from django.db import models
from django.utils import timezone
from datetime import timedelta
from apps.accounts.models import User

class Story(models.Model):
    MEDIA_TYPES = [
        ('image', 'Image'),
        ('video', 'Video'),
    ]
    user = models.ForeignKey(User, related_name='stories', on_delete=models.CASCADE)
    media_type = models.CharField(max_length=10, choices=MEDIA_TYPES)
    media_file = models.FileField(upload_to='stories/')
    caption = models.TextField(max_length=500, blank=True)
    views_count = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()

    class Meta:
        ordering = ['-created_at']
        verbose_name_plural = 'Stories'
    
    def save(self, *args, **kwargs):
        if not self.expires_at:
            self.expires_at = timezone.now() + timedelta(hours=24)
        super().save(*args, **kwargs)
    
    def is_expired(self):
        return timezone.now() >= self.expires_at
    
class StoryView(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    story = models.ForeignKey(Story, related_name='views', on_delete=models.CASCADE)
    viewed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'story')
        ordering = ['-viewed_at']
