from rest_framework import serializers
from .models import Notification
from apps.accounts.serializers import UserSerializer

class NotificationSerializer(serializers.ModelSerializer):
    sender = UserSerializer(read_only=True)
    post_data = serializers.SerializerMethodField()
    
    class Meta:
        model = Notification
        fields = ['id', 'sender', 'notification_type', 'post_data', 
                  'is_read', 'created_at']
        read_only_fields = ['id', 'sender', 'created_at']

    def get_post_data(self, obj):
        if obj.post:
            return {
                'id': obj.post.id,
                'caption': obj.post.caption[:50] if obj.post.caption else '',
                'thumbnail': obj.post.media.first().file.url if obj.post.media.exists() else None
            }
        return None