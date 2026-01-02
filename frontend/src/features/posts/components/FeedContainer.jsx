import { Box, Container, CircularProgress, Typography, Button } from '@mui/material'
import PostCard from './PostCard'
import PostSkeleton from '@/components/common/PostSkeleton'
// import StoriesBar from '@/features/stories/components/StoriesBar'
import { useFeed } from '@/hooks/usePosts'

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

//   const mockStories = [
//     { id: 1, user: { id: 1, username: 'user1', avatar: null }, viewed: false },
//     { id: 2, user: { id: 2, username: 'user2', avatar: null }, viewed: false },
//     { id: 3, user: { id: 3, username: 'user3', avatar: null }, viewed: true },
//   ]

  if (isLoading) {
    return (
      <Container maxWidth="md" sx={{ pt: 4 }}>
        {/* <StoriesBar stories={mockStories} /> */}
        {[1, 2, 3].map((i) => (
          <PostSkeleton key={i} />
        ))}
      </Container>
    )
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
        {/* <StoriesBar stories={mockStories} /> */}
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
      {/* Stories */}
      {/* <StoriesBar stories={mockStories} /> */}

      {/* Posts */}
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}

      {/* Load More Button */}
      {hasNextPage && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Button
            variant="outlined"
            size="large"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            sx={{ minWidth: 200 }}
          >
            {isFetchingNextPage ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1 }} />
                Loading...
              </>
            ) : (
              'Load More Posts'
            )}
          </Button>
        </Box>
      )}

      {/* End of Feed */}
      {!hasNextPage && posts.length > 0 && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body2" color="text.secondary">
            You're all caught up! 🎉
          </Typography>
        </Box>
      )}
    </Container>
  )
}

export default FeedContainer