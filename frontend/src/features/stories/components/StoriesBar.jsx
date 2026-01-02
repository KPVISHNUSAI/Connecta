import { Box, Paper } from '@mui/material'
import StoryCircle from './StoryCircle'

const StoriesBar = ({ stories = [] }) => {
  return (
    <Paper
      elevation={0}
      sx={{
        mb: 3,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: { xs: 0, sm: 1 },
        p: 2,
        display: { xs: 'none', sm: 'block' },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          overflowX: 'auto',
          overflowY: 'hidden',
          '&::-webkit-scrollbar': {
            height: 8,
          },
          '&::-webkit-scrollbar-track': {
            bgcolor: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            bgcolor: '#dbdbdb',
            borderRadius: 4,
          },
        }}
      >
        {/* Add Your Story */}
        <StoryCircle isAddStory />

        {/* Stories */}
        {stories.map((story) => (
          <StoryCircle key={story.id} story={story} />
        ))}
      </Box>
    </Paper>
  )
}

export default StoriesBar