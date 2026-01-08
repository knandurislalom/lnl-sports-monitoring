type StorageKey = 'user-preferences' | 'favorite-teams' | 'filter-settings' | 'theme-mode';

class LocalStorageService {
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

  setItem<T>(key: StorageKey, value: T): boolean {
    if (!this.isAvailable()) {
      console.warn('LocalStorage is not available');
      return false;
    }

    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(key, serializedValue);
      return true;
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      return false;
    }
  }

  getItem<T>(key: StorageKey, defaultValue?: T): T | null {
    if (!this.isAvailable()) {
      return defaultValue || null;
    }

    try {
      const item = localStorage.getItem(key);
      if (item === null) {
        return defaultValue || null;
      }
      return JSON.parse(item) as T;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return defaultValue || null;
    }
  }

  removeItem(key: StorageKey): boolean {
    if (!this.isAvailable()) {
      return false;
    }

    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error removing from localStorage:', error);
      return false;
    }
  }

  clear(): boolean {
    if (!this.isAvailable()) {
      return false;
    }

    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  }
}

export const localStorageService = new LocalStorageService();

// Convenience functions for common use cases
export interface UserPreferences {
  favoriteTeams: string[];
  defaultSport: string;
  compactMode: boolean;
  autoRefresh: boolean;
  theme: 'light' | 'dark' | 'auto';
}

export const getUserPreferences = (): UserPreferences => {
  return localStorageService.getItem('user-preferences', {
    favoriteTeams: [],
    defaultSport: 'nfl',
    compactMode: false,
    autoRefresh: true,
    theme: 'light' as const,
  })!;
};

export const saveUserPreferences = (preferences: UserPreferences): boolean => {
  return localStorageService.setItem('user-preferences', preferences);
};

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