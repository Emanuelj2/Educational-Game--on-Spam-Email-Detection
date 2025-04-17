import { AppBar, Toolbar, Typography, Button, Box, Avatar, Menu, MenuItem, IconButton, useMediaQuery, useTheme } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import SecurityIcon from '@mui/icons-material/Security';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import HomeIcon from '@mui/icons-material/Home';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MenuIcon from '@mui/icons-material/Menu';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isLoggedIn, user, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null);
  
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuAnchor(null);
  };
  
  const handleLogout = () => {
    logout();
    handleMenuClose();
    handleMobileMenuClose();
    navigate('/');
  };

  const mobileMenuItems = [
    { text: 'Home', icon: <HomeIcon />, to: '/' },
    { text: 'Leaderboard', icon: <EmojiEventsIcon />, to: '/leaderboard' },
    ...(isLoggedIn 
      ? [{ text: 'Play Game', to: '/game' }]
      : [
          { text: 'Login', to: '/login' },
          { text: 'Register', to: '/register' }
        ]
    ),
  ];

  return (
    <AppBar position="static" sx={{ backgroundColor: '#4CAF50' }}>
      <Toolbar>
        <SecurityIcon sx={{ mr: 2, fontSize: 40 }} />
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{
            flexGrow: 1,
            textDecoration: 'none',
            color: 'inherit',
            fontWeight: 'bold',
            fontSize: '1.5rem',
          }}
        >
          Spam Detective
        </Typography>

        {isMobile ? (
          <>
            <IconButton
              color="inherit"
              onClick={handleMobileMenuOpen}
              sx={{ ml: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={mobileMenuAnchor}
              open={Boolean(mobileMenuAnchor)}
              onClose={handleMobileMenuClose}
              PaperProps={{
                sx: { width: 200 }
              }}
            >
              {mobileMenuItems.map((item) => (
                <MenuItem
                  key={item.text}
                  onClick={() => {
                    navigate(item.to);
                    handleMobileMenuClose();
                  }}
                  sx={{ gap: 1 }}
                >
                  {item.icon}
                  {item.text}
                </MenuItem>
              ))}
              {isLoggedIn && (
                <MenuItem onClick={handleLogout} sx={{ gap: 1 }}>
                  <LogoutIcon />
                  Logout
                </MenuItem>
              )}
            </Menu>
          </>
        ) : (
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Button
              color="inherit"
              component={RouterLink}
              to="/"
              startIcon={<HomeIcon />}
            >
              Home
            </Button>
            <Button
              color="inherit"
              component={RouterLink}
              to="/leaderboard"
              startIcon={<EmojiEventsIcon />}
            >
              Leaderboard
            </Button>
            
            {isLoggedIn ? (
              <>
                <Button
                  color="inherit"
                  component={RouterLink}
                  to="/game"
                  variant="outlined"
                  sx={{
                    borderColor: 'white',
                    '&:hover': {
                      borderColor: 'white',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    },
                  }}
                >
                  Play Game
                </Button>
                
                <IconButton 
                  onClick={handleMenuOpen}
                  sx={{ color: 'white' }}
                >
                  <Avatar 
                    sx={{ width: 32, height: 32, bgcolor: 'white', color: '#4CAF50' }}
                  >
                    {user?.email?.charAt(0).toUpperCase() || 'U'}
                  </Avatar>
                </IconButton>
                
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                >
                  <MenuItem disabled>
                    {user?.email}
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
                    Logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Button
                  color="inherit"
                  component={RouterLink}
                  to="/login"
                  variant="outlined"
                  sx={{
                    borderColor: 'white',
                    '&:hover': {
                      borderColor: 'white',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    },
                  }}
                >
                  Login
                </Button>
                <Button
                  color="inherit"
                  component={RouterLink}
                  to="/register"
                  variant="outlined"
                  sx={{
                    borderColor: 'white',
                    '&:hover': {
                      borderColor: 'white',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    },
                  }}
                >
                  Register
                </Button>
              </>
            )}
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 