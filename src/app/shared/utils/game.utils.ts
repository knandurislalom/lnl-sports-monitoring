import { Game, LiveGame, CompletedGame, ScheduledGame, SportType } from '@core-types/game.types';

export const formatGameTime = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short',
  }).format(date);
};

export const formatScore = (score: number): string => {
  return score.toString();
};

export const formatTimeRemaining = (timeRemaining?: string): string => {
  if (!timeRemaining) return '';
  return timeRemaining;
};

export const getGameStatusDisplay = (game: Game): string => {
  switch (game.status) {
    case 'live':
      const liveGame = game as LiveGame;
      if (liveGame.clock?.quarter) {
        return `Q${liveGame.clock.quarter} ${liveGame.clock.timeRemaining || ''}`.trim();
      }
      if (liveGame.clock?.period) {
        return `P${liveGame.clock.period} ${liveGame.clock.timeRemaining || ''}`.trim();
      }
      if (liveGame.clock?.inning) {
        return `${liveGame.clock.inning}${getInningHalf()} ${liveGame.clock.timeRemaining || ''}`.trim();
      }
      return 'LIVE';
    case 'halftime':
      return 'HALFTIME';
    case 'final':
      return 'FINAL';
    case 'scheduled':
      return formatGameTime(game.startTime);
    case 'postponed':
      return 'POSTPONED';
    case 'cancelled':
      return 'CANCELLED';
    default:
      return game.status.toUpperCase();
  }
};

const getInningHalf = (): string => {
  return Math.random() > 0.5 ? 'T' : 'B'; // Top or Bottom
};

export const getSportDisplayName = (sport: SportType): string => {
  const sportNames = {
    nfl: 'NFL',
    nba: 'NBA',
    mlb: 'MLB',
    nhl: 'NHL',
  };
  return sportNames[sport] || sport.toUpperCase();
};

export const getWinningTeam = (game: CompletedGame): 'home' | 'away' | 'tie' => {
  const { home, away } = game.finalScore;
  if (home > away) return 'home';
  if (away > home) return 'away';
  return 'tie';
};

export const calculateTimeSince = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
};

export const calculateTimeUntil = (date: Date): string => {
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMs < 0) return 'Started';
  if (diffMins < 60) return `${diffMins}m`;
  if (diffHours < 24) return `${diffHours}h`;
  return `${diffDays}d`;
};

export const groupGamesByDate = (games: Game[]): Record<string, Game[]> => {
  return games.reduce((groups, game) => {
    const dateKey = game.startTime.toDateString();
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(game);
    return groups;
  }, {} as Record<string, Game[]>);
};

export const sortGamesByTime = (games: Game[]): Game[] => {
  return [...games].sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
};

export const filterGamesBySport = (games: Game[], sport?: SportType): Game[] => {
  if (!sport) return games;
  return games.filter(game => game.sport === sport);
};

export const filterGamesByTeam = (games: Game[], teamId?: string): Game[] => {
  if (!teamId) return games;
  return games.filter(
    game => game.homeTeam.id === teamId || game.awayTeam.id === teamId
  );
};