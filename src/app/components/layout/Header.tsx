import React from 'react';
import {
  Box,
  Typography,
  IconButton,
  Avatar,
  Badge,
  useTheme,
  useMediaQuery,
  Tooltip,
  Menu,
  MenuItem,
  Divider,
} from '@mui/material';
import {
  SportsSoccer as SportsIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  LiveTv as LiveIcon,
} from '@mui/icons-material';
import { useLayout } from './MainLayout';
import { getUserPreferences, setThemeMode, getThemeMode } from '../core/utils/storage.utils';

// ===== TYPES =====

export interface HeaderProps {
  title?: string;
  subtitle?: string;
  showLiveIndicator?: boolean;
  liveGameCount?: number;
  onRefresh?: () => void;
  onSearch?: () => void;
  onSettings?: () => void;
  refreshing?: boolean;
}

// ===== HEADER COMPONENT =====

export const Header: React.FC<HeaderProps> = ({
  title = 'Sports Monitoring',
  subtitle,
  showLiveIndicator = true,
  liveGameCount = 0,
  onRefresh,
  onSearch,
  onSettings,
  refreshing = false,
}) => {
  const theme = useTheme();
  const { isMobile, compactMode } = useLayout();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [notificationAnchor, setNotificationAnchor] = React.useState<null | HTMLElement>(null);
  
  const preferences = getUserPreferences();
  const currentTheme = getThemeMode();

  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationClick = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setNotificationAnchor(null);
  };

  const handleThemeToggle = () => {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setThemeMode(newTheme);
    // In a real app, this would trigger a theme change
    handleClose();
  };

  const formatLiveCount = (count: number): string => {
    if (count === 0) return 'No live games';
    if (count === 1) return '1 live game';
    return `${count} live games`;
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        minHeight: compactMode ? 40 : 48,
      }}
    >
      {/* Logo and Title Section */}
      <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
        <SportsIcon
          sx={{
            fontSize: compactMode ? 24 : 28,
            color: 'primary.main',
            mr: 1,
          }}
        />
        
        <Box>
          <Typography
            variant={compactMode ? 'h6' : 'h5'}
            component="h1"
            sx={{
              fontWeight: 600,
              color: 'text.primary',
              lineHeight: 1.2,
              fontSize: {
                xs: compactMode ? '1rem' : '1.25rem',
                sm: compactMode ? '1.1rem' : '1.5rem',
              },
            }}
          >
            {isMobile && title.length > 15 ? 'Sports Monitor' : title}
          </Typography>
          
          {subtitle && !compactMode && (
            <Typography
              variant="caption"
              sx={{
                color: 'text.secondary',
                display: { xs: 'none', sm: 'block' },
              }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>
      </Box>

      {/* Live Indicator */}
      {showLiveIndicator && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            mr: 2,
            px: 1.5,
            py: 0.5,
            bgcolor: liveGameCount > 0 ? 'error.main' : 'action.disabled',
            borderRadius: 1,
            minWidth: { xs: 'auto', sm: 120 },
          }}
        >
          <LiveIcon
            sx={{
              fontSize: 16,
              color: liveGameCount > 0 ? 'error.contrastText' : 'text.disabled',
              mr: 0.5,
            }}
          />
          <Typography
            variant="caption"
            sx={{
              color: liveGameCount > 0 ? 'error.contrastText' : 'text.disabled',
              fontWeight: 500,
              display: { xs: 'none', sm: 'inline' },
            }}
          >
            {formatLiveCount(liveGameCount)}
          </Typography>
          {isMobile && (
            <Typography
              variant="caption"
              sx={{
                color: liveGameCount > 0 ? 'error.contrastText' : 'text.disabled',
                fontWeight: 500,
              }}
            >
              {liveGameCount}
            </Typography>
          )}
        </Box>
      )}

      {/* Spacer */}
      <Box sx={{ flexGrow: 1 }} />

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {/* Search Button */}
        {onSearch && (
          <Tooltip title="Search">
            <IconButton
              color="inherit"
              onClick={onSearch}
              size={compactMode ? 'small' : 'medium'}
            >
              <SearchIcon />
            </IconButton>
          </Tooltip>
        )}

        {/* Refresh Button */}
        {onRefresh && (
          <Tooltip title={preferences.autoRefresh ? 'Auto-refresh enabled' : 'Refresh data'}>
            <IconButton
              color="inherit"
              onClick={onRefresh}
              disabled={refreshing}
              size={compactMode ? 'small' : 'medium'}
              sx={{
                animation: refreshing ? 'spin 1s linear infinite' : 'none',
                '@keyframes spin': {
                  '0%': { transform: 'rotate(0deg)' },
                  '100%': { transform: 'rotate(360deg)' },
                },
              }}
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        )}

        {/* Notifications */}
        <Tooltip title="Notifications">
          <IconButton
            color="inherit"
            onClick={handleNotificationClick}
            size={compactMode ? 'small' : 'medium'}
          >
            <Badge badgeContent={2} color="error" variant="dot">
              <NotificationsIcon />
            </Badge>
          </IconButton>
        </Tooltip>

        {/* Settings */}
        {onSettings && (
          <Tooltip title="Settings">
            <IconButton
              color="inherit"
              onClick={onSettings}
              size={compactMode ? 'small' : 'medium'}
              sx={{ display: { xs: 'none', md: 'inline-flex' } }}
            >
              <SettingsIcon />
            </IconButton>
          </Tooltip>
        )}

        {/* User Profile */}
        <Tooltip title="Profile">
          <IconButton
            onClick={handleProfileClick}
            size={compactMode ? 'small' : 'medium'}
            sx={{ ml: 1 }}
          >
            <Avatar
              sx={{
                width: compactMode ? 28 : 32,
                height: compactMode ? 28 : 32,
                bgcolor: 'primary.main',
                fontSize: compactMode ? '0.875rem' : '1rem',
              }}
            >
              <PersonIcon fontSize="inherit" />
            </Avatar>
          </IconButton>
        </Tooltip>
      </Box>

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 3,
          sx: {
            mt: 1.5,
            minWidth: 200,
            '& .MuiMenuItem-root': {
              px: 2,
              py: 1,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem>
          <PersonIcon sx={{ mr: 2 }} />
          Profile
        </MenuItem>
        
        {isMobile && onSettings && (
          <MenuItem onClick={onSettings}>
            <SettingsIcon sx={{ mr: 2 }} />
            Settings
          </MenuItem>
        )}
        
        <MenuItem onClick={handleThemeToggle}>
          {currentTheme === 'light' ? (
            <>
              <DarkModeIcon sx={{ mr: 2 }} />
              Dark Mode
            </>
          ) : (
            <>
              <LightModeIcon sx={{ mr: 2 }} />
              Light Mode
            </>
          )}
        </MenuItem>
        
        <Divider />
        
        <MenuItem>
          <LogoutIcon sx={{ mr: 2 }} />
          Sign Out
        </MenuItem>
      </Menu>

      {/* Notifications Menu */}
      <Menu
        anchorEl={notificationAnchor}
        open={Boolean(notificationAnchor)}
        onClose={handleClose}
        PaperProps={{
          elevation: 3,
          sx: {
            mt: 1.5,
            minWidth: 320,
            maxHeight: 400,
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 600 }}>
            Notifications
          </Typography>
        </Box>
        <Divider />
        
        <MenuItem sx={{ py: 1.5, whiteSpace: 'normal' }}>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              Game Alert
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Chiefs vs Bills starting in 15 minutes
            </Typography>
          </Box>
        </MenuItem>
        
        <MenuItem sx={{ py: 1.5, whiteSpace: 'normal' }}>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              Score Update
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Lakers 98 - Warriors 94 (Final)
            </Typography>
          </Box>
        </MenuItem>
        
        <Divider />
        
        <MenuItem sx={{ justifyContent: 'center', color: 'primary.main' }}>
          <Typography variant="caption">
            View All Notifications
          </Typography>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default Header;