import { Box, Container, Typography } from '@mui/material'

const ExplorePage = () => {
  return (
    <Container maxWidth="lg">
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
          🔍 Explore
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Discover trending posts and new people to follow.
        </Typography>
      </Box>
    </Container>
  )
}

export default ExplorePage