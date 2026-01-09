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
  Divider,
  Button,
  IconButton
} from '@mui/material';
import {
  CalendarToday as CalendarIcon,
  AccessTime as TimeIcon,
  LocationOn as LocationIcon,
  Notifications as NotificationIcon,
  NotificationsOff as NotificationOffIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { Game } from '../../types/game';

// Mock upcoming games data
const mockUpcomingGames: Game[] = [
  {
    id: '101',
    homeTeam: { name: 'Los Angeles Lakers', abbreviation: 'LAL', city: 'Los Angeles' },
    awayTeam: { name: 'Boston Celtics', abbreviation: 'BOS', city: 'Boston' },
    homeScore: 0,
    awayScore: 0,
    status: 'scheduled',
    startTime: dayjs().add(2, 'hours').toDate(),
    period: 0,
    timeRemaining: '',
    isLive: false
  },
  {
    id: '102',
    homeTeam: { name: 'Golden State Warriors', abbreviation: 'GSW', city: 'Golden State' },
    awayTeam: { name: 'Miami Heat', abbreviation: 'MIA', city: 'Miami' },
    homeScore: 0,
    awayScore: 0,
    status: 'scheduled',
    startTime: dayjs().add(1, 'day').add(3, 'hours').toDate(),
    period: 0,
    timeRemaining: '',
    isLive: false
  },
  {
    id: '103',
    homeTeam: { name: 'Denver Nuggets', abbreviation: 'DEN', city: 'Denver' },
    awayTeam: { name: 'Phoenix Suns', abbreviation: 'PHX', city: 'Phoenix' },
    homeScore: 0,
    awayScore: 0,
    status: 'scheduled',
    startTime: dayjs().add(2, 'days').add(1, 'hour').toDate(),
    period: 0,
    timeRemaining: '',
    isLive: false
  },
  {
    id: '104',
    homeTeam: { name: 'Milwaukee Bucks', abbreviation: 'MIL', city: 'Milwaukee' },
    awayTeam: { name: 'Philadelphia 76ers', abbreviation: 'PHI', city: 'Philadelphia' },
    homeScore: 0,
    awayScore: 0,
    status: 'scheduled',
    startTime: dayjs().add(3, 'days').add(2, 'hours').toDate(),
    period: 0,
    timeRemaining: '',
    isLive: false
  },
  {
    id: '105',
    homeTeam: { name: 'Toronto Raptors', abbreviation: 'TOR', city: 'Toronto' },
    awayTeam: { name: 'Atlanta Hawks', abbreviation: 'ATL', city: 'Atlanta' },
    homeScore: 0,
    awayScore: 0,
    status: 'scheduled',
    startTime: dayjs().add(4, 'days').add(4, 'hours').toDate(),
    period: 0,
    timeRemaining: '',
    isLive: false
  }
];

interface ScheduleCardProps {
  game: Game;
  onNotificationToggle?: (gameId: string, enabled: boolean) => void;
  notificationEnabled?: boolean;
}

const ScheduleCard: React.FC<ScheduleCardProps> = ({ 
  game, 
  onNotificationToggle,
  notificationEnabled = false 
}) => {
  const formatGameTime = (date: Date) => {
    return dayjs(date).format('h:mm A');
  };

  const formatGameDate = (date: Date) => {
    return dayjs(date).format('MMM DD, YYYY');
  };

  const getTimeUntilGame = (date: Date) => {
    const now = dayjs();
    const gameTime = dayjs(date);
    const diffInHours = gameTime.diff(now, 'hours');
    const diffInDays = gameTime.diff(now, 'days');
    
    if (diffInHours < 1) {
      const diffInMinutes = gameTime.diff(now, 'minutes');
      return `in ${diffInMinutes} minutes`;
    } else if (diffInHours < 24) {
      return `in ${diffInHours} hours`;
    } else {
      return `in ${diffInDays} days`;
    }
  };

  const isToday = dayjs(game.startTime).isSame(dayjs(), 'day');
  const isTomorrow = dayjs(game.startTime).isSame(dayjs().add(1, 'day'), 'day');

  return (
    <Card 
      sx={{ 
        mb: 2, 
        border: '1px solid #e0e0e0',
        borderLeft: isToday ? '4px solid #1976d2' : isTomorrow ? '4px solid #ff9800' : '1px solid #e0e0e0',
        '&:hover': {
          boxShadow: 2,
          cursor: 'pointer'
        }
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
              <CalendarIcon fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                {formatGameDate(game.startTime)}
              </Typography>
              {isToday && <Chip label="Today" size="small" color="primary" />}
              {isTomorrow && <Chip label="Tomorrow" size="small" color="warning" />}
            </Stack>
            
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
              <TimeIcon fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                {formatGameTime(game.startTime)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                ({getTimeUntilGame(game.startTime)})
              </Typography>
            </Stack>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton
              size="small"
              onClick={() => onNotificationToggle?.(game.id, !notificationEnabled)}
              color={notificationEnabled ? 'primary' : 'default'}
            >
              {notificationEnabled ? <NotificationIcon /> : <NotificationOffIcon />}
            </IconButton>
          </Box>
        </Box>

        <Grid container spacing={2} alignItems="center">
          {/* Away Team */}
          <Grid item xs={5}>
            <Box sx={{ textAlign: 'left' }}>
              <Typography variant="h6" color="text.primary">
                {game.awayTeam.abbreviation}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {game.awayTeam.city}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Away
              </Typography>
            </Box>
          </Grid>

          {/* VS */}
          <Grid item xs={2}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary">
                vs
              </Typography>
            </Box>
          </Grid>

          {/* Home Team */}
          <Grid item xs={5}>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="h6" color="text.primary">
                {game.homeTeam.abbreviation}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {game.homeTeam.city}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Home
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />
        
        {/* Game Details */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <LocationIcon fontSize="small" color="action" />
            <Typography variant="caption" color="text.secondary">
              {game.homeTeam.city} Arena
            </Typography>
          </Stack>
          
          <Chip 
            label="Scheduled"
            variant="outlined"
            size="small"
            color="info"
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export const SchedulePage: React.FC = () => {
  const [games, setGames] = useState<Game[]>(mockUpcomingGames);
  const [filteredGames, setFilteredGames] = useState<Game[]>(mockUpcomingGames);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [teamFilter, setTeamFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [notifications, setNotifications] = useState<Set<string>>(new Set());
  const [dateRange, setDateRange] = useState<string>('week');

  // Filter games based on selected criteria
  useEffect(() => {
    let filtered = [...games];

    // Date range filter
    const now = dayjs();
    if (dateRange === 'today') {
      filtered = filtered.filter(game => 
        dayjs(game.startTime).isSame(now, 'day')
      );
    } else if (dateRange === 'week') {
      filtered = filtered.filter(game => 
        dayjs(game.startTime).isBefore(now.add(7, 'days'))
      );
    } else if (dateRange === 'month') {
      filtered = filtered.filter(game => 
        dayjs(game.startTime).isBefore(now.add(30, 'days'))
      );
    }

    // Specific date filter
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

    // Sort by start time
    filtered.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

    setFilteredGames(filtered);
  }, [games, selectedDate, teamFilter, searchQuery, dateRange]);

  // Get unique teams for filter dropdown
  const uniqueTeams = Array.from(new Set([
    ...games.map(game => game.homeTeam.abbreviation),
    ...games.map(game => game.awayTeam.abbreviation)
  ])).sort();

  const handleNotificationToggle = (gameId: string, enabled: boolean) => {
    const newNotifications = new Set(notifications);
    if (enabled) {
      newNotifications.add(gameId);
    } else {
      newNotifications.delete(gameId);
    }
    setNotifications(newNotifications);
  };

  // Group games by date
  const groupedGames = filteredGames.reduce((groups, game) => {
    const dateKey = dayjs(game.startTime).format('YYYY-MM-DD');
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(game);
    return groups;
  }, {} as Record<string, Game[]>);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Typography variant="h4" gutterBottom>
          Game Schedule
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          View upcoming games and set notifications
        </Typography>

        {/* Quick Actions */}
        <Box sx={{ mb: 3 }}>
          <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
            <Button
              variant={dateRange === 'today' ? 'contained' : 'outlined'}
              size="small"
              onClick={() => setDateRange('today')}
            >
              Today
            </Button>
            <Button
              variant={dateRange === 'week' ? 'contained' : 'outlined'}
              size="small"
              onClick={() => setDateRange('week')}
            >
              This Week
            </Button>
            <Button
              variant={dateRange === 'month' ? 'contained' : 'outlined'}
              size="small"
              onClick={() => setDateRange('month')}
            >
              This Month
            </Button>
          </Stack>
        </Box>

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
          {Object.keys(groupedGames).length > 0 ? (
            Object.entries(groupedGames).map(([date, dayGames]) => (
              <Box key={date} sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                  {dayjs(date).format('dddd, MMMM DD, YYYY')}
                </Typography>
                {dayGames.map(game => (
                  <ScheduleCard 
                    key={game.id} 
                    game={game}
                    onNotificationToggle={handleNotificationToggle}
                    notificationEnabled={notifications.has(game.id)}
                  />
                ))}
              </Box>
            ))
          ) : (
            <Card sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary">
                No scheduled games found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Try adjusting your filters to see more results
              </Typography>
            </Card>
          )}
        </Box>

        {/* Summary */}
        {filteredGames.length > 0 && (
          <Box sx={{ textAlign: 'center', mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Showing {filteredGames.length} upcoming games
              {notifications.size > 0 && (
                <> • {notifications.size} notification{notifications.size !== 1 ? 's' : ''} set</>
              )}
            </Typography>
          </Box>
        )}
      </Box>
    </LocalizationProvider>
  );
};

export default SchedulePage;