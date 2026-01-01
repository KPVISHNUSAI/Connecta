from django.contrib import admin
from django.contrib.admin import AdminSite
from django.utils.translation import gettext_lazy as _

class InstagramAdminSite(AdminSite):
    site_header = _('Instagram Clone Administration')
    site_title = _('Instagram Clone Admin')
    index_title = _('Welcome to Instagram Clone Admin Panel')
    
    def index(self, request, extra_context=None):
        """
        Display custom dashboard with statistics
        """
        from apps.accounts.models import User
        from apps.posts.models import Post
        from apps.comments.models import Comment
        from apps.stories.models import Story
        from apps.notifications.models import Notification
        from django.utils import timezone
        from datetime import timedelta
        
        extra_context = extra_context or {}
        
        # Get statistics
        today = timezone.now().date()
        week_ago = today - timedelta(days=7)
        
        extra_context['total_users'] = User.objects.count()
        extra_context['total_posts'] = Post.objects.count()
        extra_context['total_comments'] = Comment.objects.count()
        extra_context['active_stories'] = Story.objects.filter(
            expires_at__gt=timezone.now()
        ).count()
        extra_context['unread_notifications'] = Notification.objects.filter(
            is_read=False
        ).count()
        
        # Weekly statistics
        extra_context['new_users_week'] = User.objects.filter(
            date_joined__gte=week_ago
        ).count()
        extra_context['new_posts_week'] = Post.objects.filter(
            created_at__gte=week_ago
        ).count()
        
        return super().index(request, extra_context)

# You can use this custom admin site if needed
# instagram_admin_site = InstagramAdminSite(name='instagram_admin')