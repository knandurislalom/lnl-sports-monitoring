import { Team } from './team.types';

export type GameStatus = 'scheduled' | 'live' | 'halftime' | 'final' | 'postponed' | 'cancelled';
export type SportType = 'nfl' | 'nba' | 'mlb' | 'nhl';

export interface GameScore {
  home: number;
  away: number;
}

export interface GameClock {
  quarter?: number; // NFL, NBA
  period?: number;  // NHL
  inning?: number;  // MLB
  timeRemaining?: string;
  overtime?: boolean;
}

export interface GameStats {
  home: Record<string, number | string>;
  away: Record<string, number | string>;
}

export interface Game {
  id: string;
  sport: SportType;
  status: GameStatus;
  startTime: Date;
  homeTeam: Team;
  awayTeam: Team;
  score: GameScore;
  clock?: GameClock;
  stats?: GameStats;
  broadcast?: string;
  venue?: string;
  weather?: string;
  attendance?: number;
}

export interface LiveGame extends Game {
  status: 'live' | 'halftime';
  clock: GameClock;
  lastUpdate: Date;
}

export interface CompletedGame extends Game {
  status: 'final';
  finalScore: GameScore;
  stats: GameStats;
  gameLength?: string;
  highlights?: string[];
}

export interface ScheduledGame extends Game {
  status: 'scheduled';
  broadcast?: string;
  ticketUrl?: string;
}