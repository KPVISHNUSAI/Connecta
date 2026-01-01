from kafka import KafkaProducer
from django.conf import settings
import json
import logging

logger = logging.getLogger(__name__)

class EventProducer:
    def __init__(self):
        try:
            self.producer = KafkaProducer(
                bootstrap_servers=settings.KAFKA_BOOTSTRAP_SERVERS,
                value_serializer=lambda v: json.dumps(v).encode('utf-8'),
                acks='all',
                retries=3,
                max_in_flight_requests_per_connection=1
            )
        except Exception as e:
            logger.error(f"Failed to initialize Kafka producer: {e}")
            self.producer = None

    def send_event(self, topic, event_data):
        """Send event to Kafka topic"""
        if not self.producer:
            logger.warning("Kafka producer not initialized")
            return False
        
        try:
            future = self.producer.send(topic, event_data)
            future.get(timeout=10)
            return True
        except Exception as e:
            logger.error(f"Failed to send event to Kafka: {e}")
            return False

    def close(self):
        if self.producer:
            self.producer.close()

# Global producer instance
event_producer = EventProducer()