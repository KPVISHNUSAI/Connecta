from locust import HttpUser, task, between
import random
import json

class InstagramUser(HttpUser):
    wait_time = between(1, 3)
    
    def on_start(self):
        """Login when user starts"""
        response = self.client.post("/api/token/", json={
            "username": f"user{random.randint(1, 1000)}",
            "password": "testpass123"
        })
        if response.status_code == 200:
            self.token = response.json()['access']
            self.client.headers.update({
                'Authorization': f'Bearer {self.token}'
            })
    
    @task(3)
    def view_feed(self):
        """View user feed"""
        self.client.get("/api/posts/feed/")
    
    @task(2)
    def explore_posts(self):
        """Explore posts"""
        self.client.get("/api/posts/explore/")
    
    @task(5)
    def view_post(self):
        """View specific post"""
        post_id = random.randint(1, 10000)
        self.client.get(f"/api/posts/{post_id}/")
    
    @task(1)
    def create_post(self):
        """Create a new post"""
        self.client.post("/api/posts/", json={
            "caption": f"Test post {random.randint(1, 10000)}",
            "location": "Test Location"
        })
    
    @task(4)
    def like_post(self):
        """Like a post"""
        post_id = random.randint(1, 10000)
        self.client.post(f"/api/posts/{post_id}/like/")
    
    @task(2)
    def comment_on_post(self):
        """Comment on a post"""
        post_id = random.randint(1, 10000)
        self.client.post("/api/comments/", json={
            "post_id": post_id,
            "text": f"Test comment {random.randint(1, 10000)}"
        })
    
    @task(1)
    def search_users(self):
        """Search for users"""
        query = f"user{random.randint(1, 100)}"
        self.client.get(f"/api/search/users/?q={query}")
    
    @task(1)
    def search_posts(self):
        """Search for posts"""
        query = "test"
        self.client.get(f"/api/search/posts/?q={query}")
    
    @task(1)
    def view_notifications(self):
        """View notifications"""
        self.client.get("/api/notifications/")