import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  IconButton,
  Button,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material'
import { Close, ArrowBack } from '@mui/icons-material'
import ImageUpload from './ImageUpload'
import ImagePreview from './ImagePreview'
import PostDetails from './PostDetails'
import { postsAPI } from '@/api/endpoints'
import { useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'

const CreatePostModal = ({ open, onClose }) => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [step, setStep] = useState(0) // 0: upload, 1: preview, 2: details
  const [selectedImage, setSelectedImage] = useState(null)
  const [caption, setCaption] = useState('')
  const [location, setLocation] = useState('')
  const [settings, setSettings] = useState({
    hideComments: false,
    hideLikes: false,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const steps = ['Select', 'Preview', 'Create']

  const handleImageSelect = (image) => {
    setSelectedImage(image)
    setStep(1)
  }

  const handleBack = () => {
    if (step === 1) {
      setStep(0)
      setSelectedImage(null)
    } else if (step === 2) {
      setStep(1)
    }
  }

  const handleNext = () => {
    if (step === 1) {
      setStep(2)
    }
  }

  const handleClose = () => {
    if (isSubmitting) return

    // Confirm if user has entered data
    if (caption || location || selectedImage) {
      if (window.confirm('Discard post?')) {
        resetForm()
        onClose()
      }
    } else {
      resetForm()
      onClose()
    }
  }

  const resetForm = () => {
    setStep(0)
    setSelectedImage(null)
    setCaption('')
    setLocation('')
    setSettings({ hideComments: false, hideLikes: false })
  }

  const handleSubmit = async () => {
  if (isSubmitting) return
  setIsSubmitting(true)

  try {
    // Convert base64 to blob
    const response = await fetch(selectedImage)
    const blob = await response.blob()
    
    // Create proper file
    const file = new File([blob], 'post-image.jpg', { 
      type: blob.type || 'image/jpeg' 
    })
    
    // Create FormData - Django expects lists for media_files and media_types
    const formData = new FormData()
    
    // The key is to append them separately (not as an array)
    // Django REST Framework will convert multiple values with same key into a list
    formData.append('media_files', file)  // This becomes a list on backend
    formData.append('media_types', 'image')  // This becomes a list on backend
    
    // Other fields
    if (caption) {
      formData.append('caption', caption.trim())
    }
    if (location) {
      formData.append('location', location.trim())
    }
    formData.append('comments_disabled', settings.hideComments)
    
    // Log what we're sending
    console.log('📤 Submitting post...')
    console.log('Caption:', caption)
    console.log('Location:', location)
    console.log('Comments disabled:', settings.hideComments)
    console.log('File:', file.name, file.type, file.size, 'bytes')
    
    // Send request
    const result = await postsAPI.createPost(formData)
    console.log('✅ Post created:', result.data)
    
    toast.success('Post created successfully!')
    queryClient.invalidateQueries(['feed'])
    
    resetForm()
    onClose()
    navigate('/')
    
  } catch (error) {
    console.error('❌ Error creating post:', error)
    console.error('Error response:', error.response?.data)
    
    // Parse error message
    let errorMessage = 'Failed to create post'
    if (error.response?.data) {
      if (error.response.data.detail) {
        errorMessage = error.response.data.detail
      } else if (error.response.data.media_files) {
        errorMessage = Array.isArray(error.response.data.media_files) 
          ? error.response.data.media_files[0]
          : error.response.data.media_files
      } else if (error.response.data.media_types) {
        errorMessage = Array.isArray(error.response.data.media_types)
          ? error.response.data.media_types[0] 
          : error.response.data.media_types
      }
    }
    
    toast.error(errorMessage)
  } finally {
    setIsSubmitting(false)
  }
}


  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          height: { xs: '100vh', sm: '90vh' },
          maxHeight: { xs: '100vh', sm: '800px' },
          m: { xs: 0, sm: 2 },
          borderRadius: { xs: 0, sm: 2 },
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        {step > 0 ? (
          <IconButton onClick={handleBack} disabled={isSubmitting}>
            <ArrowBack />
          </IconButton>
        ) : (
          <Box sx={{ width: 40 }} />
        )}

        <Typography variant="h6" fontWeight={600}>
          {step === 0 && 'Create new post'}
          {step === 1 && 'Preview'}
          {step === 2 && 'Create new post'}
        </Typography>

        {step === 2 ? (
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !selectedImage}
            sx={{ fontWeight: 600, textTransform: 'none' }}
          >
            {isSubmitting ? <CircularProgress size={20} /> : 'Share'}
          </Button>
        ) : step === 1 ? (
          <Button
            onClick={handleNext}
            sx={{ fontWeight: 600, textTransform: 'none' }}
          >
            Next
          </Button>
        ) : (
          <IconButton onClick={handleClose}>
            <Close />
          </IconButton>
        )}
      </Box>

      {/* Stepper */}
      <Box sx={{ p: 2, display: { xs: 'none', sm: 'block' } }}>
        <Stepper activeStep={step}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      {/* Content */}
      <DialogContent sx={{ p: 0, display: 'flex', height: 'calc(100% - 120px)' }}>
        {step === 0 && (
          <Box sx={{ flex: 1, p: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ImageUpload onImageSelect={handleImageSelect} />
          </Box>
        )}

        {step === 1 && (
          <Box sx={{ flex: 1 }}>
            <ImagePreview
              image={selectedImage}
              onBack={handleBack}
              onClose={handleClose}
            />
          </Box>
        )}

        {step === 2 && (
          <Box sx={{ display: 'flex', width: '100%', height: '100%' }}>
            {/* Image Preview */}
            <Box
              sx={{
                flex: 1,
                bgcolor: '#000',
                display: { xs: 'none', md: 'flex' },
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <img
                src={selectedImage}
                alt="Preview"
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                }}
              />
            </Box>

            {/* Details Form */}
            <Box
              sx={{
                width: { xs: '100%', md: '400px' },
                borderLeft: { md: '1px solid' },
                borderColor: { md: 'divider' },
                overflowY: 'auto',
              }}
            >
              <PostDetails
                caption={caption}
                setCaption={setCaption}
                location={location}
                setLocation={setLocation}
                settings={settings}
                setSettings={setSettings}
              />
            </Box>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default CreatePostModal