import { useState, useEffect } from 'react'
import { Container, Box, Typography, CircularProgress } from '@mui/material'

const TestFeedPage = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log('Loading mock posts...')
    
    // Simple mock posts
    const mockPosts = [
      { id: 1, username: 'user1', caption: 'Post 1' },
      { id: 2, username: 'user2', caption: 'Post 2' },
      { id: 3, username: 'user3', caption: 'Post 3' },
    ]

    setTimeout(() => {
      setPosts(mockPosts)
      setLoading(false)
      console.log('Posts loaded:', mockPosts)
    }, 1000)
  }, [])

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Container>
    )
  }

  return (
    <Container maxWidth="md" sx={{ pt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Test Feed Page
      </Typography>
      
      {posts.map((post) => (
        <Box
          key={post.id}
          sx={{
            p: 3,
            mb: 2,
            border: '1px solid #ddd',
            borderRadius: 1,
            bgcolor: 'white',
          }}
        >
          <Typography variant="h6">{post.username}</Typography>
          <Typography>{post.caption}</Typography>
        </Box>
      ))}
    </Container>
  )
}

export default TestFeedPage