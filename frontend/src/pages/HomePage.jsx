import { Box, Container, Typography, CircularProgress } from '@mui/material'
import  FeedContainer  from '@features/posts/components/FeedContainer'
// import useAuthStore from '@/store/authStore'

const HomePage = () => {
  // const { user } = useAuthStore()

  return <FeedContainer />
}

export default HomePage