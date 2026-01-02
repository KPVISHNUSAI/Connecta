import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { postsAPI } from '@/api/endpoints'
import toast from 'react-hot-toast'

export const useFeed = () => {
  return useInfiniteQuery({
    queryKey: ['feed'],
    queryFn: async ({ pageParam = 1 }) => {
      console.log('📥 Fetching page:', pageParam)
      const response = await postsAPI.getFeed({ page: pageParam })
      console.log('✅ Received:', response.data.results.length, 'posts')
      return response.data
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => {
      // Simple check: if there's a next URL, return the next page number
      if (lastPage.next) {
        return pages.length + 1
      }
      return null // null means no more pages
    },
  })
}

export const useExplorePosts = () => {
  return useInfiniteQuery({
    queryKey: ['explore'],
    queryFn: async ({ pageParam }) => {
      const response = await postsAPI.getExplore({ page: pageParam })
      return response.data
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.next ? allPages.length + 1 : undefined
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  })
}

export const useLikePost = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ postId, isLiked }) => {
      if (isLiked) {
        return postsAPI.unlikePost(postId)
      }
      return postsAPI.likePost(postId)
    },
    onError: (error) => {
      toast.error('Failed to update like')
      queryClient.invalidateQueries({ queryKey: ['feed'] })
      console.log(error);
      
    },
  })
}

export const useSavePost = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ postId, isSaved }) => {
      if (isSaved) {
        return postsAPI.unsavePost(postId)
      }
      return postsAPI.savePost(postId)
    },
    onError: (error) => {
      toast.error('Failed to update save')
      queryClient.invalidateQueries({ queryKey: ['feed'] })
      console.log('Error saving post:', error)
    },
  })
}