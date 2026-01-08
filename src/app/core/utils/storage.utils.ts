// ===== TYPES =====

export interface StorageOptions {
  serialize?: boolean;
  ttl?: number; // Time to live in milliseconds
  encrypt?: boolean;
}

export interface StorageItem<T = any> {
  value: T;
  timestamp: number;
  ttl?: number;
  encrypted?: boolean;
}

export interface CacheStats {
  totalItems: number;
  totalSize: number; // Approximate size in bytes
  oldestItem?: string;
  newestItem?: string;
  hitCount: number;
  missCount: number;
}

type StorageKey = 
  | 'user-preferences' 
  | 'favorite-teams' 
  | 'filter-settings' 
  | 'theme-mode'
  | 'game-data-cache'
  | 'api-cache'
  | 'recent-searches'
  | 'view-preferences'
  | 'notification-settings';

class LocalStorageService {
  private prefix: string = 'sports_app_';
  private stats: CacheStats;

  constructor() {
    this.stats = {
      totalItems: 0,
      totalSize: 0,
      hitCount: 0,
      missCount: 0,
    };
    this.loadStats();
  }

  private isAvailable(): boolean {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Set item with advanced options including TTL and encryption
   */
  setItem<T>(key: StorageKey, value: T, options: StorageOptions = {}): boolean {
    if (!this.isAvailable()) {
      console.warn('LocalStorage is not available');
      return false;
    }

    try {
      const item: StorageItem<T> = {
        value: options.serialize !== false ? JSON.parse(JSON.stringify(value)) : value,
        timestamp: Date.now(),
        ttl: options.ttl,
        encrypted: options.encrypt,
      };

      if (options.encrypt) {
        item.value = this.encrypt(JSON.stringify(item.value)) as T;
      }

      const serializedItem = JSON.stringify(item);
      const fullKey = this.getKey(key);
      localStorage.setItem(fullKey, serializedItem);
      
      this.updateStats('set', key, serializedItem);
      return true;
    } catch (error) {
      console.error(`Error saving "${key}" to localStorage:`, error);
      return false;
    }
  }

  /**
   * Get item with TTL validation and decryption
   */
  getItem<T>(key: StorageKey, defaultValue?: T): T | null {
    if (!this.isAvailable()) {
      return defaultValue || null;
    }

    try {
      const fullKey = this.getKey(key);
      const rawItem = localStorage.getItem(fullKey);
      
      if (!rawItem) {
        this.stats.missCount++;
        return defaultValue || null;
      }

      // Handle legacy format (simple values)
      let item: StorageItem<T>;
      try {
        const parsed = JSON.parse(rawItem);
        if (parsed && typeof parsed === 'object' && 'value' in parsed && 'timestamp' in parsed) {
          item = parsed;
        } else {
          // Legacy format - wrap in new structure
          item = {
            value: parsed,
            timestamp: Date.now(),
          };
        }
      } catch {
        // Not JSON - treat as legacy string value
        item = {
          value: rawItem as T,
          timestamp: Date.now(),
        };
      }
      
      // Check TTL expiration
      if (item.ttl && Date.now() - item.timestamp > item.ttl) {
        this.removeItem(key);
        this.stats.missCount++;
        return defaultValue || null;
      }

      let value = item.value;
      
      // Decrypt if needed
      if (item.encrypted) {
        const decrypted = this.decrypt(value as string);
        value = JSON.parse(decrypted);
      }

      this.stats.hitCount++;
      return value;
    } catch (error) {
      console.error(`Error reading "${key}" from localStorage:`, error);
      this.stats.missCount++;
      return defaultValue || null;
    }
  }

  removeItem(key: StorageKey): boolean {
    if (!this.isAvailable()) {
      return false;
    }

    try {
      const fullKey = this.getKey(key);
      localStorage.removeItem(fullKey);
      this.updateStats('remove', key);
      return true;
    } catch (error) {
      console.error(`Error removing "${key}" from localStorage:`, error);
      return false;
    }
  }

  /**
   * Check if item exists and is not expired
   */
  hasItem(key: StorageKey): boolean {
    return this.getItem(key) !== null;
  }

  /**
   * Get all keys with this prefix
   */
  getAllKeys(): string[] {
    const keys: string[] = [];
    
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(this.prefix)) {
          keys.push(key.replace(this.prefix, ''));
        }
      }
    } catch (error) {
      console.warn('Failed to get all keys:', error);
    }
    
    return keys;
  }

  /**
   * Get storage usage stats
   */
  getStats(): CacheStats {
    return { ...this.stats };
  }

  /**
   * Clean up expired items
   */
  cleanup(): number {
    let removedCount = 0;
    const keys = this.getAllKeys();
    
    keys.forEach(key => {
      try {
        const rawItem = localStorage.getItem(this.getKey(key));
        if (rawItem) {
          const item: StorageItem = JSON.parse(rawItem);
          if (item.ttl && Date.now() - item.timestamp > item.ttl) {
            this.removeItem(key as StorageKey);
            removedCount++;
          }
        }
      } catch (error) {
        // Remove corrupted items
        this.removeItem(key as StorageKey);
        removedCount++;
      }
    });
    
    return removedCount;
  }

  clear(): boolean {
    if (!this.isAvailable()) {
      return false;
    }

    try {
      // Only clear items with our prefix
      const keysToRemove: string[] = [];
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(this.prefix)) {
          keysToRemove.push(key);
        }
      }
      
      keysToRemove.forEach(key => localStorage.removeItem(key));
      this.resetStats();
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  }

  // ===== PRIVATE METHODS =====

  private getKey(key: string): string {
    return `${this.prefix}${key}`;
  }

  private encrypt(value: string): string {
    // Simple base64 encoding for basic obfuscation
    // In production, use proper encryption
    return btoa(value);
  }

  private decrypt(value: string): string {
    // Simple base64 decoding
    // In production, use proper decryption
    return atob(value);
  }

  private updateStats(operation: 'set' | 'remove', key: string, serializedValue?: string): void {
    if (operation === 'set') {
      this.stats.totalItems++;
      if (serializedValue) {
        this.stats.totalSize += serializedValue.length;
      }
      if (!this.stats.newestItem) {
        this.stats.newestItem = key;
      }
      if (!this.stats.oldestItem) {
        this.stats.oldestItem = key;
      }
    } else if (operation === 'remove') {
      this.stats.totalItems = Math.max(0, this.stats.totalItems - 1);
    }
    
    this.saveStats();
  }

  private loadStats(): void {
    try {
      const rawStats = localStorage.getItem(`${this.prefix}_stats`);
      if (rawStats) {
        this.stats = { ...this.stats, ...JSON.parse(rawStats) };
      }
    } catch (error) {
      console.warn('Failed to load storage stats:', error);
    }
  }

  private saveStats(): void {
    try {
      localStorage.setItem(`${this.prefix}_stats`, JSON.stringify(this.stats));
    } catch (error) {
      console.warn('Failed to save storage stats:', error);
    }
  }

  private resetStats(): void {
    this.stats = {
      totalItems: 0,
      totalSize: 0,
      hitCount: 0,
      missCount: 0,
    };
    this.saveStats();
  }
}

export const localStorageService = new LocalStorageService();

// ===== ENHANCED CACHE IMPLEMENTATIONS =====

/**
 * LRU Cache implementation using localStorage
 */
export class LRUCache<T> {
  private maxSize: number;
  private accessOrder: string[] = [];
  private prefix: string;

  constructor(maxSize: number = 100, prefix: string = 'lru_cache_') {
    this.maxSize = maxSize;
    this.prefix = prefix;
    this.loadAccessOrder();
  }

  set(key: string, value: T, ttl?: number): void {
    // Remove if already exists to update position
    this.remove(key);
    
    // Add to storage
    const options: StorageOptions = ttl ? { ttl } : {};
    localStorageService.setItem(`${this.prefix}${key}` as StorageKey, value, options);
    
    // Update access order
    this.accessOrder.push(key);
    
    // Enforce max size
    while (this.accessOrder.length > this.maxSize) {
      const oldestKey = this.accessOrder.shift();
      if (oldestKey) {
        localStorageService.removeItem(`${this.prefix}${oldestKey}` as StorageKey);
      }
    }
    
    this.saveAccessOrder();
  }

  get(key: string): T | null {
    const value = localStorageService.getItem<T>(`${this.prefix}${key}` as StorageKey);
    
    if (value !== null) {
      // Move to end (most recently used)
      this.moveToEnd(key);
    }
    
    return value;
  }

  remove(key: string): boolean {
    const index = this.accessOrder.indexOf(key);
    if (index > -1) {
      this.accessOrder.splice(index, 1);
      this.saveAccessOrder();
    }
    
    return localStorageService.removeItem(`${this.prefix}${key}` as StorageKey);
  }

  clear(): void {
    this.accessOrder.forEach(key => {
      localStorageService.removeItem(`${this.prefix}${key}` as StorageKey);
    });
    this.accessOrder = [];
    this.saveAccessOrder();
  }

  size(): number {
    return this.accessOrder.length;
  }

  keys(): string[] {
    return [...this.accessOrder];
  }

  private moveToEnd(key: string): void {
    const index = this.accessOrder.indexOf(key);
    if (index > -1) {
      this.accessOrder.splice(index, 1);
      this.accessOrder.push(key);
      this.saveAccessOrder();
    }
  }

  private loadAccessOrder(): void {
    const order = localStorageService.getItem<string[]>(`${this.prefix}_access_order` as StorageKey, []);
    this.accessOrder = order || [];
  }

  private saveAccessOrder(): void {
    localStorageService.setItem(`${this.prefix}_access_order` as StorageKey, this.accessOrder);
  }
}

/**
 * Time-based cache with automatic cleanup
 */
export class TimedCache<T> {
  private cleanupInterval: number;
  private cleanupTimer?: number;
  private prefix: string;

  constructor(cleanupInterval: number = 60000, prefix: string = 'timed_cache_') {
    this.cleanupInterval = cleanupInterval;
    this.prefix = prefix;
    this.startCleanupTimer();
  }

  set(key: string, value: T, ttl: number): void {
    localStorageService.setItem(`${this.prefix}${key}` as StorageKey, value, { ttl });
  }

  get(key: string): T | null {
    return localStorageService.getItem<T>(`${this.prefix}${key}` as StorageKey);
  }

  remove(key: string): boolean {
    return localStorageService.removeItem(`${this.prefix}${key}` as StorageKey);
  }

  clear(): void {
    const keys = localStorageService.getAllKeys().filter(key => key.startsWith(this.prefix));
    keys.forEach(key => {
      localStorageService.removeItem(key as StorageKey);
    });
  }

  cleanup(): number {
    return localStorageService.cleanup();
  }

  destroy(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
    }
  }

  private startCleanupTimer(): void {
    this.cleanupTimer = window.setInterval(() => {
      this.cleanup();
    }, this.cleanupInterval);
  }
}

// ===== UTILITY FUNCTIONS =====

/**
 * Check if storage is available
 */
export const isStorageAvailable = (type: 'localStorage' | 'sessionStorage' = 'localStorage'): boolean => {
  try {
    const storage = type === 'localStorage' ? localStorage : sessionStorage;
    const test = '__storage_test__';
    storage.setItem(test, test);
    storage.removeItem(test);
    return true;
  } catch {
    return false;
  }
};

/**
 * Get storage usage information
 */
export const getStorageUsage = (): { used: number; available: number; percentage: number } => {
  try {
    let used = 0;
    
    // Calculate current usage
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        used += localStorage[key].length + key.length;
      }
    }
    
    // Estimate available space (most browsers have 5-10MB limit)
    const estimated = 5 * 1024 * 1024; // 5MB estimate
    const available = estimated - used;
    const percentage = (used / estimated) * 100;
    
    return { used, available, percentage };
  } catch {
    return { used: 0, available: 0, percentage: 0 };
  }
};

// ===== CONVENIENCE FUNCTIONS =====
// Enhanced user preferences interface
export interface UserPreferences {
  favoriteTeams: string[];
  defaultSport: string;
  compactMode: boolean;
  autoRefresh: boolean;
  refreshInterval: number; // seconds
  theme: 'light' | 'dark' | 'auto';
  timezone: string;
  dateFormat: 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD';
  timeFormat: '12h' | '24h';
  notifications: {
    gameStart: boolean;
    scoreUpdate: boolean;
    finalScore: boolean;
  };
  displaySettings: {
    showLogos: boolean;
    showRecords: boolean;
    showBroadcast: boolean;
    compactScores: boolean;
  };
}

export interface FilterSettings {
  sports: string[];
  leagues: string[];
  teams: string[];
  dateRange: {
    start?: string;
    end?: string;
  };
  gameStatus: ('live' | 'upcoming' | 'completed')[];
  lastUpdated: number;
}

export interface ViewPreferences {
  currentView: 'live' | 'recent' | 'schedule';
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  itemsPerPage: number;
  groupBy?: string;
}

// Enhanced convenience functions
export const getUserPreferences = (): UserPreferences => {
  return localStorageService.getItem('user-preferences', {
    favoriteTeams: [],
    defaultSport: 'nfl',
    compactMode: false,
    autoRefresh: true,
    refreshInterval: 30,
    theme: 'light' as const,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    dateFormat: 'MM/DD/YYYY' as const,
    timeFormat: '12h' as const,
    notifications: {
      gameStart: true,
      scoreUpdate: false,
      finalScore: true,
    },
    displaySettings: {
      showLogos: true,
      showRecords: true,
      showBroadcast: true,
      compactScores: false,
    },
  })!;
};

export const saveUserPreferences = (preferences: Partial<UserPreferences>): boolean => {
  const currentPrefs = getUserPreferences();
  const updatedPrefs = { ...currentPrefs, ...preferences };
  return localStorageService.setItem('user-preferences', updatedPrefs);
};

// Favorite teams management
export const getFavoriteTeams = (): string[] => {
  return localStorageService.getItem('favorite-teams', [])!;
};

export const saveFavoriteTeams = (teams: string[]): boolean => {
  return localStorageService.setItem('favorite-teams', teams);
};

export const addFavoriteTeam = (teamId: string): boolean => {
  const currentTeams = getFavoriteTeams();
  if (!currentTeams.includes(teamId)) {
    currentTeams.push(teamId);
    return saveFavoriteTeams(currentTeams);
  }
  return true;
};

export const removeFavoriteTeam = (teamId: string): boolean => {
  const currentTeams = getFavoriteTeams();
  const updatedTeams = currentTeams.filter(id => id !== teamId);
  return saveFavoriteTeams(updatedTeams);
};

export const isFavoriteTeam = (teamId: string): boolean => {
  return getFavoriteTeams().includes(teamId);
};

// Filter settings management
export const getFilterSettings = (): FilterSettings => {
  return localStorageService.getItem('filter-settings', {
    sports: [],
    leagues: [],
    teams: [],
    dateRange: {},
    gameStatus: ['live', 'upcoming', 'completed'],
    lastUpdated: Date.now(),
  })!;
};

export const saveFilterSettings = (filters: Partial<FilterSettings>): boolean => {
  const currentFilters = getFilterSettings();
  const updatedFilters = { 
    ...currentFilters, 
    ...filters, 
    lastUpdated: Date.now() 
  };
  return localStorageService.setItem('filter-settings', updatedFilters);
};

// View preferences management
export const getViewPreferences = (): ViewPreferences => {
  return localStorageService.getItem('view-preferences', {
    currentView: 'live',
    sortBy: 'startTime',
    sortOrder: 'asc',
    itemsPerPage: 20,
  })!;
};

export const saveViewPreferences = (prefs: Partial<ViewPreferences>): boolean => {
  const currentPrefs = getViewPreferences();
  const updatedPrefs = { ...currentPrefs, ...prefs };
  return localStorageService.setItem('view-preferences', updatedPrefs);
};

// Recent searches management
export const getRecentSearches = (): string[] => {
  return localStorageService.getItem('recent-searches', [])!;
};

export const addRecentSearch = (query: string, maxItems: number = 10): boolean => {
  const searches = getRecentSearches();
  const filtered = searches.filter(s => s !== query);
  filtered.unshift(query);
  
  if (filtered.length > maxItems) {
    filtered.splice(maxItems);
  }
  
  return localStorageService.setItem('recent-searches', filtered);
};

export const clearRecentSearches = (): boolean => {
  return localStorageService.setItem('recent-searches', []);
};

// Theme management
export const getThemeMode = (): 'light' | 'dark' | 'auto' => {
  return localStorageService.getItem('theme-mode', 'light')!;
};

export const setThemeMode = (mode: 'light' | 'dark' | 'auto'): boolean => {
  return localStorageService.setItem('theme-mode', mode);
};

// ===== CACHE INSTANCES =====

// Create cache instances for common use cases
export const gameDataCache = new LRUCache<any>(50, 'game_cache_');
export const apiCache = new TimedCache<any>(300000, 'api_cache_'); // 5 minutes TTL
export const imageCache = new LRUCache<string>(100, 'img_cache_');
export const searchCache = new TimedCache<any>(600000, 'search_cache_'); // 10 minutes TTL

// ===== DATA PERSISTENCE HELPERS =====

/**
 * Save data with automatic cache management
 */
export const cacheGameData = (gameId: string, data: any, ttl?: number): void => {
  if (ttl) {
    // Use timed cache for temporary data
    apiCache.set(`game_${gameId}`, data, ttl);
  } else {
    // Use LRU cache for persistent data
    gameDataCache.set(gameId, data);
  }
};

/**
 * Get cached game data
 */
export const getCachedGameData = (gameId: string): any => {
  // Try timed cache first, then LRU cache
  return apiCache.get(`game_${gameId}`) || gameDataCache.get(gameId);
};

/**
 * Cache API response
 */
export const cacheApiResponse = (endpoint: string, data: any, ttl: number = 300000): void => {
  apiCache.set(endpoint, data, ttl);
};

/**
 * Get cached API response
 */
export const getCachedApiResponse = (endpoint: string): any => {
  return apiCache.get(endpoint);
};

/**
 * Export all user data for backup
 */
export const exportUserData = () => {
  return {
    preferences: getUserPreferences(),
    favoriteTeams: getFavoriteTeams(),
    filterSettings: getFilterSettings(),
    viewPreferences: getViewPreferences(),
    recentSearches: getRecentSearches(),
    themeMode: getThemeMode(),
    exportDate: new Date().toISOString(),
  };
};

/**
 * Import user data from backup
 */
export const importUserData = (data: any): boolean => {
  try {
    if (data.preferences) saveUserPreferences(data.preferences);
    if (data.favoriteTeams) saveFavoriteTeams(data.favoriteTeams);
    if (data.filterSettings) saveFilterSettings(data.filterSettings);
    if (data.viewPreferences) saveViewPreferences(data.viewPreferences);
    if (data.recentSearches) localStorageService.setItem('recent-searches', data.recentSearches);
    if (data.themeMode) setThemeMode(data.themeMode);
    
    return true;
  } catch (error) {
    console.error('Failed to import user data:', error);
    return false;
  }
};

/**
 * Clean up expired cache entries
 */
export const cleanupExpiredData = (): number => {
  let cleanedCount = 0;
  
  // Clean up main storage
  cleanedCount += localStorageService.cleanup();
  
  // Clean up timed caches
  cleanedCount += apiCache.cleanup();
  cleanedCount += searchCache.cleanup();
  
  return cleanedCount;
};

/**
 * Get storage statistics
 */
export const getStorageStats = () => {
  const usage = getStorageUsage();
  const stats = localStorageService.getStats();
  
  return {
    usage,
    stats,
    cacheInfo: {
      gameCache: gameDataCache.size(),
      apiCache: apiCache.size ? apiCache.size() : 0,
      imageCache: imageCache.size(),
    },
  };
};