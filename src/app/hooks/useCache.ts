import { useState, useEffect, useCallback } from 'react';

// Types for cache configuration
interface CacheConfig {
  key: string;
  ttl?: number; // Time to live in milliseconds
  enabled?: boolean;
}

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

// Generic cache hook
export const useCache = <T>(config: CacheConfig) => {
  const { key, ttl = 5 * 60 * 1000, enabled = true } = config; // Default 5 minutes TTL
  
  const [cachedData, setCachedData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get data from cache
  const getFromCache = useCallback((): T | null => {
    if (!enabled) return null;
    
    try {
      const cached = localStorage.getItem(`cache_${key}`);
      if (!cached) return null;
      
      const entry: CacheEntry<T> = JSON.parse(cached);
      const now = Date.now();
      
      // Check if cache is still valid
      if (now - entry.timestamp > entry.ttl) {
        localStorage.removeItem(`cache_${key}`);
        return null;
      }
      
      return entry.data;
    } catch (error) {
      console.warn(`Cache read error for key ${key}:`, error);
      return null;
    }
  }, [key, enabled]);

  // Set data in cache
  const setInCache = useCallback((data: T): void => {
    if (!enabled) return;
    
    try {
      const entry: CacheEntry<T> = {
        data,
        timestamp: Date.now(),
        ttl
      };
      localStorage.setItem(`cache_${key}`, JSON.stringify(entry));
      setCachedData(data);
    } catch (error) {
      console.warn(`Cache write error for key ${key}:`, error);
    }
  }, [key, ttl, enabled]);

  // Clear cache for this key
  const clearCache = useCallback((): void => {
    localStorage.removeItem(`cache_${key}`);
    setCachedData(null);
  }, [key]);

  // Load cached data on mount
  useEffect(() => {
    const cached = getFromCache();
    if (cached) {
      setCachedData(cached);
    }
  }, [getFromCache]);

  return {
    cachedData,
    isLoading,
    error,
    setInCache,
    clearCache,
    getFromCache
  };
};

// Persistent state hook for user preferences
export const usePersistentState = <T>(
  key: string,
  defaultValue: T
): [T, (value: T) => void] => {
  const [state, setState] = useState<T>(() => {
    try {
      const saved = localStorage.getItem(`state_${key}`);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.warn(`Error loading persistent state for ${key}:`, error);
    }
    return defaultValue;
  });

  const setPersistentState = useCallback((value: T) => {
    try {
      localStorage.setItem(`state_${key}`, JSON.stringify(value));
      setState(value);
    } catch (error) {
      console.warn(`Error saving persistent state for ${key}:`, error);
    }
  }, [key]);

  return [state, setPersistentState];
};

// Cache management utilities
export const cacheManager = {
  // Clear all cached data
  clearAll: () => {
    const keys = Object.keys(localStorage).filter(key => key.startsWith('cache_'));
    keys.forEach(key => localStorage.removeItem(key));
  },

  // Clear expired entries
  clearExpired: () => {
    const keys = Object.keys(localStorage).filter(key => key.startsWith('cache_'));
    const now = Date.now();
    
    keys.forEach(key => {
      try {
        const cached = localStorage.getItem(key);
        if (cached) {
          const entry = JSON.parse(cached);
          if (now - entry.timestamp > entry.ttl) {
            localStorage.removeItem(key);
          }
        }
      } catch (error) {
        // Remove corrupted entries
        localStorage.removeItem(key);
      }
    });
  },

  // Get cache info
  getInfo: () => {
    const keys = Object.keys(localStorage).filter(key => key.startsWith('cache_'));
    return {
      totalEntries: keys.length,
      keys: keys.map(key => key.replace('cache_', '')),
      totalSize: JSON.stringify(localStorage).length
    };
  }
};

// Auto cleanup on app load
if (typeof window !== 'undefined') {
  // Clear expired cache entries on app start
  cacheManager.clearExpired();
}