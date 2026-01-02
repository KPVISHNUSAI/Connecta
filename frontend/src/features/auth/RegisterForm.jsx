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
  LinearProgress,
  Checkbox,
  FormControlLabel,
} from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { useForm } from 'react-hook-form'
import useAuthStore from '@/store/authStore'
import toast from 'react-hot-toast'
import {
  isValidEmail,
  isValidUsername,
  getPasswordStrength,
} from '@/utils/helpers'

const RegisterForm = () => {
  const navigate = useNavigate()
  const { register: registerUser, isLoading, error, clearError } = useAuthStore()
  const [showPassword, setShowPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(null)

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm()

  const handlePasswordChange = (e) => {
    const pwd = e.target.value
    if (pwd) {
      setPasswordStrength(getPasswordStrength(pwd))
    } else {
      setPasswordStrength(null)
    }
  }

  const onSubmit = async (data) => {
    clearError()

    const { agreeToTerms: _agreeToTerms, ...userData } = data

    const result = await registerUser(userData)

    if (result.success) {
      toast.success('Welcome to Connecta!')
      navigate('/')
    } else {
      console.log(result);
      console.log(userData);
      
      toast.error(result.error || 'Registration failed')
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ width: '100%' }}>
      {/* Logo */}
      <Box sx={{ textAlign: 'center', mb: 3 }}>
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
        <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
          Sign up to see photos and videos from your friends.
        </Typography>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={clearError}>
          {error}
        </Alert>
      )}

      {/* Email Field */}
      <TextField
        fullWidth
        label="Email"
        type="email"
        margin="normal"
        autoFocus
        {...register('email', {
          required: 'Email is required',
          validate: (value) =>
            isValidEmail(value) || 'Please enter a valid email',
        })}
        error={!!errors.email}
        helperText={errors.email?.message}
        disabled={isLoading}
      />

      {/* Full Name Field */}
      <TextField
        fullWidth
        label="Full Name"
        margin="normal"
        {...register('first_name', {
          required: 'Full name is required',
          minLength: {
            value: 2,
            message: 'Name must be at least 2 characters',
          },
        })}
        error={!!errors.first_name}
        helperText={errors.first_name?.message}
        disabled={isLoading}
      />

      {/* Username Field */}
      <TextField
        fullWidth
        label="Username"
        margin="normal"
        {...register('username', {
          required: 'Username is required',
          validate: (value) =>
            isValidUsername(value) ||
            'Username must be 3-30 characters (letters, numbers, underscore, dot)',
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
          minLength: {
            value: 8,
            message: 'Password must be at least 8 characters',
          },
        })}
        onChange={handlePasswordChange}
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

      {/* Password Strength Indicator */}
      {passwordStrength && (
        <Box sx={{ mt: 1 }}>
          <LinearProgress
            variant="determinate"
            value={
              passwordStrength.level === 'weak'
                ? 33
                : passwordStrength.level === 'medium'
                ? 66
                : 100
            }
            color={passwordStrength.color}
            sx={{ height: 4, borderRadius: 2 }}
          />
          <Typography
            variant="caption"
            color={`${passwordStrength.color}.main`}
            sx={{ mt: 0.5, display: 'block' }}
          >
            Password strength: {passwordStrength.level}
          </Typography>
        </Box>
      )}

      {/* Confirm Password Field */}
      <TextField
        fullWidth
        label="Confirm Password"
        type={showPassword ? 'text' : 'password'}
        margin="normal"
        {...register('password2', {
          required: 'Please confirm your password',
          validate: (value) =>
            value === getValues('password') || 'Passwords do not match',
        })}
        error={!!errors.password2}
        helperText={errors.password2?.message}
        disabled={isLoading}
      />
      <FormControlLabel
        control={
          <Checkbox
            {...register('agreeToTerms', {
              required: 'You must agree to the terms',
            })}
            disabled={isLoading}
          />
        }
        label={
          <Typography variant="body2" color="text.secondary">
            I agree to the{' '}
            <Link to="/terms" style={{ color: '#0095f6' }}>
              Terms
            </Link>{' '}
            and{' '}
            <Link to="/privacy" style={{ color: '#0095f6' }}>
              Privacy Policy
            </Link>
          </Typography>
        }
        sx={{ mt: 1 }}
      />
      {errors.agreeToTerms && (
        <Typography variant="caption" color="error" sx={{ ml: 2 }}>
          {errors.agreeToTerms.message}
        </Typography>
      )}

      {/* Sign Up Button */}
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
        {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Sign Up'}
      </Button>

      {/* Login Link */}
      <Box
        sx={{
          textAlign: 'center',
          border: '1px solid #dbdbdb',
          borderRadius: 1,
          p: 2,
        }}
      >
        <Typography variant="body2">
          Have an account?{' '}
          <Link
            to="/login"
            style={{
              color: '#0095f6',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            Log in
          </Link>
        </Typography>
      </Box>
    </Box>
  )
}

export default RegisterForm