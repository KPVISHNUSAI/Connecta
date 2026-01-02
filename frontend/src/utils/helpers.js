import { formatDistanceToNow, format } from 'date-fns'

// Format date/time
export const formatTimeAgo = (date) => {
  return formatDistanceToNow(new Date(date), { addSuffix: true })
}

export const formatDate = (date, formatStr = 'MMM dd, yyyy') => {
  return format(new Date(date), formatStr)
}

// Truncate text
export const truncateText = (text, maxLength = 100) => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

// Format numbers (1000 -> 1K)
export const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

// Validate email
export const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

// Validate username (alphanumeric, underscore, dot)
export const isValidUsername = (username) => {
  const re = /^[a-zA-Z0-9_.]{3,30}$/
  return re.test(username)
}

// Validate password (min 8 chars, at least 1 letter and 1 number)
export const isValidPassword = (password) => {
  const re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/
  return re.test(password)
}

// Get password strength
export const getPasswordStrength = (password) => {
  let strength = 0
  if (password.length >= 8) strength++
  if (password.length >= 12) strength++
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++
  if (/\d/.test(password)) strength++
  if (/[@$!%*#?&]/.test(password)) strength++
  
  if (strength <= 2) return { level: 'weak', color: 'error' }
  if (strength <= 3) return { level: 'medium', color: 'warning' }
  return { level: 'strong', color: 'success' }
}

// Extract mentions from text
export const extractMentions = (text) => {
  const mentionRegex = /@(\w+)/g
  const mentions = []
  let match
  while ((match = mentionRegex.exec(text)) !== null) {
    mentions.push(match[1])
  }
  return mentions
}

// Extract hashtags from text
export const extractHashtags = (text) => {
  const hashtagRegex = /#(\w+)/g
  const hashtags = []
  let match
  while ((match = hashtagRegex.exec(text)) !== null) {
    hashtags.push(match[1])
  }
  return hashtags
}

// Format file size
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

// Check if file is valid image
export const isValidImage = (file, maxSize = 10 * 1024 * 1024) => {
  const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  return validTypes.includes(file.type) && file.size <= maxSize
}

// Check if file is valid video
export const isValidVideo = (file, maxSize = 50 * 1024 * 1024) => {
  const validTypes = ['video/mp4', 'video/webm', 'video/ogg']
  return validTypes.includes(file.type) && file.size <= maxSize
}

// Debounce function
export const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Throttle function
export const throttle = (func, limit) => {
  let inThrottle
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

// Copy to clipboard
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (err) {
    console.error('Failed to copy:', err)
    return false
  }
}

// Generate avatar URL (using DiceBear API)
export const generateAvatarUrl = (seed) => {
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`
}

// Get error message from error object
export const getErrorMessage = (error) => {
  if (error.response?.data?.detail) {
    return error.response.data.detail
  }
  if (error.response?.data?.message) {
    return error.response.data.message
  }
  if (error.message) {
    return error.message
  }
  return 'An unexpected error occurred'
}