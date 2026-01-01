from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView
from apps.posts.search import PostSearchView
from apps.accounts.search import UserSearchView

urlpatterns = [
    path('admin/', admin.site.urls),

    # Prometheus metrics
    path('', include('django_prometheus.urls')),
    
    # Health checks
    path('api/', include('apps.core.urls')),

    # API Documentation
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    
    # JWT Authentication
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Search
    path('api/search/posts/', PostSearchView.as_view(), name='post-search'),
    path('api/search/users/', UserSearchView.as_view(), name='user-search'),

    # App URLs
    path('api/accounts/', include('apps.accounts.urls')),
    path('api/posts/', include('apps.posts.urls')),
    path('api/comments/', include('apps.comments.urls')),
    path('api/stories/', include('apps.stories.urls')),
    path('api/notifications/', include('apps.notifications.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)