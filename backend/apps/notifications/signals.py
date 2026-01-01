from django.db.models.signals import post_save
from django.dispatch import receiver
from apps.posts.models import Like
from apps.comments.models import Comment
from apps.accounts.models import Follow
from .models import Notification

@receiver(post_save, sender=Like)
def create_like_notification(sender, instance, created, **kwargs):
    if created and instance.user != instance.post.user:
        Notification.objects.create(
            recipient=instance.post.user,
            sender=instance.user,
            notification_type='like',
            post=instance.post
        )

@receiver(post_save, sender=Comment)
def create_comment_notification(sender, instance, created, **kwargs):
    if created and instance.user != instance.post.user:
        Notification.objects.create(
            recipient=instance.post.user,
            sender=instance.user,
            notification_type='comment',
            post=instance.post,
            comment=instance
        )

@receiver(post_save, sender=Follow)
def create_follow_notification(sender, instance, created, **kwargs):
    if created:
        Notification.objects.create(
            recipient=instance.following,
            sender=instance.follower,
            notification_type='follow'
        )