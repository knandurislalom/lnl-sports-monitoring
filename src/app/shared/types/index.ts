// Re-export all types for easier importing
export * from './team.types';
export * from './game.types';
export * from './api.types';

// Common UI component prop types
export interface BaseComponentProps {
  className?: string;
  'data-testid'?: string;
}

export interface LoadingState {
  loading: boolean;
  error?: string | null;
}

export interface EmptyStateProps extends BaseComponentProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}