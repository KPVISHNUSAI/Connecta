from apps.core.kafka_producer import event_producer
from apps.core.kafka_consumer import EventConsumer
from .models import Notification
import logging

logger = logging.getLogger(__name__)

def publish_notification_event(notification_type, recipient_id, sender_id, post_id=None):
    """Publish notification event to Kafka"""
    event_data = {
        'type': notification_type,
        'recipient_id': recipient_id,
        'sender_id': sender_id,
        'post_id': post_id,
    }
    event_producer.send_event('notifications', event_data)

def handle_notification_event(event_data):
    """Handle notification event from Kafka"""
    try:
        Notification.objects.create(
            notification_type=event_data['type'],
            recipient_id=event_data['recipient_id'],
            sender_id=event_data['sender_id'],
            post_id=event_data.get('post_id')
        )
        logger.info(f"Created notification from Kafka event")
    except Exception as e:
        logger.error(f"Failed to create notification from Kafka event: {e}")

# Consumer for notifications
def start_notification_consumer():
    consumer = EventConsumer('notifications', 'notification-group')
    consumer.consume_events(handle_notification_event)