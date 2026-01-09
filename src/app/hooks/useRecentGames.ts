import { useState, useEffect, useRef, useCallback } from 'react';
import { 
  recentGamesService, 
  RecentGamesFilter, 
  DetailedGameResult, 
  GameStatistics 
} from '../services/RecentGamesService';
import { 
  upcomingScheduleService, 
  ScheduleFilter, 
  UpcomingGame 
} from '../services/UpcomingScheduleService';
import { Team } from '../types/Team';
import { addDays, subDays, startOfDay, endOfDay } from 'date-fns';

// ===== RECENT GAMES HOOK =====

export interface UseRecentGamesOptions {
  autoRefresh?: boolean;
  refreshInterval?: number;
  defaultFilter?: RecentGamesFilter;
  onGamesUpdate?: (games: DetailedGameResult[]) => void;
  onError?: (error: Error) => void;
}

export interface UseRecentGamesReturn {
  games: DetailedGameResult[];
  filteredGames: DetailedGameResult[];
  isLoading: boolean;
  error: string | null;
  filter: RecentGamesFilter;
  setFilter: (filter: RecentGamesFilter) => void;
  refreshGames: () => void;
  clearFilter: () => void;
  // Convenience methods
  getLast24Hours: () => DetailedGameResult[];
  getLastWeek: () => DetailedGameResult[];
  getGamesByTeam: (teamId: string) => DetailedGameResult[];
  getHighScoringGames: (minScore?: number) => DetailedGameResult[];
  getCloseGames: (maxMargin?: number) => DetailedGameResult[];
  getBlowoutGames: (minMargin?: number) => DetailedGameResult[];
  // Statistics
  getGameStats: () => {
    totalGames: number;
    averageScore: number;
    highestScoringGame: DetailedGameResult | null;
    lowestScoringGame: DetailedGameResult | null;
    closestGame: DetailedGameResult | null;
    biggestBlowout: DetailedGameResult | null;
  };
}

export const useRecentGames = (options: UseRecentGamesOptions = {}): UseRecentGamesReturn => {
  const {
    autoRefresh = false,
    refreshInterval = 60000, // 1 minute default
    defaultFilter = {},
    onGamesUpdate,
    onError
  } = options;

  const [games, setGames] = useState<DetailedGameResult[]>([]);
  const [filteredGames, setFilteredGames] = useState<DetailedGameResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilterState] = useState<RecentGamesFilter>(defaultFilter);

  const unsubscribeRef = useRef<(() => void) | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const onGamesUpdateRef = useRef(onGamesUpdate);
  const onErrorRef = useRef(onError);

  // Update refs when callbacks change
  useEffect(() => {
    onGamesUpdateRef.current = onGamesUpdate;
    onErrorRef.current = onError;
  }, [onGamesUpdate, onError]);

  // Initialize and subscribe to games
  useEffect(() => {
    try {
      setIsLoading(true);
      setError(null);

      unsubscribeRef.current = recentGamesService.subscribe((updatedGames) => {
        setGames(updatedGames);
        setIsLoading(false);
        
        // Call external callback if provided
        if (onGamesUpdateRef.current) {
          try {
            onGamesUpdateRef.current(updatedGames);
          } catch (callbackError) {
            console.error('Error in onGamesUpdate callback:', callbackError);
          }
        }
      });

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load recent games';
      setError(errorMessage);
      setIsLoading(false);
      
      if (onErrorRef.current) {
        onErrorRef.current(new Error(errorMessage));
      }
    }

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, []);

  // Apply filters when games or filter changes
  useEffect(() => {
    try {
      const filtered = recentGamesService.getRecentGames(filter);
      setFilteredGames(filtered);
    } catch (err) {
      console.error('Error applying filter:', err);
      setFilteredGames(games);
    }
  }, [games, filter]);

  // Auto-refresh setup
  useEffect(() => {
    if (autoRefresh && refreshInterval > 0) {
      intervalRef.current = setInterval(() => {
        refreshGames();
      }, refreshInterval);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [autoRefresh, refreshInterval]);

  const setFilter = useCallback((newFilter: RecentGamesFilter) => {
    setFilterState(newFilter);
  }, []);

  const refreshGames = useCallback(() => {
    try {
      recentGamesService.refreshGames();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to refresh games';
      setError(errorMessage);
      
      if (onErrorRef.current) {
        onErrorRef.current(new Error(errorMessage));
      }
    }
  }, []);

  const clearFilter = useCallback(() => {
    setFilterState({});
  }, []);

  // Convenience methods
  const getLast24Hours = useCallback(() => {
    return recentGamesService.getLast24Hours();
  }, []);

  const getLastWeek = useCallback(() => {
    return recentGamesService.getLastWeek();
  }, []);

  const getGamesByTeam = useCallback((teamId: string) => {
    return recentGamesService.getGamesByTeam(teamId);
  }, []);

  const getHighScoringGames = useCallback((minScore: number = 50) => {
    return recentGamesService.getHighScoringGames(minScore);
  }, []);

  const getCloseGames = useCallback((maxMargin: number = 7) => {
    return recentGamesService.getCloseGames(maxMargin);
  }, []);

  const getBlowoutGames = useCallback((minMargin: number = 21) => {
    return recentGamesService.getBlowoutGames(minMargin);
  }, []);

  const getGameStats = useCallback(() => {
    try {
      const stats = recentGamesService.getGameStatsSummary();
      return {
        totalGames: stats.totalGames,
        averageScore: stats.averageScore,
        highestScoringGame: stats.highestScoringGame,
        lowestScoringGame: stats.lowestScoringGame,
        closestGame: stats.closestGame,
        biggestBlowout: stats.biggestBlowout,
      };
    } catch (err) {
      return {
        totalGames: 0,
        averageScore: 0,
        highestScoringGame: null,
        lowestScoringGame: null,
        closestGame: null,
        biggestBlowout: null,
      };
    }
  }, [games]);

  return {
    games,
    filteredGames,
    isLoading,
    error,
    filter,
    setFilter,
    refreshGames,
    clearFilter,
    getLast24Hours,
    getLastWeek,
    getGamesByTeam,
    getHighScoringGames,
    getCloseGames,
    getBlowoutGames,
    getGameStats,
  };
};

// ===== UPCOMING SCHEDULE HOOK =====

export interface UseUpcomingScheduleOptions {
  autoRefresh?: boolean;
  refreshInterval?: number;
  defaultFilter?: ScheduleFilter;
  onScheduleUpdate?: (games: UpcomingGame[]) => void;
  onError?: (error: Error) => void;
}

export interface UseUpcomingScheduleReturn {
  games: UpcomingGame[];
  filteredGames: UpcomingGame[];
  isLoading: boolean;
  error: string | null;
  filter: ScheduleFilter;
  setFilter: (filter: ScheduleFilter) => void;
  refreshSchedule: () => void;
  clearFilter: () => void;
  // Convenience methods
  getNext7Days: () => UpcomingGame[];
  getThisWeek: () => UpcomingGame[];
  getTodaysGames: () => UpcomingGame[];
  getPrimetimeGames: () => UpcomingGame[];
  getDivisionGames: () => UpcomingGame[];
  getPlayoffImplicationGames: () => UpcomingGame[];
  getGamesByTeam: (teamId: string) => UpcomingGame[];
  getGamesByNetwork: (network: string) => UpcomingGame[];
  // Statistics
  getScheduleStats: () => {
    totalGames: number;
    gamesThisWeek: number;
    primetimeGames: number;
    divisionGames: number;
    playoffImplicationGames: number;
    nextGame: UpcomingGame | null;
  };
}

export const useUpcomingSchedule = (options: UseUpcomingScheduleOptions = {}): UseUpcomingScheduleReturn => {
  const {
    autoRefresh = false,
    refreshInterval = 300000, // 5 minutes default
    defaultFilter = {},
    onScheduleUpdate,
    onError
  } = options;

  const [games, setGames] = useState<UpcomingGame[]>([]);
  const [filteredGames, setFilteredGames] = useState<UpcomingGame[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilterState] = useState<ScheduleFilter>(defaultFilter);

  const unsubscribeRef = useRef<(() => void) | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const onScheduleUpdateRef = useRef(onScheduleUpdate);
  const onErrorRef = useRef(onError);

  // Update refs when callbacks change
  useEffect(() => {
    onScheduleUpdateRef.current = onScheduleUpdate;
    onErrorRef.current = onError;
  }, [onScheduleUpdate, onError]);

  // Initialize and subscribe to schedule
  useEffect(() => {
    try {
      setIsLoading(true);
      setError(null);

      unsubscribeRef.current = upcomingScheduleService.subscribe((updatedGames) => {
        setGames(updatedGames);
        setIsLoading(false);
        
        // Call external callback if provided
        if (onScheduleUpdateRef.current) {
          try {
            onScheduleUpdateRef.current(updatedGames);
          } catch (callbackError) {
            console.error('Error in onScheduleUpdate callback:', callbackError);
          }
        }
      });

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load upcoming schedule';
      setError(errorMessage);
      setIsLoading(false);
      
      if (onErrorRef.current) {
        onErrorRef.current(new Error(errorMessage));
      }
    }

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, []);

  // Apply filters when games or filter changes
  useEffect(() => {
    try {
      const filtered = upcomingScheduleService.getUpcomingGames(filter);
      setFilteredGames(filtered);
    } catch (err) {
      console.error('Error applying filter:', err);
      setFilteredGames(games);
    }
  }, [games, filter]);

  // Auto-refresh setup
  useEffect(() => {
    if (autoRefresh && refreshInterval > 0) {
      intervalRef.current = setInterval(() => {
        refreshSchedule();
      }, refreshInterval);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [autoRefresh, refreshInterval]);

  const setFilter = useCallback((newFilter: ScheduleFilter) => {
    setFilterState(newFilter);
  }, []);

  const refreshSchedule = useCallback(() => {
    try {
      upcomingScheduleService.refreshSchedule();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to refresh schedule';
      setError(errorMessage);
      
      if (onErrorRef.current) {
        onErrorRef.current(new Error(errorMessage));
      }
    }
  }, []);

  const clearFilter = useCallback(() => {
    setFilterState({});
  }, []);

  // Convenience methods
  const getNext7Days = useCallback(() => {
    return upcomingScheduleService.getNext7Days();
  }, []);

  const getThisWeek = useCallback(() => {
    return upcomingScheduleService.getThisWeek();
  }, []);

  const getTodaysGames = useCallback(() => {
    return upcomingScheduleService.getTodaysGames();
  }, []);

  const getPrimetimeGames = useCallback(() => {
    return upcomingScheduleService.getPrimetimeGames();
  }, []);

  const getDivisionGames = useCallback(() => {
    return upcomingScheduleService.getDivisionGames();
  }, []);

  const getPlayoffImplicationGames = useCallback(() => {
    return upcomingScheduleService.getPlayoffImplicationGames();
  }, []);

  const getGamesByTeam = useCallback((teamId: string) => {
    return upcomingScheduleService.getGamesByTeam(teamId);
  }, []);

  const getGamesByNetwork = useCallback((network: string) => {
    return upcomingScheduleService.getGamesByNetwork(network);
  }, []);

  const getScheduleStats = useCallback(() => {
    return upcomingScheduleService.getScheduleSummary();
  }, [games]);

  return {
    games,
    filteredGames,
    isLoading,
    error,
    filter,
    setFilter,
    refreshSchedule,
    clearFilter,
    getNext7Days,
    getThisWeek,
    getTodaysGames,
    getPrimetimeGames,
    getDivisionGames,
    getPlayoffImplicationGames,
    getGamesByTeam,
    getGamesByNetwork,
    getScheduleStats,
  };
};

// ===== COMBINED GAMES HOOK =====

export interface UseCombinedGamesOptions {
  recentGamesOptions?: UseRecentGamesOptions;
  upcomingScheduleOptions?: UseUpcomingScheduleOptions;
}

export interface UseCombinedGamesReturn {
  recentGames: UseRecentGamesReturn;
  upcomingSchedule: UseUpcomingScheduleReturn;
  isLoading: boolean;
  hasError: boolean;
  refreshAll: () => void;
}

export const useCombinedGames = (options: UseCombinedGamesOptions = {}): UseCombinedGamesReturn => {
  const { recentGamesOptions = {}, upcomingScheduleOptions = {} } = options;

  const recentGames = useRecentGames(recentGamesOptions);
  const upcomingSchedule = useUpcomingSchedule(upcomingScheduleOptions);

  const isLoading = recentGames.isLoading || upcomingSchedule.isLoading;
  const hasError = !!recentGames.error || !!upcomingSchedule.error;

  const refreshAll = useCallback(() => {
    recentGames.refreshGames();
    upcomingSchedule.refreshSchedule();
  }, [recentGames, upcomingSchedule]);

  return {
    recentGames,
    upcomingSchedule,
    isLoading,
    hasError,
    refreshAll,
  };
};