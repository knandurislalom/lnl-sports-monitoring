import React from 'react';
import { Box, CssBaseline } from '@mui/material';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <>
      <CssBaseline />
      <Box
        component="main"
        sx={{
          minHeight: '100vh',
          backgroundColor: 'background.default',
        }}
      >
        {children}
      </Box>
    </>
  );
};