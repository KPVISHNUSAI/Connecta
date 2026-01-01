from rest_framework import serializers
from .models import Comment, CommentLike
from apps.accounts.serializers import UserSerializer

class CommentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    replies_count = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()
    
    class Meta:
        model = Comment
        fields = ['id', 'user', 'post', 'parent', 'content', 'likes_count',
                  'replies_count', 'is_liked', 'created_at', 'updated_at']
        read_only_fields = ['id', 'user', 'likes_count', 'created_at', 'updated_at']

    def get_replies_count(self, obj):
        return obj.replies.count()

    def get_is_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return CommentLike.objects.filter(user=request.user, comment=obj).exists()
        return False

class CommentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['content', 'parent']

    def validate_parent(self, value):
        if value and value.parent is not None:
            raise serializers.ValidationError(
                "Cannot reply to a reply. Only one level of nesting allowed."
            )
        return value

class CommentDetailSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    replies = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()
    
    class Meta:
        model = Comment
        fields = ['id', 'user', 'post', 'parent', 'content', 'likes_count',
                  'replies', 'is_liked', 'created_at', 'updated_at']
        read_only_fields = ['id', 'user', 'likes_count', 'created_at', 'updated_at']

    def get_replies(self, obj):
        if obj.parent is None:  # Only show replies for top-level comments
            replies = obj.replies.all()
            return CommentSerializer(replies, many=True, context=self.context).data
        return []

    def get_is_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return CommentLike.objects.filter(user=request.user, comment=obj).exists()
        return False