import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Chip,
  LinearProgress,
  Card,
  CardContent,
  Grid,
  Switch,
  FormControlLabel,
  Alert,
  Tabs,
  Tab,
  Badge,
  useTheme,
  alpha,
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  Stop as StopIcon,
  Refresh as RefreshIcon,
  Notifications as NotificationsIcon,
  NotificationsOff as NotificationsOffIcon,
  Timer as TimerIcon,
  SportsFootball as FootballIcon,
} from '@mui/icons-material';
import { GameCard, GameList, Game } from './GameCard';
import { GameDetails, GameSummary, DetailedGame } from './GameDetails';
import { LoadingSpinner, GameCardSkeleton, useLoadingState } from '../layout/LoadingStates';

// ===== MOCK DATA =====

const createMockTeam = (id: string, name: string, shortName: string, city: string, colors: { primary: string; secondary: string }) => ({
  id,
  name,
  shortName,
  city,
  logo: `https://via.placeholder.com/64x64/${colors.primary.replace('#', '')}/ffffff?text=${shortName}`,
  colors,
  conference: 'NFC',
  division: 'North',
});

const mockTeams = {
  dal: createMockTeam('dal', 'Dallas Cowboys', 'DAL', 'Dallas', { primary: '#003594', secondary: '#869397' }),
  nyg: createMockTeam('nyg', 'New York Giants', 'NYG', 'New York', { primary: '#0B2265', secondary: '#A71930' }),
  phi: createMockTeam('phi', 'Philadelphia Eagles', 'PHI', 'Philadelphia', { primary: '#004C54', secondary: '#A5ACAF' }),
  was: createMockTeam('was', 'Washington Commanders', 'WAS', 'Washington', { primary: '#5A1414', secondary: '#FFB612' }),
  sf: createMockTeam('sf', 'San Francisco 49ers', 'SF', 'San Francisco', { primary: '#AA0000', secondary: '#B3995D' }),
  sea: createMockTeam('sea', 'Seattle Seahawks', 'SEA', 'Seattle', { primary: '#002244', secondary: '#69BE28' }),
};

const generateMockGame = (
  homeTeam: any,
  awayTeam: any,
  status: Game['status'],
  startTime: Date,
  score?: { home: number; away: number }
): DetailedGame => {
  const baseGame: DetailedGame = {
    id: `${awayTeam.id}-${homeTeam.id}-${Date.now()}`,
    homeTeam,
    awayTeam,
    startTime,
    status,
    week: Math.floor(Math.random() * 18) + 1,
    season: 2024,
    venue: {
      name: `${homeTeam.city} Stadium`,
      city: homeTeam.city,
      state: 'TX',
    },
    weather: {
      temperature: Math.floor(Math.random() * 40) + 40,
      condition: ['Clear', 'Cloudy', 'Light Rain', 'Sunny'][Math.floor(Math.random() * 4)],
      windSpeed: Math.floor(Math.random() * 20),
    },
    broadcast: {
      network: ['FOX', 'CBS', 'NBC', 'ESPN', 'Amazon Prime'][Math.floor(Math.random() * 5)],
    },
    isFavorite: Math.random() > 0.7,
  };

  if (score) {
    baseGame.score = {
      home: score.home,
      away: score.away,
      quarter: status === 'live' ? Math.floor(Math.random() * 4) + 1 : 4,
      timeRemaining: status === 'live' ? `${Math.floor(Math.random() * 15)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}` : '0:00',
    };

    // Add detailed stats for finished or live games
    if (status === 'live' || status === 'finished') {
      baseGame.stats = {
        home: {
          firstDowns: Math.floor(Math.random() * 25) + 15,
          totalYards: Math.floor(Math.random() * 200) + 300,
          passingYards: Math.floor(Math.random() * 150) + 200,
          rushingYards: Math.floor(Math.random() * 100) + 80,
          turnovers: Math.floor(Math.random() * 4),
          penalties: Math.floor(Math.random() * 8) + 4,
          penaltyYards: Math.floor(Math.random() * 60) + 40,
          timeOfPossession: `${Math.floor(Math.random() * 20) + 20}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
          thirdDownEfficiency: {
            attempts: Math.floor(Math.random() * 8) + 8,
            conversions: Math.floor(Math.random() * 6) + 3,
          },
          redZoneEfficiency: {
            attempts: Math.floor(Math.random() * 4) + 2,
            scores: Math.floor(Math.random() * 3) + 1,
          },
        },
        away: {
          firstDowns: Math.floor(Math.random() * 25) + 15,
          totalYards: Math.floor(Math.random() * 200) + 300,
          passingYards: Math.floor(Math.random() * 150) + 200,
          rushingYards: Math.floor(Math.random() * 100) + 80,
          turnovers: Math.floor(Math.random() * 4),
          penalties: Math.floor(Math.random() * 8) + 4,
          penaltyYards: Math.floor(Math.random() * 60) + 40,
          timeOfPossession: `${Math.floor(Math.random() * 20) + 20}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
          thirdDownEfficiency: {
            attempts: Math.floor(Math.random() * 8) + 8,
            conversions: Math.floor(Math.random() * 6) + 3,
          },
          redZoneEfficiency: {
            attempts: Math.floor(Math.random() * 4) + 2,
            scores: Math.floor(Math.random() * 3) + 1,
          },
        },
      };

      baseGame.quarterScores = [
        { quarter: 1, home: Math.floor(Math.random() * 14), away: Math.floor(Math.random() * 14) },
        { quarter: 2, home: Math.floor(Math.random() * 14), away: Math.floor(Math.random() * 14) },
        { quarter: 3, home: Math.floor(Math.random() * 14), away: Math.floor(Math.random() * 14) },
        { quarter: 4, home: Math.floor(Math.random() * 14), away: Math.floor(Math.random() * 14) },
      ];

      baseGame.scoringPlays = [
        {
          id: '1',
          quarter: 1,
          time: '12:34',
          team: 'home',
          type: 'touchdown',
          description: '15-yard touchdown pass',
          player: 'QB Smith to WR Johnson',
        },
        {
          id: '2',
          quarter: 2,
          time: '8:21',
          team: 'away',
          type: 'field_goal',
          description: '32-yard field goal',
          player: 'K Davis',
        },
      ];

      baseGame.attendance = Math.floor(Math.random() * 20000) + 60000;
    }
  }

  return baseGame;
};

const mockGames: DetailedGame[] = [
  generateMockGame(mockTeams.dal, mockTeams.nyg, 'live', new Date(Date.now() - 2 * 60 * 60 * 1000), { home: 21, away: 14 }),
  generateMockGame(mockTeams.phi, mockTeams.was, 'halftime', new Date(Date.now() - 1 * 60 * 60 * 1000), { home: 10, away: 17 }),
  generateMockGame(mockTeams.sf, mockTeams.sea, 'scheduled', new Date(Date.now() + 2 * 60 * 60 * 1000)),
  generateMockGame(mockTeams.dal, mockTeams.phi, 'finished', new Date(Date.now() - 24 * 60 * 60 * 1000), { home: 28, away: 21 }),
  generateMockGame(mockTeams.nyg, mockTeams.was, 'scheduled', new Date(Date.now() + 24 * 60 * 60 * 1000)),
  generateMockGame(mockTeams.sea, mockTeams.sf, 'finished', new Date(Date.now() - 48 * 60 * 60 * 1000), { home: 31, away: 24 }),
];

// ===== GAME DISPLAY DEMO COMPONENT =====

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => (
  <div role="tabpanel" hidden={value !== index}>
    {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
  </div>
);

const GameDisplayDemo: React.FC = () => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [selectedGame, setSelectedGame] = useState<DetailedGame | null>(null);
  const [liveUpdatesEnabled, setLiveUpdatesEnabled] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [games, setGames] = useState<DetailedGame[]>(mockGames);
  const { loading, startLoading, stopLoading } = useLoadingState();

  // Simulate live updates
  useEffect(() => {
    if (!liveUpdatesEnabled) return;

    const interval = setInterval(() => {
      setGames(prevGames => 
        prevGames.map(game => {
          if (game.status === 'live' && game.score) {
            // Randomly update score
            if (Math.random() > 0.8) {
              const isHome = Math.random() > 0.5;
              const points = Math.random() > 0.7 ? 7 : 3; // TD or FG
              
              return {
                ...game,
                score: {
                  ...game.score,
                  home: isHome ? game.score.home + points : game.score.home,
                  away: !isHome ? game.score.away + points : game.score.away,
                },
              };
            }
          }
          return game;
        })
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [liveUpdatesEnabled]);

  const handleGameClick = (game: DetailedGame) => {
    setSelectedGame(game);
    setTabValue(3); // Switch to game details tab
  };

  const handleFavorite = (gameId: string, isFavorite: boolean) => {
    setGames(prevGames =>
      prevGames.map(game =>
        game.id === gameId ? { ...game, isFavorite } : game
      )
    );
  };

  const handleRefresh = async () => {
    startLoading();
    // Simulate API call
    setTimeout(() => {
      stopLoading();
    }, 2000);
  };

  const liveGames = games.filter(game => game.status === 'live' || game.status === 'halftime');
  const upcomingGames = games.filter(game => game.status === 'scheduled');
  const finishedGames = games.filter(game => game.status === 'finished');

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Game Display Components Demo
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Interactive demonstration of game display components with live updates and detailed views.
        </Typography>
      </Box>

      {/* Controls */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            <FormControlLabel
              control={
                <Switch
                  checked={liveUpdatesEnabled}
                  onChange={(e) => setLiveUpdatesEnabled(e.target.checked)}
                />
              }
              label="Live Updates"
            />
            
            <FormControlLabel
              control={
                <Switch
                  checked={notificationsEnabled}
                  onChange={(e) => setNotificationsEnabled(e.target.checked)}
                />
              }
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  {notificationsEnabled ? <NotificationsIcon fontSize="small" /> : <NotificationsOffIcon fontSize="small" />}
                  Notifications
                </Box>
              }
            />

            <Button
              variant="outlined"
              startIcon={loading ? <LoadingSpinner size={16} /> : <RefreshIcon />}
              onClick={handleRefresh}
              disabled={loading}
            >
              Refresh Data
            </Button>
          </Box>

          {liveUpdatesEnabled && (
            <Alert severity="info" sx={{ mt: 2 }}>
              Live updates are enabled. Scores will update automatically every 5 seconds.
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
          <Tab 
            label={
              <Badge badgeContent={liveGames.length} color="error">
                Live Games
              </Badge>
            } 
          />
          <Tab label={`Upcoming (${upcomingGames.length})`} />
          <Tab label={`Finished (${finishedGames.length})`} />
          <Tab label="Game Details" disabled={!selectedGame} />
          <Tab label="Components" />
        </Tabs>
      </Box>

      {/* Live Games Tab */}
      <TabPanel value={tabValue} index={0}>
        {loading ? (
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: 2 }}>
            {Array.from({ length: 3 }).map((_, index) => (
              <GameCardSkeleton key={index} />
            ))}
          </Box>
        ) : liveGames.length > 0 ? (
          <>
            <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
              <TimerIcon color="error" />
              <Typography variant="h6" color="error.main">
                Live Now
              </Typography>
              {liveUpdatesEnabled && (
                <Chip
                  icon={<PlayIcon />}
                  label="Auto-updating"
                  color="success"
                  size="small"
                  variant="outlined"
                />
              )}
            </Box>
            <GameList
              games={liveGames}
              variant="detailed"
              onGameClick={handleGameClick}
              onFavorite={handleFavorite}
            />
          </>
        ) : (
          <Box sx={{ textAlign: 'center', py: 8, color: 'text.secondary' }}>
            <FootballIcon sx={{ fontSize: 64, mb: 2, opacity: 0.5 }} />
            <Typography variant="h6">No Live Games</Typography>
            <Typography variant="body2">
              All games are either finished or scheduled for later.
            </Typography>
          </Box>
        )}
      </TabPanel>

      {/* Upcoming Games Tab */}
      <TabPanel value={tabValue} index={1}>
        {loading ? (
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 2 }}>
            {Array.from({ length: 4 }).map((_, index) => (
              <GameCardSkeleton key={index} />
            ))}
          </Box>
        ) : (
          <GameList
            games={upcomingGames}
            variant="default"
            groupBy="date"
            onGameClick={handleGameClick}
            onFavorite={handleFavorite}
          />
        )}
      </TabPanel>

      {/* Finished Games Tab */}
      <TabPanel value={tabValue} index={2}>
        {loading ? (
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 2 }}>
            {Array.from({ length: 4 }).map((_, index) => (
              <GameCardSkeleton key={index} />
            ))}
          </Box>
        ) : (
          <GameList
            games={finishedGames}
            variant="compact"
            groupBy="week"
            onGameClick={handleGameClick}
            onFavorite={handleFavorite}
          />
        )}
      </TabPanel>

      {/* Game Details Tab */}
      <TabPanel value={tabValue} index={3}>
        {selectedGame ? (
          <Box>
            <Box sx={{ mb: 3 }}>
              <Button
                variant="outlined"
                onClick={() => setSelectedGame(null)}
                sx={{ mb: 2 }}
              >
                ← Back to Games
              </Button>
              <GameSummary game={selectedGame} showMomentum />
            </Box>
            <GameDetails
              game={selectedGame}
              showStats
              showScoring
              showQuarters
            />
          </Box>
        ) : (
          <Box sx={{ textAlign: 'center', py: 8, color: 'text.secondary' }}>
            <Typography variant="h6">No Game Selected</Typography>
            <Typography variant="body2">
              Click on a game card to view detailed information.
            </Typography>
          </Box>
        )}
      </TabPanel>

      {/* Components Tab */}
      <TabPanel value={tabValue} index={4}>
        <Box>
          <Typography variant="h6" gutterBottom>
            Game Card Variants
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" gutterBottom>
                Default Variant
              </Typography>
              <GameCard
                game={games[0]}
                variant="default"
                onFavorite={handleFavorite}
                showBroadcast
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" gutterBottom>
                Compact Variant
              </Typography>
              <GameCard
                game={games[1]}
                variant="compact"
                onFavorite={handleFavorite}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
                Detailed Variant
              </Typography>
              <GameCard
                game={games[0]}
                variant="detailed"
                onFavorite={handleFavorite}
                showBroadcast
                showVenue
                showWeather
              />
            </Grid>
          </Grid>
        </Box>
      </TabPanel>
    </Box>
  );
};

export default GameDisplayDemo;