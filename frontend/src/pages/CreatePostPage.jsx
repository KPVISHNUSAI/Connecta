import { Box, Container, Typography } from '@mui/material'

const CreatePostPage = () => {
  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 'calc(100vh - 100px)',
          textAlign: 'center',
        }}
      >
        <Typography variant="h3" gutterBottom>
          ➕ Create Post
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Share your photos and videos with your followers.
        </Typography>
      </Box>
    </Container>
  )
}

export default CreatePostPage