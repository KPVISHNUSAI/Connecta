from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Notification
from .serializers import NotificationSerializer

class NotificationViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = NotificationSerializer
    
    def get_queryset(self):
        return Notification.objects.filter(
            recipient=self.request.user
        ).select_related('sender', 'post').order_by('-created_at')

    @action(detail=False, methods=['get'])
    def unread_count(self, request):
        """Get count of unread notifications"""
        count = Notification.objects.filter(
            recipient=request.user, 
            is_read=False
        ).count()
        return Response({'unread_count': count})

    @action(detail=True, methods=['post'])
    def mark_read(self, request, pk=None):
        """Mark a notification as read"""
        notification = self.get_object()
        notification.is_read = True
        notification.save(update_fields=['is_read'])
        return Response({'message': 'Notification marked as read'})

    @action(detail=False, methods=['post'])
    def mark_all_read(self, request):
        """Mark all notifications as read"""
        updated = Notification.objects.filter(
            recipient=request.user, 
            is_read=False
        ).update(is_read=True)
        
        return Response({'message': f'{updated} notifications marked as read'})

    @action(detail=False, methods=['delete'])
    def clear_all(self, request):
        """Delete all notifications"""
        deleted = Notification.objects.filter(recipient=request.user).delete()
        return Response({'message': f'{deleted[0]} notifications deleted'})