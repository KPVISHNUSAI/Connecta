from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.html import format_html
from .models import User, Follow

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ['username', 'email', 'first_name', 'last_name', 
                    'profile_picture_preview', 'is_private', 'is_staff', 'date_joined']
    list_filter = ['is_staff', 'is_superuser', 'is_active', 'is_private', 'date_joined']
    search_fields = ['username', 'email', 'first_name', 'last_name']
    readonly_fields = ['date_joined', 'last_login', 'profile_picture_preview']
    
    fieldsets = (
        (None, {
            'fields': ('username', 'password')
        }),
        ('Personal info', {
            'fields': ('first_name', 'last_name', 'email', 'phone', 'gender', 'bio', 'website')
        }),
        ('Profile', {
            'fields': ('profile_picture', 'profile_picture_preview', 'is_private')
        }),
        ('Permissions', {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions'),
        }),
        ('Important dates', {
            'fields': ('last_login', 'date_joined'),
        }),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'password1', 'password2'),
        }),
    )
    
    def profile_picture_preview(self, obj):
        """Display profile picture preview in admin"""
        if obj.profile_picture:
            return format_html(
                '<img src="{}" style="width: 100px; height: 100px; '
                'object-fit: cover; border-radius: 50%;" />',
                obj.profile_picture.url
            )
        return format_html(
            '<div style="width: 100px; height: 100px; background-color: #e9ecef; '
            'border-radius: 50%; display: flex; align-items: center; '
            'justify-content: center; font-size: 40px; color: #6c757d;">👤</div>'
        )
    profile_picture_preview.short_description = 'Profile Picture'

@admin.register(Follow)
class FollowAdmin(admin.ModelAdmin):
    list_display = ['id', 'follower', 'following', 'created_at']
    list_filter = ['created_at']
    search_fields = ['follower__username', 'following__username']
    raw_id_fields = ['follower', 'following']
    readonly_fields = ['created_at']
    
    fieldsets = (
        ('Follow Relationship', {
            'fields': ('follower', 'following')
        }),
        ('Timestamp', {
            'fields': ('created_at',)
        }),
    )
    
    def get_queryset(self, request):
        """Optimize queryset with select_related"""
        qs = super().get_queryset(request)
        return qs.select_related('follower', 'following')