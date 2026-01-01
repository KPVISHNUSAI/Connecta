from django.core.cache import cache
from functools import wraps
import hashlib
import json

def cache_result(timeout=300, key_prefix=''):
    """
    Decorator to cache function results
    Usage: @cache_result(timeout=600, key_prefix='user_profile')
    """
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            # Generate cache key
            cache_key = f"{key_prefix}:{func.__name__}"
            
            # Add args and kwargs to cache key
            if args:
                cache_key += f":{hashlib.md5(str(args).encode()).hexdigest()}"
            if kwargs:
                cache_key += f":{hashlib.md5(json.dumps(kwargs, sort_keys=True).encode()).hexdigest()}"
            
            # Try to get from cache
            result = cache.get(cache_key)
            if result is not None:
                return result
            
            # Execute function
            result = func(*args, **kwargs)
            
            # Cache result
            cache.set(cache_key, result, timeout)
            return result
        
        return wrapper
    return decorator

def invalidate_cache(key_pattern):
    """
    Invalidate cache keys matching pattern
    """
    from django_redis import get_redis_connection
    conn = get_redis_connection("default")
    keys = conn.keys(f"*{key_pattern}*")
    if keys:
        conn.delete(*keys)

class CacheManager:
    """
    Centralized cache management
    """
    
    @staticmethod
    def get_user_feed(user_id):
        """Get cached user feed"""
        return cache.get(f'user_feed:{user_id}')
    
    @staticmethod
    def set_user_feed(user_id, feed_data, timeout=600):
        """Cache user feed"""
        cache.set(f'user_feed:{user_id}', feed_data, timeout)
    
    @staticmethod
    def invalidate_user_feed(user_id):
        """Invalidate user feed cache"""
        cache.delete(f'user_feed:{user_id}')
    
    @staticmethod
    def get_trending_posts():
        """Get cached trending posts"""
        return cache.get('trending_posts')
    
    @staticmethod
    def set_trending_posts(post_ids, timeout=1800):
        """Cache trending posts"""
        cache.set('trending_posts', post_ids, timeout)
    
    @staticmethod
    def get_user_profile(user_id):
        """Get cached user profile"""
        return cache.get(f'user_profile:{user_id}')
    
    @staticmethod
    def set_user_profile(user_id, profile_data, timeout=3600):
        """Cache user profile"""
        cache.set(f'user_profile:{user_id}', profile_data, timeout)
    
    @staticmethod
    def invalidate_user_profile(user_id):
        """Invalidate user profile cache"""
        cache.delete(f'user_profile:{user_id}')
    
    @staticmethod
    def get_post_detail(post_id):
        """Get cached post detail"""
        return cache.get(f'post:{post_id}')
    
    @staticmethod
    def set_post_detail(post_id, post_data, timeout=600):
        """Cache post detail"""
        cache.set(f'post:{post_id}', post_data, timeout)
    
    @staticmethod
    def invalidate_post_detail(post_id):
        """Invalidate post cache"""
        cache.delete(f'post:{post_id}')