import { useState, useEffect, useCallback } from 'react';
import { usePersistentState } from './useCache';
import dayjs, { Dayjs } from 'dayjs';

// Filter types for different pages
export interface GameFilters {
  searchQuery: string;
  selectedTeam: string;
  selectedDate: Dayjs | null;
  dateRange: 'today' | 'week' | 'month' | 'all';
  status: 'live' | 'completed' | 'scheduled' | 'all';
  sortBy: 'date' | 'score' | 'team' | 'status';
  sortOrder: 'asc' | 'desc';
}

export interface NotificationSettings {
  gameNotifications: Set<string>;
  reminderMinutes: number;
  emailNotifications: boolean;
  pushNotifications: boolean;
}

export interface ViewPreferences {
  compactView: boolean;
  showScores: boolean;
  showStats: boolean;
  itemsPerPage: number;
  autoRefresh: boolean;
  refreshInterval: number;
}

// Default filter values
const defaultFilters: GameFilters = {
  searchQuery: '',
  selectedTeam: '',
  selectedDate: null,
  dateRange: 'week',
  status: 'all',
  sortBy: 'date',
  sortOrder: 'asc'
};

const defaultNotifications: NotificationSettings = {
  gameNotifications: new Set<string>(),
  reminderMinutes: 30,
  emailNotifications: false,
  pushNotifications: false
};

const defaultViewPreferences: ViewPreferences = {
  compactView: false,
  showScores: true,
  showStats: false,
  itemsPerPage: 20,
  autoRefresh: true,
  refreshInterval: 30000
};

/**
 * Hook for managing game filters with persistence
 */
export const useGameFilters = (pageKey: string = 'global') => {
  const [filters, setFilters] = usePersistentState<GameFilters>(
    `game-filters-${pageKey}`,
    defaultFilters
  );

  const updateFilter = useCallback(<K extends keyof GameFilters>(
    key: K,
    value: GameFilters[K]
  ) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  }, [setFilters]);

  const resetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, [setFilters]);

  const hasActiveFilters = useCallback(() => {
    return filters.searchQuery !== '' ||
           filters.selectedTeam !== '' ||
           filters.selectedDate !== null ||
           filters.dateRange !== 'week' ||
           filters.status !== 'all';
  }, [filters]);

  return {
    filters,
    updateFilter,
    resetFilters,
    hasActiveFilters
  };
};

/**
 * Hook for managing notification settings with persistence
 */
export const useNotifications = (pageKey: string = 'global') => {
  const [notifications, setNotifications] = usePersistentState<NotificationSettings>(
    `notifications-${pageKey}`,
    defaultNotifications
  );

  const toggleGameNotification = useCallback((gameId: string) => {
    setNotifications(prev => {
      const newNotifications = new Set(prev.gameNotifications);
      if (newNotifications.has(gameId)) {
        newNotifications.delete(gameId);
      } else {
        newNotifications.add(gameId);
      }
      return {
        ...prev,
        gameNotifications: newNotifications
      };
    });
  }, [setNotifications]);

  const updateNotificationSetting = useCallback(<K extends keyof NotificationSettings>(
    key: K,
    value: NotificationSettings[K]
  ) => {
    setNotifications(prev => ({
      ...prev,
      [key]: value
    }));
  }, [setNotifications]);

  const clearAllNotifications = useCallback(() => {
    setNotifications(prev => ({
      ...prev,
      gameNotifications: new Set<string>()
    }));
  }, [setNotifications]);

  const isGameNotificationEnabled = useCallback((gameId: string) => {
    return notifications.gameNotifications.has(gameId);
  }, [notifications.gameNotifications]);

  return {
    notifications,
    toggleGameNotification,
    updateNotificationSetting,
    clearAllNotifications,
    isGameNotificationEnabled
  };
};

/**
 * Hook for managing view preferences with persistence
 */
export const useViewPreferences = (pageKey: string = 'global') => {
  const [preferences, setPreferences] = usePersistentState<ViewPreferences>(
    `view-preferences-${pageKey}`,
    defaultViewPreferences
  );

  const updatePreference = useCallback(<K extends keyof ViewPreferences>(
    key: K,
    value: ViewPreferences[K]
  ) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  }, [setPreferences]);

  const resetPreferences = useCallback(() => {
    setPreferences(defaultViewPreferences);
  }, [setPreferences]);

  return {
    preferences,
    updatePreference,
    resetPreferences
  };
};

/**
 * Combined hook for comprehensive state management
 */
export const usePageState = (pageKey: string) => {
  const filters = useGameFilters(pageKey);
  const notifications = useNotifications(pageKey);
  const viewPreferences = useViewPreferences(pageKey);

  // Combined reset function
  const resetAll = useCallback(() => {
    filters.resetFilters();
    notifications.clearAllNotifications();
    viewPreferences.resetPreferences();
  }, [filters, notifications, viewPreferences]);

  // Export data function for debugging/analytics
  const exportState = useCallback(() => {
    return {
      filters: filters.filters,
      notifications: {
        ...notifications.notifications,
        gameNotifications: Array.from(notifications.notifications.gameNotifications)
      },
      preferences: viewPreferences.preferences,
      pageKey,
      timestamp: new Date().toISOString()
    };
  }, [filters.filters, notifications.notifications, viewPreferences.preferences, pageKey]);

  return {
    filters,
    notifications,
    viewPreferences,
    resetAll,
    exportState
  };
};

/**
 * Hook for managing date range filtering
 */
export const useDateFilter = (games: any[]) => {
  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month' | 'all'>('week');
  const [customDate, setCustomDate] = useState<Dayjs | null>(null);

  const filteredGames = useCallback(() => {
    let filtered = [...games];
    const now = dayjs();

    if (customDate) {
      // Custom date filter takes priority
      filtered = filtered.filter(game => 
        dayjs(game.startTime).isSame(customDate, 'day')
      );
    } else {
      // Date range filter
      switch (dateRange) {
        case 'today':
          filtered = filtered.filter(game => 
            dayjs(game.startTime).isSame(now, 'day')
          );
          break;
        case 'week':
          filtered = filtered.filter(game => 
            dayjs(game.startTime).isAfter(now.subtract(7, 'days'))
          );
          break;
        case 'month':
          filtered = filtered.filter(game => 
            dayjs(game.startTime).isAfter(now.subtract(30, 'days'))
          );
          break;
        case 'all':
        default:
          // No filtering
          break;
      }
    }

    return filtered;
  }, [games, dateRange, customDate]);

  return {
    dateRange,
    setDateRange,
    customDate,
    setCustomDate,
    filteredGames: filteredGames()
  };
};

/**
 * Hook for managing team filtering
 */
export const useTeamFilter = (games: any[]) => {
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const availableTeams = useCallback(() => {
    const teams = new Set<string>();
    games.forEach(game => {
      teams.add(game.homeTeam.abbreviation);
      teams.add(game.awayTeam.abbreviation);
    });
    return Array.from(teams).sort();
  }, [games]);

  const filteredGames = useCallback(() => {
    let filtered = [...games];

    // Team filter
    if (selectedTeams.length > 0) {
      filtered = filtered.filter(game =>
        selectedTeams.includes(game.homeTeam.abbreviation) ||
        selectedTeams.includes(game.awayTeam.abbreviation)
      );
    }

    // Search query filter
    if (searchQuery) {
      filtered = filtered.filter(game =>
        game.homeTeam.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.awayTeam.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.homeTeam.abbreviation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.awayTeam.abbreviation.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [games, selectedTeams, searchQuery]);

  const toggleTeam = useCallback((teamAbbrev: string) => {
    setSelectedTeams(prev => {
      if (prev.includes(teamAbbrev)) {
        return prev.filter(team => team !== teamAbbrev);
      } else {
        return [...prev, teamAbbrev];
      }
    });
  }, []);

  const clearTeamFilters = useCallback(() => {
    setSelectedTeams([]);
    setSearchQuery('');
  }, []);

  return {
    selectedTeams,
    searchQuery,
    setSearchQuery,
    availableTeams: availableTeams(),
    filteredGames: filteredGames(),
    toggleTeam,
    clearTeamFilters
  };
};

export default {
  useGameFilters,
  useNotifications,
  useViewPreferences,
  usePageState,
  useDateFilter,
  useTeamFilter
};