import React, { Component, ReactNode } from 'react';
import { Box, Typography, Button, Alert } from '@mui/material';
import { ErrorOutline as ErrorIcon } from '@mui/icons-material';
import { AppError } from '@core-utils/error.utils';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error Boundary caught an error:', error, errorInfo);
    
    // You could send this to a logging service
    if (error instanceof AppError) {
      console.error('App Error:', error.toJSON());
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const isAppError = this.state.error instanceof AppError;
      const errorMessage = isAppError 
        ? this.state.error.message 
        : 'An unexpected error occurred';
      
      const errorDetails = isAppError 
        ? `Error Code: ${(this.state.error as AppError).code}`
        : 'Please try refreshing the page';

      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '400px',
            p: 3,
            textAlign: 'center',
          }}
        >
          <ErrorIcon sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
          
          <Typography variant="h5" color="error" gutterBottom>
            Something went wrong
          </Typography>
          
          <Alert severity="error" sx={{ mb: 3, maxWidth: 500 }}>
            <Typography variant="body1" gutterBottom>
              {errorMessage}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {errorDetails}
            </Typography>
          </Alert>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              onClick={this.handleReset}
              color="primary"
            >
              Try Again
            </Button>
            
            <Button
              variant="outlined"
              onClick={() => window.location.reload()}
              color="primary"
            >
              Reload Page
            </Button>
          </Box>
        </Box>
      );
    }

    return this.props.children;
  }
}