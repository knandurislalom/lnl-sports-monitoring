import { useState, useEffect, useRef, useCallback } from 'react';
import { Game, GameStatus } from '../types/Game';
import { liveGameService } from '../services/LiveGameService';

// ===== LIVE GAMES HOOK =====

export interface UseLiveGamesOptions {
  autoStart?: boolean;
  updateInterval?: number;
  onGameUpdate?: (games: Game[]) => void;
  onError?: (error: Error) => void;
}

export interface UseLiveGamesReturn {
  games: Game[];
  liveGames: Game[];
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  startTracking: () => void;
  stopTracking: () => void;
  refreshGames: () => void;
  getGame: (gameId: string) => Game | undefined;
  updateInterval: number;
  setUpdateInterval: (interval: number) => void;
}

export const useLiveGames = (options: UseLiveGamesOptions = {}): UseLiveGamesReturn => {
  const {
    autoStart = true,
    updateInterval = 5000,
    onGameUpdate,
    onError
  } = options;

  const [games, setGames] = useState<Game[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUpdateInterval, setCurrentUpdateInterval] = useState(updateInterval);
  
  const unsubscribeRef = useRef<(() => void) | null>(null);
  const onGameUpdateRef = useRef(onGameUpdate);
  const onErrorRef = useRef(onError);

  // Update refs when callbacks change
  useEffect(() => {
    onGameUpdateRef.current = onGameUpdate;
    onErrorRef.current = onError;
  }, [onGameUpdate, onError]);

  const startTracking = useCallback(() => {
    try {
      setError(null);
      setIsLoading(true);
      
      // Set update interval
      liveGameService.setUpdateInterval(currentUpdateInterval);
      
      // Subscribe to game updates
      unsubscribeRef.current = liveGameService.subscribe((updatedGames) => {
        setGames(updatedGames);
        setIsLoading(false);
        setIsConnected(true);
        
        // Call external callback if provided
        if (onGameUpdateRef.current) {
          try {
            onGameUpdateRef.current(updatedGames);
          } catch (callbackError) {
            console.error('Error in onGameUpdate callback:', callbackError);
          }
        }
      });
      
      // Start live updates
      liveGameService.startLiveUpdates();
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to start live game tracking';
      setError(errorMessage);
      setIsLoading(false);
      setIsConnected(false);
      
      if (onErrorRef.current) {
        onErrorRef.current(new Error(errorMessage));
      }
    }
  }, [currentUpdateInterval]);

  const stopTracking = useCallback(() => {
    try {
      // Unsubscribe from updates
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
      
      // Stop live updates
      liveGameService.stopLiveUpdates();
      
      setIsConnected(false);
    } catch (err) {
      console.error('Error stopping live game tracking:', err);
    }
  }, []);

  const refreshGames = useCallback(() => {
    if (isConnected) {
      // Force a refresh by restarting tracking
      stopTracking();
      setTimeout(startTracking, 100);
    } else {
      startTracking();
    }
  }, [isConnected, startTracking, stopTracking]);

  const getGame = useCallback((gameId: string): Game | undefined => {
    return liveGameService.getGame(gameId);
  }, []);

  const setUpdateIntervalHandler = useCallback((interval: number) => {
    setCurrentUpdateInterval(interval);
    liveGameService.setUpdateInterval(interval);
  }, []);

  // Auto-start if enabled
  useEffect(() => {
    if (autoStart) {
      startTracking();
    }

    // Cleanup on unmount
    return () => {
      stopTracking();
    };
  }, [autoStart, startTracking, stopTracking]);

  // Derived state
  const liveGames = games.filter(game => game.status === GameStatus.LIVE);

  return {
    games,
    liveGames,
    isConnected,
    isLoading,
    error,
    startTracking,
    stopTracking,
    refreshGames,
    getGame,
    updateInterval: currentUpdateInterval,
    setUpdateInterval: setUpdateIntervalHandler,
  };
};

// ===== GAME STATISTICS HOOK =====

export interface UseGameStatsOptions {
  gameId?: string;
  autoRefresh?: boolean;
}

export interface UseGameStatsReturn {
  game: Game | null;
  isLive: boolean;
  progress: number;
  statusText: string;
  scoreLeader: 'home' | 'away' | 'tie';
  timeSinceLastUpdate: number;
  refreshGame: () => void;
}

export const useGameStats = (options: UseGameStatsOptions = {}): UseGameStatsReturn => {
  const { gameId, autoRefresh = true } = options;
  const [game, setGame] = useState<Game | null>(null);
  const [timeSinceLastUpdate, setTimeSinceLastUpdate] = useState(0);
  
  const { games } = useLiveGames({ autoStart: autoRefresh });

  // Update game when games change or gameId changes
  useEffect(() => {
    if (gameId) {
      const foundGame = games.find(g => g.id === gameId);
      setGame(foundGame || null);
      setTimeSinceLastUpdate(0);
    } else {
      setGame(null);
    }
  }, [gameId, games]);

  // Track time since last update
  useEffect(() => {
    if (!game || game.status !== GameStatus.LIVE) return;

    const interval = setInterval(() => {
      setTimeSinceLastUpdate(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [game]);

  const refreshGame = useCallback(() => {
    if (gameId) {
      const foundGame = liveGameService.getGame(gameId);
      setGame(foundGame || null);
      setTimeSinceLastUpdate(0);
    }
  }, [gameId]);

  // Calculate derived values
  const isLive = game?.status === GameStatus.LIVE;
  
  const progress = game ? (() => {
    if (game.status === GameStatus.FINAL) return 100;
    if (game.status !== GameStatus.LIVE) return 0;

    const [minutes, seconds] = game.timeRemaining.split(':').map(Number);
    const totalSecondsRemaining = minutes * 60 + seconds;
    const quarterSeconds = 15 * 60;
    const gameSeconds = 4 * quarterSeconds;
    
    const elapsedSeconds = ((game.quarter - 1) * quarterSeconds) + (quarterSeconds - totalSecondsRemaining);
    
    return Math.min(100, (elapsedSeconds / gameSeconds) * 100);
  })() : 0;

  const statusText = game ? (() => {
    switch (game.status) {
      case GameStatus.SCHEDULED:
        return 'Scheduled';
      case GameStatus.LIVE:
        return `Q${game.quarter} ${game.timeRemaining}`;
      case GameStatus.HALFTIME:
        return 'Halftime';
      case GameStatus.FINAL:
        return 'Final';
      case GameStatus.POSTPONED:
        return 'Postponed';
      case GameStatus.CANCELLED:
        return 'Cancelled';
      default:
        return 'Unknown';
    }
  })() : '';

  const scoreLeader: 'home' | 'away' | 'tie' = game ? (() => {
    if (game.homeScore > game.awayScore) return 'home';
    if (game.awayScore > game.homeScore) return 'away';
    return 'tie';
  })() : 'tie';

  return {
    game,
    isLive,
    progress,
    statusText,
    scoreLeader,
    timeSinceLastUpdate,
    refreshGame,
  };
};

// ===== LIVE SCORE TICKER HOOK =====

export interface UseLiveScoreTickerOptions {
  maxGames?: number;
  sortBy?: 'time' | 'score' | 'status';
  filterStatus?: GameStatus[];
}

export interface UseLiveScoreTickerReturn {
  tickerGames: Game[];
  currentIndex: number;
  nextGame: () => void;
  previousGame: () => void;
  goToGame: (index: number) => void;
  autoAdvance: boolean;
  setAutoAdvance: (enabled: boolean) => void;
}

export const useLiveScoreTicker = (options: UseLiveScoreTickerOptions = {}): UseLiveScoreTickerReturn => {
  const { 
    maxGames = 10, 
    sortBy = 'status',
    filterStatus = [GameStatus.LIVE, GameStatus.FINAL]
  } = options;
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoAdvance, setAutoAdvance] = useState(true);
  
  const { games } = useLiveGames();

  // Filter and sort games for ticker
  const tickerGames = games
    .filter(game => filterStatus.includes(game.status))
    .sort((a, b) => {
      switch (sortBy) {
        case 'time':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'score':
          const aTotalScore = a.homeScore + a.awayScore;
          const bTotalScore = b.homeScore + b.awayScore;
          return bTotalScore - aTotalScore;
        case 'status':
        default:
          // Live games first, then by start time
          if (a.status === GameStatus.LIVE && b.status !== GameStatus.LIVE) return -1;
          if (b.status === GameStatus.LIVE && a.status !== GameStatus.LIVE) return 1;
          return new Date(a.date).getTime() - new Date(b.date).getTime();
      }
    })
    .slice(0, maxGames);

  const nextGame = useCallback(() => {
    setCurrentIndex(prev => (prev + 1) % Math.max(1, tickerGames.length));
  }, [tickerGames.length]);

  const previousGame = useCallback(() => {
    setCurrentIndex(prev => (prev - 1 + tickerGames.length) % Math.max(1, tickerGames.length));
  }, [tickerGames.length]);

  const goToGame = useCallback((index: number) => {
    if (index >= 0 && index < tickerGames.length) {
      setCurrentIndex(index);
    }
  }, [tickerGames.length]);

  // Auto-advance ticker
  useEffect(() => {
    if (autoAdvance && tickerGames.length > 1) {
      const interval = setInterval(nextGame, 5000); // Advance every 5 seconds
      return () => clearInterval(interval);
    }
  }, [autoAdvance, nextGame, tickerGames.length]);

  // Reset index if games change
  useEffect(() => {
    if (currentIndex >= tickerGames.length && tickerGames.length > 0) {
      setCurrentIndex(0);
    }
  }, [tickerGames.length, currentIndex]);

  return {
    tickerGames,
    currentIndex,
    nextGame,
    previousGame,
    goToGame,
    autoAdvance,
    setAutoAdvance,
  };
};