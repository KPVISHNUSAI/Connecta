import { Box, Container, Typography } from '@mui/material'

const NotificationsPage = () => {
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
          🔔 Notifications
        </Typography>
        <Typography variant="body1" color="text.secondary">
          You'll see notifications about your activity here.
        </Typography>
      </Box>
    </Container>
  )
}

export default NotificationsPage