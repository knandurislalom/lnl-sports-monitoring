import React, { useState } from 'react';
import {
  CircularProgress,
  LinearProgress,
  Skeleton,
  Box,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Fade,
  Grow,
  Slide,
  useTheme,
} from '@mui/material';
import {
  Sports as SportsIcon,
  Schedule as ScheduleIcon,
  Timer as TimerIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useLayout } from './MainLayout';

// ===== TYPES =====

export interface LoadingSpinnerProps {
  size?: number | string;
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success' | 'inherit';
  thickness?: number;
  variant?: 'determinate' | 'indeterminate';
  value?: number;
  sx?: object;
}

export interface LoadingBarProps {
  variant?: 'determinate' | 'indeterminate' | 'buffer' | 'query';
  value?: number;
  valueBuffer?: number;
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success' | 'inherit';
  sx?: object;
}

export interface ContentSkeletonProps {
  variant?: 'text' | 'rectangular' | 'rounded' | 'circular';
  width?: number | string;
  height?: number | string;
  animation?: 'pulse' | 'wave' | false;
  sx?: object;
}

export interface LoadingOverlayProps {
  loading: boolean;
  children: React.ReactNode;
  message?: string;
  variant?: 'spinner' | 'linear' | 'dots';
  backdrop?: boolean;
  sx?: object;
}

export interface PageLoadingProps {
  message?: string;
  progress?: number;
  showProgress?: boolean;
  icon?: React.ElementType;
}

// ===== LOADING SPINNER COMPONENT =====

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 40,
  color = 'primary',
  thickness = 3.6,
  variant = 'indeterminate',
  value,
  sx = {},
}) => {
  return (
    <CircularProgress
      size={size}
      color={color}
      thickness={thickness}
      variant={variant}
      value={value}
      sx={{
        ...sx,
      }}
    />
  );
};

// ===== LOADING BAR COMPONENT =====

export const LoadingBar: React.FC<LoadingBarProps> = ({
  variant = 'indeterminate',
  value,
  valueBuffer,
  color = 'primary',
  sx = {},
}) => {
  return (
    <LinearProgress
      variant={variant}
      value={value}
      valueBuffer={valueBuffer}
      color={color}
      sx={{
        width: '100%',
        height: 4,
        borderRadius: 2,
        ...sx,
      }}
    />
  );
};

// ===== CONTENT SKELETON COMPONENT =====

export const ContentSkeleton: React.FC<ContentSkeletonProps> = ({
  variant = 'text',
  width = '100%',
  height,
  animation = 'pulse',
  sx = {},
}) => {
  return (
    <Skeleton
      variant={variant}
      width={width}
      height={height}
      animation={animation}
      sx={{
        ...sx,
      }}
    />
  );
};

// ===== LOADING OVERLAY COMPONENT =====

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  loading,
  children,
  message = 'Loading...',
  variant = 'spinner',
  backdrop = true,
  sx = {},
}) => {
  const theme = useTheme();

  const renderLoadingIndicator = () => {
    switch (variant) {
      case 'linear':
        return <LoadingBar />;
      case 'dots':
        return (
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            {[0, 1, 2].map((index) => (
              <Box
                key={index}
                sx={{
                  width: 8,
                  height: 8,
                  bgcolor: 'primary.main',
                  borderRadius: '50%',
                  animation: 'pulse 1.5s ease-in-out infinite',
                  animationDelay: `${index * 0.2}s`,
                  '@keyframes pulse': {
                    '0%, 80%, 100%': {
                      transform: 'scale(0.8)',
                      opacity: 0.5,
                    },
                    '40%': {
                      transform: 'scale(1)',
                      opacity: 1,
                    },
                  },
                }}
              />
            ))}
          </Box>
        );
      default:
        return <LoadingSpinner />;
    }
  };

  if (!loading) {
    return <>{children}</>;
  }

  return (
    <Box sx={{ position: 'relative', ...sx }}>
      {children}
      <Fade in={loading}>
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: backdrop ? 'rgba(255, 255, 255, 0.8)' : 'transparent',
            backdropFilter: backdrop ? 'blur(2px)' : 'none',
            zIndex: 1000,
          }}
        >
          {renderLoadingIndicator()}
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
      </Fade>
    </Box>
  );
};

// ===== PAGE LOADING COMPONENT =====

export const PageLoading: React.FC<PageLoadingProps> = ({
  message = 'Loading page...',
  progress,
  showProgress = false,
  icon: Icon = SportsIcon,
}) => {
  const theme = useTheme();
  const { compactMode } = useLayout();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '50vh',
        textAlign: 'center',
        p: 4,
      }}
    >
      <Grow in timeout={500}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
          }}
        >
          {/* Animated Icon */}
          <Box
            sx={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <LoadingSpinner 
              size={compactMode ? 60 : 80} 
              thickness={2} 
              sx={{ color: 'primary.main' }}
            />
            <Icon
              sx={{
                position: 'absolute',
                fontSize: compactMode ? 24 : 32,
                color: 'primary.main',
                animation: 'spin 3s linear infinite',
                '@keyframes spin': {
                  '0%': { transform: 'rotate(0deg)' },
                  '100%': { transform: 'rotate(360deg)' },
                },
              }}
            />
          </Box>

          {/* Loading Message */}
          <Typography
            variant={compactMode ? 'h6' : 'h5'}
            color="text.primary"
            sx={{ fontWeight: 500 }}
          >
            {message}
          </Typography>

          {/* Progress Bar */}
          {showProgress && (
            <Box sx={{ width: '100%', maxWidth: 300, mt: 1 }}>
              <LoadingBar
                variant={progress !== undefined ? 'determinate' : 'indeterminate'}
                value={progress}
                sx={{ mb: 1 }}
              />
              {progress !== undefined && (
                <Typography variant="caption" color="text.secondary">
                  {Math.round(progress)}% complete
                </Typography>
              )}
            </Box>
          )}
        </Box>
      </Grow>
    </Box>
  );
};

// ===== SKELETON LAYOUTS =====

/**
 * Game card skeleton
 */
export const GameCardSkeleton: React.FC = () => {
  const { compactMode } = useLayout();
  
  return (
    <Card>
      <CardContent sx={{ p: compactMode ? 2 : 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <ContentSkeleton variant="circular" width={32} height={32} />
          <Box sx={{ ml: 2, flexGrow: 1 }}>
            <ContentSkeleton variant="text" width="60%" height={20} />
            <ContentSkeleton variant="text" width="40%" height={16} />
          </Box>
          <ContentSkeleton variant="rectangular" width={60} height={32} />
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <ContentSkeleton variant="text" width="25%" height={24} />
          <ContentSkeleton variant="text" width="15%" height={24} />
          <ContentSkeleton variant="text" width="25%" height={24} />
        </Box>
        
        <ContentSkeleton variant="text" width="100%" height={16} />
      </CardContent>
    </Card>
  );
};

/**
 * Team list skeleton
 */
export const TeamListSkeleton: React.FC<{ items?: number }> = ({ items = 5 }) => {
  return (
    <List>
      {Array.from({ length: items }).map((_, index) => (
        <ListItem key={index}>
          <ListItemAvatar>
            <ContentSkeleton variant="circular" width={40} height={40} />
          </ListItemAvatar>
          <ListItemText
            primary={<ContentSkeleton variant="text" width="70%" height={20} />}
            secondary={<ContentSkeleton variant="text" width="50%" height={16} />}
          />
          <ContentSkeleton variant="rectangular" width={80} height={32} />
        </ListItem>
      ))}
    </List>
  );
};

/**
 * Dashboard skeleton
 */
export const DashboardSkeleton: React.FC = () => {
  const { compactMode } = useLayout();
  
  return (
    <Box sx={{ p: compactMode ? 2 : 3 }}>
      {/* Header skeleton */}
      <Box sx={{ mb: 4 }}>
        <ContentSkeleton variant="text" width="30%" height={32} sx={{ mb: 1 }} />
        <ContentSkeleton variant="text" width="60%" height={20} />
      </Box>
      
      {/* Stats cards skeleton */}
      <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} sx={{ minWidth: 200, flex: 1 }}>
            <CardContent>
              <ContentSkeleton variant="text" width="50%" height={20} sx={{ mb: 1 }} />
              <ContentSkeleton variant="text" width="80%" height={32} />
            </CardContent>
          </Card>
        ))}
      </Box>
      
      {/* Content grid skeleton */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 3 }}>
        {Array.from({ length: 6 }).map((_, index) => (
          <GameCardSkeleton key={index} />
        ))}
      </Box>
    </Box>
  );
};

// ===== LOADING STATES =====

/**
 * Smart loading component that shows different states
 */
export interface SmartLoadingProps {
  loading: boolean;
  error?: string | null;
  empty?: boolean;
  children: React.ReactNode;
  skeleton?: React.ReactNode;
  emptyMessage?: string;
  errorMessage?: string;
  retryButton?: React.ReactNode;
}

export const SmartLoading: React.FC<SmartLoadingProps> = ({
  loading,
  error,
  empty = false,
  children,
  skeleton,
  emptyMessage = 'No data available',
  errorMessage = 'Something went wrong',
  retryButton,
}) => {
  if (loading) {
    return skeleton ? <>{skeleton}</> : <PageLoading />;
  }

  if (error) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '30vh',
          textAlign: 'center',
          p: 4,
        }}
      >
        <Typography variant="h6" color="error.main" gutterBottom>
          {errorMessage}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {error}
        </Typography>
        {retryButton}
      </Box>
    );
  }

  if (empty) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '30vh',
          textAlign: 'center',
          p: 4,
        }}
      >
        <Typography variant="h6" color="text.secondary" gutterBottom>
          {emptyMessage}
        </Typography>
      </Box>
    );
  }

  return <>{children}</>;
};

// ===== LOADING HOOKS =====

/**
 * Hook for managing loading states
 */
export const useLoadingState = (initialLoading: boolean = false) => {
  const [loading, setLoading] = useState(initialLoading);
  const [error, setError] = useState<string | null>(null);

  const startLoading = () => {
    setLoading(true);
    setError(null);
  };

  const stopLoading = () => {
    setLoading(false);
  };

  const setLoadingError = (errorMessage: string) => {
    setLoading(false);
    setError(errorMessage);
  };

  const reset = () => {
    setLoading(false);
    setError(null);
  };

  return {
    loading,
    error,
    startLoading,
    stopLoading,
    setLoadingError,
    reset,
  };
};

/**
 * Hook for simulating loading delays (development only)
 */
export const useSimulatedLoading = (duration: number = 2000) => {
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  return loading;
};

export default LoadingSpinner;