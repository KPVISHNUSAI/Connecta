import { Fab } from '@mui/material'
import { Add } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'

const FloatingCreateButton = () => {
  const navigate = useNavigate()

  return (
    <Fab
      color="primary"
      aria-label="create"
      onClick={() => navigate('/create')}
      sx={{
        position: 'fixed',
        bottom: 80,
        right: 16,
        display: { xs: 'flex', md: 'none' },
        background: 'linear-gradient(45deg, #405DE6, #5B51D8, #833AB4, #C13584, #E1306C)',
      }}
    >
      <Add />
    </Fab>
  )
}

export default FloatingCreateButton