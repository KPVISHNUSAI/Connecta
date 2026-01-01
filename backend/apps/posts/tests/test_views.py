from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from apps.posts.models import Post, PostMedia

User = get_user_model()

class PostAPITestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        self.client.force_authenticate(user=self.user)
    
    def test_create_post(self):
        """Test creating a post"""
        data = {
            'caption': 'Test post',
            'location': 'Test Location'
        }
        response = self.client.post('/api/posts/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
    
    def test_list_posts(self):
        """Test listing posts"""
        response = self.client.get('/api/posts/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    
    def test_like_post(self):
        """Test liking a post"""
        post = Post.objects.create(user=self.user, caption='Test')
        response = self.client.post(f'/api/posts/{post.id}/like/')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
    
    def test_unlike_post(self):
        """Test unliking a post"""
        post = Post.objects.create(user=self.user, caption='Test')
        self.client.post(f'/api/posts/{post.id}/like/')
        response = self.client.post(f'/api/posts/{post.id}/unlike/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)