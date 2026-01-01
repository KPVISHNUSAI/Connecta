from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.cache import cache
from django.db import connection
from django.conf import settings
import redis
import logging

logger = logging.getLogger(__name__)

class HealthCheckView(APIView):
    """
    Health check endpoint for monitoring
    """
    permission_classes = []
    
    def get(self, request):
        health_status = {
            'status': 'healthy',
            'checks': {}
        }
        
        # Check Database
        try:
            with connection.cursor() as cursor:
                cursor.execute("SELECT 1")
            health_status['checks']['database'] = 'healthy'
        except Exception as e:
            health_status['checks']['database'] = f'unhealthy: {str(e)}'
            health_status['status'] = 'unhealthy'
            logger.error(f"Database health check failed: {e}")
        
        # Check Redis
        try:
            cache.set('health_check', 'ok', 10)
            result = cache.get('health_check')
            if result == 'ok':
                health_status['checks']['redis'] = 'healthy'
            else:
                health_status['checks']['redis'] = 'unhealthy: cache not working'
                health_status['status'] = 'unhealthy'
        except Exception as e:
            health_status['checks']['redis'] = f'unhealthy: {str(e)}'
            health_status['status'] = 'unhealthy'
            logger.error(f"Redis health check failed: {e}")
        
        # Check Elasticsearch
        try:
            from elasticsearch import Elasticsearch
            es = Elasticsearch(hosts=[settings.ELASTICSEARCH_DSL['default']['hosts']])
            if es.ping():
                health_status['checks']['elasticsearch'] = 'healthy'
            else:
                health_status['checks']['elasticsearch'] = 'unhealthy'
                health_status['status'] = 'unhealthy'
        except Exception as e:
            health_status['checks']['elasticsearch'] = f'unhealthy: {str(e)}'
            health_status['status'] = 'unhealthy'
            logger.error(f"Elasticsearch health check failed: {e}")
        
        # Determine HTTP status code
        http_status = status.HTTP_200_OK if health_status['status'] == 'healthy' else status.HTTP_503_SERVICE_UNAVAILABLE
        
        return Response(health_status, status=http_status)

class ReadinessCheckView(APIView):
    """
    Readiness check for Kubernetes/Docker
    """
    permission_classes = []
    
    def get(self, request):
        return Response({'status': 'ready'}, status=status.HTTP_200_OK)

class LivenessCheckView(APIView):
    """
    Liveness check for Kubernetes/Docker
    """
    permission_classes = []
    
    def get(self, request):
        return Response({'status': 'alive'}, status=status.HTTP_200_OK)