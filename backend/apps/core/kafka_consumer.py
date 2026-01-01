from kafka import KafkaConsumer
from django.conf import settings
import json
import logging

logger = logging.getLogger(__name__)

class EventConsumer:
    def __init__(self, topic, group_id):
        try:
            self.consumer = KafkaConsumer(
                topic,
                bootstrap_servers=settings.KAFKA_BOOTSTRAP_SERVERS,
                group_id=group_id,
                value_deserializer=lambda m: json.loads(m.decode('utf-8')),
                auto_offset_reset='earliest',
                enable_auto_commit=True
            )
        except Exception as e:
            logger.error(f"Failed to initialize Kafka consumer: {e}")
            self.consumer = None

    def consume_events(self, callback):
        """Consume events from Kafka topic"""
        if not self.consumer:
            logger.warning("Kafka consumer not initialized")
            return
        
        try:
            for message in self.consumer:
                callback(message.value)
        except Exception as e:
            logger.error(f"Error consuming Kafka events: {e}")

    def close(self):
        if self.consumer:
            self.consumer.close()