from django.contrib import admin
from .models import Post, PostMedia, Like, SavedPost

@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'caption_short', 'likes_count', 'comments_count', 'created_at']
    list_filter = ['is_archived', 'comments_disabled', 'created_at']
    search_fields = ['user__username', 'caption', 'location']
    
    def caption_short(self, obj):
        return obj.caption[:50] if obj.caption else ''

@admin.register(PostMedia)
class PostMediaAdmin(admin.ModelAdmin):
    list_display = ['id', 'post', 'media_type', 'order', 'created_at']
    list_filter = ['media_type']

@admin.register(Like)
class LikeAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'post', 'created_at']

@admin.register(SavedPost)
class SavedPostAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'post', 'created_at']