import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Badge,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
  InputBase,
  styled,
} from '@mui/material'
import {
  Home,
  Search,
  Explore,
  FavoriteBorder,
  AddBoxOutlined,
  Person,
  Settings,
  Bookmark,
  Logout,
} from '@mui/icons-material'
import useAuthStore from '@/store/authStore'
import { generateAvatarUrl } from '@/utils/helpers'

const SearchContainer = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: '#efefef',
  marginLeft: theme.spacing(2),
  width: '268px',
  [theme.breakpoints.down('md')]: {
    display: 'none',
  },
}))

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}))

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    width: '100%',
  },
}))

const Header = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const [anchorEl, setAnchorEl] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
    handleMenuClose()
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <AppBar
      position="fixed"
      sx={{
        bgcolor: 'background.paper',
        color: 'text.primary',
        boxShadow: '0 1px 0 rgba(0,0,0,.1)',
      }}
    >
      <Toolbar
        sx={{
          justifyContent: 'space-between',
          maxWidth: '975px',
          width: '100%',
          mx: 'auto',
          px: { xs: 2, sm: 3 },
        }}
      >
        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none' }}>
          <Box
            sx={{
              fontFamily: "'Lobster', cursive",
              fontSize: { xs: '1.5rem', sm: '1.75rem' },
              background:
                'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              cursor: 'pointer',
            }}
          >
            Connecta
          </Box>
        </Link>

        {/* Search Bar - Desktop */}
        <SearchContainer>
          <form onSubmit={handleSearch}>
            <SearchIconWrapper>
              <Search sx={{ color: '#8e8e8e' }} />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </SearchContainer>

        {/* Navigation Icons */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
          {/* Home */}
          <IconButton
            component={Link}
            to="/"
            sx={{ display: { xs: 'none', sm: 'flex' } }}
          >
            <Home />
          </IconButton>

          {/* Explore */}
          <IconButton
            component={Link}
            to="/explore"
            sx={{ display: { xs: 'none', sm: 'flex' } }}
          >
            <Explore />
          </IconButton>

          {/* Create Post */}
          <IconButton component={Link} to="/create">
            <AddBoxOutlined />
          </IconButton>

          {/* Notifications */}
          <IconButton component={Link} to="/notifications">
            <Badge badgeContent={3} color="error">
              <FavoriteBorder />
            </Badge>
          </IconButton>

          {/* Profile Menu */}
          <IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
            <Avatar
              src={generateAvatarUrl(user?.username || 'default')}
              sx={{ width: 28, height: 28 }}
            />
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            onClick={handleMenuClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            PaperProps={{
              elevation: 3,
              sx: {
                mt: 1.5,
                minWidth: 230,
                '& .MuiMenuItem-root': {
                  py: 1.5,
                },
              },
            }}
          >
            <MenuItem onClick={() => navigate(`/profile/${user?.id}`)}>
              <ListItemIcon>
                <Person fontSize="small" />
              </ListItemIcon>
              Profile
            </MenuItem>

            <MenuItem onClick={() => navigate('/saved')}>
              <ListItemIcon>
                <Bookmark fontSize="small" />
              </ListItemIcon>
              Saved
            </MenuItem>

            <MenuItem onClick={() => navigate('/settings')}>
              <ListItemIcon>
                <Settings fontSize="small" />
              </ListItemIcon>
              Settings
            </MenuItem>

            <Divider />

            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Header