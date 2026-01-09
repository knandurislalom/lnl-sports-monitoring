import { useState, useEffect, useRef } from 'react';

// Basic performance monitoring hook
export interface PerformanceMetrics {
  renderTime: number;
  lastRenderTime: number;
  isSlowRender: boolean;
}

export const usePerformanceMonitor = (componentName: string) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    renderTime: 0,
    lastRenderTime: 0,
    isSlowRender: false,
  });

  const mountTime = useRef<number>(0);

  useEffect(() => {
    mountTime.current = performance.now();
    return () => {
      // Cleanup
    };
  }, []);

  useEffect(() => {
    const renderEnd = performance.now();
    const renderTime = renderEnd - mountTime.current;
    const isSlowRender = renderTime > 16; // 60fps threshold
    
    setMetrics({
      renderTime,
      lastRenderTime: renderTime,
      isSlowRender,
    });
    
    if (process.env.NODE_ENV === 'development' && isSlowRender) {
      console.warn(`Slow render in ${componentName}: ${renderTime.toFixed(2)}ms`);
    }
  });

  return metrics;
};

// Basic memory monitoring
export interface MemoryStats {
  usedJSHeapSize: number;
  memoryUsagePercentage: number;
  isHighMemoryUsage: boolean;
}

export const useMemoryMonitor = () => {
  const [memoryStats, setMemoryStats] = useState<MemoryStats | null>(null);

  useEffect(() => {
    const checkMemory = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        const stats: MemoryStats = {
          usedJSHeapSize: memory.usedJSHeapSize || 0,
          memoryUsagePercentage: ((memory.usedJSHeapSize || 0) / (memory.jsHeapSizeLimit || 1000000000)) * 100,
          isHighMemoryUsage: ((memory.usedJSHeapSize || 0) / (memory.jsHeapSizeLimit || 1000000000)) > 0.8,
        };
        setMemoryStats(stats);
      }
    };

    const interval = setInterval(checkMemory, 5000);
    checkMemory();
    
    return () => clearInterval(interval);
  }, []);

  return memoryStats;
};