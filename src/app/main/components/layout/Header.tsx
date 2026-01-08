import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Menu,
  MenuItem,
  Chip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Sports as SportsIcon,
  Refresh as RefreshIcon,
  Settings as SettingsIcon,
  Favorite as FavoriteIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

export const Header: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleRefresh = () => {
    setLastUpdate(new Date());
    // Trigger data refresh - will be implemented when we add data context
    window.location.reload();
  };

  const getPageTitle = () => {
    const path = location.pathname;
    switch (path) {
      case '/':
        return 'Live Games';
      case '/schedule':
        return 'Schedule';
      case '/results':
        return 'Results';
      case '/favorites':
        return 'Favorites';
      default:
        return 'Sports Monitor';
    }
  };

  const formatLastUpdate = () => {
    return lastUpdate.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <AppBar position="sticky" elevation={1}>
      <Toolbar>
        {/* Logo and Title */}
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <SportsIcon sx={{ mr: 1, color: 'white' }} />
          <Typography
            variant="h6"
            component="h1"
            sx={{
              fontWeight: 600,
              color: 'white',
              mr: 2,
            }}
          >
            {isMobile ? 'Sports' : 'Sports Monitor'}
          </Typography>
          
          {/* Page Title */}
          <Typography
            variant="subtitle1"
            sx={{
              color: 'rgba(255, 255, 255, 0.8)',
              display: { xs: 'none', sm: 'block' },
            }}
          >
            {getPageTitle()}
          </Typography>
        </Box>

        {/* Status Indicators */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {!isMobile && (
            <Chip
              label={`Updated: ${formatLastUpdate()}`}
              size="small"
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                '& .MuiChip-label': {
                  fontSize: '0.75rem',
                },
              }}
            />
          )}
          
          {/* Action Buttons */}
          <IconButton
            color="inherit"
            onClick={handleRefresh}
            title="Refresh Data"
            sx={{ color: 'white' }}
          >
            <RefreshIcon />
          </IconButton>

          <IconButton
            color="inherit"
            onClick={() => navigate('/favorites')}
            title="Favorite Teams"
            sx={{ color: 'white' }}
          >
            <FavoriteIcon />
          </IconButton>

          <IconButton
            color="inherit"
            onClick={handleMenuOpen}
            title="Settings"
            sx={{ color: 'white' }}
          >
            <SettingsIcon />
          </IconButton>

          {/* Settings Menu */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <MenuItem onClick={() => { handleMenuClose(); navigate('/settings'); }}>
              Settings
            </MenuItem>
            <MenuItem onClick={() => { handleMenuClose(); navigate('/about'); }}>
              About
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};