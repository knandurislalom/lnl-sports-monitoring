import React from 'react';
import { CircularProgress, Box, Typography, useTheme, alpha } from '@mui/material';

interface LoadingSpinnerProps {
  size?: number;
  message?: string;
  fullscreen?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 40,
  message = 'Loading...',
  fullscreen = false,
}) => {
  const theme = useTheme();
  
  const containerStyles = fullscreen
    ? {
        position: 'fixed' as const,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: alpha(theme.palette.background.default, 0.8),
        zIndex: 9999,
      }
    : {
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
      };

  return (
    <Box sx={containerStyles}>
      <CircularProgress size={size} color="primary" />
      {message && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 2, textAlign: 'center' }}
        >
          {message}
        </Typography>
      )}
    </Box>
  );
};