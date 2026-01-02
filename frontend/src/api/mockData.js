export const mockPosts = [
  {
    id: 1,
    user: { id: 1, username: 'john_doe', avatar: null },
    caption: 'Beautiful sunset at the beach! 🌅 #nature #sunset #beach',
    location: 'Santa Monica Beach',
    media: [
      {
        id: 1,
        file: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600',
        media_type: 'image',
      },
    ],
    likes_count: 234,
    comments_count: 12,
    is_liked: false,
    is_saved: false,
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 2,
    user: { id: 2, username: 'jane_smith', avatar: null },
    caption: 'Coffee and code ☕💻',
    location: 'San Francisco, CA',
    media: [
      {
        id: 2,
        file: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=600',
        media_type: 'image',
      },
    ],
    likes_count: 156,
    comments_count: 8,
    is_liked: true,
    is_saved: false,
    created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 3,
    user: { id: 3, username: 'travel_lover', avatar: null },
    caption: 'Exploring the mountains! 🏔️⛰️',
    location: 'Swiss Alps',
    media: [
      {
        id: 3,
        file: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600',
        media_type: 'image',
      },
    ],
    likes_count: 892,
    comments_count: 45,
    is_liked: false,
    is_saved: true,
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 4,
    user: { id: 4, username: 'foodie_paradise', avatar: null },
    caption: 'Homemade pizza night! 🍕👨‍🍳',
    location: 'New York, NY',
    media: [
      {
        id: 4,
        file: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600',
        media_type: 'image',
      },
    ],
    likes_count: 567,
    comments_count: 23,
    is_liked: true,
    is_saved: true,
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 5,
    user: { id: 5, username: 'fitness_guru', avatar: null },
    caption: 'Morning workout done! 💪 #fitness',
    location: 'Venice Beach, CA',
    media: [
      {
        id: 5,
        file: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600',
        media_type: 'image',
      },
    ],
    likes_count: 423,
    comments_count: 34,
    is_liked: false,
    is_saved: false,
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

export const generateMockFeedResponse = (page = 1, pageSize = 2) => {
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const results = mockPosts.slice(start, end)
  
  return {
    count: mockPosts.length,
    next: end < mockPosts.length ? `?page=${page + 1}` : null,
    previous: page > 1 ? `?page=${page - 1}` : null,
    results,
  }
}