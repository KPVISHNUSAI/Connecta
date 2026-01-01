from django.contrib import admin
from .models import Comment, CommentLike

@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'post', 'content_short', 'parent', 'likes_count', 'created_at']
    list_filter = ['created_at', 'updated_at']
    search_fields = ['user__username', 'content', 'post__caption']
    raw_id_fields = ['user', 'post', 'parent']
    readonly_fields = ['likes_count', 'created_at', 'updated_at']
    
    fieldsets = (
        ('Comment Information', {
            'fields': ('user', 'post', 'parent', 'text')
        }),
        ('Statistics', {
            'fields': ('likes_count',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def content_short(self, obj):
        """Display shortened comment text"""
        return obj.content[:50] + '...' if len(obj.content) > 50 else obj.text
    content_short.short_description = 'Comment Text'
    
    def get_queryset(self, request):
        """Optimize queryset with select_related"""
        qs = super().get_queryset(request)
        return qs.select_related('user', 'post', 'parent')

@admin.register(CommentLike)
class CommentLikeAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'comment_preview', 'created_at']
    list_filter = ['created_at']
    search_fields = ['user__username', 'comment__content']
    raw_id_fields = ['user', 'comment']
    readonly_fields = ['created_at']
    
    fieldsets = (
        ('Like Information', {
            'fields': ('user', 'comment')
        }),
        ('Timestamp', {
            'fields': ('created_at',)
        }),
    )
    
    def comment_preview(self, obj):
        """Display preview of the liked comment"""
        return obj.comment.content[:30] + '...' if len(obj.comment.content) > 30 else obj.comment.content
    comment_preview.short_description = 'Comment'
    
    def get_queryset(self, request):
        """Optimize queryset with select_related"""
        qs = super().get_queryset(request)
        return qs.select_related('user', 'comment', 'comment__user')