from django.test import TestCase
from django.core.cache import cache
from apps.core.cache_utils import CacheManager

class CacheTestCase(TestCase):
    def setUp(self):
        cache.clear()
    
    def test_cache_set_get(self):
        """Test basic cache set and get"""
        cache.set('test_key', 'test_value', 60)
        value = cache.get('test_key')
        self.assertEqual(value, 'test_value')
    
    def test_user_feed_cache(self):
        """Test user feed caching"""
        user_id = 1
        feed_data = [1, 2, 3, 4, 5]
        
        CacheManager.set_user_feed(user_id, feed_data)
        cached_feed = CacheManager.get_user_feed(user_id)
        
        self.assertEqual(cached_feed, feed_data)
    
    def test_cache_invalidation(self):
        """Test cache invalidation"""
        user_id = 1
        feed_data = [1, 2, 3]
        
        CacheManager.set_user_feed(user_id, feed_data)
        CacheManager.invalidate_user_feed(user_id)
        
        cached_feed = CacheManager.get_user_feed(user_id)
        self.assertIsNone(cached_feed)