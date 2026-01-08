import React, { useState } from 'react';
import { Box, Button, Typography, Stack } from '@mui/material';
import { ErrorBoundary, GameErrorBoundary, PageErrorBoundary } from '@shared-components/ErrorBoundary';
import { 
  AppError, 
  NetworkError, 
  DataError, 
  GameDataError, 
  ValidationError,
  getErrorMessage,
  formatErrorForDisplay,
  withRetry
} from '@core-utils/error.utils';

// Test components that throw different types of errors
const ErrorThrower: React.FC<{ errorType: string }> = ({ errorType }) => {
  const throwError = () => {
    switch (errorType) {
      case 'network':
        throw new NetworkError('Failed to fetch game data');
      case 'data':
        throw new DataError('Invalid game response format');
      case 'game':
        throw new GameDataError('Game not found', 'game-123');
      case 'validation':
        throw new ValidationError('Invalid team selection', 'teamId');
      case 'generic':
        throw new AppError('Generic application error', 'GENERIC_ERROR');
      case 'javascript':
        throw new Error('Standard JavaScript error');
      case 'string':
        throw 'String error';
      default:
        throw new Error('Unknown error type');
    }
  };

  // Simulate error on render
  if (errorType) {
    throwError();
  }

  return <Typography>No error</Typography>;
};

const AsyncErrorTester: React.FC = () => {
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const testRetryMechanism = async () => {
    setIsLoading(true);
    setResult(null);
    
    try {
      const result = await withRetry(async () => {
        // Simulate a service that fails twice then succeeds
        const shouldFail = Math.random() > 0.6;
        if (shouldFail) {
          throw new NetworkError('Service temporarily unavailable');
        }
        return 'Success! Service responded correctly.';
      }, 3, 500);
      
      setResult(result);
    } catch (error) {
      const appError = error as AppError;
      setResult(`Failed after retries: ${getErrorMessage(appError)}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
      <Typography variant="h6" gutterBottom>
        Retry Mechanism Test
      </Typography>
      <Button 
        variant="outlined" 
        onClick={testRetryMechanism}
        disabled={isLoading}
      >
        {isLoading ? 'Testing...' : 'Test Retry Logic'}
      </Button>
      {result && (
        <Typography variant="body2" sx={{ mt: 1 }}>
          {result}
        </Typography>
      )}
    </Box>
  );
};

const ErrorFormatTester: React.FC = () => {
  const errors = [
    new NetworkError('Connection failed'),
    new DataError('Invalid JSON response'),
    new GameDataError('Game data corrupted', 'game-456'),
    new ValidationError('Team name is required', 'teamName'),
    new AppError('Unknown error occurred', 'UNKNOWN_ERROR'),
  ];

  return (
    <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
      <Typography variant="h6" gutterBottom>
        Error Message Formatting Test
      </Typography>
      <Stack spacing={1}>
        {errors.map((error, index) => {
          const formatted = formatErrorForDisplay(error);
          return (
            <Box key={index} sx={{ p: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="subtitle2">{error.constructor.name}</Typography>
              <Typography variant="body2">Title: {formatted.title}</Typography>
              <Typography variant="body2">Message: {formatted.message}</Typography>
              <Typography variant="body2">Severity: {formatted.severity}</Typography>
            </Box>
          );
        })}
      </Stack>
    </Box>
  );
};

export const ErrorHandlingTestPage: React.FC = () => {
  const [errorType, setErrorType] = useState<string>('');
  const [boundaryType, setBoundaryType] = useState<'default' | 'game' | 'page'>('default');

  const resetTest = () => {
    setErrorType('');
  };

  const renderErrorBoundary = () => {
    const content = <ErrorThrower errorType={errorType} />;
    
    switch (boundaryType) {
      case 'game':
        return <GameErrorBoundary>{content}</GameErrorBoundary>;
      case 'page':
        return <PageErrorBoundary>{content}</PageErrorBoundary>;
      default:
        return (
          <ErrorBoundary context="TestComponent">
            {content}
          </ErrorBoundary>
        );
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: '800px', mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Error Handling System Test
      </Typography>
      
      <Typography variant="body1" paragraph>
        This page tests the error handling utilities, error boundaries, and message formatting.
      </Typography>

      {/* Error Boundary Test */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Error Boundary Test
        </Typography>
        
        <Stack direction="row" spacing={1} sx={{ mb: 2 }} flexWrap="wrap">
          <Button size="small" onClick={() => setBoundaryType('default')}>Default Boundary</Button>
          <Button size="small" onClick={() => setBoundaryType('game')}>Game Boundary</Button>
          <Button size="small" onClick={() => setBoundaryType('page')}>Page Boundary</Button>
        </Stack>
        
        <Stack direction="row" spacing={1} sx={{ mb: 2 }} flexWrap="wrap">
          <Button size="small" onClick={() => setErrorType('network')}>Network Error</Button>
          <Button size="small" onClick={() => setErrorType('data')}>Data Error</Button>
          <Button size="small" onClick={() => setErrorType('game')}>Game Error</Button>
          <Button size="small" onClick={() => setErrorType('validation')}>Validation Error</Button>
          <Button size="small" onClick={() => setErrorType('javascript')}>JS Error</Button>
          <Button size="small" onClick={resetTest}>Reset</Button>
        </Stack>
        
        <Box sx={{ minHeight: '150px', border: '2px dashed', borderColor: 'divider', borderRadius: 1, p: 2 }}>
          {renderErrorBoundary()}
        </Box>
      </Box>

      {/* Async Error Test */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Async Error Handling
        </Typography>
        <AsyncErrorTester />
      </Box>

      {/* Error Formatting Test */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Error Message Formatting
        </Typography>
        <ErrorFormatTester />
      </Box>

      <Typography variant="body2" color="text.secondary">
        Check the browser console for detailed error logs during testing.
      </Typography>
    </Box>
  );
};