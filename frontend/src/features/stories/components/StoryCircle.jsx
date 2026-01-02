import { Box, Container, CircularProgress, Typography, Button } from '@mui/material'
import PostCard from '@/features/posts/components/PostCard'
import StoriesBar from '@/features/stories/components/StoriesBar'
import { useFeed } from '@/hooks/usePosts'
import useInfiniteScroll from '@/hooks/useInfiniteScroll'
import Loading from '@/components/common/Loading'

const FeedContainer = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useFeed()

  const lastPostRef = useInfiniteScroll(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, hasNextPage)

  // Mock stories data (we'll make this real later)
  const mockStories = [
    {
      id: 1,
      user: { id: 1, username: 'user1', avatar: null },
      viewed: false,
    },
    {
      id: 2,
      user: { id: 2, username: 'user2', avatar: null },
      viewed: false,
    },
    {
      id: 3,
      user: { id: 3, username: 'user3', avatar: null },
      viewed: true,
    },
  ]

  if (isLoading) {
    return <Loading fullScreen />
  }

  if (isError) {
    return (
      <Container maxWidth="md" sx={{ pt: 4 }}>
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="error" gutterBottom>
            Failed to load feed
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {error?.message || 'Something went wrong'}
          </Typography>
          <Button variant="contained" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </Box>
      </Container>
    )
  }

  const posts = data?.pages?.flatMap((page) => page.results) || []

  if (posts.length === 0) {
    return (
      <Container maxWidth="md" sx={{ pt: 4 }}>
        <StoriesBar stories={mockStories} />
        <Box
          sx={{
            textAlign: 'center',
            py: 8,
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1,
            bgcolor: 'background.paper',
          }}
        >
          <Typography variant="h6" gutterBottom>
            No posts yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Follow people to see their posts in your feed
          </Typography>
          <Button variant="contained" href="/explore">
            Explore
          </Button>
        </Box>
      </Container>
    )
  }

  return (
    <Container maxWidth="md" sx={{ pt: 4 }}>
      {/* Stories Bar */}
      <StoriesBar stories={mockStories} />

      {/* Posts */}
      {posts.map((post, index) => {
        const isLast = posts.length === index + 1
        if (posts.length === index + 1) {
          return (
            <div ref={lastPostRef} key={post.id}>
              <PostCard key={post.id} post={post} ref={isLast ? lastPostRef : null} />
            </div>
          )
        }
        return <PostCard key={post.id} post={post} />
      })}

      {/* Loading More */}
      {isFetchingNextPage && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* End of Feed */}
      {!hasNextPage && posts.length > 0 && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body2" color="text.secondary">
            You're all caught up!
          </Typography>
        </Box>
      )}
    </Container>
  )
}

export default FeedContainer