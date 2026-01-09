import React from 'react';
import { 
  Box, 
  CssBaseline, 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Stack,
  IconButton
} from '@mui/material';
import { 
  Sports as SportsIcon,
  SportsBasketball as LiveIcon,
  History as RecentIcon,
  Schedule as ScheduleIcon,
  Home as HomeIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: 'Dashboard', path: '/', icon: <HomeIcon /> },
    { label: 'Live Games', path: '/live', icon: <LiveIcon /> },
    { label: 'Recent', path: '/recent', icon: <RecentIcon /> },
    { label: 'Schedule', path: '/schedule', icon: <ScheduleIcon /> }
  ];

  return (
    <>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* Header */}
        <AppBar position="static" sx={{ backgroundColor: 'primary.main' }}>
          <Toolbar>
            <IconButton
              color="inherit"
              onClick={() => navigate('/')}
              sx={{ mr: 1 }}
            >
              <SportsIcon />
            </IconButton>
            <Typography 
              variant="h6" 
              component="div" 
              sx={{ flexGrow: 1, cursor: 'pointer' }}
              onClick={() => navigate('/')}
            >
              Sports Monitoring MVP
            </Typography>
            
            {/* Navigation Buttons */}
            <Stack direction="row" spacing={1}>
              {navItems.map((item) => (
                <Button
                  key={item.path}
                  color="inherit"
                  startIcon={item.icon}
                  onClick={() => navigate(item.path)}
                  variant={location.pathname === item.path ? 'outlined' : 'text'}
                  sx={{
                    color: 'white',
                    borderColor: location.pathname === item.path ? 'white' : 'transparent',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)'
                    }
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Stack>
          </Toolbar>
        </AppBar>
        
        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flex: 1,
            backgroundColor: 'background.default',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {children}
        </Box>
      </Box>
    </>
  );
};