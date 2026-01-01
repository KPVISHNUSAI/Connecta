from django.db import models
from apps.accounts.models import User

class Post(models.Model):
    user = models.ForeignKey(User, related_name='posts', on_delete=models.CASCADE)
    caption = models.TextField(max_length=2200, blank=True)
    location = models.CharField(max_length=255, blank=True)
    is_archived = models.BooleanField(default=False)
    comments_disabled = models.BooleanField(default=False)
    likes_count = models.IntegerField(default=0)
    comments_count = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Post by {self.user.username} at {self.created_at}"
    
class PostMedia(models.Model):
    MEDIA_TYPES = [
        ('image', 'Image'),
        ('video', 'Video'),
    ]

    post = models.ForeignKey(Post, related_name='media', on_delete=models.CASCADE)
    media_type = models.CharField(max_length=10, choices=MEDIA_TYPES)
    media_file = models.FileField(upload_to='posts/')
    order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order']

class Like(models.Model):
    user = models.ForeignKey(User, related_name='likes', on_delete=models.CASCADE)
    post = models.ForeignKey(Post, related_name='likes', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'post')

    def __str__(self):
        return f"{self.user.username} likes Post {self.post.id}"
    
class SavedPost(models.Model):
    user = models.ForeignKey(User, related_name='saved_posts', on_delete=models.CASCADE)
    post = models.ForeignKey(Post, related_name='saved_by', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'post')
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username} saved Post {self.post.id}"