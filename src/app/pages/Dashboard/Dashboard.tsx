import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Tabs,
  Tab,
  Chip,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  ToggleButtonGroup,
  ToggleButton,
  Alert,
} from '@mui/material';
import {
  ViewModule as GridIcon,
  ViewList as ListIcon,
  Sports as SportsIcon,
} from '@mui/icons-material';
import { Game } from '@core-types/game.types';
import { mockGamesService } from '@shared-services/mockGames.service';
import { GameCard, LoadingSpinner } from '@shared-components';
import { getFavoriteTeams, addFavoriteTeam, removeFavoriteTeam } from '@core-utils/storage.utils';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => (
  <div hidden={value !== index} style={{ paddingTop: 16 }}>
    {value === index && children}
  </div>
);

export const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [games, setGames] = useState<Game[]>([]);
  const [favoriteTeams, setFavoriteTeams] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState(0);
  const [selectedSport, setSelectedSport] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [error, setError] = useState<string | null>(null);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Load games and favorite teams
        const [gamesData, favTeams] = await Promise.all([
          mockGamesService.getGames(),
          Promise.resolve(getFavoriteTeams()),
        ]);
        
        setGames(gamesData);
        setFavoriteTeams(favTeams);
      } catch (err) {
        setError('Failed to load games data. Please try refreshing the page.');
        console.error('Error loading dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Auto-refresh live games every 30 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const updatedGames = await mockGamesService.getGames();
        setGames(updatedGames);
      } catch (err) {
        console.error('Error refreshing games:', err);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleFavoriteToggle = (gameId: string) => {
    const game = games.find(g => g.id === gameId);
    if (!game) return;

    const isAwayFavorite = favoriteTeams.includes(game.awayTeam.id);
    const isHomeFavorite = favoriteTeams.includes(game.homeTeam.id);
    
    // If either team is favorited, remove both, otherwise add both
    if (isAwayFavorite || isHomeFavorite) {
      removeFavoriteTeam(game.awayTeam.id);
      removeFavoriteTeam(game.homeTeam.id);
      setFavoriteTeams(prev => prev.filter(id => id !== game.awayTeam.id && id !== game.homeTeam.id));
    } else {
      addFavoriteTeam(game.awayTeam.id);
      addFavoriteTeam(game.homeTeam.id);
      setFavoriteTeams(prev => [...prev, game.awayTeam.id, game.homeTeam.id]);
    }
  };

  const isGameFavorite = (game: Game): boolean => {
    return favoriteTeams.includes(game.awayTeam.id) || favoriteTeams.includes(game.homeTeam.id);
  };

  const filterGamesBySport = (games: Game[]): Game[] => {
    if (selectedSport === 'all') return games;
    return games.filter(game => game.sport === selectedSport);
  };

  const liveGames = filterGamesBySport(games.filter(game => game.status === 'live'));
  const todayGames = filterGamesBySport(games.filter(game => {
    const today = new Date().toDateString();
    return new Date(game.startTime).toDateString() === today;
  }));
  const favoriteGames = filterGamesBySport(games.filter(isGameFavorite));

  const renderGamesGrid = (gamesList: Game[], emptyMessage: string) => {
    if (gamesList.length === 0) {
      return (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <SportsIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            {emptyMessage}
          </Typography>
        </Box>
      );
    }

    return (
      <Grid container spacing={viewMode === 'grid' ? 3 : 1}>
        {gamesList.map(game => (
          <Grid 
            item 
            xs={12} 
            sm={viewMode === 'grid' ? 6 : 12} 
            md={viewMode === 'grid' ? 4 : 12} 
            lg={viewMode === 'grid' ? 3 : 12}
            key={game.id}
          >
            <GameCard
              game={game}
              isFavorite={isGameFavorite(game)}
              onFavoriteToggle={handleFavoriteToggle}
              variant={viewMode === 'list' ? 'compact' : 'default'}
            />
          </Grid>
        ))}
      </Grid>
    );
  };

  if (loading) {
    return <LoadingSpinner message="Loading sports data..." />;
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Sports Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Stay up to date with live games and scores
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Controls */}
      <Box sx={{ 
        display: 'flex', 
        flexWrap: 'wrap',
        gap: 2, 
        mb: 3,
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Live Games Count */}
          {liveGames.length > 0 && (
            <Chip
              label={`${liveGames.length} Live Game${liveGames.length !== 1 ? 's' : ''}`}
              color="success"
              variant="filled"
              sx={{ fontWeight: 'bold' }}
            />
          )}

          {/* Sport Filter */}
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Sport</InputLabel>
            <Select
              value={selectedSport}
              label="Sport"
              onChange={(e) => setSelectedSport(e.target.value)}
            >
              <MenuItem value="all">All Sports</MenuItem>
              <MenuItem value="nfl">NFL</MenuItem>
              <MenuItem value="nba">NBA</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* View Mode Toggle */}
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={(_, newMode) => newMode && setViewMode(newMode)}
          size="small"
        >
          <ToggleButton value="grid">
            <GridIcon />
          </ToggleButton>
          <ToggleButton value="list">
            <ListIcon />
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
          <Tab 
            label={`Live Games (${liveGames.length})`}
            disabled={liveGames.length === 0}
          />
          <Tab label={`Today's Games (${todayGames.length})`} />
          <Tab 
            label={`Favorites (${favoriteGames.length})`}
            disabled={favoriteGames.length === 0}
          />
        </Tabs>
      </Box>

      {/* Tab Panels */}
      <TabPanel value={activeTab} index={0}>
        {renderGamesGrid(liveGames, 'No live games right now')}
      </TabPanel>

      <TabPanel value={activeTab} index={1}>
        {renderGamesGrid(todayGames, 'No games scheduled for today')}
      </TabPanel>

      <TabPanel value={activeTab} index={2}>
        {renderGamesGrid(favoriteGames, 'No favorite team games found. Add teams to favorites to see their games here.')}
      </TabPanel>
    </Box>
  );
};