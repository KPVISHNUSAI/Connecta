from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q
from django.core.cache import cache
from .models import Post, Like, SavedPost
from .serializers import PostSerializer, PostCreateSerializer, LikeSerializer
from apps.accounts.models import Follow
from apps.core.cache_utils import CacheManager, cache_result
from apps.core.kafka_producer import event_producer
import logging

logger = logging.getLogger(__name__)

class PostViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['caption', 'location', 'user__username']
    ordering_fields = ['created_at', 'likes_count', 'comments_count']
    ordering = ['-created_at']
    
    def get_queryset(self):
        queryset = Post.objects.filter(is_archived=False).select_related('user').prefetch_related('media')
        # Filter by user if specified
        user_id = self.request.query_params.get('user_id')
        if user_id:
            queryset = queryset.filter(user__id=user_id)
        return queryset
    
    def get_serializer_class(self):
        if self.action == 'create':
            return PostCreateSerializer
        return PostSerializer
    
    def create(self, request, *args, **kwargs):
        """Create a new post with proper response serialization"""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Save the post with current user
        post = serializer.save(user=request.user)
        
        # Invalidate user's followers' feeds
        try:
            followers = Follow.objects.filter(following=request.user).values_list('follower_id', flat=True)
            for follower_id in followers:
                CacheManager.invalidate_user_feed(follower_id)
        except Exception as e:
            logger.error(f"Error invalidating cache: {e}")
        
        # Publish event to Kafka
        try:
            event_producer.send_event('post_created', {
                'post_id': post.id,
                'user_id': request.user.id,
                'timestamp': post.created_at.isoformat()
            })
        except Exception as e:
            logger.error(f"Error sending Kafka event: {e}")
        
        logger.info(f"Post {post.id} created by user {request.user.id}")
        
        # Use PostSerializer to return full post data with user info
        response_serializer = PostSerializer(post, context={'request': request})
        
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)
    
    def retrieve(self, request, *args, **kwargs):
        """Get post detail with caching"""
        post_id = kwargs.get('pk')
        
        # Try to get from cache
        try:
            cached_data = CacheManager.get_post_detail(post_id)
            if cached_data:
                return Response(cached_data)
        except Exception as e:
            logger.error(f"Cache error: {e}")
        
        # Get from database
        instance = self.get_object()
        serializer = self.get_serializer(
            instance,
            context={'request': request}
        )

        
        # Cache the result
        try:
            CacheManager.set_post_detail(post_id, serializer.data)
        except Exception as e:
            logger.error(f"Cache error: {e}")
        
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def feed(self, request):
        """Get posts from users that the current user follows with caching"""
        user_id = request.user.id
        
        # Try to get from cache
        try:
            cached_feed = CacheManager.get_user_feed(user_id)
            if cached_feed:
                posts = Post.objects.filter(id__in=cached_feed).select_related('user').prefetch_related('media')
                serializer = self.get_serializer(
                    posts,
                    many=True,
                    context={'request': request}
                )

                return Response(serializer.data)
        except Exception as e:
            logger.error(f"Cache error: {e}")
        
        # Get from database
        following_users = Follow.objects.filter(
            follower=request.user
        ).values_list('following', flat=True)
        
        posts = Post.objects.filter(
            Q(user__in=following_users) | Q(user=request.user),
            is_archived=False
        ).select_related('user').prefetch_related('media').order_by('-created_at')[:100]
        
        # Cache post IDs
        try:
            post_ids = list(posts.values_list('id', flat=True))
            CacheManager.set_user_feed(user_id, post_ids)
        except Exception as e:
            logger.error(f"Cache error: {e}")
        
        page = self.paginate_queryset(posts)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(
            posts,
            many=True,
            context={'request': request}
        )

        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def explore(self, request):
        """Get Posts from users not followed by current user"""
        following_users = Follow.objects.filter(
            follower=request.user
        ).values_list('following', flat=True)
        
        posts = Post.objects.exclude(
            Q(user__in=following_users) | Q(user=request.user)
        ).filter(is_archived=False).select_related('user').prefetch_related('media').order_by('-created_at')
        
        page = self.paginate_queryset(posts)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(
            posts,
            many=True,
            context={'request': request}
        )

        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def like(self, request, pk=None):
        post = self.get_object()
        like, created = Like.objects.get_or_create(user=request.user, post=post)
        
        if created:
            # Update likes count
            post.likes_count += 1
            post.save(update_fields=['likes_count'])
            
            # Invalidate caches
            try:
                CacheManager.invalidate_post_detail(post.id)
            except Exception as e:
                logger.error(f"Cache error: {e}")
            
            # Publish event to Kafka
            try:
                event_producer.send_event('post_liked', {
                    'post_id': post.id,
                    'user_id': request.user.id,
                    'post_owner_id': post.user.id
                })
            except Exception as e:
                logger.error(f"Kafka error: {e}")
            
            # Create notification asynchronously
            try:
                from apps.notifications.tasks import batch_create_notifications
                batch_create_notifications.delay([{
                    'recipient_id': post.user.id,
                    'sender_id': request.user.id,
                    'notification_type': 'like',
                    'post_id': post.id
                }])
            except Exception as e:
                logger.error(f"Notification error: {e}")
            
            return Response({'message': 'Post liked'}, status=status.HTTP_201_CREATED)
        
        return Response({'message': 'Already liked'}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'])
    def unlike(self, request, pk=None):
        post = self.get_object()
        deleted, _ = Like.objects.filter(user=request.user, post=post).delete()
        
        if deleted > 0:
            post.likes_count = max(0, post.likes_count - 1)
            post.save(update_fields=['likes_count'])
            try:
                CacheManager.invalidate_post_detail(post.id)
            except Exception as e:
                logger.error(f"Cache error: {e}")
            return Response({'message': 'Post unliked successfully'})
        return Response({'message': 'Post not liked yet'}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['get'])
    def likes(self, request, pk=None):
        post = self.get_object()
        likes = Like.objects.filter(post=post).select_related('user')
        
        page = self.paginate_queryset(likes)
        if page is not None:
            serializer = LikeSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = LikeSerializer(likes, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def save(self, request, pk=None):
        post = self.get_object()
        saved_post, created = SavedPost.objects.get_or_create(user=request.user, post=post)
        
        if created:
            return Response({'message': 'Post saved successfully'}, status=status.HTTP_201_CREATED)
        return Response({'message': 'Post already saved'}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'])
    def unsave(self, request, pk=None):
        post = self.get_object()
        deleted, _ = SavedPost.objects.filter(user=request.user, post=post).delete()
        
        if deleted > 0:
            return Response({'message': 'Post unsaved successfully'})
        return Response({'message': 'Post not saved yet'}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'])
    def saved(self, request):
        """Get all saved posts of the current user"""
        saved_posts = SavedPost.objects.filter(
            user=request.user
        ).select_related('post__user').prefetch_related('post__media').order_by('-created_at')
        posts = [sp.post for sp in saved_posts]
        
        page = self.paginate_queryset(posts)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(
            posts,
            many=True,
            context={'request': request}
        )

        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def archive(self, request, pk=None):
        post = self.get_object()
        if post.user != request.user:
            return Response(
                {'error': 'You can only archive your own posts'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        post.is_archived = True
        post.save(update_fields=['is_archived'])
        return Response({'message': 'Post archived successfully'})
    
    @action(detail=True, methods=['post'])
    def unarchive(self, request, pk=None):
        post = self.get_object()
        if post.user != request.user:
            return Response(
                {'error': 'You can only unarchive your own posts'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        post.is_archived = False
        post.save(update_fields=['is_archived'])
        return Response({'message': 'Post unarchived successfully'})