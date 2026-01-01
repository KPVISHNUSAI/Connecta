from celery import shared_task
from django.utils import timezone
from .models import Story

@shared_task
def delete_expired_stories():
    """Delete stories that have expired"""
    expired_stories = Story.objects.filter(expires_at__lte=timezone.now())
    count = expired_stories.count()
    expired_stories.delete()
    return f'Deleted {count} expired stories'

@shared_task
def process_story_upload(story_id):
    """Process uploaded story (compress, generate thumbnail, etc.)"""
    from .models import Story
    try:
        story = Story.objects.get(id=story_id)
        # Add your processing logic here
        # Example: compress video, generate thumbnail
        return f'Processed story {story_id}'
    except Story.DoesNotExist:
        return f'Story {story_id} not found'