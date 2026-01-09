import { Game, GameStatus, LiveGameUpdate } from '../types/Game';
import { Team } from '../types/Team';

// ===== MOCK TEAM DATA =====
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
};

// ===== LIVE GAME SIMULATION =====

export class LiveGameService {
  private games: Map<string, Game> = new Map();
  private subscribers: Set<(games: Game[]) => void> = new Set();
  private intervalId: NodeJS.Timeout | null = null;
  private updateIntervalMs = 5000; // Update every 5 seconds

  constructor() {
    this.initializeMockGames();
  }

  private initializeMockGames(): void {
    const now = new Date();
    const teams = Object.values(mockTeams);

    // Create 3 live games
    const liveGames: Game[] = [
      {
        id: 'live-1',
        homeTeam: teams[0],
        awayTeam: teams[1],
        homeScore: 14,
        awayScore: 10,
        status: GameStatus.LIVE,
        quarter: 2,
        timeRemaining: '08:45',
        date: new Date(now.getTime() - 30 * 60 * 1000), // Started 30 minutes ago
        venue: 'AT&T Stadium',
        broadcast: 'CBS',
        weather: { temperature: 72, condition: 'Clear' },
        possession: 'home',
        down: 2,
        distance: 7,
        yardLine: 45,
        isRedZone: false,
        drives: {
          home: { totalYards: 245, passingYards: 180, rushingYards: 65, turnovers: 1 },
          away: { totalYards: 198, passingYards: 155, rushingYards: 43, turnovers: 0 }
        }
      },
      {
        id: 'live-2', 
        homeTeam: teams[2],
        awayTeam: teams[3],
        homeScore: 3,
        awayScore: 7,
        status: GameStatus.LIVE,
        quarter: 1,
        timeRemaining: '03:22',
        date: new Date(now.getTime() - 15 * 60 * 1000), // Started 15 minutes ago
        venue: 'MetLife Stadium',
        broadcast: 'FOX',
        weather: { temperature: 45, condition: 'Cloudy' },
        possession: 'away',
        down: 1,
        distance: 10,
        yardLine: 25,
        isRedZone: true,
        drives: {
          home: { totalYards: 78, passingYards: 45, rushingYards: 33, turnovers: 0 },
          away: { totalYards: 142, passingYards: 98, rushingYards: 44, turnovers: 1 }
        }
      },
      {
        id: 'live-3',
        homeTeam: teams[4],
        awayTeam: teams[5], 
        homeScore: 21,
        awayScore: 17,
        status: GameStatus.LIVE,
        quarter: 4,
        timeRemaining: '12:08',
        date: new Date(now.getTime() - 2.5 * 60 * 60 * 1000), // Started 2.5 hours ago
        venue: 'Highmark Stadium',
        broadcast: 'NBC',
        weather: { temperature: 28, condition: 'Snow' },
        possession: 'away',
        down: 3,
        distance: 8,
        yardLine: 42,
        isRedZone: false,
        drives: {
          home: { totalYards: 378, passingYards: 265, rushingYards: 113, turnovers: 2 },
          away: { totalYards: 345, passingYards: 198, rushingYards: 147, turnovers: 1 }
        }
      }
    ];

    // Store games
    liveGames.forEach(game => {
      this.games.set(game.id, game);
    });
  }

  public startLiveUpdates(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

    this.intervalId = setInterval(() => {
      this.simulateGameUpdates();
      this.notifySubscribers();
    }, this.updateIntervalMs);

    // Initial notification
    this.notifySubscribers();
  }

  public stopLiveUpdates(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  public subscribe(callback: (games: Game[]) => void): () => void {
    this.subscribers.add(callback);
    
    // Immediately call with current games
    callback(Array.from(this.games.values()));
    
    return () => {
      this.subscribers.delete(callback);
    };
  }

  public getLiveGames(): Game[] {
    return Array.from(this.games.values()).filter(game => game.status === GameStatus.LIVE);
  }

  public getGame(gameId: string): Game | undefined {
    return this.games.get(gameId);
  }

  private simulateGameUpdates(): void {
    this.games.forEach((game, gameId) => {
      if (game.status !== GameStatus.LIVE) return;

      const updatedGame = { ...game };
      
      // Simulate time progression
      const [minutes, seconds] = game.timeRemaining.split(':').map(Number);
      let totalSeconds = minutes * 60 + seconds;
      
      // Decrease time by 10-30 seconds randomly
      totalSeconds -= Math.floor(Math.random() * 20) + 10;
      
      if (totalSeconds <= 0) {
        // Quarter ended
        if (game.quarter < 4) {
          updatedGame.quarter += 1;
          updatedGame.timeRemaining = '15:00';
        } else {
          // Game ended
          updatedGame.status = GameStatus.FINAL;
          updatedGame.timeRemaining = 'FINAL';
        }
      } else {
        const newMinutes = Math.floor(totalSeconds / 60);
        const newSeconds = totalSeconds % 60;
        updatedGame.timeRemaining = `${newMinutes.toString().padStart(2, '0')}:${newSeconds.toString().padStart(2, '0')}`;
      }

      // Randomly simulate scoring (10% chance per update)
      if (Math.random() < 0.1 && updatedGame.status === GameStatus.LIVE) {
        const scoreTypes = [
          { points: 7, name: 'Touchdown' },
          { points: 3, name: 'Field Goal' },
          { points: 2, name: 'Safety' },
          { points: 1, name: 'Extra Point' }
        ];
        
        const scoreType = scoreTypes[Math.floor(Math.random() * scoreTypes.length)];
        const isHomeTeam = Math.random() < 0.5;
        
        if (isHomeTeam) {
          updatedGame.homeScore += scoreType.points;
        } else {
          updatedGame.awayScore += scoreType.points;
        }

        // Update drive stats
        if (updatedGame.drives) {
          const team = isHomeTeam ? 'home' : 'away';
          updatedGame.drives[team].totalYards += Math.floor(Math.random() * 50) + 20;
          updatedGame.drives[team].passingYards += Math.floor(Math.random() * 30) + 10;
          updatedGame.drives[team].rushingYards += Math.floor(Math.random() * 20) + 5;
        }
      }

      // Simulate possession changes (20% chance)
      if (Math.random() < 0.2) {
        updatedGame.possession = updatedGame.possession === 'home' ? 'away' : 'home';
        updatedGame.down = Math.floor(Math.random() * 4) + 1;
        updatedGame.distance = Math.floor(Math.random() * 15) + 1;
        updatedGame.yardLine = Math.floor(Math.random() * 90) + 5;
        updatedGame.isRedZone = updatedGame.yardLine <= 20;
      }

      this.games.set(gameId, updatedGame);
    });
  }

  private notifySubscribers(): void {
    const games = Array.from(this.games.values());
    this.subscribers.forEach(callback => {
      try {
        callback(games);
      } catch (error) {
        console.error('Error notifying live games subscriber:', error);
      }
    });
  }

  public setUpdateInterval(intervalMs: number): void {
    this.updateIntervalMs = intervalMs;
    
    if (this.intervalId) {
      this.stopLiveUpdates();
      this.startLiveUpdates();
    }
  }

  public addGame(game: Game): void {
    this.games.set(game.id, game);
    this.notifySubscribers();
  }

  public removeGame(gameId: string): void {
    this.games.delete(gameId);
    this.notifySubscribers();
  }

  public updateGame(gameId: string, updates: Partial<Game>): void {
    const game = this.games.get(gameId);
    if (game) {
      this.games.set(gameId, { ...game, ...updates });
      this.notifySubscribers();
    }
  }
}

// ===== SINGLETON INSTANCE =====
export const liveGameService = new LiveGameService();

// ===== ADDITIONAL UTILITIES =====

export const getGameStatusText = (game: Game): string => {
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
};

export const getGameProgress = (game: Game): number => {
  if (game.status === GameStatus.FINAL) return 100;
  if (game.status !== GameStatus.LIVE) return 0;

  const [minutes, seconds] = game.timeRemaining.split(':').map(Number);
  const totalSecondsRemaining = minutes * 60 + seconds;
  const quarterSeconds = 15 * 60; // 15 minutes per quarter
  const gameSeconds = 4 * quarterSeconds; // 4 quarters
  
  const elapsedSeconds = ((game.quarter - 1) * quarterSeconds) + (quarterSeconds - totalSecondsRemaining);
  
  return Math.min(100, (elapsedSeconds / gameSeconds) * 100);
};

export const isGameLive = (game: Game): boolean => {
  return game.status === GameStatus.LIVE;
};

export const getScoreLeader = (game: Game): 'home' | 'away' | 'tie' => {
  if (game.homeScore > game.awayScore) return 'home';
  if (game.awayScore > game.homeScore) return 'away';
  return 'tie';
};

export const formatGameTime = (game: Game): string => {
  if (game.status === GameStatus.SCHEDULED) {
    return game.date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      timeZoneName: 'short'
    });
  }
  
  return getGameStatusText(game);
};