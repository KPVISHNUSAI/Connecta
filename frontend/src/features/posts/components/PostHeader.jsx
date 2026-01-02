import { Link } from 'react-router-dom'
import { Box, Avatar, Typography, IconButton } from '@mui/material'
import { MoreVert } from '@mui/icons-material'
import { generateAvatarUrl } from '@/utils/helpers'

const PostHeader = ({ post }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        p: 2,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Avatar
          component={Link}
          to={`/profile/${post.user?.id}`}
          src={post.user?.avatar || generateAvatarUrl(post.user?.username)}
          sx={{ width: 32, height: 32, cursor: 'pointer' }}
        />
        <Box>
          <Typography
            component={Link}
            to={`/profile/${post.user?.id}`}
            variant="subtitle2"
            fontWeight={600}
            sx={{
              textDecoration: 'none',
              color: 'text.primary',
              '&:hover': { color: 'text.secondary' },
            }}
          >
            {post.user?.username}
          </Typography>
          {post.location && (
            <Typography variant="caption" color="text.secondary" display="block">
              {post.location}
            </Typography>
          )}
        </Box>
      </Box>

      <IconButton size="small">
        <MoreVert />
      </IconButton>
    </Box>
  )
}

export default PostHeader