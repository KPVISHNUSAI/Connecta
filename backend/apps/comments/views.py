from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from .models import Comment, CommentLike
from .serializers import (
    CommentSerializer, 
    CommentCreateSerializer,
    CommentDetailSerializer
)
from apps.posts.models import Post

class CommentViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        post_id = self.request.query_params.get('post_id')
        if post_id:
            # Get only top-level comments (no parent)
            return Comment.objects.filter(
                post_id=post_id, 
                parent=None
            ).select_related('user').prefetch_related('replies__user').order_by('-created_at')
        return Comment.objects.none()

    def get_serializer_class(self):
        if self.action == 'create':
            return CommentCreateSerializer
        elif self.action == 'retrieve':
            return CommentDetailSerializer
        return CommentSerializer

    def create(self, request, *args, **kwargs):
        post_id = request.data.get('post_id')
        if not post_id:
            return Response(
                {'error': 'post_id is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        post = get_object_or_404(Post, id=post_id)
        
        if post.comments_disabled:
            return Response(
                {'error': 'Comments are disabled for this post'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        comment = serializer.save(user=request.user, post=post)
        
        # Update post comments count
        post.comments_count += 1
        post.save(update_fields=['comments_count'])
        
        return Response(
            CommentSerializer(comment, context={'request': request}).data,
            status=status.HTTP_201_CREATED
        )

    def destroy(self, request, *args, **kwargs):
        comment = self.get_object()
        
        if comment.user != request.user:
            return Response(
                {'error': 'You can only delete your own comments'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        post = comment.post
        
        # Count total comments to delete (comment + its replies)
        total_count = 1 + comment.replies.count()
        
        # Delete comment (cascades to replies)
        comment.delete()
        
        # Update post comments count
        post.comments_count = max(0, post.comments_count - total_count)
        post.save(update_fields=['comments_count'])
        
        return Response(status=status.HTTP_204_NO_CONTENT)

    def update(self, request, *args, **kwargs):
        comment = self.get_object()
        
        if comment.user != request.user:
            return Response(
                {'error': 'You can only edit your own comments'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        return super().update(request, *args, **kwargs)

    @action(detail=True, methods=['post'])
    def like(self, request, pk=None):
        comment = self.get_object()
        like, created = CommentLike.objects.get_or_create(
            user=request.user, 
            comment=comment
        )
        
        if created:
            comment.likes_count += 1
            comment.save(update_fields=['likes_count'])
            return Response({'message': 'Comment liked'}, status=status.HTTP_201_CREATED)
        
        return Response({'message': 'Already liked'}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def unlike(self, request, pk=None):
        comment = self.get_object()
        deleted = CommentLike.objects.filter(
            user=request.user, 
            comment=comment
        ).delete()
        
        if deleted[0] > 0:
            comment.likes_count = max(0, comment.likes_count - 1)
            comment.save(update_fields=['likes_count'])
            return Response({'message': 'Comment unliked'})
        
        return Response({'message': 'Not liked'}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['get'])
    def replies(self, request, pk=None):
        """Get all replies to a comment"""
        comment = self.get_object()
        replies = comment.replies.all().select_related('user')
        
        page = self.paginate_queryset(replies)
        if page is not None:
            serializer = CommentSerializer(page, many=True, context={'request': request})
            return self.get_paginated_response(serializer.data)
        
        serializer = CommentSerializer(replies, many=True, context={'request': request})
        return Response(serializer.data)