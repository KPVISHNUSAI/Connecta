import { Box, Container, Typography } from '@mui/material'
import { useParams } from 'react-router-dom'

const ProfilePage = () => {
  const { userId } = useParams()

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
          👤 Profile
        </Typography>
        <Typography variant="body1" color="text.secondary">
          User Profile ID: {userId}
        </Typography>
      </Box>
    </Container>
  )
}

export default ProfilePage