import React, { memo } from 'react';

// Simple wrapper component for performance monitoring
interface PerformanceMonitorWrapperProps {
  children: React.ReactNode;
  componentName: string;
}

export const PerformanceMonitorWrapper: React.FC<PerformanceMonitorWrapperProps> = memo(({ 
  children, 
  componentName 
}) => {
  // Just return children for now - we can enhance this later
  return <>{children}</>;
});

// Simple performance dashboard component
interface PerformanceDashboardProps {
  show: boolean;
  onToggle: (show: boolean) => void;
}

export const PerformanceDashboard: React.FC<PerformanceDashboardProps> = memo(({ show, onToggle }) => {
  if (!show) {
    return null;
  }
  
  return (
    <div style={{ 
      position: 'fixed', 
      top: 20, 
      right: 20, 
      background: 'rgba(0,0,0,0.8)', 
      color: 'white', 
      padding: '10px',
      borderRadius: '5px',
      fontSize: '12px',
      zIndex: 9999
    }}>
      Performance Monitor (Basic)
      <button onClick={() => onToggle(false)} style={{ marginLeft: '10px', fontSize: '10px' }}>
        Close
      </button>
    </div>
  );
});

PerformanceMonitorWrapper.displayName = 'PerformanceMonitorWrapper';
PerformanceDashboard.displayName = 'PerformanceDashboard';