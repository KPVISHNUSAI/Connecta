import { Box, Paper, Skeleton } from '@mui/material'

const PostSkeleton = () => {
  return (
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
      <Box sx={{ display: 'flex', alignItems: 'center', p: 2, gap: 1.5 }}>
        <Skeleton variant="circular" width={32} height={32} />
        <Box sx={{ flex: 1 }}>
          <Skeleton width="30%" height={20} />
          <Skeleton width="20%" height={16} />
        </Box>
      </Box>

      {/* Image */}
      <Skeleton variant="rectangular" height={400} />

      {/* Actions */}
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <Skeleton variant="circular" width={24} height={24} />
          <Skeleton variant="circular" width={24} height={24} />
          <Skeleton variant="circular" width={24} height={24} />
        </Box>
        <Skeleton width="30%" height={20} sx={{ mb: 1 }} />
        <Skeleton width="80%" height={16} />
        <Skeleton width="60%" height={16} />
      </Box>
    </Paper>
  )
}

export default PostSkeleton