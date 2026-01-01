from celery import shared_task
from django.utils import timezone
from datetime import timedelta
from .models import Notification

@shared_task
def cleanup_old_notifications():
    """Delete read notifications older than 30 days"""
    threshold = timezone.now() - timedelta(days=30)
    old_notifications = Notification.objects.filter(
        is_read=True,
        created_at__lte=threshold
    )
    count = old_notifications.count()
    old_notifications.delete()
    return f'Deleted {count} old notifications'

@shared_task
def send_push_notification(notification_id):
    """Send push notification to user device"""
    try:
        notification = Notification.objects.get(id=notification_id)
        # Add your push notification logic here
        # Example: Firebase Cloud Messaging, OneSignal, etc.
        return f'Sent push notification {notification_id}'
    except Notification.DoesNotExist:
        return f'Notification {notification_id} not found'

@shared_task
def batch_create_notifications(notification_data_list):
    """Create multiple notifications in batch"""
    from .models import Notification
    notifications = [
        Notification(**data) for data in notification_data_list
    ]
    Notification.objects.bulk_create(notifications, ignore_conflicts=True)
    return f'Created {len(notifications)} notifications'