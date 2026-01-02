import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Box,
  Button,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
  Alert,
  CircularProgress,
} from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { useForm } from 'react-hook-form'
import useAuthStore from '@/store/authStore'
import toast from 'react-hot-toast'

const LoginForm = () => {
  const navigate = useNavigate()
  const { login, isLoading, error, clearError } = useAuthStore()
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const onSubmit = async (data) => {
    clearError()
    const result = await login(data)

    if (result.success) {
      toast.success('Welcome back!')
      navigate('/')
    } else {
      toast.error(result.error || 'Login failed')
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ width: '100%' }}>
      {/* Logo */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography
          variant="h3"
          sx={{
            fontFamily: "'Lobster', cursive",
            background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Connecta
        </Typography>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={clearError}>
          {error}
        </Alert>
      )}

      {/* Username/Email Field */}
      <TextField
        fullWidth
        label="Username or Email"
        margin="normal"
        autoFocus
        {...register('username', {
          required: 'Username or email is required',
        })}
        error={!!errors.username}
        helperText={errors.username?.message}
        disabled={isLoading}
      />

      {/* Password Field */}
      <TextField
        fullWidth
        label="Password"
        type={showPassword ? 'text' : 'password'}
        margin="normal"
        {...register('password', {
          required: 'Password is required',
        })}
        error={!!errors.password}
        helperText={errors.password?.message}
        disabled={isLoading}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShowPassword(!showPassword)}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      {/* Login Button */}
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{
          mt: 3,
          mb: 2,
          py: 1.5,
          textTransform: 'none',
          fontSize: '1rem',
          fontWeight: 600,
          background: 'linear-gradient(45deg, #405DE6, #5B51D8, #833AB4, #C13584, #E1306C, #FD1D1D)',
        }}
        disabled={isLoading}
      >
        {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Log In'}
      </Button>

      {/* Forgot Password Link */}
      <Box sx={{ textAlign: 'center', mb: 2 }}>
        <Link
          to="/forgot-password"
          style={{
            color: '#00376b',
            fontSize: '0.875rem',
            textDecoration: 'none',
          }}
        >
          Forgot password?
        </Link>
      </Box>

      {/* Divider */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          my: 3,
        }}
      >
        <Box sx={{ flex: 1, height: '1px', bgcolor: '#dbdbdb' }} />
        <Typography sx={{ px: 2, color: '#8e8e8e', fontSize: '0.875rem' }}>
          OR
        </Typography>
        <Box sx={{ flex: 1, height: '1px', bgcolor: '#dbdbdb' }} />
      </Box>

      {/* Sign Up Link */}
      <Box
        sx={{
          textAlign: 'center',
          border: '1px solid #dbdbdb',
          borderRadius: 1,
          p: 2,
        }}
      >
        <Typography variant="body2">
          Don't have an account?{' '}
          <Link
            to="/register"
            style={{
              color: '#0095f6',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            Sign up
          </Link>
        </Typography>
      </Box>
    </Box>
  )
}

export default LoginForm