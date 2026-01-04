import apiClient from './client'
import { API_ENDPOINTS } from '@/utils/constants'
import { generateMockFeedResponse } from './mockData'

// Auth API
export const authAPI = {
  login: (credentials) => apiClient.post(API_ENDPOINTS.LOGIN, credentials),
  refresh: (refreshToken) => apiClient.post(API_ENDPOINTS.REFRESH, { refresh: refreshToken }),
  register: (userData) => apiClient.post(API_ENDPOINTS.REGISTER, userData),
}

// Users API
export const usersAPI = {
  getUsers: (params) => apiClient.get(API_ENDPOINTS.USERS, { params }),
  getUserById: (id) => apiClient.get(API_ENDPOINTS.USER_DETAIL(id)),
  updateUser: (id, data) => apiClient.patch(API_ENDPOINTS.USER_DETAIL(id), data),
  follow: (id) => apiClient.post(API_ENDPOINTS.FOLLOW(id)),
  unfollow: (id) => apiClient.post(API_ENDPOINTS.UNFOLLOW(id)),
}

// Posts API (with mock data for development)
const USE_MOCK_DATA = false // Set to false when backend is ready

export const postsAPI = {
  getPosts: (params) => apiClient.get(API_ENDPOINTS.POSTS, { params }),
  getPostById: (id) => apiClient.get(API_ENDPOINTS.POST_DETAIL(id)),
  // createPost: (data) => apiClient.post(API_ENDPOINTS.POSTS, data),
  createPost: (formData) => {
    if (USE_MOCK_DATA) {
      // Mock successful post creation
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            data: {
              id: Date.now(),
              message: 'Post created successfully',
            },
          })
        }, 1500)
      })
    }
    return apiClient.post(API_ENDPOINTS.POSTS, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },
  updatePost: (id, data) => apiClient.patch(API_ENDPOINTS.POST_DETAIL(id), data),
  deletePost: (id) => apiClient.delete(API_ENDPOINTS.POST_DETAIL(id)),
  
  getFeed: (params) => {
    if (USE_MOCK_DATA) {
      // Simulate API delay
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            data: generateMockFeedResponse(params.page || 1, 3), // 3 posts per page
          })
        }, 500) // 500ms delay
      })
    }
    return apiClient.get(API_ENDPOINTS.POST_FEED, { params })
  },
  
  getExplore: (params) => {
    if (USE_MOCK_DATA) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            data: generateMockFeedResponse(params.page || 1, 3),
          })
        }, 500)
      })
    }
    return apiClient.get(API_ENDPOINTS.POST_EXPLORE, { params })
  },
  
  likePost: (id) => {
    if (USE_MOCK_DATA) {
      return Promise.resolve({ data: { message: 'Liked' } })
    }
    return apiClient.post(API_ENDPOINTS.POST_LIKE(id))
  },
  
  unlikePost: (id) => {
    if (USE_MOCK_DATA) {
      return Promise.resolve({ data: { message: 'Unliked' } })
    }
    return apiClient.post(API_ENDPOINTS.POST_UNLIKE(id))
  },
  
  savePost: (id) => {
    if (USE_MOCK_DATA) {
      return Promise.resolve({ data: { message: 'Saved' } })
    }
    return apiClient.post(API_ENDPOINTS.POST_SAVE(id))
  },
  
  unsavePost: (id) => {
    if (USE_MOCK_DATA) {
      return Promise.resolve({ data: { message: 'Unsaved' } })
    }
    return apiClient.post(API_ENDPOINTS.POST_UNSAVE(id))
  },
}

// Comments API
export const commentsAPI = {
  getComments: (params) => apiClient.get(API_ENDPOINTS.COMMENTS, { params }),
  createComment: (data) => apiClient.post(API_ENDPOINTS.COMMENTS, data),
  updateComment: (id, data) => apiClient.patch(API_ENDPOINTS.COMMENT_DETAIL(id), data),
  deleteComment: (id) => apiClient.delete(API_ENDPOINTS.COMMENT_DETAIL(id)),
  likeComment: (id) => apiClient.post(API_ENDPOINTS.COMMENT_LIKE(id)),
}

// Stories API
export const storiesAPI = {
  getStories: (params) => apiClient.get(API_ENDPOINTS.STORIES, { params }),
  getStoryById: (id) => apiClient.get(API_ENDPOINTS.STORY_DETAIL(id)),
  createStory: (data) => apiClient.post(API_ENDPOINTS.STORIES, data),
  deleteStory: (id) => apiClient.delete(API_ENDPOINTS.STORY_DETAIL(id)),
  getStoryFeed: (params) => apiClient.get(API_ENDPOINTS.STORY_FEED, { params }),
  viewStory: (id) => apiClient.post(API_ENDPOINTS.STORY_VIEW(id)),
}

// Notifications API
export const notificationsAPI = {
  getNotifications: (params) => apiClient.get(API_ENDPOINTS.NOTIFICATIONS, { params }),
  markAsRead: (id) => apiClient.post(API_ENDPOINTS.NOTIFICATION_READ(id)),
  markAllAsRead: () => apiClient.post(API_ENDPOINTS.NOTIFICATION_READ_ALL),
}

// Search API
export const searchAPI = {
  searchUsers: (query) => apiClient.get(API_ENDPOINTS.SEARCH_USERS, { params: { q: query } }),
  searchPosts: (query) => apiClient.get(API_ENDPOINTS.SEARCH_POSTS, { params: { q: query } }),
}

// Health API
export const healthAPI = {
  check: () => apiClient.get(API_ENDPOINTS.HEALTH),
}