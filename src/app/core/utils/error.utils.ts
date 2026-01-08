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

export const handleError = (error: unknown): AppError => {
  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof Error) {
    // Network/fetch errors
    if (error.message.includes('fetch') || error.message.includes('network')) {
      return new NetworkError(error.message);
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
    // In production, you might send to error tracking service like Sentry
    console.error('Error:', error.message);
  }
};

export const createErrorHandler = (context: string) => {
  return (error: unknown): AppError => {
    const appError = handleError(error);
    logError(appError, context);
    return appError;
  };
};