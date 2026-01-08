import React from 'react';
import { Box, Container, CssBaseline, useTheme } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { ErrorBoundary } from '@shared/components/ErrorBoundary';

interface MainLayoutProps {
  children?: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const theme = useTheme();

  return (
    <>
      <CssBaseline />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          bgcolor: 'background.default',
        }}
      >
        <Header />
        
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            py: 2,
            backgroundColor: theme.palette.background.default,
          }}
        >
          <Container maxWidth="xl">
            <ErrorBoundary>
              {children || <Outlet />}
            </ErrorBoundary>
          </Container>
        </Box>
      </Box>
    </>
  );
};