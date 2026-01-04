import { Box } from '@mui/material'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import Sidebar from './Sidebar'
import BottomNavigation from './BottomNavigation'
import FloatingCreateButton from '@/components/common/FloatingCreateButton'

const MainLayout = () => {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Sidebar - Desktop */}
      <Sidebar />

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ml: { xs: 0, md: '245px' },
          pt: { xs: 0, md: 0 },
          pb: { xs: 7, md: 0 },
          minHeight: '100vh',
        }}
      >
        {/* Header - Mobile */}
        <Box sx={{ display: { xs: 'block', md: 'none' } }}>
          <Header />
        </Box>

        {/* Page Content */}
        <Box sx={{ pt: { xs: 7, md: 2 } }}>
          <Outlet />
        </Box>
      </Box>

      {/* Bottom Navigation - Mobile */}
      <BottomNavigation />
      <FloatingCreateButton />
    </Box>
  )
}

export default MainLayout