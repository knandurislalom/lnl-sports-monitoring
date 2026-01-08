import { Game, LiveGame, CompletedGame, ScheduledGame, SportType } from '@core-types/game.types';
import { Team } from '@core-types/team.types';

// ===== DATE & TIME TRANSFORMATIONS =====

/**
 * Format a date for display in various contexts
 */
export const formatDisplayDate = (date: Date, format: 'short' | 'long' | 'relative' = 'short'): string => {
  switch (format) {
    case 'long':
      return new Intl.DateTimeFormat('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(date);
    case 'relative':
      return formatRelativeTime(date);
    case 'short':
    default:
      return new Intl.DateTimeFormat('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      }).format(date);
  }
};

/**
 * Format time for game display
 */
export const formatGameDisplayTime = (date: Date, includeTimezone: boolean = false): string => {
  const options: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: '2-digit',
  };
  
  if (includeTimezone) {
    options.timeZoneName = 'short';
  }
  
  return new Intl.DateTimeFormat('en-US', options).format(date);
};

/**
 * Format relative time (e.g., "2 hours ago", "in 3 days")
 */
export const formatRelativeTime = (date: Date): string => {
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const absDiffMs = Math.abs(diffMs);
  
  const minute = 1000 * 60;
  const hour = minute * 60;
  const day = hour * 24;
  const week = day * 7;
  const month = day * 30;
  const year = day * 365;
  
  const isPast = diffMs < 0;
  const suffix = isPast ? 'ago' : 'from now';
  
  if (absDiffMs < minute) return 'just now';
  if (absDiffMs < hour) return `${Math.floor(absDiffMs / minute)} min ${isPast ? 'ago' : 'from now'}`;
  if (absDiffMs < day) return `${Math.floor(absDiffMs / hour)} hr ${suffix}`;
  if (absDiffMs < week) return `${Math.floor(absDiffMs / day)} day${Math.floor(absDiffMs / day) !== 1 ? 's' : ''} ${suffix}`;
  if (absDiffMs < month) return `${Math.floor(absDiffMs / week)} week${Math.floor(absDiffMs / week) !== 1 ? 's' : ''} ${suffix}`;
  if (absDiffMs < year) return `${Math.floor(absDiffMs / month)} month${Math.floor(absDiffMs / month) !== 1 ? 's' : ''} ${suffix}`;
  
  return `${Math.floor(absDiffMs / year)} year${Math.floor(absDiffMs / year) !== 1 ? 's' : ''} ${suffix}`;
};

/**
 * Check if a date is today
 */
export const isToday = (date: Date): boolean => {
  const today = new Date();
  return date.toDateString() === today.toDateString();
};

/**
 * Check if a date is tomorrow
 */
export const isTomorrow = (date: Date): boolean => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return date.toDateString() === tomorrow.toDateString();
};

/**
 * Check if a date is yesterday
 */
export const isYesterday = (date: Date): boolean => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return date.toDateString() === yesterday.toDateString();
};

// ===== GAME DATA TRANSFORMATIONS =====

/**
 * Transform raw game data to ensure consistent structure
 */
export const normalizeGameData = (rawGame: any): Game => {
  // Ensure consistent date handling
  const startTime = rawGame.startTime instanceof Date ? rawGame.startTime : new Date(rawGame.startTime);
  
  // Normalize team data
  const homeTeam = normalizeTeamData(rawGame.homeTeam);
  const awayTeam = normalizeTeamData(rawGame.awayTeam);
  
  // Base game structure
  const baseGame = {
    id: rawGame.id || `game-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    homeTeam,
    awayTeam,
    startTime,
    sport: rawGame.sport || 'nfl' as SportType,
    league: rawGame.league || rawGame.sport?.toUpperCase() || 'NFL',
    venue: rawGame.venue || `${homeTeam.city} Stadium`,
    season: rawGame.season || new Date().getFullYear(),
    week: rawGame.week,
    status: rawGame.status || 'scheduled',
  };
  
  // Add status-specific properties
  switch (rawGame.status) {
    case 'live':
      return {
        ...baseGame,
        status: 'live',
        homeTeam: { ...homeTeam, score: rawGame.homeTeam?.score || 0 },
        awayTeam: { ...awayTeam, score: rawGame.awayTeam?.score || 0 },
        clock: rawGame.clock || { quarter: 1, timeRemaining: '15:00' },
        possession: rawGame.possession,
      } as LiveGame;
      
    case 'completed':
    case 'final':
      return {
        ...baseGame,
        status: 'completed',
        finalScore: {
          home: rawGame.finalScore?.home || rawGame.homeTeam?.score || 0,
          away: rawGame.finalScore?.away || rawGame.awayTeam?.score || 0,
        },
        stats: rawGame.stats || {},
        highlights: rawGame.highlights || [],
      } as CompletedGame;
      
    default:
      return {
        ...baseGame,
        status: 'scheduled',
        broadcast: rawGame.broadcast,
        weather: rawGame.weather,
      } as ScheduledGame;
  }
};

/**
 * Transform raw team data to ensure consistent structure
 */
export const normalizeTeamData = (rawTeam: any): Team => {
  if (!rawTeam) {
    throw new Error('Team data is required');
  }
  
  return {
    id: rawTeam.id || rawTeam.abbreviation || 'unknown',
    name: rawTeam.name || 'Unknown Team',
    abbreviation: rawTeam.abbreviation || rawTeam.name?.substring(0, 3).toUpperCase() || 'UNK',
    city: rawTeam.city || 'Unknown City',
    colors: rawTeam.colors || {
      primary: '#013369', // Default NFL blue
      secondary: '#A5ACAF', // Default NFL silver
    },
    logo: rawTeam.logo || null,
    conference: rawTeam.conference,
    division: rawTeam.division,
    record: rawTeam.record,
    ranking: rawTeam.ranking,
    score: rawTeam.score,
  };
};

// ===== SCORE & STATISTICS TRANSFORMATIONS =====

/**
 * Calculate score difference
 */
export const calculateScoreDifference = (game: CompletedGame | LiveGame): number => {
  if ('finalScore' in game) {
    return Math.abs(game.finalScore.home - game.finalScore.away);
  }
  if (game.homeTeam.score !== undefined && game.awayTeam.score !== undefined) {
    return Math.abs(game.homeTeam.score - game.awayTeam.score);
  }
  return 0;
};

/**
 * Determine if a game is a blowout (score difference > threshold)
 */
export const isBlowout = (game: CompletedGame | LiveGame, threshold: number = 21): boolean => {
  return calculateScoreDifference(game) > threshold;
};

/**
 * Calculate team win percentage from record
 */
export const calculateWinPercentage = (wins: number, losses: number, ties: number = 0): number => {
  const totalGames = wins + losses + ties;
  if (totalGames === 0) return 0;
  return Math.round(((wins + (ties * 0.5)) / totalGames) * 1000) / 10; // Return percentage with 1 decimal
};

/**
 * Format win percentage for display
 */
export const formatWinPercentage = (percentage: number): string => {
  return `${percentage.toFixed(1)}%`;
};

/**
 * Format team record for display
 */
export const formatTeamRecord = (wins: number, losses: number, ties: number = 0): string => {
  return ties > 0 ? `${wins}-${losses}-${ties}` : `${wins}-${losses}`;
};

// ===== FILTERING & SORTING TRANSFORMATIONS =====

/**
 * Filter games by date range
 */
export const filterGamesByDateRange = (
  games: Game[], 
  startDate: Date, 
  endDate: Date
): Game[] => {
  return games.filter(game => {
    const gameDate = new Date(game.startTime);
    return gameDate >= startDate && gameDate <= endDate;
  });
};

/**
 * Filter games by status
 */
export const filterGamesByStatus = (
  games: Game[], 
  statuses: Game['status'][]
): Game[] => {
  return games.filter(game => statuses.includes(game.status));
};

/**
 * Sort games by multiple criteria
 */
export const sortGamesBy = (
  games: Game[], 
  criteria: ('date' | 'score-diff' | 'importance')[] = ['date']
): Game[] => {
  return [...games].sort((a, b) => {
    for (const criterion of criteria) {
      let comparison = 0;
      
      switch (criterion) {
        case 'date':
          comparison = a.startTime.getTime() - b.startTime.getTime();
          break;
        case 'score-diff':
          const aDiff = (a.status === 'completed' || a.status === 'live') 
            ? calculateScoreDifference(a as CompletedGame | LiveGame) 
            : 0;
          const bDiff = (b.status === 'completed' || b.status === 'live') 
            ? calculateScoreDifference(b as CompletedGame | LiveGame) 
            : 0;
          comparison = bDiff - aDiff; // Descending (higher diff first)
          break;
        case 'importance':
          // Prioritize: live > today's games > future games > completed games
          const getImportanceScore = (game: Game): number => {
            if (game.status === 'live') return 4;
            if (isToday(game.startTime)) return 3;
            if (game.startTime > new Date()) return 2;
            return 1;
          };
          comparison = getImportanceScore(b) - getImportanceScore(a);
          break;
      }
      
      if (comparison !== 0) return comparison;
    }
    return 0;
  });
};

// ===== DATA GROUPING TRANSFORMATIONS =====

/**
 * Group games by sport
 */
export const groupGamesBySport = (games: Game[]): Record<SportType, Game[]> => {
  return games.reduce((groups, game) => {
    if (!groups[game.sport]) {
      groups[game.sport] = [];
    }
    groups[game.sport].push(game);
    return groups;
  }, {} as Record<SportType, Game[]>);
};

/**
 * Group games by status
 */
export const groupGamesByStatus = (games: Game[]): Record<Game['status'], Game[]> => {
  return games.reduce((groups, game) => {
    if (!groups[game.status]) {
      groups[game.status] = [];
    }
    groups[game.status].push(game);
    return groups;
  }, {} as Record<Game['status'], Game[]>);
};

/**
 * Group games by date with friendly labels
 */
export const groupGamesByDateWithLabels = (games: Game[]): { date: string; label: string; games: Game[] }[] => {
  const groups = games.reduce((acc, game) => {
    const dateKey = game.startTime.toDateString();
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(game);
    return acc;
  }, {} as Record<string, Game[]>);

  return Object.entries(groups)
    .map(([dateString, games]) => {
      const date = new Date(dateString);
      let label = formatDisplayDate(date, 'short');
      
      if (isToday(date)) label = 'Today';
      else if (isTomorrow(date)) label = 'Tomorrow';
      else if (isYesterday(date)) label = 'Yesterday';
      
      return {
        date: dateString,
        label,
        games: sortGamesBy(games, ['date']),
      };
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

// ===== UTILITY TRANSFORMATIONS =====

/**
 * Extract unique teams from a list of games
 */
export const extractUniqueTeams = (games: Game[]): Team[] => {
  const teamMap = new Map<string, Team>();
  
  games.forEach(game => {
    teamMap.set(game.homeTeam.id, game.homeTeam);
    teamMap.set(game.awayTeam.id, game.awayTeam);
  });
  
  return Array.from(teamMap.values()).sort((a, b) => a.name.localeCompare(b.name));
};

/**
 * Extract unique sports from a list of games
 */
export const extractUniqueSports = (games: Game[]): SportType[] => {
  const sports = new Set(games.map(game => game.sport));
  return Array.from(sports).sort();
};

/**
 * Convert game data to search-friendly format
 */
export const createGameSearchIndex = (game: Game): string => {
  return [
    game.homeTeam.name,
    game.homeTeam.abbreviation,
    game.homeTeam.city,
    game.awayTeam.name,
    game.awayTeam.abbreviation,
    game.awayTeam.city,
    game.sport,
    game.league,
    game.venue,
    game.status,
  ].filter(Boolean).join(' ').toLowerCase();
};

/**
 * Search games by text query
 */
export const searchGames = (games: Game[], query: string): Game[] => {
  if (!query.trim()) return games;
  
  const searchTerm = query.toLowerCase();
  return games.filter(game => 
    createGameSearchIndex(game).includes(searchTerm)
  );
};

// ===== VALIDATION HELPERS =====

/**
 * Validate game data structure
 */
export const validateGameData = (data: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!data.id) errors.push('Game ID is required');
  if (!data.homeTeam) errors.push('Home team is required');
  if (!data.awayTeam) errors.push('Away team is required');
  if (!data.startTime) errors.push('Start time is required');
  if (!data.sport) errors.push('Sport is required');
  
  // Validate start time
  if (data.startTime && isNaN(new Date(data.startTime).getTime())) {
    errors.push('Invalid start time format');
  }
  
  // Validate team data
  if (data.homeTeam && !data.homeTeam.name) errors.push('Home team name is required');
  if (data.awayTeam && !data.awayTeam.name) errors.push('Away team name is required');
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Clean and sanitize game data
 */
export const sanitizeGameData = (data: any): any => {
  return {
    ...data,
    // Trim string fields
    id: typeof data.id === 'string' ? data.id.trim() : data.id,
    venue: typeof data.venue === 'string' ? data.venue.trim() : data.venue,
    league: typeof data.league === 'string' ? data.league.trim() : data.league,
    // Sanitize team data
    homeTeam: data.homeTeam ? {
      ...data.homeTeam,
      name: data.homeTeam.name?.trim(),
      city: data.homeTeam.city?.trim(),
      abbreviation: data.homeTeam.abbreviation?.trim()?.toUpperCase(),
    } : data.homeTeam,
    awayTeam: data.awayTeam ? {
      ...data.awayTeam,
      name: data.awayTeam.name?.trim(),
      city: data.awayTeam.city?.trim(),
      abbreviation: data.awayTeam.abbreviation?.trim()?.toUpperCase(),
    } : data.awayTeam,
  };
};