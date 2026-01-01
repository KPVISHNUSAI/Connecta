from rest_framework import serializers
from .models import Post, PostMedia, Like, SavedPost
from apps.accounts.serializers import UserSerializer

class PostMediaSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostMedia
        fields = ['id', 'media_type', 'media_file', 'order', 'created_at']
        read_only_fields = ['id', 'created_at']

class PostSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    media = PostMediaSerializer(many=True, read_only=True)
    is_liked = serializers.SerializerMethodField()
    is_saved = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = ['id', 'user', 'caption', 'location', 'is_archived', 
                  'comments_disabled', 'likes_count', 'comments_count', 
                  'media', 'is_liked', 'is_saved', 'created_at', 'updated_at']
        read_only_fields = ['id', 'likes_count', 'comments_count', 
                            'created_at', 'updated_at']

    def get_is_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return Like.objects.filter(user=request.user, post=obj).exists()
        return False

    def get_is_saved(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return SavedPost.objects.filter(user=request.user, post=obj).exists()
        return False
    
class PostCreateSerializer(serializers.ModelSerializer):
    media_files = serializers.ListField(
        child=serializers.FileField(), write_only=True, required=False
    )
    media_types = serializers.ListField(
        child=serializers.ChoiceField(choices=PostMedia.MEDIA_TYPES), 
        write_only=True, required=False
    )

    class Meta:
        model = Post
        fields = ['id', 'caption', 'location', 'comments_disabled', 
                  'media_files', 'media_types', 'created_at', 'updated_at']

    def validate(self, data):
        media_files = data.get('media_files', [])
        media_types = data.get('media_types', [])
        if len(media_files) != len(media_types):
            raise serializers.ValidationError( "Number of media files must match number of media types" )
        
        if(len(media_files) > 10):
            raise serializers.ValidationError("Maximum 10 media files allowed per post")
        
        return data

    def create(self, validated_data):
        media_files = validated_data.pop('media_files', [])
        media_types = validated_data.pop('media_types', [])
        post = Post.objects.create(**validated_data)

        for index, (file, media_type) in enumerate(zip(media_files, media_types)):
            PostMedia.objects.create(
                post=post,
                media_type=media_type,
                file=file,
                order=index
            )
        return post
    
class LikeSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Like
        fields = ['id', 'user', 'post', 'created_at']
        read_only_fields = ['id', 'user', 'created_at']