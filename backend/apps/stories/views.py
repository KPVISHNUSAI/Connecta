from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from django.db.models import Exists, OuterRef, Q
from .models import Story, StoryView
from .serializers import (
    StorySerializer, 
    StoryCreateSerializer, 
    StoryViewSerializer
)
from apps.accounts.models import Follow

class StoryViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        # Get non-expired stories
        queryset = Story.objects.filter(
            expires_at__gt=timezone.now()
        ).select_related('user').order_by('-created_at')
        
        user_id = self.request.query_params.get('user_id')
        if user_id:
            queryset = queryset.filter(user_id=user_id)
        
        return queryset

    def get_serializer_class(self):
        if self.action == 'create':
            return StoryCreateSerializer
        return StorySerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['get'])
    def feed(self, request):
        """Get stories from users that the current user follows"""
        following_users = Follow.objects.filter(
            follower=request.user
        ).values_list('following', flat=True)
        
        # Get stories from followed users that haven't been viewed yet
        stories = Story.objects.filter(
            user__in=following_users,
            expires_at__gt=timezone.now()
        ).exclude(
            views__user=request.user
        ).select_related('user').order_by('user', '-created_at')
        
        # Group stories by user
        stories_by_user = {}
        for story in stories:
            if story.user.id not in stories_by_user:
                stories_by_user[story.user.id] = []
            stories_by_user[story.user.id].append(story)
        
        serializer = self.get_serializer(stories, many=True)
        return Response({
            'stories_by_user': stories_by_user,
            'stories': serializer.data
        })

    @action(detail=False, methods=['get'])
    def my_stories(self, request):
        """Get current user's active stories"""
        stories = Story.objects.filter(
            user=request.user,
            expires_at__gt=timezone.now()
        ).order_by('-created_at')
        
        serializer = self.get_serializer(stories, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def view(self, request, pk=None):
        """Mark a story as viewed"""
        story = self.get_object()
        
        if story.is_expired():
            return Response(
                {'error': 'Story has expired'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        view, created = StoryView.objects.get_or_create(
            user=request.user, 
            story=story
        )
        
        if created:
            story.views_count += 1
            story.save(update_fields=['views_count'])
            return Response({'message': 'Story viewed'}, status=status.HTTP_201_CREATED)
        
        return Response({'message': 'Already viewed'})

    @action(detail=True, methods=['get'])
    def viewers(self, request, pk=None):
        """Get all users who viewed this story"""
        story = self.get_object()
        
        if story.user != request.user:
            return Response(
                {'error': 'You can only see viewers of your own stories'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        views = StoryView.objects.filter(story=story).select_related('user')
        
        page = self.paginate_queryset(views)
        if page is not None:
            serializer = StoryViewSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = StoryViewSerializer(views, many=True)
        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        story = self.get_object()
        
        if story.user != request.user:
            return Response(
                {'error': 'You can only delete your own stories'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        return super().destroy(request, *args, **kwargs)