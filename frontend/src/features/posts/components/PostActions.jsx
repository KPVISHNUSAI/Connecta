import { useState } from 'react'
import { Box, IconButton, Typography } from '@mui/material'
import {
  FavoriteBorder,
  Favorite,
  ChatBubbleOutline,
  Send,
  BookmarkBorder,
  Bookmark,
} from '@mui/icons-material'
import { useLikePost, useSavePost } from '@/hooks/usePosts'
import { formatNumber } from '@/utils/helpers'

const PostActions = ({ post }) => {
  const [isLiked, setIsLiked] = useState(post.is_liked || false)
  const [isSaved, setIsSaved] = useState(post.is_saved || false)
  const [likesCount, setLikesCount] = useState(post.likes_count || 0)

  const likePostMutation = useLikePost()
  const savePostMutation = useSavePost()

  const handleLike = () => {
    const newIsLiked = !isLiked
    setIsLiked(newIsLiked)
    setLikesCount(newIsLiked ? likesCount + 1 : likesCount - 1)

    likePostMutation.mutate({
      postId: post.id,
      isLiked: isLiked,
    })
  }

  const handleSave = () => {
    setIsSaved(!isSaved)
    savePostMutation.mutate({
      postId: post.id,
      isSaved: isSaved,
    })
  }

  return (
    <Box sx={{ px: 2 }}>
      {/* Action Buttons */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          py: 1,
        }}
      >
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton onClick={handleLike} sx={{ p: 1 }}>
            {isLiked ? (
              <Favorite sx={{ color: '#ed4956' }} />
            ) : (
              <FavoriteBorder />
            )}
          </IconButton>
          <IconButton sx={{ p: 1 }}>
            <ChatBubbleOutline />
          </IconButton>
          <IconButton sx={{ p: 1 }}>
            <Send />
          </IconButton>
        </Box>

        <IconButton onClick={handleSave} sx={{ p: 1 }}>
          {isSaved ? <Bookmark /> : <BookmarkBorder />}
        </IconButton>
      </Box>

      {/* Likes Count */}
      {likesCount > 0 && (
        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
          {formatNumber(likesCount)} {likesCount === 1 ? 'like' : 'likes'}
        </Typography>
      )}
    </Box>
  )
}

export default PostActions