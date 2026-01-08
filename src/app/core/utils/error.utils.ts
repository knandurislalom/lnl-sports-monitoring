export class AppError extends Error {
  constructor(
    message: string,
    public code: string = 'UNKNOWN_ERROR',
    public statusCode: number = 500,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string, field?: string) {
    super(message, 'VALIDATION_ERROR', 400, { field });
    this.name = 'ValidationError';
  }
}

export class NetworkError extends AppError {
  constructor(message: string = 'Network request failed') {
    super(message, 'NETWORK_ERROR', 0);
    this.name = 'NetworkError';
  }
}

export class DataError extends AppError {
  constructor(message: string = 'Data processing failed') {
    super(message, 'DATA_ERROR', 422);
    this.name = 'DataError';
  }
}

export class GameDataError extends AppError {
  constructor(message: string, gameId?: string) {
    super(message, 'GAME_DATA_ERROR', 422, { gameId });
    this.name = 'GameDataError';
  }
}

export class ServiceUnavailableError extends AppError {
  constructor(message: string = 'Service temporarily unavailable') {
    super(message, 'SERVICE_UNAVAILABLE', 503);
    this.name = 'ServiceUnavailableError';
  }
}

export const handleError = (error: unknown): AppError => {
  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof Error) {
    // Network/fetch errors
    if (error.message.includes('fetch') || error.message.includes('network') || error.message.includes('Failed to fetch')) {
      return new NetworkError(error.message);
    }
    
    // Timeout errors
    if (error.message.includes('timeout') || error.message.includes('aborted')) {
      return new ServiceUnavailableError('Request timeout - please try again');
    }
    
    // JSON parsing errors
    if (error.message.includes('JSON') || error.message.includes('parse')) {
      return new DataError('Invalid data format received');
    }
    
    return new AppError(error.message, 'GENERIC_ERROR');
  }

  if (typeof error === 'string') {
    return new AppError(error, 'STRING_ERROR');
  }

  return new AppError('An unknown error occurred', 'UNKNOWN_ERROR');
};

export const logError = (error: AppError, context?: string): void => {
  const errorInfo = {
    name: error.name,
    message: error.message,
    code: error.code,
    statusCode: error.statusCode,
    details: error.details,
    context,
    timestamp: new Date().toISOString(),
    stack: error.stack,
  };

  if (process.env.NODE_ENV === 'development') {
    console.error('Error logged:', errorInfo);
  } else {
    // In production, send to error logging service
    import('@core-services/errorLogging.service').then(({ errorLoggingService }) => {
      errorLoggingService.logError(error, context);
    }).catch(console.error);
  }
};

export const createErrorHandler = (context: string) => {
  return (error: unknown): AppError => {
    const appError = handleError(error);
    logError(appError, context);
    return appError;
  };
};

// User-friendly error messages for common error types
export const getErrorMessage = (error: AppError): string => {
  switch (error.code) {
    case 'NETWORK_ERROR':
      return 'Unable to connect. Please check your internet connection and try again.';
    case 'SERVICE_UNAVAILABLE':
      return 'Service is temporarily unavailable. Please try again in a moment.';
    case 'DATA_ERROR':
      return 'There was a problem loading the data. Please refresh the page.';
    case 'GAME_DATA_ERROR':
      return 'Unable to load game information. Please try again.';
    case 'VALIDATION_ERROR':
      return error.message; // Validation messages are usually user-friendly
    default:
      return 'Something went wrong. Please try again.';
  }
};

// Error retry utility
export const withRetry = async <T>(
  fn: () => Promise<T>,
  maxAttempts: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: unknown;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      // Don't retry validation errors or client errors
      const appError = handleError(error);
      if (appError.statusCode >= 400 && appError.statusCode < 500) {
        throw appError;
      }
      
      // Don't delay on the last attempt
      if (attempt < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, delay * attempt));
      }
    }
  }
  
  throw handleError(lastError);
};

// Error boundary helper for React components
export const createErrorBoundaryFallback = (componentName: string) => {
  return ({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) => {
    const appError = handleError(error);
    
    return {
      error: appError,
      message: getErrorMessage(appError),
      retry: resetErrorBoundary,
      context: componentName,
    };
  };
};

// Format error for display in UI components
export const formatErrorForDisplay = (error: AppError): { title: string; message: string; severity: 'error' | 'warning' | 'info' } => {
  switch (error.code) {
    case 'NETWORK_ERROR':
      return {
        title: 'Connection Problem',
        message: 'Please check your internet connection and try again.',
        severity: 'error',
      };
    case 'SERVICE_UNAVAILABLE':
      return {
        title: 'Service Unavailable',
        message: 'The service is temporarily down. We\'ll be back shortly.',
        severity: 'warning',
      };
    case 'DATA_ERROR':
    case 'GAME_DATA_ERROR':
      return {
        title: 'Data Error',
        message: 'There was a problem loading the information. Please refresh the page.',
        severity: 'error',
      };
    case 'VALIDATION_ERROR':
      return {
        title: 'Input Error',
        message: error.message,
        severity: 'warning',
      };
    default:
      return {
        title: 'Something Went Wrong',
        message: 'An unexpected error occurred. Please try again.',
        severity: 'error',
      };
  }
};

// Get help text for common errors
export const getErrorHelpText = (error: AppError): string | null => {
  switch (error.code) {
    case 'NETWORK_ERROR':
      return 'Try refreshing the page or checking your internet connection.';
    case 'SERVICE_UNAVAILABLE':
      return 'This is usually temporary. Please wait a moment and try again.';
    case 'DATA_ERROR':
      return 'Clear your browser cache or try refreshing the page.';
    case 'GAME_DATA_ERROR':
      return 'The game data might be updating. Please try again in a moment.';
    default:
      return null;
  }
};

// Check if error should trigger a retry
export const shouldAllowRetry = (error: AppError): boolean => {
  const nonRetryableCodes = ['VALIDATION_ERROR'];
  return !nonRetryableCodes.includes(error.code);
};

// Get retry delay based on error type
export const getRetryDelay = (error: AppError, attempt: number): number => {
  switch (error.code) {
    case 'NETWORK_ERROR':
      return Math.min(1000 * Math.pow(2, attempt), 10000); // Exponential backoff, max 10s
    case 'SERVICE_UNAVAILABLE':
      return Math.min(2000 * attempt, 15000); // Linear backoff, max 15s
    default:
      return 1000 * attempt; // Simple linear backoff
  }
};