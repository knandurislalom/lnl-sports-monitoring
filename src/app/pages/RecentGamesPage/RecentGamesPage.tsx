import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Stack,
  Divider
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { Game } from '../../types/game';

// Mock recent games data
const mockRecentGames: Game[] = [
  {
    id: '1',
    homeTeam: { name: 'Los Angeles Lakers', abbreviation: 'LAL', city: 'Los Angeles' },
    awayTeam: { name: 'Boston Celtics', abbreviation: 'BOS', city: 'Boston' },
    homeScore: 108,
    awayScore: 112,
    status: 'completed',
    startTime: dayjs().subtract(2, 'hours').toDate(),
    period: 4,
    timeRemaining: '00:00',
    isLive: false
  },
  {
    id: '2',
    homeTeam: { name: 'Golden State Warriors', abbreviation: 'GSW', city: 'Golden State' },
    awayTeam: { name: 'Miami Heat', abbreviation: 'MIA', city: 'Miami' },
    homeScore: 115,
    awayScore: 108,
    status: 'completed',
    startTime: dayjs().subtract(1, 'day').toDate(),
    period: 4,
    timeRemaining: '00:00',
    isLive: false
  },
  {
    id: '3',
    homeTeam: { name: 'Denver Nuggets', abbreviation: 'DEN', city: 'Denver' },
    awayTeam: { name: 'Phoenix Suns', abbreviation: 'PHX', city: 'Phoenix' },
    homeScore: 122,
    awayScore: 119,
    status: 'completed',
    startTime: dayjs().subtract(2, 'days').toDate(),
    period: 4,
    timeRemaining: '00:00',
    isLive: false
  },
  {
    id: '4',
    homeTeam: { name: 'Milwaukee Bucks', abbreviation: 'MIL', city: 'Milwaukee' },
    awayTeam: { name: 'Philadelphia 76ers', abbreviation: 'PHI', city: 'Philadelphia' },
    homeScore: 98,
    awayScore: 105,
    status: 'completed',
    startTime: dayjs().subtract(3, 'days').toDate(),
    period: 4,
    timeRemaining: '00:00',
    isLive: false
  }
];

interface GameSummaryCardProps {
  game: Game;
}

const GameSummaryCard: React.FC<GameSummaryCardProps> = ({ game }) => {
  const isHomeWinner = (game.homeScore || 0) > (game.awayScore || 0);
  const isAwayWinner = (game.awayScore || 0) > (game.homeScore || 0);

  const formatGameTime = (date: Date) => {
    return dayjs(date).format('MMM DD, YYYY - h:mm A');
  };

  const getTimeAgo = (date: Date) => {
    const now = dayjs();
    const gameTime = dayjs(date);
    const diffInHours = now.diff(gameTime, 'hours');
    
    if (diffInHours < 1) {
      return `${now.diff(gameTime, 'minutes')} minutes ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else {
      return `${Math.floor(diffInHours / 24)} days ago`;
    }
  };

  return (
    <Card 
      sx={{ 
        mb: 2, 
        border: '1px solid #e0e0e0',
        '&:hover': {
          boxShadow: 2,
          cursor: 'pointer'
        }
      }}
    >
      <CardContent>
        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" color="text.secondary">
            Final • {getTimeAgo(game.startTime)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {formatGameTime(game.startTime)}
          </Typography>
        </Box>

        <Grid container spacing={2} alignItems="center">
          {/* Away Team */}
          <Grid item xs={4}>
            <Box sx={{ textAlign: 'left' }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: isAwayWinner ? 'bold' : 'normal',
                  color: isAwayWinner ? 'primary.main' : 'text.primary'
                }}
              >
                {game.awayTeam.abbreviation}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {game.awayTeam.city}
              </Typography>
            </Box>
          </Grid>

          {/* Score */}
          <Grid item xs={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Stack direction="row" spacing={1} justifyContent="center" alignItems="center">
                <Typography 
                  variant="h5" 
                  sx={{ 
                    fontWeight: isAwayWinner ? 'bold' : 'normal',
                    color: isAwayWinner ? 'primary.main' : 'text.primary'
                  }}
                >
                  {game.awayScore}
                </Typography>
                <Typography variant="h6" color="text.secondary">-</Typography>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    fontWeight: isHomeWinner ? 'bold' : 'normal',
                    color: isHomeWinner ? 'primary.main' : 'text.primary'
                  }}
                >
                  {game.homeScore}
                </Typography>
              </Stack>
              {isHomeWinner && (
                <Chip 
                  label="W" 
                  size="small" 
                  color="success" 
                  sx={{ mt: 0.5, fontSize: '0.7rem' }} 
                />
              )}
              {isAwayWinner && (
                <Chip 
                  label="W" 
                  size="small" 
                  color="success" 
                  sx={{ mt: 0.5, fontSize: '0.7rem' }} 
                />
              )}
            </Box>
          </Grid>

          {/* Home Team */}
          <Grid item xs={4}>
            <Box sx={{ textAlign: 'right' }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: isHomeWinner ? 'bold' : 'normal',
                  color: isHomeWinner ? 'primary.main' : 'text.primary'
                }}
              >
                {game.homeTeam.abbreviation}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {game.homeTeam.city}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 1 }} />
        
        {/* Game Details */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Chip 
            label="Final"
            variant="outlined"
            size="small"
            color="success"
          />
          <Typography variant="caption" color="text.secondary">
            Game ID: {game.id}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export const RecentGamesPage: React.FC = () => {
  const [games, setGames] = useState<Game[]>(mockRecentGames);
  const [filteredGames, setFilteredGames] = useState<Game[]>(mockRecentGames);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [teamFilter, setTeamFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Filter games based on selected criteria
  useEffect(() => {
    let filtered = [...games];

    // Date filter
    if (selectedDate) {
      filtered = filtered.filter(game => 
        dayjs(game.startTime).isSame(selectedDate, 'day')
      );
    }

    // Team filter
    if (teamFilter) {
      filtered = filtered.filter(game =>
        game.homeTeam.abbreviation === teamFilter || 
        game.awayTeam.abbreviation === teamFilter
      );
    }

    // Search query filter
    if (searchQuery) {
      filtered = filtered.filter(game =>
        game.homeTeam.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.awayTeam.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.homeTeam.abbreviation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.awayTeam.abbreviation.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredGames(filtered);
  }, [games, selectedDate, teamFilter, searchQuery]);

  // Get unique teams for filter dropdown
  const uniqueTeams = Array.from(new Set([
    ...games.map(game => game.homeTeam.abbreviation),
    ...games.map(game => game.awayTeam.abbreviation)
  ])).sort();

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Typography variant="h4" gutterBottom>
          Recent Games
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          View completed games and final scores
        </Typography>

        {/* Filters */}
        <Box sx={{ mb: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Search Teams"
                variant="outlined"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter team name or abbreviation"
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Filter by Team</InputLabel>
                <Select
                  value={teamFilter}
                  label="Filter by Team"
                  onChange={(e) => setTeamFilter(e.target.value)}
                >
                  <MenuItem value="">All Teams</MenuItem>
                  {uniqueTeams.map(team => (
                    <MenuItem key={team} value={team}>
                      {team}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <DatePicker
                label="Filter by Date"
                value={selectedDate}
                onChange={(newValue) => setSelectedDate(newValue)}
                slotProps={{
                  textField: {
                    fullWidth: true
                  }
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                <Typography variant="body2" color="text.secondary">
                  {filteredGames.length} games found
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Games List */}
        <Box>
          {filteredGames.length > 0 ? (
            filteredGames.map(game => (
              <GameSummaryCard key={game.id} game={game} />
            ))
          ) : (
            <Card sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary">
                No games found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Try adjusting your filters to see more results
              </Typography>
            </Card>
          )}
        </Box>

        {/* Load More Button (placeholder for future pagination) */}
        {filteredGames.length > 0 && (
          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Showing {filteredGames.length} recent games
            </Typography>
          </Box>
        )}
      </Box>
    </LocalizationProvider>
  );
};

export default RecentGamesPage;