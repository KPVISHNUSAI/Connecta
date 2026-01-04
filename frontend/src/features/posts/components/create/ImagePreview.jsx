import { Box, IconButton } from '@mui/material'
import { Close, ArrowBack } from '@mui/icons-material'

const ImagePreview = ({ image, onBack, onClose }) => {
  return (
    <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* Header */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 1,
          bgcolor: 'rgba(0,0,0,0.5)',
          zIndex: 1,
        }}
      >
        <IconButton onClick={onBack} sx={{ color: 'white' }}>
          <ArrowBack />
        </IconButton>
        <IconButton onClick={onClose} sx={{ color: 'white' }}>
          <Close />
        </IconButton>
      </Box>

      {/* Image */}
      <Box
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: '#000',
        }}
      >
        <img
          src={image}
          alt="Preview"
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
          }}
        />
      </Box>
    </Box>
  )
}

export default ImagePreview