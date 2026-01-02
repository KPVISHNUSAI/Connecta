// API endpoints base
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost/api'

// App info
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'Connecta'
export const APP_VERSION = import.meta.env.VITE_APP_VERSION || '1.0.0'

// Local storage keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'connecta_access_token',
  REFRESH_TOKEN: 'connecta_refresh_token',
  USER: 'connecta_user',
  THEME: 'connecta_theme',
}

// API endpoints
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/token/',
  REFRESH: '/token/refresh/',
  REGISTER: '/accounts/users/register/',
  
  // Users
  USERS: '/accounts/users/',
  USER_DETAIL: (id) => `/accounts/users/${id}/`,
  FOLLOW: (id) => `/accounts/users/${id}/follow/`,
  UNFOLLOW: (id) => `/accounts/users/${id}/unfollow/`,
  
  // Posts
  POSTS: '/posts/',
  POST_DETAIL: (id) => `/posts/${id}/`,
  POST_FEED: '/posts/feed/',
  POST_EXPLORE: '/posts/explore/',
  POST_LIKE: (id) => `/posts/${id}/like/`,
  POST_UNLIKE: (id) => `/posts/${id}/unlike/`,
  POST_SAVE: (id) => `/posts/${id}/save/`,
  POST_UNSAVE: (id) => `/posts/${id}/unsave/`,
  
  // Comments
  COMMENTS: '/comments/',
  COMMENT_DETAIL: (id) => `/comments/${id}/`,
  COMMENT_LIKE: (id) => `/comments/${id}/like/`,
  
  // Stories
  STORIES: '/stories/',
  STORY_DETAIL: (id) => `/stories/${id}/`,
  STORY_FEED: '/stories/feed/',
  STORY_VIEW: (id) => `/stories/${id}/view/`,
  
  // Notifications
  NOTIFICATIONS: '/notifications/',
  NOTIFICATION_READ: (id) => `/notifications/${id}/mark_read/`,
  NOTIFICATION_READ_ALL: '/notifications/mark_all_read/',
  
  // Search
  SEARCH_USERS: '/search/users/',
  SEARCH_POSTS: '/search/posts/',
  
  // Health
  HEALTH: '/health/',
}

// Pagination
export const DEFAULT_PAGE_SIZE = 20

// File upload
export const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
export const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/ogg']

// UI
export const BREAKPOINTS = {
  xs: 0,
  sm: 600,
  md: 900,
  lg: 1200,
  xl: 1536,
}

// Theme
export const THEME_MODE = {
  LIGHT: 'light',
  DARK: 'dark',
}

// Status
export const REQUEST_STATUS = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
}