import { Game, LiveGame, CompletedGame, ScheduledGame, SportType } from '@core-types/game.types';
import { getTeamsBySport, getTeamById } from './mockTeams.service';

// Helper function to generate random scores
const randomScore = (min = 0, max = 35) => Math.floor(Math.random() * (max - min + 1)) + min;

// Helper function to generate random time
const randomTime = () => {
  const minutes = Math.floor(Math.random() * 15);
  const seconds = Math.floor(Math.random() * 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

export class MockGamesService {
  private static instance: MockGamesService;
  private games: Game[] = [];

  static getInstance(): MockGamesService {
    if (!MockGamesService.instance) {
      MockGamesService.instance = new MockGamesService();
    }
    return MockGamesService.instance;
  }

  constructor() {
    this.generateMockGames();
  }

  private generateMockGames(): void {
    this.games = [
      ...this.generateLiveGames(),
      ...this.generateRecentGames(),
      ...this.generateUpcomingGames(),
    ];
  }

  private generateLiveGames(): LiveGame[] {
    const liveGames: LiveGame[] = [];
    const nflTeams = getTeamsBySport('nfl');
    const nbaTeams = getTeamsBySport('nba');

    // NFL Live Games
    for (let i = 0; i < 3; i++) {
      const homeTeam = nflTeams[Math.floor(Math.random() * nflTeams.length)];
      let awayTeam = nflTeams[Math.floor(Math.random() * nflTeams.length)];
      while (awayTeam.id === homeTeam.id) {
        awayTeam = nflTeams[Math.floor(Math.random() * nflTeams.length)];
      }

      liveGames.push({
        id: `live-nfl-${i}`,
        sport: 'nfl',
        status: 'live',
        startTime: new Date(Date.now() - Math.random() * 3 * 60 * 60 * 1000), // Started up to 3 hours ago
        homeTeam,
        awayTeam,
        score: {
          home: randomScore(0, 28),
          away: randomScore(0, 28),
        },
        clock: {
          quarter: Math.floor(Math.random() * 4) + 1,
          timeRemaining: randomTime(),
        },
        lastUpdate: new Date(),
        broadcast: ['CBS', 'NBC', 'FOX', 'ESPN'][Math.floor(Math.random() * 4)],
        venue: `${homeTeam.city} Stadium`,
      });
    }

    // NBA Live Games
    for (let i = 0; i < 2; i++) {
      const homeTeam = nbaTeams[Math.floor(Math.random() * nbaTeams.length)];
      let awayTeam = nbaTeams[Math.floor(Math.random() * nbaTeams.length)];
      while (awayTeam.id === homeTeam.id) {
        awayTeam = nbaTeams[Math.floor(Math.random() * nbaTeams.length)];
      }

      liveGames.push({
        id: `live-nba-${i}`,
        sport: 'nba',
        status: 'live',
        startTime: new Date(Date.now() - Math.random() * 2.5 * 60 * 60 * 1000), // Started up to 2.5 hours ago
        homeTeam,
        awayTeam,
        score: {
          home: randomScore(60, 120),
          away: randomScore(60, 120),
        },
        clock: {
          quarter: Math.floor(Math.random() * 4) + 1,
          timeRemaining: randomTime(),
        },
        lastUpdate: new Date(),
        broadcast: ['ESPN', 'TNT', 'ABC', 'NBA TV'][Math.floor(Math.random() * 4)],
        venue: `${homeTeam.city} Arena`,
      });
    }

    return liveGames;
  }

  private generateRecentGames(): CompletedGame[] {
    const recentGames: CompletedGame[] = [];
    const nflTeams = getTeamsBySport('nfl');
    const nbaTeams = getTeamsBySport('nba');

    // NFL Recent Games (last 24 hours)
    for (let i = 0; i < 5; i++) {
      const homeTeam = nflTeams[Math.floor(Math.random() * nflTeams.length)];
      let awayTeam = nflTeams[Math.floor(Math.random() * nflTeams.length)];
      while (awayTeam.id === homeTeam.id) {
        awayTeam = nflTeams[Math.floor(Math.random() * nflTeams.length)];
      }

      const homeScore = randomScore(7, 35);
      const awayScore = randomScore(7, 35);

      recentGames.push({
        id: `recent-nfl-${i}`,
        sport: 'nfl',
        status: 'final',
        startTime: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000), // Last 24 hours
        homeTeam,
        awayTeam,
        score: { home: homeScore, away: awayScore },
        finalScore: { home: homeScore, away: awayScore },
        stats: {
          home: {
            totalYards: randomScore(200, 450),
            passingYards: randomScore(150, 350),
            rushingYards: randomScore(50, 200),
            turnovers: Math.floor(Math.random() * 4),
          },
          away: {
            totalYards: randomScore(200, 450),
            passingYards: randomScore(150, 350),
            rushingYards: randomScore(50, 200),
            turnovers: Math.floor(Math.random() * 4),
          },
        },
        gameLength: '3:15',
        venue: `${homeTeam.city} Stadium`,
      });
    }

    // NBA Recent Games
    for (let i = 0; i < 8; i++) {
      const homeTeam = nbaTeams[Math.floor(Math.random() * nbaTeams.length)];
      let awayTeam = nbaTeams[Math.floor(Math.random() * nbaTeams.length)];
      while (awayTeam.id === homeTeam.id) {
        awayTeam = nbaTeams[Math.floor(Math.random() * nbaTeams.length)];
      }

      const homeScore = randomScore(85, 130);
      const awayScore = randomScore(85, 130);

      recentGames.push({
        id: `recent-nba-${i}`,
        sport: 'nba',
        status: 'final',
        startTime: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000), // Last 24 hours
        homeTeam,
        awayTeam,
        score: { home: homeScore, away: awayScore },
        finalScore: { home: homeScore, away: awayScore },
        stats: {
          home: {
            fieldGoalPct: (Math.random() * 0.3 + 0.4).toFixed(3),
            threePointPct: (Math.random() * 0.25 + 0.25).toFixed(3),
            rebounds: randomScore(35, 55),
            assists: randomScore(15, 35),
            turnovers: randomScore(8, 20),
          },
          away: {
            fieldGoalPct: (Math.random() * 0.3 + 0.4).toFixed(3),
            threePointPct: (Math.random() * 0.25 + 0.25).toFixed(3),
            rebounds: randomScore(35, 55),
            assists: randomScore(15, 35),
            turnovers: randomScore(8, 20),
          },
        },
        gameLength: '2:28',
        venue: `${homeTeam.city} Arena`,
      });
    }

    return recentGames;
  }

  private generateUpcomingGames(): ScheduledGame[] {
    const upcomingGames: ScheduledGame[] = [];
    const nflTeams = getTeamsBySport('nfl');
    const nbaTeams = getTeamsBySport('nba');

    // NFL Upcoming Games (next 7 days)
    for (let i = 0; i < 8; i++) {
      const homeTeam = nflTeams[Math.floor(Math.random() * nflTeams.length)];
      let awayTeam = nflTeams[Math.floor(Math.random() * nflTeams.length)];
      while (awayTeam.id === homeTeam.id) {
        awayTeam = nflTeams[Math.floor(Math.random() * nflTeams.length)];
      }

      const futureDate = new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000); // Next 7 days

      upcomingGames.push({
        id: `upcoming-nfl-${i}`,
        sport: 'nfl',
        status: 'scheduled',
        startTime: futureDate,
        homeTeam,
        awayTeam,
        score: { home: 0, away: 0 },
        broadcast: ['CBS', 'NBC', 'FOX', 'ESPN', 'Amazon Prime'][Math.floor(Math.random() * 5)],
        venue: `${homeTeam.city} Stadium`,
      });
    }

    // NBA Upcoming Games
    for (let i = 0; i < 12; i++) {
      const homeTeam = nbaTeams[Math.floor(Math.random() * nbaTeams.length)];
      let awayTeam = nbaTeams[Math.floor(Math.random() * nbaTeams.length)];
      while (awayTeam.id === homeTeam.id) {
        awayTeam = nbaTeams[Math.floor(Math.random() * nbaTeams.length)];
      }

      const futureDate = new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000); // Next 7 days

      upcomingGames.push({
        id: `upcoming-nba-${i}`,
        sport: 'nba',
        status: 'scheduled',
        startTime: futureDate,
        homeTeam,
        awayTeam,
        score: { home: 0, away: 0 },
        broadcast: ['ESPN', 'TNT', 'ABC', 'NBA TV', 'Bally Sports'][Math.floor(Math.random() * 5)],
        venue: `${homeTeam.city} Arena`,
      });
    }

    return upcomingGames;
  }

  // Public methods
  getLiveGames(sport?: SportType): Promise<LiveGame[]> {
    return new Promise(resolve => {
      setTimeout(() => {
        const liveGames = this.games.filter(
          game => game.status === 'live' && (!sport || game.sport === sport)
        ) as LiveGame[];
        resolve(liveGames);
      }, 200); // Simulate API delay
    });
  }

  getRecentGames(sport?: SportType, hours = 24): Promise<CompletedGame[]> {
    return new Promise(resolve => {
      setTimeout(() => {
        const cutoffTime = new Date(Date.now() - hours * 60 * 60 * 1000);
        const recentGames = this.games.filter(
          game =>
            game.status === 'final' &&
            game.startTime >= cutoffTime &&
            (!sport || game.sport === sport)
        ) as CompletedGame[];
        resolve(recentGames.sort((a, b) => b.startTime.getTime() - a.startTime.getTime()));
      }, 200);
    });
  }

  getUpcomingGames(sport?: SportType, days = 7): Promise<ScheduledGame[]> {
    return new Promise(resolve => {
      setTimeout(() => {
        const cutoffTime = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
        const upcomingGames = this.games.filter(
          game =>
            game.status === 'scheduled' &&
            game.startTime <= cutoffTime &&
            game.startTime > new Date() &&
            (!sport || game.sport === sport)
        ) as ScheduledGame[];
        resolve(upcomingGames.sort((a, b) => a.startTime.getTime() - b.startTime.getTime()));
      }, 200);
    });
  }

  // Simulate live updates
  updateLiveGames(): void {
    this.games.forEach(game => {
      if (game.status === 'live') {
        const liveGame = game as LiveGame;
        // Randomly update scores
        if (Math.random() < 0.3) {
          if (Math.random() < 0.5) {
            liveGame.score.home += Math.floor(Math.random() * 7) + 1;
          } else {
            liveGame.score.away += Math.floor(Math.random() * 7) + 1;
          }
          liveGame.lastUpdate = new Date();
        }
        
        // Randomly advance clock
        if (Math.random() < 0.7 && liveGame.clock) {
          const [minutes, seconds] = liveGame.clock.timeRemaining?.split(':').map(Number) || [15, 0];
          const totalSeconds = minutes * 60 + seconds;
          const newTotalSeconds = Math.max(0, totalSeconds - Math.floor(Math.random() * 60));
          const newMinutes = Math.floor(newTotalSeconds / 60);
          const newSeconds = newTotalSeconds % 60;
          liveGame.clock.timeRemaining = `${newMinutes}:${newSeconds.toString().padStart(2, '0')}`;
        }
      }
    });
  }
}

export const mockGamesService = MockGamesService.getInstance();