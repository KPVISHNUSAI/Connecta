import { Link, useLocation } from 'react-router-dom'
import { BottomNavigation as MuiBottomNavigation, BottomNavigationAction, Paper, Avatar } from '@mui/material'
import {
  Home,
  HomeOutlined,
  Search,
  AddBoxOutlined,
  FavoriteBorder,
  PersonOutline,
} from '@mui/icons-material'
import useAuthStore from '@/store/authStore'
import { generateAvatarUrl } from '@/utils/helpers'

const BottomNavigation = () => {
  const location = useLocation()
  const { user } = useAuthStore()

  const getActiveIndex = () => {
    const path = location.pathname
    if (path === '/') return 0
    if (path.startsWith('/search')) return 1
    if (path.startsWith('/create')) return 2
    if (path.startsWith('/notifications')) return 3
    if (path.startsWith('/profile')) return 4
    return 0
  }

  return (
    <Paper
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        display: { xs: 'block', md: 'none' },
        zIndex: 1000,
        borderTop: '1px solid',
        borderColor: 'divider',
      }}
      elevation={3}
    >
      <MuiBottomNavigation value={getActiveIndex()} showLabels={false}>
        <BottomNavigationAction
          component={Link}
          to="/"
          icon={location.pathname === '/' ? <Home /> : <HomeOutlined />}
        />
        <BottomNavigationAction
          component={Link}
          to="/search"
          icon={<Search />}
        />
        <BottomNavigationAction
          component={Link}
          to="/create"
          icon={<AddBoxOutlined />}
        />
        <BottomNavigationAction
          component={Link}
          to="/notifications"
          icon={<FavoriteBorder />}
        />
        <BottomNavigationAction
          component={Link}
          to={`/profile/${user?.id}`}
          icon={
            <Avatar
              src={generateAvatarUrl(user?.username || 'default')}
              sx={{ width: 28, height: 28 }}
            />
          }
        />
      </MuiBottomNavigation>
    </Paper>
  )
}

export default BottomNavigation