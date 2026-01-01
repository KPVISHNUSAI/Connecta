from django.contrib import admin
from django.utils import timezone
from django.utils.html import format_html
from .models import Story, StoryView

@admin.register(Story)
class StoryAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'media_type', 'caption_short', 'views_count', 
                    'status_badge', 'created_at', 'expires_at']
    list_filter = ['media_type', 'created_at', 'expires_at']
    search_fields = ['user__username', 'caption']
    raw_id_fields = ['user']
    readonly_fields = ['views_count', 'created_at', 'expires_at', 'preview_media']
    
    fieldsets = (
        ('Story Information', {
            'fields': ('user', 'media_type', 'file', 'caption', 'preview_media')
        }),
        ('Statistics', {
            'fields': ('views_count',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'expires_at'),
        }),
    )
    
    def caption_short(self, obj):
        """Display shortened caption"""
        if not obj.caption:
            return '-'
        return obj.caption[:30] + '...' if len(obj.caption) > 30 else obj.caption
    caption_short.short_description = 'Caption'
    
    def status_badge(self, obj):
        """Display story status as colored badge"""
        if obj.is_expired():
            return format_html(
                '<span style="background-color: #dc3545; color: white; padding: 3px 10px; '
                'border-radius: 3px; font-weight: bold;">EXPIRED</span>'
            )
        else:
            return format_html(
                '<span style="background-color: #28a745; color: white; padding: 3px 10px; '
                'border-radius: 3px; font-weight: bold;">ACTIVE</span>'
            )
    status_badge.short_description = 'Status'
    
    def preview_media(self, obj):
        """Display media preview in admin"""
        if obj.media_type == 'image' and obj.file:
            return format_html(
                '<img src="{}" style="max-width: 300px; max-height: 300px;" />',
                obj.file.url
            )
        elif obj.media_type == 'video' and obj.file:
            return format_html(
                '<video controls style="max-width: 300px; max-height: 300px;">'
                '<source src="{}" type="video/mp4">Your browser does not support videos.'
                '</video>',
                obj.file.url
            )
        return '-'
    preview_media.short_description = 'Media Preview'
    
    def get_queryset(self, request):
        """Optimize queryset with select_related"""
        qs = super().get_queryset(request)
        return qs.select_related('user')
    
    actions = ['delete_expired_stories']
    
    def delete_expired_stories(self, request, queryset):
        """Admin action to delete expired stories"""
        expired = queryset.filter(expires_at__lte=timezone.now())
        count = expired.count()
        expired.delete()
        self.message_user(request, f'{count} expired stories deleted successfully.')
    delete_expired_stories.short_description = 'Delete selected expired stories'

@admin.register(StoryView)
class StoryViewAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'story_info', 'viewed_at']
    list_filter = ['viewed_at']
    search_fields = ['user__username', 'story__user__username']
    raw_id_fields = ['user', 'story']
    readonly_fields = ['viewed_at']
    
    fieldsets = (
        ('View Information', {
            'fields': ('user', 'story')
        }),
        ('Timestamp', {
            'fields': ('viewed_at',)
        }),
    )
    
    def story_info(self, obj):
        """Display story owner and creation time"""
        return f"Story by {obj.story.user.username} ({obj.story.created_at.strftime('%Y-%m-%d %H:%M')})"
    story_info.short_description = 'Story'
    
    def get_queryset(self, request):
        """Optimize queryset with select_related"""
        qs = super().get_queryset(request)
        return qs.select_related('user', 'story', 'story__user')