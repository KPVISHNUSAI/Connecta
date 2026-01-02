import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authAPI } from '@/api/endpoints'
import { STORAGE_KEYS } from '@/utils/constants'

const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      login: async (credentials) => {
        set({ isLoading: true, error: null })
        try {
          const response = await authAPI.login(credentials)
          const { access, refresh } = response.data

          // Store tokens
          localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, access)
          localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refresh)

          // Decode JWT to get user info (simple decode, not verification)
          const userPayload = JSON.parse(atob(access.split('.')[1]))
          
          set({
            isAuthenticated: true,
            user: { id: userPayload.user_id },
            isLoading: false,
          })

          return { success: true }
        } catch (error) {
          const errorMessage = error.response?.data?.detail || 'Login failed'
          set({ error: errorMessage, isLoading: false })
          return { success: false, error: errorMessage }
        }
      },

      register: async (userData) => {
        set({ isLoading: true, error: null })
        try {
          await authAPI.register(userData)
          
          // Auto-login after registration
          const loginResult = await get().login({
            username: userData.username,
            password: userData.password,
          })

          return loginResult
        } catch (error) {
          const errorMessage =
            error.response?.data?.detail ||
            error.response?.data?.username?.[0] ||
            error.response?.data?.email?.[0] ||
            'Registration failed'
          set({ error: errorMessage, isLoading: false })
          return { success: false, error: errorMessage }
        }
      },

      logout: () => {
        // Clear tokens
        localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
        localStorage.removeItem(STORAGE_KEYS.USER)

        // Reset state
        set({
          user: null,
          isAuthenticated: false,
          error: null,
        })
      },

      clearError: () => {
        set({ error: null })
      },

      setUser: (user) => {
        set({ user, isAuthenticated: true })
      },

      checkAuth: () => {
        const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
        if (token) {
          try {
            const userPayload = JSON.parse(atob(token.split('.')[1]))
            set({
              isAuthenticated: true,
              user: { id: userPayload.user_id },
            })
          } catch {
            get().logout()
          }
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)

export default useAuthStore