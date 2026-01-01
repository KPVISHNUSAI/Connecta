from django.contrib import admin
from django.utils.html import format_html
from .models import Notification

@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ['id', 'recipient', 'sender', 'notification_type', 
                    'status_badge', 'post_info', 'created_at']
    list_filter = ['notification_type', 'is_read', 'created_at']
    search_fields = ['recipient__username', 'sender__username', 'post__caption']
    raw_id_fields = ['recipient', 'sender', 'post', 'comment']
    readonly_fields = ['created_at']
    
    fieldsets = (
        ('Notification Information', {
            'fields': ('recipient', 'sender', 'notification_type', 'is_read')
        }),
        ('Related Content', {
            'fields': ('post', 'comment')
        }),
        ('Timestamp', {
            'fields': ('created_at',)
        }),
    )
    
    def status_badge(self, obj):
        """Display read/unread status as colored badge"""
        if obj.is_read:
            return format_html(
                '<span style="background-color: #6c757d; color: white; padding: 3px 10px; '
                'border-radius: 3px; font-weight: bold;">READ</span>'
            )
        else:
            return format_html(
                '<span style="background-color: #007bff; color: white; padding: 3px 10px; '
                'border-radius: 3px; font-weight: bold;">UNREAD</span>'
            )
    status_badge.short_description = 'Status'
    
    def post_info(self, obj):
        """Display post information if available"""
        if obj.post:
            caption = obj.post.caption[:30] if obj.post.caption else 'No caption'
            return format_html(
                '<a href="/admin/posts/post/{}/change/" target="_blank">Post #{}: {}</a>',
                obj.post.id,
                obj.post.id,
                caption
            )
        return '-'
    post_info.short_description = 'Post'
    
    def get_queryset(self, request):
        """Optimize queryset with select_related"""
        qs = super().get_queryset(request)
        return qs.select_related('recipient', 'sender', 'post', 'comment')
    
    actions = ['mark_as_read', 'mark_as_unread', 'delete_read_notifications']
    
    def mark_as_read(self, request, queryset):
        """Admin action to mark notifications as read"""
        count = queryset.update(is_read=True)
        self.message_user(request, f'{count} notifications marked as read.')
    mark_as_read.short_description = 'Mark selected as read'
    
    def mark_as_unread(self, request, queryset):
        """Admin action to mark notifications as unread"""
        count = queryset.update(is_read=False)
        self.message_user(request, f'{count} notifications marked as unread.')
    mark_as_unread.short_description = 'Mark selected as unread'
    
    def delete_read_notifications(self, request, queryset):
        """Admin action to delete read notifications"""
        read_notifications = queryset.filter(is_read=True)
        count = read_notifications.count()
        read_notifications.delete()
        self.message_user(request, f'{count} read notifications deleted.')
    delete_read_notifications.short_description = 'Delete read notifications'