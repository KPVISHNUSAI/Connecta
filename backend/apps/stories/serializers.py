from rest_framework import serializers
from .models import Story, StoryView
from apps.accounts.serializers import UserSerializer

class StorySerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    is_viewed = serializers.SerializerMethodField()
    is_expired = serializers.SerializerMethodField()
    
    class Meta:
        model = Story
        fields = ['id', 'user', 'media_type', 'media_file', 'caption', 
                  'views_count', 'is_viewed', 'is_expired', 
                  'created_at', 'expires_at']
        read_only_fields = ['id', 'user', 'views_count', 'created_at', 'expires_at']

    def get_is_viewed(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return StoryView.objects.filter(user=request.user, story=obj).exists()
        return False

    def get_is_expired(self, obj):
        return obj.is_expired()

class StoryCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Story
        fields = ['media_type', 'media_file', 'caption']

    def validate_file(self, value):
        # Validate file size (max 50MB)
        if value.size > 50 * 1024 * 1024:
            raise serializers.ValidationError("File size cannot exceed 50MB")
        return value

class StoryViewSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = StoryView
        fields = ['id', 'user', 'viewed_at']
        read_only_fields = ['id', 'user', 'viewed_at']