import { Link, useLocation } from 'react-router-dom'
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Button,
} from '@mui/material'
import {
  Home,
  HomeOutlined,
  Search,
  Explore,
  ExploreOutlined,
  OndemandVideo,
  OndemandVideoOutlined,
  Send,
  SendOutlined,
  FavoriteBorder,
  Favorite,
  AddBoxOutlined,
  Menu as MenuIcon,
  Person,
  PersonOutline,
} from '@mui/icons-material'
import useAuthStore from '@/store/authStore'
import { generateAvatarUrl } from '@/utils/helpers'

const Sidebar = () => {
  const location = useLocation()
  const { user } = useAuthStore()

  const menuItems = [
    {
      text: 'Home',
      icon: <HomeOutlined />,
      activeIcon: <Home />,
      path: '/',
    },
    {
      text: 'Search',
      icon: <Search />,
      activeIcon: <Search />,
      path: '/search',
    },
    {
      text: 'Explore',
      icon: <ExploreOutlined />,
      activeIcon: <Explore />,
      path: '/explore',
    },
    {
      text: 'Reels',
      icon: <OndemandVideoOutlined />,
      activeIcon: <OndemandVideo />,
      path: '/reels',
    },
    {
      text: 'Messages',
      icon: <SendOutlined />,
      activeIcon: <Send />,
      path: '/messages',
    },
    {
      text: 'Notifications',
      icon: <FavoriteBorder />,
      activeIcon: <Favorite />,
      path: '/notifications',
    },
    {
      text: 'Create',
      icon: <AddBoxOutlined />,
      activeIcon: <AddBoxOutlined />,
      path: '/create',
    },
  ]

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(path)
  }

  return (
    <Box
      sx={{
        width: 245,
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        borderRight: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
        display: { xs: 'none', md: 'flex' },
        flexDirection: 'column',
        pt: 2,
        pb: 3,
      }}
    >
      {/* Logo */}
      <Box sx={{ px: 3, mb: 4 }}>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <Box
            sx={{
              fontFamily: "'Lobster', cursive",
              fontSize: '1.75rem',
              background:
                'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Connecta
          </Box>
        </Link>
      </Box>

      {/* Navigation Menu */}
      <List sx={{ flex: 1, px: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              component={Link}
              to={item.path}
              sx={{
                borderRadius: 2,
                py: 1.5,
                '&:hover': {
                  bgcolor: 'action.hover',
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 40,
                  color: isActive(item.path) ? 'text.primary' : 'text.secondary',
                }}
              >
                {isActive(item.path) ? item.activeIcon : item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontWeight: isActive(item.path) ? 600 : 400,
                  fontSize: '1rem',
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}

        {/* Profile */}
        <ListItem disablePadding sx={{ mb: 0.5 }}>
          <ListItemButton
            component={Link}
            to={`/profile/${user?.id}`}
            sx={{
              borderRadius: 2,
              py: 1.5,
              '&:hover': {
                bgcolor: 'action.hover',
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <Avatar
                src={generateAvatarUrl(user?.username || 'default')}
                sx={{ width: 24, height: 24 }}
              />
            </ListItemIcon>
            <ListItemText
              primary="Profile"
              primaryTypographyProps={{
                fontWeight: isActive(`/profile/${user?.id}`) ? 600 : 400,
                fontSize: '1rem',
              }}
            />
          </ListItemButton>
        </ListItem>
      </List>

      {/* More Menu */}
      <Box sx={{ px: 1 }}>
        <Button
          fullWidth
          startIcon={<MenuIcon />}
          sx={{
            justifyContent: 'flex-start',
            textTransform: 'none',
            color: 'text.primary',
            fontSize: '1rem',
            py: 1.5,
            px: 2,
            borderRadius: 2,
          }}
        >
          More
        </Button>
      </Box>
    </Box>
  )
}

export default Sidebar