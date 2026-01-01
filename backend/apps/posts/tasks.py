from celery import shared_task
from django.core.cache import cache
from django.db.models import Count, Q
from django.utils import timezone
from datetime import timedelta
from .models import Post

@shared_task
def update_trending_posts():
    """Update trending posts based on engagement"""
    time_threshold = timezone.now() - timedelta(hours=24)
    
    trending_posts = Post.objects.filter(
        created_at__gte=time_threshold,
        is_archived=False
    ).annotate(
        engagement_score=Count('likes') + Count('comments') * 2
    ).order_by('-engagement_score')[:50]
    
    trending_ids = list(trending_posts.values_list('id', flat=True))
    cache.set('trending_posts', trending_ids, timeout=1800)  # 30 minutes
    
    return f'Updated {len(trending_ids)} trending posts'

@shared_task
def process_post_media(post_id):
    """Process uploaded media (compress, generate thumbnails, etc.)"""
    from .models import Post, PostMedia
    try:
        post = Post.objects.get(id=post_id)
        media_items = post.media.all()
        
        for media in media_items:
            # Add your processing logic here
            # Example: compress images, generate thumbnails
            pass
        
        return f'Processed media for post {post_id}'
    except Post.DoesNotExist:
        return f'Post {post_id} not found'

@shared_task
def generate_feed_for_user(user_id):
    """Pre-generate feed for user and cache it"""
    from apps.accounts.models import Follow
    from django.contrib.auth import get_user_model
    
    User = get_user_model()
    try:
        user = User.objects.get(id=user_id)
        following_users = Follow.objects.filter(
            follower=user
        ).values_list('following', flat=True)
        
        feed_posts = Post.objects.filter(
            Q(user__in=following_users) | Q(user=user),
            is_archived=False
        ).select_related('user').prefetch_related('media').order_by('-created_at')[:100]
        
        feed_ids = list(feed_posts.values_list('id', flat=True))
        cache.set(f'user_feed:{user_id}', feed_ids, timeout=600)  # 10 minutes
        
        return f'Generated feed for user {user_id}'
    except User.DoesNotExist:
        return f'User {user_id} not found'