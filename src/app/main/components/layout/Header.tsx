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
  Tabs,
  Tab,
  Badge,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Sports as SportsIcon,
  Refresh as RefreshIcon,
  Settings as SettingsIcon,
  Favorite as FavoriteIcon,
  LiveTv as LiveIcon,
  History as HistoryIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

export const Header: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
  
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
      case '/live':
        return 'Live Games';
      case '/recent':
      case '/results':
        return 'Recent Games';
      case '/schedule':
        return 'Upcoming Schedule';
      case '/favorites':
        return 'Favorite Teams';
      case '/settings':
        return 'Settings';
      case '/about':
        return 'About';
      default:
        return 'Sports Monitor';
    }
  };

  const getCurrentTab = () => {
    const path = location.pathname;
    if (path === '/' || path === '/live') return 0;
    if (path === '/recent' || path === '/results') return 1;
    if (path === '/schedule') return 2;
    return 0;
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    switch (newValue) {
      case 0:
        navigate('/live');
        break;
      case 1:
        navigate('/recent');
        break;
      case 2:
        navigate('/schedule');
        break;
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
              cursor: 'pointer',
            }}
            onClick={() => navigate('/live')}
          >
            {isMobile ? 'NFL' : 'NFL Monitor'}
          </Typography>
          
          {/* Page Title for mobile */}
          {isMobile && (
            <Typography
              variant="subtitle2"
              sx={{
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '0.75rem',
              }}
            >
              {getPageTitle()}
            </Typography>
          )}
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
            <Badge badgeContent={3} color="error">
              <FavoriteIcon />
            </Badge>
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

      {/* Navigation Tabs */}
      {!isMobile && (
        <Box sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <Tabs
            value={getCurrentTab()}
            onChange={handleTabChange}
            variant={isTablet ? 'fullWidth' : 'standard'}
            sx={{
              '& .MuiTab-root': {
                color: 'rgba(255, 255, 255, 0.8)',
                minHeight: 48,
                '&.Mui-selected': {
                  color: 'white',
                },
              },
              '& .MuiTabs-indicator': {
                backgroundColor: 'white',
              },
            }}
          >
            <Tab
              icon={<LiveIcon />}
              label="Live Games"
              iconPosition="start"
            />
            <Tab
              icon={<HistoryIcon />}
              label="Recent Games"
              iconPosition="start"
            />
            <Tab
              icon={<ScheduleIcon />}
              label="Schedule"
              iconPosition="start"
            />
          </Tabs>
        </Box>
      )}
    </AppBar>
  );
};