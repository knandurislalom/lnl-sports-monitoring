import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Divider,
  Grid,
  Alert,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Timer as TimerIcon,
  Error as ErrorIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import {
  LoadingSpinner,
  LoadingBar,
  ContentSkeleton,
  LoadingOverlay,
  PageLoading,
  GameCardSkeleton,
  TeamListSkeleton,
  DashboardSkeleton,
  SmartLoading,
  useLoadingState,
  useSimulatedLoading,
} from './LoadingStates';

/**
 * Demo page for testing loading state components
 */
const LoadingStatesDemo: React.FC = () => {
  const [overlayLoading, setOverlayLoading] = useState(false);
  const [smartLoadingState, setSmartLoadingState] = useState<'loading' | 'error' | 'empty' | 'data'>('data');
  const [progressValue, setProgressValue] = useState(45);
  const { loading, error, startLoading, stopLoading, setLoadingError, reset } = useLoadingState();
  const simulatedLoading = useSimulatedLoading(3000);

  const handleOverlayTest = () => {
    setOverlayLoading(true);
    setTimeout(() => setOverlayLoading(false), 3000);
  };

  const handleLoadingStateTest = (action: 'start' | 'error' | 'stop') => {
    switch (action) {
      case 'start':
        startLoading();
        // Auto stop after 3 seconds
        setTimeout(() => stopLoading(), 3000);
        break;
      case 'error':
        setLoadingError('Failed to load data. Please try again.');
        break;
      case 'stop':
        reset();
        break;
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Loading States Demo
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Interactive demonstration of all loading state components and utilities.
      </Typography>

      <Grid container spacing={4}>
        {/* Basic Loading Components */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Basic Loading Components
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Loading Spinner
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
                  <LoadingSpinner size={24} />
                  <LoadingSpinner size={32} color="secondary" />
                  <LoadingSpinner size={40} color="success" />
                  <LoadingSpinner 
                    size={48} 
                    variant="determinate" 
                    value={progressValue} 
                    color="error"
                  />
                </Box>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Loading Bar
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <LoadingBar />
                </Box>
                <Box sx={{ mb: 2 }}>
                  <LoadingBar 
                    variant="determinate" 
                    value={progressValue} 
                    color="secondary"
                  />
                </Box>
                <Box sx={{ mb: 2 }}>
                  <LoadingBar 
                    variant="buffer" 
                    value={progressValue} 
                    valueBuffer={progressValue + 10}
                    color="success"
                  />
                </Box>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => setProgressValue(Math.random() * 100)}
                >
                  Update Progress ({Math.round(progressValue)}%)
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Content Skeletons */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Content Skeletons
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Text Skeletons
                </Typography>
                <ContentSkeleton variant="text" width="100%" height={20} sx={{ mb: 1 }} />
                <ContentSkeleton variant="text" width="75%" height={20} sx={{ mb: 1 }} />
                <ContentSkeleton variant="text" width="50%" height={20} />
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Shape Skeletons
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
                  <ContentSkeleton variant="circular" width={40} height={40} />
                  <ContentSkeleton variant="rectangular" width={100} height={40} />
                  <ContentSkeleton variant="rounded" width={80} height={40} />
                </Box>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Animation Types
                </Typography>
                <ContentSkeleton variant="text" animation="pulse" sx={{ mb: 1 }} />
                <ContentSkeleton variant="text" animation="wave" sx={{ mb: 1 }} />
                <ContentSkeleton variant="text" animation={false} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Loading Overlay */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Loading Overlay
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Test the loading overlay that can be applied over any content.
              </Typography>
              
              <LoadingOverlay
                loading={overlayLoading}
                message="Processing your request..."
                variant="spinner"
              >
                <Box
                  sx={{
                    p: 4,
                    textAlign: 'center',
                    bgcolor: 'grey.100',
                    borderRadius: 1,
                    minHeight: 200,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography variant="h6">
                    Content behind overlay
                  </Typography>
                </Box>
              </LoadingOverlay>
              
              <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                <Button
                  variant="contained"
                  onClick={handleOverlayTest}
                  disabled={overlayLoading}
                >
                  Test Overlay (3s)
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Page Loading */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Page Loading
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Full page loading component with progress.
              </Typography>
              
              <Box sx={{ border: 1, borderColor: 'grey.300', borderRadius: 1, minHeight: 300 }}>
                <PageLoading
                  message="Loading game data..."
                  progress={progressValue}
                  showProgress
                  icon={TimerIcon}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Smart Loading */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Smart Loading Component
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Intelligent component that handles loading, error, and empty states.
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>State</InputLabel>
                  <Select
                    value={smartLoadingState}
                    label="State"
                    onChange={(e) => setSmartLoadingState(e.target.value as any)}
                  >
                    <MenuItem value="loading">Loading</MenuItem>
                    <MenuItem value="error">Error</MenuItem>
                    <MenuItem value="empty">Empty</MenuItem>
                    <MenuItem value="data">Data</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              
              <Box sx={{ border: 1, borderColor: 'grey.300', borderRadius: 1, minHeight: 200 }}>
                <SmartLoading
                  loading={smartLoadingState === 'loading'}
                  error={smartLoadingState === 'error' ? 'Network connection failed' : null}
                  empty={smartLoadingState === 'empty'}
                  skeleton={<GameCardSkeleton />}
                  retryButton={
                    <Button 
                      variant="outlined" 
                      startIcon={<RefreshIcon />}
                      onClick={() => setSmartLoadingState('loading')}
                    >
                      Retry
                    </Button>
                  }
                >
                  <Box sx={{ p: 3, textAlign: 'center' }}>
                    <CheckCircleIcon color="success" sx={{ fontSize: 48, mb: 1 }} />
                    <Typography variant="h6">
                      Data loaded successfully!
                    </Typography>
                  </Box>
                </SmartLoading>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Skeleton Layouts */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Skeleton Layouts
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Pre-built skeleton components for common sports app layouts.
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" gutterBottom>
                    Game Card Skeleton
                  </Typography>
                  <GameCardSkeleton />
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" gutterBottom>
                    Team List Skeleton
                  </Typography>
                  <Card>
                    <TeamListSkeleton items={3} />
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" gutterBottom>
                    Dashboard Preview
                  </Typography>
                  <Box sx={{ 
                    border: 1, 
                    borderColor: 'grey.300', 
                    borderRadius: 1,
                    maxHeight: 300,
                    overflow: 'auto'
                  }}>
                    <DashboardSkeleton />
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Loading Hook Demo */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Loading Hooks Demo
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Test the useLoadingState hook for managing component loading states.
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Alert 
                  severity={loading ? 'info' : error ? 'error' : 'success'}
                  icon={loading ? <TimerIcon /> : error ? <ErrorIcon /> : <CheckCircleIcon />}
                >
                  Status: {loading ? 'Loading...' : error ? `Error: ${error}` : 'Ready'}
                </Alert>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  onClick={() => handleLoadingStateTest('start')}
                  disabled={loading}
                >
                  Start Loading
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => handleLoadingStateTest('error')}
                  disabled={loading}
                >
                  Simulate Error
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => handleLoadingStateTest('stop')}
                  disabled={loading && !error}
                >
                  Reset State
                </Button>
              </Box>
              
              <Divider sx={{ my: 3 }} />
              
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Simulated Loading (Auto-ends in 3s):
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  {simulatedLoading ? (
                    <>
                      <LoadingSpinner size={20} />
                      <Typography variant="body2">
                        Simulated loading active...
                      </Typography>
                    </>
                  ) : (
                    <>
                      <CheckCircleIcon color="success" />
                      <Typography variant="body2">
                        Simulated loading complete!
                      </Typography>
                    </>
                  )}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default LoadingStatesDemo;