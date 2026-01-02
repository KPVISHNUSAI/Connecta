import { Box, Container, Typography } from '@mui/material'

const SearchPage = () => {
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
          🔎 Search
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Search for users and posts.
        </Typography>
      </Box>
    </Container>
  )
}

export default SearchPage