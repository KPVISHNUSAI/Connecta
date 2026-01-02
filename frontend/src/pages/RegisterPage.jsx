import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Paper } from '@mui/material'
import RegisterForm from '@/features/auth/RegisterForm'
import useAuthStore from '@/store/authStore'

const RegisterPage = () => {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/')
    }
  }, [isAuthenticated, navigate])

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#fafafa',
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={0}
          sx={{
            p: 4,
            border: '1px solid #dbdbdb',
            borderRadius: 1,
          }}
        >
          <RegisterForm />
        </Paper>

        {/* Footer */}
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="#" style={{ color: '#8e8e8e', fontSize: '0.75rem', textDecoration: 'none' }}>
              About
            </a>
            <a href="#" style={{ color: '#8e8e8e', fontSize: '0.75rem', textDecoration: 'none' }}>
              Help
            </a>
            <a href="#" style={{ color: '#8e8e8e', fontSize: '0.75rem', textDecoration: 'none' }}>
              Press
            </a>
            <a href="#" style={{ color: '#8e8e8e', fontSize: '0.75rem', textDecoration: 'none' }}>
              API
            </a>
            <a href="#" style={{ color: '#8e8e8e', fontSize: '0.75rem', textDecoration: 'none' }}>
              Jobs
            </a>
            <a href="#" style={{ color: '#8e8e8e', fontSize: '0.75rem', textDecoration: 'none' }}>
              Privacy
            </a>
            <a href="#" style={{ color: '#8e8e8e', fontSize: '0.75rem', textDecoration: 'none' }}>
              Terms
            </a>
          </Box>
          <Box sx={{ mt: 2, color: '#8e8e8e', fontSize: '0.75rem' }}>
            © 2026 Connecta from Meta
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

export default RegisterPage