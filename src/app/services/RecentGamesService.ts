import { Game, GameStatus } from '../types/Game';
import { Team } from '../types/Team';
import { addDays, subDays, startOfDay, endOfDay, isAfter, isBefore } from 'date-fns';

// ===== EXTENDED MOCK TEAM DATA =====
const mockTeams = {
  dal: { 
    id: 'dal', 
    name: 'Dallas Cowboys', 
    shortName: 'DAL', 
    abbreviation: 'DAL',
    logo: 'https://via.placeholder.com/64x64/003594/ffffff?text=DAL', 
    colors: { primary: '#003594', secondary: '#041E42' },
    conference: 'NFC',
    division: 'East'
  },
  phi: { 
    id: 'phi', 
    name: 'Philadelphia Eagles', 
    shortName: 'PHI', 
    abbreviation: 'PHI',
    logo: 'https://via.placeholder.com/64x64/004C54/ffffff?text=PHI', 
    colors: { primary: '#004C54', secondary: '#A5ACAF' },
    conference: 'NFC',
    division: 'East'
  },
  nyg: { 
    id: 'nyg', 
    name: 'New York Giants', 
    shortName: 'NYG', 
    abbreviation: 'NYG',
    logo: 'https://via.placeholder.com/64x64/0B2265/ffffff?text=NYG', 
    colors: { primary: '#0B2265', secondary: '#A71930' },
    conference: 'NFC',
    division: 'East'
  },
  was: { 
    id: 'was', 
    name: 'Washington Commanders', 
    shortName: 'WAS', 
    abbreviation: 'WAS',
    logo: 'https://via.placeholder.com/64x64/5A1414/ffffff?text=WAS', 
    colors: { primary: '#5A1414', secondary: '#FFB612' },
    conference: 'NFC',
    division: 'East'
  },
  buf: { 
    id: 'buf', 
    name: 'Buffalo Bills', 
    shortName: 'BUF', 
    abbreviation: 'BUF',
    logo: 'https://via.placeholder.com/64x64/00338D/ffffff?text=BUF', 
    colors: { primary: '#00338D', secondary: '#C60C30' },
    conference: 'AFC',
    division: 'East'
  },
  mia: { 
    id: 'mia', 
    name: 'Miami Dolphins', 
    shortName: 'MIA', 
    abbreviation: 'MIA',
    logo: 'https://via.placeholder.com/64x64/008E97/ffffff?text=MIA', 
    colors: { primary: '#008E97', secondary: '#FC4C02' },
    conference: 'AFC',
    division: 'East'
  },
  ne: { 
    id: 'ne', 
    name: 'New England Patriots', 
    shortName: 'NE', 
    abbreviation: 'NE',
    logo: 'https://via.placeholder.com/64x64/002244/ffffff?text=NE', 
    colors: { primary: '#002244', secondary: '#C60C30' },
    conference: 'AFC',
    division: 'East'
  },
  nyj: { 
    id: 'nyj', 
    name: 'New York Jets', 
    shortName: 'NYJ', 
    abbreviation: 'NYJ',
    logo: 'https://via.placeholder.com/64x64/125740/ffffff?text=NYJ', 
    colors: { primary: '#125740', secondary: '#000000' },
    conference: 'AFC',
    division: 'East'
  },
  kc: { 
    id: 'kc', 
    name: 'Kansas City Chiefs', 
    shortName: 'KC', 
    abbreviation: 'KC',
    logo: 'https://via.placeholder.com/64x64/E31837/ffffff?text=KC', 
    colors: { primary: '#E31837', secondary: '#FFB81C' },
    conference: 'AFC',
    division: 'West'
  },
  den: { 
    id: 'den', 
    name: 'Denver Broncos', 
    shortName: 'DEN', 
    abbreviation: 'DEN',
    logo: 'https://via.placeholder.com/64x64/FB4F14/ffffff?text=DEN', 
    colors: { primary: '#FB4F14', secondary: '#002244' },
    conference: 'AFC',
    division: 'West'
  },
  lv: { 
    id: 'lv', 
    name: 'Las Vegas Raiders', 
    shortName: 'LV', 
    abbreviation: 'LV',
    logo: 'https://via.placeholder.com/64x64/000000/ffffff?text=LV', 
    colors: { primary: '#000000', secondary: '#A5ACAF' },
    conference: 'AFC',
    division: 'West'
  },
  lac: { 
    id: 'lac', 
    name: 'Los Angeles Chargers', 
    shortName: 'LAC', 
    abbreviation: 'LAC',
    logo: 'https://via.placeholder.com/64x64/0080C6/ffffff?text=LAC', 
    colors: { primary: '#0080C6', secondary: '#FFC20E' },
    conference: 'AFC',
    division: 'West'
  },
};

// ===== RECENT GAMES SERVICE =====

export interface RecentGamesFilter {
  dateRange?: {
    start: Date;
    end: Date;
  };
  teams?: string[];
  conferences?: string[];
  divisions?: string[];
  minScore?: number;
  maxScore?: number;
  sortBy?: 'date' | 'score' | 'margin' | 'team';
  sortOrder?: 'asc' | 'desc';
}

export interface GameStatistics {
  totalYards: number;
  passingYards: number;
  rushingYards: number;
  turnovers: number;
  penalties: number;
  penaltyYards: number;
  timeOfPossession: string;
  thirdDownConversions: string;
  redZoneEfficiency: string;
}

export interface DetailedGameResult extends Game {
  finalScore: {
    home: number;
    away: number;
  };
  quarterScores: {
    quarter1: { home: number; away: number };
    quarter2: { home: number; away: number };
    quarter3: { home: number; away: number };
    quarter4: { home: number; away: number };
    overtime?: { home: number; away: number };
  };
  gameStats: {
    home: GameStatistics;
    away: GameStatistics;
  };
  keyPlays: Array<{
    quarter: number;
    time: string;
    description: string;
    team: 'home' | 'away';
    type: 'touchdown' | 'field_goal' | 'safety' | 'interception' | 'fumble' | 'other';
  }>;
  attendance?: number;
  gameDuration: string;
}

export class RecentGamesService {
  private recentGames: DetailedGameResult[] = [];
  private subscribers: Set<(games: DetailedGameResult[]) => void> = new Set();

  constructor() {
    this.initializeMockRecentGames();
  }

  private initializeMockRecentGames(): void {
    const now = new Date();
    const teams = Object.values(mockTeams);
    
    // Generate 12 recent games from the last 3 days
    const recentGames: DetailedGameResult[] = [];
    
    for (let i = 0; i < 12; i++) {
      const daysAgo = Math.floor(i / 4); // 4 games per day for last 3 days
      const gameDate = subDays(now, daysAgo);
      
      // Set specific game times throughout the day
      const gameHours = [13, 16, 20, 23]; // 1pm, 4pm, 8pm, 11pm games
      const gameHour = gameHours[i % 4];
      gameDate.setHours(gameHour, Math.floor(Math.random() * 60), 0, 0);

      const homeTeamIndex = (i * 2) % teams.length;
      const awayTeamIndex = (i * 2 + 1) % teams.length;
      
      const homeScore = Math.floor(Math.random() * 28) + 14; // 14-42 points
      const awayScore = Math.floor(Math.random() * 28) + 14;
      
      // Generate quarter scores
      const homeQ1 = Math.floor(Math.random() * 14);
      const homeQ2 = Math.floor(Math.random() * 14);
      const homeQ3 = Math.floor(Math.random() * 14);
      const homeQ4 = homeScore - homeQ1 - homeQ2 - homeQ3;
      
      const awayQ1 = Math.floor(Math.random() * 14);
      const awayQ2 = Math.floor(Math.random() * 14);
      const awayQ3 = Math.floor(Math.random() * 14);
      const awayQ4 = awayScore - awayQ1 - awayQ2 - awayQ3;

      const homeStats: GameStatistics = {
        totalYards: Math.floor(Math.random() * 200) + 300,
        passingYards: Math.floor(Math.random() * 150) + 200,
        rushingYards: Math.floor(Math.random() * 100) + 100,
        turnovers: Math.floor(Math.random() * 4),
        penalties: Math.floor(Math.random() * 8) + 4,
        penaltyYards: Math.floor(Math.random() * 80) + 40,
        timeOfPossession: `${Math.floor(Math.random() * 10) + 25}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
        thirdDownConversions: `${Math.floor(Math.random() * 8) + 4}/${Math.floor(Math.random() * 6) + 10}`,
        redZoneEfficiency: `${Math.floor(Math.random() * 4) + 2}/${Math.floor(Math.random() * 2) + 4}`,
      };

      const awayStats: GameStatistics = {
        totalYards: Math.floor(Math.random() * 200) + 300,
        passingYards: Math.floor(Math.random() * 150) + 200,
        rushingYards: Math.floor(Math.random() * 100) + 100,
        turnovers: Math.floor(Math.random() * 4),
        penalties: Math.floor(Math.random() * 8) + 4,
        penaltyYards: Math.floor(Math.random() * 80) + 40,
        timeOfPossession: `${Math.floor(Math.random() * 10) + 25}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
        thirdDownConversions: `${Math.floor(Math.random() * 8) + 4}/${Math.floor(Math.random() * 6) + 10}`,
        redZoneEfficiency: `${Math.floor(Math.random() * 4) + 2}/${Math.floor(Math.random() * 2) + 4}`,
      };

      // Generate key plays
      const keyPlays = [
        {
          quarter: 1,
          time: '12:34',
          description: `${teams[awayTeamIndex].shortName} - 15 yard touchdown pass`,
          team: 'away' as const,
          type: 'touchdown' as const,
        },
        {
          quarter: 2,
          time: '8:21',
          description: `${teams[homeTeamIndex].shortName} - 32 yard field goal`,
          team: 'home' as const,
          type: 'field_goal' as const,
        },
        {
          quarter: 3,
          time: '5:45',
          description: `${teams[homeTeamIndex].shortName} - 2 yard rushing touchdown`,
          team: 'home' as const,
          type: 'touchdown' as const,
        },
        {
          quarter: 4,
          time: '2:18',
          description: `${teams[awayTeamIndex].shortName} - Interception returned for touchdown`,
          team: 'away' as const,
          type: 'interception' as const,
        },
      ];

      const game: DetailedGameResult = {
        id: `recent-${i + 1}`,
        homeTeam: teams[homeTeamIndex],
        awayTeam: teams[awayTeamIndex],
        homeScore,
        awayScore,
        status: GameStatus.FINAL,
        quarter: 4,
        timeRemaining: 'FINAL',
        date: gameDate,
        venue: `${teams[homeTeamIndex].name} Stadium`,
        broadcast: ['CBS', 'FOX', 'NBC', 'ESPN', 'Amazon Prime'][Math.floor(Math.random() * 5)],
        weather: {
          temperature: Math.floor(Math.random() * 40) + 30,
          condition: ['Clear', 'Cloudy', 'Light Rain', 'Snow'][Math.floor(Math.random() * 4)],
        },
        finalScore: {
          home: homeScore,
          away: awayScore,
        },
        quarterScores: {
          quarter1: { home: homeQ1, away: awayQ1 },
          quarter2: { home: homeQ2, away: awayQ2 },
          quarter3: { home: homeQ3, away: awayQ3 },
          quarter4: { home: homeQ4, away: awayQ4 },
        },
        gameStats: {
          home: homeStats,
          away: awayStats,
        },
        keyPlays,
        attendance: Math.floor(Math.random() * 20000) + 60000,
        gameDuration: `3:${Math.floor(Math.random() * 30) + 15}`,
      };

      recentGames.push(game);
    }

    // Sort by date (most recent first)
    this.recentGames = recentGames.sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  public getRecentGames(filter?: RecentGamesFilter): DetailedGameResult[] {
    let filteredGames = [...this.recentGames];

    if (filter) {
      // Date range filter
      if (filter.dateRange) {
        filteredGames = filteredGames.filter(game => 
          isAfter(game.date, filter.dateRange!.start) && 
          isBefore(game.date, filter.dateRange!.end)
        );
      }

      // Team filter
      if (filter.teams && filter.teams.length > 0) {
        filteredGames = filteredGames.filter(game =>
          filter.teams!.includes(game.homeTeam.id) || 
          filter.teams!.includes(game.awayTeam.id)
        );
      }

      // Conference filter
      if (filter.conferences && filter.conferences.length > 0) {
        filteredGames = filteredGames.filter(game =>
          filter.conferences!.includes(game.homeTeam.conference) || 
          filter.conferences!.includes(game.awayTeam.conference)
        );
      }

      // Division filter
      if (filter.divisions && filter.divisions.length > 0) {
        filteredGames = filteredGames.filter(game =>
          filter.divisions!.includes(game.homeTeam.division) || 
          filter.divisions!.includes(game.awayTeam.division)
        );
      }

      // Score filters
      if (filter.minScore !== undefined) {
        filteredGames = filteredGames.filter(game =>
          Math.max(game.homeScore, game.awayScore) >= filter.minScore!
        );
      }

      if (filter.maxScore !== undefined) {
        filteredGames = filteredGames.filter(game =>
          Math.min(game.homeScore, game.awayScore) <= filter.maxScore!
        );
      }

      // Sorting
      if (filter.sortBy) {
        filteredGames.sort((a, b) => {
          let comparison = 0;
          
          switch (filter.sortBy) {
            case 'date':
              comparison = a.date.getTime() - b.date.getTime();
              break;
            case 'score':
              const aTotalScore = a.homeScore + a.awayScore;
              const bTotalScore = b.homeScore + b.awayScore;
              comparison = aTotalScore - bTotalScore;
              break;
            case 'margin':
              const aMargin = Math.abs(a.homeScore - a.awayScore);
              const bMargin = Math.abs(b.homeScore - b.awayScore);
              comparison = aMargin - bMargin;
              break;
            case 'team':
              comparison = a.homeTeam.name.localeCompare(b.homeTeam.name);
              break;
          }

          return filter.sortOrder === 'desc' ? -comparison : comparison;
        });
      }
    }

    return filteredGames;
  }

  public getLast24Hours(): DetailedGameResult[] {
    const now = new Date();
    const yesterday = subDays(now, 1);
    
    return this.getRecentGames({
      dateRange: {
        start: yesterday,
        end: now,
      },
      sortBy: 'date',
      sortOrder: 'desc',
    });
  }

  public getLastWeek(): DetailedGameResult[] {
    const now = new Date();
    const lastWeek = subDays(now, 7);
    
    return this.getRecentGames({
      dateRange: {
        start: lastWeek,
        end: now,
      },
      sortBy: 'date',
      sortOrder: 'desc',
    });
  }

  public getGameById(gameId: string): DetailedGameResult | undefined {
    return this.recentGames.find(game => game.id === gameId);
  }

  public getGamesByTeam(teamId: string): DetailedGameResult[] {
    return this.recentGames.filter(game =>
      game.homeTeam.id === teamId || game.awayTeam.id === teamId
    );
  }

  public getGamesByConference(conference: string): DetailedGameResult[] {
    return this.recentGames.filter(game =>
      game.homeTeam.conference === conference || game.awayTeam.conference === conference
    );
  }

  public subscribe(callback: (games: DetailedGameResult[]) => void): () => void {
    this.subscribers.add(callback);
    
    // Immediately call with current games
    callback([...this.recentGames]);
    
    return () => {
      this.subscribers.delete(callback);
    };
  }

  private notifySubscribers(): void {
    const games = [...this.recentGames];
    this.subscribers.forEach(callback => {
      try {
        callback(games);
      } catch (error) {
        console.error('Error notifying recent games subscriber:', error);
      }
    });
  }

  public refreshGames(): void {
    this.initializeMockRecentGames();
    this.notifySubscribers();
  }

  public addGame(game: DetailedGameResult): void {
    this.recentGames.unshift(game); // Add to beginning (most recent)
    this.notifySubscribers();
  }

  // Utility functions
  public getHighScoringGames(minTotalScore: number = 50): DetailedGameResult[] {
    return this.recentGames.filter(game => 
      (game.homeScore + game.awayScore) >= minTotalScore
    );
  }

  public getCloseGames(maxMargin: number = 7): DetailedGameResult[] {
    return this.recentGames.filter(game =>
      Math.abs(game.homeScore - game.awayScore) <= maxMargin
    );
  }

  public getBlowoutGames(minMargin: number = 21): DetailedGameResult[] {
    return this.recentGames.filter(game =>
      Math.abs(game.homeScore - game.awayScore) >= minMargin
    );
  }

  public getGameStatsSummary(): {
    totalGames: number;
    averageScore: number;
    highestScoringGame: DetailedGameResult;
    lowestScoringGame: DetailedGameResult;
    closestGame: DetailedGameResult;
    biggestBlowout: DetailedGameResult;
  } {
    if (this.recentGames.length === 0) {
      throw new Error('No recent games available');
    }

    const totalGames = this.recentGames.length;
    const totalPoints = this.recentGames.reduce((sum, game) => sum + game.homeScore + game.awayScore, 0);
    const averageScore = totalPoints / totalGames;

    const highestScoringGame = this.recentGames.reduce((highest, game) =>
      (game.homeScore + game.awayScore) > (highest.homeScore + highest.awayScore) ? game : highest
    );

    const lowestScoringGame = this.recentGames.reduce((lowest, game) =>
      (game.homeScore + game.awayScore) < (lowest.homeScore + lowest.awayScore) ? game : lowest
    );

    const closestGame = this.recentGames.reduce((closest, game) => {
      const gameMargin = Math.abs(game.homeScore - game.awayScore);
      const closestMargin = Math.abs(closest.homeScore - closest.awayScore);
      return gameMargin < closestMargin ? game : closest;
    });

    const biggestBlowout = this.recentGames.reduce((biggest, game) => {
      const gameMargin = Math.abs(game.homeScore - game.awayScore);
      const biggestMargin = Math.abs(biggest.homeScore - biggest.awayScore);
      return gameMargin > biggestMargin ? game : biggest;
    });

    return {
      totalGames,
      averageScore,
      highestScoringGame,
      lowestScoringGame,
      closestGame,
      biggestBlowout,
    };
  }
}

// ===== SINGLETON INSTANCE =====
export const recentGamesService = new RecentGamesService();

// ===== UTILITY FUNCTIONS =====

export const getWinningTeam = (game: DetailedGameResult): Team => {
  return game.homeScore > game.awayScore ? game.homeTeam : game.awayTeam;
};

export const getLosingTeam = (game: DetailedGameResult): Team => {
  return game.homeScore < game.awayScore ? game.homeTeam : game.awayTeam;
};

export const getScoreMargin = (game: DetailedGameResult): number => {
  return Math.abs(game.homeScore - game.awayScore);
};

export const isCloseGame = (game: DetailedGameResult, margin: number = 7): boolean => {
  return getScoreMargin(game) <= margin;
};

export const isBlowout = (game: DetailedGameResult, margin: number = 21): boolean => {
  return getScoreMargin(game) >= margin;
};

export const getGameSummary = (game: DetailedGameResult): string => {
  const winner = getWinningTeam(game);
  const loser = getLosingTeam(game);
  const margin = getScoreMargin(game);
  
  return `${winner.shortName} defeated ${loser.shortName} ${Math.max(game.homeScore, game.awayScore)}-${Math.min(game.homeScore, game.awayScore)} (${margin} point margin)`;
};