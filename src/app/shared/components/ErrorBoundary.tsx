import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Typography, Button, Alert, Collapse } from '@mui/material';
import { ErrorOutline as ErrorIcon, Refresh as RefreshIcon, ExpandMore as ExpandIcon, ExpandLess as CollapseIcon } from '@mui/icons-material';
import { AppError, handleError, getErrorMessage, logError } from '@core-utils/error.utils';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: AppError, retry: () => void) => ReactNode;
  onError?: (error: AppError, errorInfo: ErrorInfo) => void;
  context?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: AppError;
  showDetails: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      showDetails: false,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    const appError = handleError(error);
    return {
      hasError: true,
      error: appError,
      showDetails: false,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const appError = handleError(error);
    const context = this.props.context || 'ErrorBoundary';
    
    // Log the error
    logError(appError, context);
    
    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(appError, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: undefined,
      showDetails: false,
    });
  };

  toggleDetails = () => {
    this.setState(prevState => ({
      showDetails: !prevState.showDetails,
    }));
  };

  render() {
    if (this.state.hasError && this.state.error) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.handleReset);
      }

      // Default error UI
      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '200px',
            padding: 3,
            textAlign: 'center',
            gap: 2,
          }}
        >
          <ErrorIcon sx={{ fontSize: 64, color: 'error.main', mb: 1 }} />
          
          <Alert severity="error" sx={{ width: '100%', maxWidth: '600px' }}>
            <Typography variant="h6" gutterBottom>
              Oops! Something went wrong
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              {getErrorMessage(this.state.error)}
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
              <Button
                variant="contained"
                startIcon={<RefreshIcon />}
                onClick={this.handleReset}
                size="small"
              >
                Try Again
              </Button>
              
              <Button
                variant="outlined"
                onClick={() => window.location.reload()}
                size="small"
              >
                Reload Page
              </Button>
              
              {process.env.NODE_ENV === 'development' && (
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={this.state.showDetails ? <CollapseIcon /> : <ExpandIcon />}
                  onClick={this.toggleDetails}
                >
                  {this.state.showDetails ? 'Hide Details' : 'Show Details'}
                </Button>
              )}
            </Box>
          </Alert>
          
          {process.env.NODE_ENV === 'development' && (
            <Collapse in={this.state.showDetails} sx={{ width: '100%', maxWidth: '600px' }}>
              <Alert severity="info" sx={{ textAlign: 'left' }}>
                <Typography variant="subtitle2" gutterBottom>
                  Error Details (Development Only)
                </Typography>
                <Typography variant="body2" component="pre" sx={{ fontSize: '0.75rem', overflow: 'auto' }}>
                  {JSON.stringify({
                    name: this.state.error.name,
                    message: this.state.error.message,
                    code: this.state.error.code,
                    statusCode: this.state.error.statusCode,
                    details: this.state.error.details,
                  }, null, 2)}
                </Typography>
                {this.state.error.stack && (
                  <>
                    <Typography variant="subtitle2" sx={{ mt: 1 }} gutterBottom>
                      Stack Trace:
                    </Typography>
                    <Typography variant="body2" component="pre" sx={{ fontSize: '0.65rem', overflow: 'auto' }}>
                      {this.state.error.stack}
                    </Typography>
                  </>
                )}
              </Alert>
            </Collapse>
          )}
        </Box>
      );
    }

    return this.props.children;
  }
}

// Higher-order component for easier usage
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  context?: string,
  fallback?: (error: AppError, retry: () => void) => ReactNode
) => {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary context={context || Component.name} fallback={fallback}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  return WrappedComponent;
};

// Specialized error boundaries for different contexts
export const GameErrorBoundary: React.FC<{ children: ReactNode }> = ({ children }) => (
  <ErrorBoundary 
    context="GameComponent"
    fallback={(error, retry) => (
      <Alert severity="error" sx={{ m: 2 }}>
        <Typography variant="body2">
          Unable to load game information. 
        </Typography>
        <Button size="small" onClick={retry} sx={{ mt: 1 }}>
          Retry
        </Button>
      </Alert>
    )}
  >
    {children}
  </ErrorBoundary>
);

export const PageErrorBoundary: React.FC<{ children: ReactNode }> = ({ children }) => (
  <ErrorBoundary 
    context="PageComponent"
    fallback={(error, retry) => (
      <Box sx={{ minHeight: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 3 }}>
        <Alert severity="error" sx={{ maxWidth: '600px' }}>
          <Typography variant="h6" gutterBottom>
            Page Error
          </Typography>
          <Typography variant="body2" paragraph>
            {getErrorMessage(error)}
          </Typography>
          <Button variant="contained" onClick={retry} startIcon={<RefreshIcon />}>
            Refresh Page
          </Button>
        </Alert>
      </Box>
    )}
  >
    {children}
  </ErrorBoundary>
);