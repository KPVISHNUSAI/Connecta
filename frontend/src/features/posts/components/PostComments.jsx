import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Box, Typography, Button } from '@mui/material'
import { formatTimeAgo } from '@/utils/helpers'

const PostComments = ({ post }) => {
  const [showMore, setShowMore] = useState(false)
  const maxLength = 150

  const shouldTruncate = post.caption && post.caption.length > maxLength
  const displayCaption = showMore
    ? post.caption
    : post.caption?.substring(0, maxLength)

  return (
    <Box sx={{ px: 2, pb: 2 }}>
      {/* Caption */}
      {post.caption && (
        <Box sx={{ mb: 1 }}>
          <Typography variant="body2" component="span">
            <Typography
              component={Link}
              to={`/profile/${post.user?.id}`}
              variant="subtitle2"
              fontWeight={600}
              sx={{
                textDecoration: 'none',
                color: 'text.primary',
                mr: 1,
              }}
            >
              {post.user?.username}
            </Typography>
            {displayCaption}
            {shouldTruncate && !showMore && '...'}
          </Typography>
          {shouldTruncate && (
            <Button
              size="small"
              onClick={() => setShowMore(!showMore)}
              sx={{
                textTransform: 'none',
                color: 'text.secondary',
                minWidth: 'auto',
                p: 0,
                ml: 0.5,
              }}
            >
              {showMore ? 'less' : 'more'}
            </Button>
          )}
        </Box>
      )}

      {/* View Comments */}
      {post.comments_count > 0 && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ cursor: 'pointer', mb: 0.5 }}
        >
          View all {post.comments_count} comments
        </Typography>
      )}

      {/* Timestamp */}
      <Typography variant="caption" color="text.secondary">
        {formatTimeAgo(post.created_at)}
      </Typography>
    </Box>
  )
}

export default PostComments