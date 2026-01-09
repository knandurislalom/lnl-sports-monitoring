import { AppError } from '@core-utils/error.utils';

interface ErrorLogEntry {
  timestamp: string;
  error: {
    name: string;
    message: string;
    code: string;
    statusCode: number;
    details?: Record<string, unknown>;
    stack?: string;
  };
  context?: string;
  userAgent: string;
  url: string;
  userId?: string;
  sessionId: string;
}

interface ErrorReportingConfig {
  enabled: boolean;
  endpoint?: string;
  apiKey?: string;
  environment: string;
  maxRetries: number;
  batchSize: number;
  flushInterval: number; // milliseconds
}

class ErrorLoggingService {
  private config: ErrorReportingConfig;
  private errorQueue: ErrorLogEntry[] = [];
  private flushTimer?: NodeJS.Timeout;
  private sessionId: string;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.config = {
      enabled: process.env.NODE_ENV === 'production',
      endpoint: process.env.VITE_ERROR_LOGGING_ENDPOINT,
      apiKey: process.env.VITE_ERROR_LOGGING_API_KEY,
      environment: process.env.NODE_ENV || 'development',
      maxRetries: 3,
      batchSize: 10,
      flushInterval: 30000, // 30 seconds
    };

    // Auto-flush errors periodically
    if (this.config.enabled && this.config.endpoint) {
      this.startPeriodicFlush();
    }

    // Flush errors before page unload
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', this.flush.bind(this));
      window.addEventListener('unhandledrejection', this.handleUnhandledRejection.bind(this));
      window.addEventListener('error', this.handleWindowError.bind(this));
    }
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private startPeriodicFlush(): void {
    this.flushTimer = setInterval(() => {
      this.flush();
    }, this.config.flushInterval);
  }

  private handleUnhandledRejection(event: PromiseRejectionEvent): void {
    const error = new AppError(
      event.reason?.message || 'Unhandled promise rejection',
      'UNHANDLED_REJECTION',
      500,
      { reason: event.reason }
    );
    this.logError(error, 'UnhandledPromiseRejection');
  }

  private handleWindowError(event: ErrorEvent): void {
    const error = new AppError(
      event.message || 'Unhandled window error',
      'WINDOW_ERROR',
      500,
      {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      }
    );
    this.logError(error, 'WindowError');
  }

  public logError(error: AppError, context?: string, userId?: string): void {
    const errorEntry: ErrorLogEntry = {
      timestamp: new Date().toISOString(),
      error: {
        name: error.name,
        message: error.message,
        code: error.code,
        statusCode: error.statusCode,
        details: error.details,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      context,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
      url: typeof window !== 'undefined' ? window.location.href : 'unknown',
      userId,
      sessionId: this.sessionId,
    };

    // Always log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.group(`🚨 Error Logged: ${error.name}`);
      console.error('Message:', error.message);
      console.error('Code:', error.code);
      console.error('Context:', context);
      console.error('Details:', error.details);
      if (error.stack) {
        console.error('Stack:', error.stack);
      }
      console.groupEnd();
    }

    // Add to queue for remote logging
    this.errorQueue.push(errorEntry);

    // Flush immediately if queue is full or if it's a critical error
    if (this.errorQueue.length >= this.config.batchSize || error.statusCode >= 500) {
      this.flush();
    }\n  }\n\n  public async flush(): Promise<void> {\n    if (this.errorQueue.length === 0 || !this.config.enabled || !this.config.endpoint) {\n      return;\n    }\n\n    const errorsToSend = [...this.errorQueue];\n    this.errorQueue = [];\n\n    try {\n      await this.sendErrors(errorsToSend);\n    } catch (sendError) {\n      // If sending fails, put errors back in queue (up to batch size)\n      this.errorQueue.unshift(...errorsToSend.slice(0, this.config.batchSize));\n      \n      if (process.env.NODE_ENV === 'development') {\n        console.error('Failed to send error logs:', sendError);\n      }\n    }\n  }\n\n  private async sendErrors(errors: ErrorLogEntry[], attempt: number = 1): Promise<void> {\n    if (!this.config.endpoint) {\n      throw new Error('No error logging endpoint configured');\n    }\n\n    const response = await fetch(this.config.endpoint, {\n      method: 'POST',\n      headers: {\n        'Content-Type': 'application/json',\n        ...(this.config.apiKey && { 'Authorization': `Bearer ${this.config.apiKey}` }),\n      },\n      body: JSON.stringify({\n        errors,\n        environment: this.config.environment,\n        timestamp: new Date().toISOString(),\n      }),\n    });\n\n    if (!response.ok) {\n      if (attempt < this.config.maxRetries) {\n        // Exponential backoff\n        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));\n        return this.sendErrors(errors, attempt + 1);\n      }\n      throw new Error(`Failed to send errors: ${response.status} ${response.statusText}`);\n    }\n  }\n\n  public getSessionId(): string {\n    return this.sessionId;\n  }\n\n  public configure(newConfig: Partial<ErrorReportingConfig>): void {\n    this.config = { ...this.config, ...newConfig };\n    \n    // Restart periodic flush if configuration changed\n    if (this.flushTimer) {\n      clearInterval(this.flushTimer);\n    }\n    \n    if (this.config.enabled && this.config.endpoint) {\n      this.startPeriodicFlush();\n    }\n  }\n\n  public destroy(): void {\n    if (this.flushTimer) {\n      clearInterval(this.flushTimer);\n    }\n    \n    // Final flush\n    this.flush();\n    \n    // Remove event listeners\n    if (typeof window !== 'undefined') {\n      window.removeEventListener('beforeunload', this.flush.bind(this));\n      window.removeEventListener('unhandledrejection', this.handleUnhandledRejection.bind(this));\n      window.removeEventListener('error', this.handleWindowError.bind(this));\n    }\n  }\n}\n\n// Singleton instance\nexport const errorLoggingService = new ErrorLoggingService();\n\n// Convenience functions\nexport const logError = (error: AppError, context?: string, userId?: string): void => {\n  errorLoggingService.logError(error, context, userId);\n};\n\nexport const flushErrorLogs = (): Promise<void> => {\n  return errorLoggingService.flush();\n};\n\nexport const configureErrorLogging = (config: Partial<ErrorReportingConfig>): void => {\n  errorLoggingService.configure(config);\n};\n\n// React hook for error logging\nexport const useErrorLogging = () => {\n  const logErrorWithContext = (error: AppError, context?: string) => {\n    errorLoggingService.logError(error, context);\n  };\n\n  return {\n    logError: logErrorWithContext,\n    flush: errorLoggingService.flush.bind(errorLoggingService),\n    sessionId: errorLoggingService.getSessionId(),\n  };\n};