from django.core.cache import cache
from rest_framework.throttling import SimpleRateThrottle
from django.http import JsonResponse
import time

class CustomRateThrottle(SimpleRateThrottle):
    """
    Custom rate limiting with Redis
    """
    
    def get_cache_key(self, request, view):
        if request.user.is_authenticated:
            ident = request.user.pk
        else:
            ident = self.get_ident(request)
        
        return self.cache_format % {
            'scope': self.scope,
            'ident': ident
        }

class PostRateThrottle(CustomRateThrottle):
    scope = 'posts'
    rate = '50/hour'

class CommentRateThrottle(CustomRateThrottle):
    scope = 'comments'
    rate = '100/hour'

class LikeRateThrottle(CustomRateThrottle):
    scope = 'likes'
    rate = '200/hour'

class FollowRateThrottle(CustomRateThrottle):
    scope = 'follows'
    rate = '30/hour'

class RateLimitMiddleware:
    """
    Global rate limiting middleware using Redis
    """
    
    def __init__(self, get_response):
        self.get_response = get_response
    
    def __call__(self, request):
        # Get client IP
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        
        # Rate limit key
        cache_key = f'rate_limit:{ip}:{int(time.time() / 60)}'
        
        # Get current count
        count = cache.get(cache_key, 0)
        
        # Check if limit exceeded (1000 requests per minute per IP)
        if count >= 1000:
            return JsonResponse({
                'error': 'Rate limit exceeded',
                'detail': 'Too many requests. Please try again later.'
            }, status=429)
        
        # Increment counter
        cache.set(cache_key, count + 1, 60)
        
        response = self.get_response(request)
        
        # Add rate limit headers
        response['X-RateLimit-Limit'] = '1000'
        response['X-RateLimit-Remaining'] = str(1000 - count - 1)
        response['X-RateLimit-Reset'] = str(int(time.time() / 60 + 1) * 60)
        
        return response