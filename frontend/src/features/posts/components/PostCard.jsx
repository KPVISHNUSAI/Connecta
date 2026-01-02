import { Box, Paper } from '@mui/material'
import PostHeader from './PostHeader'
import PostActions from './PostActions'
import PostComments from './PostComments'
import { forwardRef } from 'react'

const PostCard = forwardRef(({ post }, ref) => {
  return (
    <div ref={ref}>
        <Paper
        elevation={0}
        sx={{
            mb: 3,
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: { xs: 0, sm: 1 },
        }}
        >
        {/* Header */}
        <PostHeader post={post} />

        {/* Image/Video */}
        <Box
            sx={{
            position: 'relative',
            width: '100%',
            paddingTop: '100%', // 1:1 aspect ratio
            bgcolor: '#000',
            }}
        >
            {post.media && post.media.length > 0 && (
            <Box
                component="img"
                src={post.media[0].file || '/placeholder.jpg'}
                alt={post.caption || 'Post image'}
                sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                }}
            />
            )}
        </Box>

        {/* Actions */}
        <PostActions post={post} />

        {/* Comments */}
        <PostComments post={post} />
        </Paper>
    </div>
  )
})

export default PostCard