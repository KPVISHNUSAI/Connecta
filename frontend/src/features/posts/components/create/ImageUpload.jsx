import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Box, Typography, Button } from '@mui/material'
import { CloudUpload, Image as ImageIcon } from '@mui/icons-material'

const ImageUpload = ({ onImageSelect }) => {
  const onDrop = useCallback(
    (acceptedFiles) => {
      if (acceptedFiles && acceptedFiles.length > 0) {
        const file = acceptedFiles[0]
        const reader = new FileReader()
        reader.onload = () => {
          onImageSelect(reader.result)
        }
        reader.readAsDataURL(file)
      }
    },
    [onImageSelect]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
    },
    maxFiles: 1,
    multiple: false,
  })

  return (
    <Box
      {...getRootProps()}
      sx={{
        border: '2px dashed',
        borderColor: isDragActive ? 'primary.main' : 'divider',
        borderRadius: 2,
        p: 6,
        textAlign: 'center',
        cursor: 'pointer',
        bgcolor: isDragActive ? 'action.hover' : 'transparent',
        transition: 'all 0.3s',
        '&:hover': {
          borderColor: 'primary.main',
          bgcolor: 'action.hover',
        },
      }}
    >
      <input {...getInputProps()} />
      <ImageIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
      <Typography variant="h6" gutterBottom>
        {isDragActive ? 'Drop the image here' : 'Drag photos here'}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        or
      </Typography>
      <Button
        variant="contained"
        startIcon={<CloudUpload />}
        sx={{ textTransform: 'none' }}
      >
        Select from computer
      </Button>
      <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
        Supported formats: JPEG, PNG, GIF, WEBP
      </Typography>
    </Box>
  )
}

export default ImageUpload