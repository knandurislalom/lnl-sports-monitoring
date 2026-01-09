import { Game, GameStatus } from '../shared/types/game.types';
import { Team } from '../types/Team';
import { addDays, addHours, startOfDay, endOfDay, format, isAfter, isBefore } from '../utils/dateUtils';

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
  sf: { 
    id: 'sf', 
    name: 'San Francisco 49ers', 
    shortName: 'SF', 
    abbreviation: 'SF',
    logo: 'https://via.placeholder.com/64x64/AA0000/ffffff?text=SF', 
    colors: { primary: '#AA0000', secondary: '#B3995D' },
    conference: 'NFC',
    division: 'West'
  },
  sea: { 
    id: 'sea', 
    name: 'Seattle Seahawks', 
    shortName: 'SEA', 
    abbreviation: 'SEA',
    logo: 'https://via.placeholder.com/64x64/002244/ffffff?text=SEA', 
    colors: { primary: '#002244', secondary: '#69BE28' },
    conference: 'NFC',
    division: 'West'
  },
  ari: { 
    id: 'ari', 
    name: 'Arizona Cardinals', 
    shortName: 'ARI', 
    abbreviation: 'ARI',
    logo: 'https://via.placeholder.com/64x64/97233F/ffffff?text=ARI', 
    colors: { primary: '#97233F', secondary: '#000000' },
    conference: 'NFC',
    division: 'West'
  },
  lar: { 
    id: 'lar', 
    name: 'Los Angeles Rams', 
    shortName: 'LAR', 
    abbreviation: 'LAR',
    logo: 'https://via.placeholder.com/64x64/003594/ffffff?text=LAR', 
    colors: { primary: '#003594', secondary: '#FFA300' },
    conference: 'NFC',
    division: 'West'
  },
};

// ===== UPCOMING SCHEDULE SERVICE =====

export interface ScheduleFilter {
  dateRange?: {
    start: Date;
    end: Date;
  };
  teams?: string[];
  conferences?: string[];
  divisions?: string[];
  weekDays?: number[]; // 0 = Sunday, 1 = Monday, etc.
  primetime?: boolean; // Games after 7 PM
  sortBy?: 'date' | 'team' | 'matchup' | 'broadcast';
  sortOrder?: 'asc' | 'desc';
}

export interface UpcomingGame extends Game {
  week: number;
  seasonType: 'preseason' | 'regular' | 'playoffs';
  ticketInfo?: {
    minPrice: number;
    maxPrice: number;
    availability: 'available' | 'limited' | 'sold_out';
    url: string;
  };
  broadcastInfo: {
    network: string;
    announcers: string[];
    streamingAvailable: boolean;
    internationalBroadcasts: string[];
  };
  gameImportance: {
    playoffImplications: boolean;
    divisionRivalry: boolean;
    conference: boolean;
    primetimeGame: boolean;
    nationalAudience: boolean;
  };
  predictions?: {
    spread: number; // Positive means home team favored
    overUnder: number;
    homeWinProbability: number;
  };
  injuries?: {
    home: Array<{
      player: string;
      position: string;
      status: 'out' | 'doubtful' | 'questionable' | 'probable';
      injury: string;
    }>;
    away: Array<{
      player: string;
      position: string;
      status: 'out' | 'doubtful' | 'questionable' | 'probable';
      injury: string;
    }>;
  };
}

export class UpcomingScheduleService {
  private upcomingGames: UpcomingGame[] = [];
  private subscribers: Set<(games: UpcomingGame[]) => void> = new Set();

  constructor() {
    this.initializeMockUpcomingGames();
  }

  private initializeMockUpcomingGames(): void {
    const now = new Date();
    const teams = Object.values(mockTeams);
    const upcomingGames: UpcomingGame[] = [];

    // Generate games for the next 14 days
    for (let day = 1; day <= 14; day++) {
      const gameDate = addDays(now, day);
      
      // More games on weekends
      const isWeekend = gameDate.getDay() === 0 || gameDate.getDay() === 6; // Sunday or Saturday
      const gamesPerDay = isWeekend ? 4 : Math.floor(Math.random() * 2) + 1;

      for (let gameIndex = 0; gameIndex < gamesPerDay; gameIndex++) {
        const totalGameIndex = (day - 1) * 4 + gameIndex;
        
        if (totalGameIndex >= teams.length * 2) break; // Don't exceed available team combinations

        // Set game times based on day of week
        let gameTime: Date;
        if (gameDate.getDay() === 0) { // Sunday
          const sunTimes = [13, 16, 20]; // 1 PM, 4 PM, 8 PM ET
          const timeIndex = gameIndex % sunTimes.length;
          gameTime = new Date(gameDate);
          gameTime.setHours(sunTimes[timeIndex], Math.floor(Math.random() * 60), 0, 0);
        } else if (gameDate.getDay() === 6) { // Saturday
          const satTimes = [16, 20]; // 4 PM, 8 PM ET
          const timeIndex = gameIndex % satTimes.length;
          gameTime = new Date(gameDate);
          gameTime.setHours(satTimes[timeIndex], Math.floor(Math.random() * 60), 0, 0);
        } else if (gameDate.getDay() === 1) { // Monday
          gameTime = new Date(gameDate);
          gameTime.setHours(20, 15, 0, 0); // 8:15 PM Monday Night Football
        } else if (gameDate.getDay() === 4) { // Thursday
          gameTime = new Date(gameDate);
          gameTime.setHours(20, 20, 0, 0); // 8:20 PM Thursday Night Football
        } else {
          // Rare weekday games
          gameTime = new Date(gameDate);
          gameTime.setHours(20, Math.floor(Math.random() * 60), 0, 0);
        }

        const homeTeamIndex = (totalGameIndex * 2) % teams.length;
        const awayTeamIndex = (totalGameIndex * 2 + 1) % teams.length;
        
        if (homeTeamIndex === awayTeamIndex) continue; // Skip same team matchups

        const homeTeam = teams[homeTeamIndex];
        const awayTeam = teams[awayTeamIndex];
        
        // Calculate game week (assuming 17-week regular season)
        const weekNumber = Math.floor(day / 7) + 1;

        // Determine broadcast network
        const isPrimetime = gameTime.getHours() >= 19;
        let network: string;
        const dayOfWeek = gameDate.getDay();
        
        if (dayOfWeek === 0) { // Sunday
          if (isPrimetime) {
            network = 'NBC';
          } else {
            network = Math.random() > 0.5 ? 'CBS' : 'FOX';
          }
        } else if (dayOfWeek === 1) { // Monday
          network = 'ESPN';
        } else if (dayOfWeek === 4) { // Thursday
          network = 'Amazon Prime';
        } else if (dayOfWeek === 6) { // Saturday
          network = Math.random() > 0.5 ? 'ESPN' : 'ABC';
        } else {
          network = 'NFL Network';
        }

        // Generate predictions
        const spread = (Math.random() - 0.5) * 14; // -7 to +7 point spread
        const overUnder = Math.floor(Math.random() * 20) + 40; // 40-60 total points
        const homeWinProbability = Math.random() * 0.4 + 0.3; // 30-70% win probability

        // Generate injuries
        const generateInjuries = () => ({
          home: Math.random() > 0.7 ? [{
            player: `${homeTeam.shortName} Player`,
            position: ['QB', 'RB', 'WR', 'LB'][Math.floor(Math.random() * 4)],
            status: (['out', 'doubtful', 'questionable', 'probable'] as const)[Math.floor(Math.random() * 4)],
            injury: ['Knee', 'Shoulder', 'Ankle', 'Hamstring'][Math.floor(Math.random() * 4)],
          }] : [],
          away: Math.random() > 0.7 ? [{
            player: `${awayTeam.shortName} Player`,
            position: ['QB', 'RB', 'WR', 'LB'][Math.floor(Math.random() * 4)],
            status: (['out', 'doubtful', 'questionable', 'probable'] as const)[Math.floor(Math.random() * 4)],
            injury: ['Knee', 'Shoulder', 'Ankle', 'Hamstring'][Math.floor(Math.random() * 4)],
          }] : [],
        });

        const game: UpcomingGame = {
          id: `upcoming-${totalGameIndex + 1}`,
          homeTeam,
          awayTeam,
          homeScore: 0,
          awayScore: 0,
          status: GameStatus.SCHEDULED,
          quarter: 0,
          timeRemaining: 'Scheduled',
          date: gameTime,
          venue: `${homeTeam.name} Stadium`,
          broadcast: network,
          weather: {
            temperature: Math.floor(Math.random() * 40) + 30,
            condition: ['Clear', 'Cloudy', 'Light Rain', 'Snow', 'Partly Cloudy'][Math.floor(Math.random() * 5)],
          },
          week: weekNumber,
          seasonType: weekNumber <= 18 ? 'regular' : 'playoffs',
          ticketInfo: {
            minPrice: Math.floor(Math.random() * 100) + 50,
            maxPrice: Math.floor(Math.random() * 500) + 200,
            availability: (['available', 'limited', 'sold_out'] as const)[Math.floor(Math.random() * 3)],
            url: `https://tickets.nfl.com/${homeTeam.id}-vs-${awayTeam.id}`,
          },
          broadcastInfo: {
            network,
            announcers: [
              `${network} Announcer 1`,
              `${network} Announcer 2`,
            ],
            streamingAvailable: network !== 'CBS' && network !== 'FOX',
            internationalBroadcasts: ['Sky Sports (UK)', 'TSN (Canada)'],
          },
          gameImportance: {
            playoffImplications: Math.random() > 0.6,
            divisionRivalry: homeTeam.division === awayTeam.division,
            conference: homeTeam.conference !== awayTeam.conference,
            primetimeGame: isPrimetime,
            nationalAudience: isPrimetime || dayOfWeek === 0,
          },
          predictions: {
            spread,
            overUnder,
            homeWinProbability,
          },
          injuries: generateInjuries(),
        };

        upcomingGames.push(game);
      }
    }

    // Sort by date
    this.upcomingGames = upcomingGames.sort((a, b) => a.date.getTime() - b.date.getTime());
  }

  public getUpcomingGames(filter?: ScheduleFilter): UpcomingGame[] {
    let filteredGames = [...this.upcomingGames];

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

      // Week days filter
      if (filter.weekDays && filter.weekDays.length > 0) {
        filteredGames = filteredGames.filter(game =>
          filter.weekDays!.includes(game.date.getDay())
        );
      }

      // Primetime filter
      if (filter.primetime) {
        filteredGames = filteredGames.filter(game =>
          game.gameImportance.primetimeGame
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
            case 'team':
              comparison = a.homeTeam.name.localeCompare(b.homeTeam.name);
              break;
            case 'matchup':
              const aMatchup = `${a.awayTeam.shortName} @ ${a.homeTeam.shortName}`;
              const bMatchup = `${b.awayTeam.shortName} @ ${b.homeTeam.shortName}`;
              comparison = aMatchup.localeCompare(bMatchup);
              break;
            case 'broadcast':
              comparison = a.broadcastInfo.network.localeCompare(b.broadcastInfo.network);
              break;
          }

          return filter.sortOrder === 'desc' ? -comparison : comparison;
        });
      }
    }

    return filteredGames;
  }

  public getNext7Days(): UpcomingGame[] {
    const now = new Date();
    const next7Days = addDays(now, 7);
    
    return this.getUpcomingGames({
      dateRange: {
        start: now,
        end: next7Days,
      },
      sortBy: 'date',
      sortOrder: 'asc',
    });
  }

  public getThisWeek(): UpcomingGame[] {
    const now = new Date();
    const endOfWeek = addDays(now, 7 - now.getDay());
    
    return this.getUpcomingGames({
      dateRange: {
        start: now,
        end: endOfWeek,
      },
      sortBy: 'date',
      sortOrder: 'asc',
    });
  }

  public getTodaysGames(): UpcomingGame[] {
    const now = new Date();
    const startOfToday = startOfDay(now);
    const endOfToday = endOfDay(now);
    
    return this.getUpcomingGames({
      dateRange: {
        start: startOfToday,
        end: endOfToday,
      },
      sortBy: 'date',
      sortOrder: 'asc',
    });
  }

  public getPrimetimeGames(): UpcomingGame[] {
    return this.getUpcomingGames({
      primetime: true,
      sortBy: 'date',
      sortOrder: 'asc',
    });
  }

  public getDivisionGames(): UpcomingGame[] {
    return this.upcomingGames.filter(game => 
      game.gameImportance.divisionRivalry
    );
  }

  public getPlayoffImplicationGames(): UpcomingGame[] {
    return this.upcomingGames.filter(game => 
      game.gameImportance.playoffImplications
    );
  }

  public getGameById(gameId: string): UpcomingGame | undefined {
    return this.upcomingGames.find(game => game.id === gameId);
  }

  public getGamesByTeam(teamId: string): UpcomingGame[] {
    return this.upcomingGames.filter(game =>
      game.homeTeam.id === teamId || game.awayTeam.id === teamId
    );
  }

  public getGamesByNetwork(network: string): UpcomingGame[] {
    return this.upcomingGames.filter(game =>
      game.broadcastInfo.network === network
    );
  }

  public subscribe(callback: (games: UpcomingGame[]) => void): () => void {
    this.subscribers.add(callback);
    
    // Immediately call with current games
    callback([...this.upcomingGames]);
    
    return () => {
      this.subscribers.delete(callback);
    };
  }

  private notifySubscribers(): void {
    const games = [...this.upcomingGames];
    this.subscribers.forEach(callback => {
      try {
        callback(games);
      } catch (error) {
        console.error('Error notifying upcoming games subscriber:', error);
      }
    });
  }

  public refreshSchedule(): void {
    this.initializeMockUpcomingGames();
    this.notifySubscribers();
  }

  public addGame(game: UpcomingGame): void {
    this.upcomingGames.push(game);
    this.upcomingGames.sort((a, b) => a.date.getTime() - b.date.getTime());
    this.notifySubscribers();
  }

  // Utility functions
  public getScheduleSummary(): {
    totalGames: number;
    gamesThisWeek: number;
    primetimeGames: number;
    divisionGames: number;
    playoffImplicationGames: number;
    nextGame: UpcomingGame | null;
  } {
    const totalGames = this.upcomingGames.length;
    const thisWeekGames = this.getThisWeek().length;
    const primetimeGames = this.getPrimetimeGames().length;
    const divisionGames = this.getDivisionGames().length;
    const playoffImplicationGames = this.getPlayoffImplicationGames().length;
    const nextGame = this.upcomingGames.length > 0 ? this.upcomingGames[0] : null;

    return {
      totalGames,
      gamesThisWeek: thisWeekGames,
      primetimeGames,
      divisionGames,
      playoffImplicationGames,
      nextGame,
    };
  }
}

// ===== SINGLETON INSTANCE =====
export const upcomingScheduleService = new UpcomingScheduleService();

// ===== UTILITY FUNCTIONS =====

export const isGameToday = (game: UpcomingGame): boolean => {
  const today = startOfDay(new Date());
  const gameDay = startOfDay(game.date);
  return today.getTime() === gameDay.getTime();
};

export const isGameThisWeek = (game: UpcomingGame): boolean => {
  const now = new Date();
  const weekStart = startOfDay(now);
  const weekEnd = addDays(weekStart, 7);
  return isAfter(game.date, weekStart) && isBefore(game.date, weekEnd);
};

export const getTimeUntilGame = (game: UpcomingGame): string => {
  const now = new Date();
  const timeDiff = game.date.getTime() - now.getTime();
  
  if (timeDiff <= 0) return 'Game has started';
  
  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (days > 0) {
    return `${days}d ${hours}h`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
};

export const getGameMatchupText = (game: UpcomingGame): string => {
  return `${game.awayTeam.shortName} @ ${game.homeTeam.shortName}`;
};

export const getSpreadText = (game: UpcomingGame): string => {
  if (!game.predictions) return 'No line';
  
  const { spread } = game.predictions;
  const favoriteTeam = spread > 0 ? game.homeTeam.shortName : game.awayTeam.shortName;
  const spreadValue = Math.abs(spread);
  
  return `${favoriteTeam} -${spreadValue.toFixed(1)}`;
};

export const formatGameTime = (game: UpcomingGame): string => {
  return format(game.date, 'EEE, MMM d • h:mm a');
};