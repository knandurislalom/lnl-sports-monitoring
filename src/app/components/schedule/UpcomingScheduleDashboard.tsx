import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Alert,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Autocomplete,
  Tabs,
  Tab,
  Badge,
  Switch,
  FormControlLabel,
  Divider,
  useTheme,
} from '@mui/material';
import {
  Schedule as ScheduleIcon,
  Refresh as RefreshIcon,
  FilterList as FilterIcon,
  Star as PrimetimeIcon,
  Sports as RivalryIcon,
  EmojiEvents as PlayoffIcon,
  Tv as BroadcastIcon,
  DateRange as DateIcon,
  ConfirmationNumber as TicketIcon,
  Timeline as StatsIcon,
  AccessTime as TimeIcon,
} from '@mui/icons-material';
import { UpcomingGameCard } from './UpcomingGameCard';
import { useRecentGames } from '../../hooks/useRecentGames';
import { UpcomingGame, UpcomingScheduleFilter } from '../../services/UpcomingScheduleService';
import { LoadingSpinner, TeamListSkeleton } from '../layout/LoadingStates';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { addDays, format, isToday, isTomorrow } from 'date-fns';

// ===== TAB PANEL COMPONENT =====
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

// ===== SCHEDULE OVERVIEW COMPONENT =====
interface ScheduleOverviewProps {
  games: UpcomingGame[];
}

const ScheduleOverview: React.FC<ScheduleOverviewProps> = ({ games }) => {
  const theme = useTheme();
  
  if (games.length === 0) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" color="text.secondary">
            No upcoming games available
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const totalGames = games.length;
  const primetimeGames = games.filter(g => g.isPrimetime).length;
  const rivalryGames = games.filter(g => g.isRivalry).length;
  const playoffImpactGames = games.filter(g => g.playoffImplications).length;

  const nextGame = games
    .filter(g => g.gameTime > new Date())
    .sort((a, b) => a.gameTime.getTime() - b.gameTime.getTime())[0];

  const todayGames = games.filter(g => isToday(g.gameTime));
  const tomorrowGames = games.filter(g => isTomorrow(g.gameTime));

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={3}>
        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <ScheduleIcon sx={{ fontSize: 40, color: theme.palette.primary.main, mb: 1 }} />
            <Typography variant="h4" fontWeight="bold">
              {totalGames}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Games
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} md={3}>
        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <PrimetimeIcon sx={{ fontSize: 40, color: theme.palette.warning.main, mb: 1 }} />
            <Typography variant="h4" fontWeight="bold">
              {primetimeGames}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Primetime Games
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} md={3}>
        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <RivalryIcon sx={{ fontSize: 40, color: theme.palette.error.main, mb: 1 }} />
            <Typography variant="h4" fontWeight="bold">
              {rivalryGames}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Rivalry Games
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} md={3}>
        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <PlayoffIcon sx={{ fontSize: 40, color: theme.palette.success.main, mb: 1 }} />
            <Typography variant="h4" fontWeight="bold">
              {playoffImpactGames}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Playoff Impact
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {nextGame && (
        <Grid item xs={12}>
          <Card sx={{ background: `linear-gradient(135deg, ${theme.palette.primary.main}15, ${theme.palette.secondary.main}15)` }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TimeIcon />
                Next Game
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="h5" fontWeight="bold">
                  {nextGame.awayTeam.shortName} @ {nextGame.homeTeam.shortName}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {isToday(nextGame.gameTime) ? 'Today' : isTomorrow(nextGame.gameTime) ? 'Tomorrow' : format(nextGame.gameTime, 'EEE MMM d')}
                  {' at '}
                  {format(nextGame.gameTime, 'h:mm a')}
                </Typography>
                {nextGame.broadcast && (
                  <Chip
                    icon={<BroadcastIcon />}
                    label={nextGame.broadcast.network}
                    size="small"
                    color="primary"
                  />
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      )}

      {(todayGames.length > 0 || tomorrowGames.length > 0) && (
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Quick Schedule</Typography>
              <Grid container spacing={2}>
                {todayGames.length > 0 && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <DateIcon sx={{ fontSize: 16 }} />
                      Today ({todayGames.length} games)
                    </Typography>
                    {todayGames.slice(0, 3).map(game => (
                      <Typography key={game.id} variant="body2" color="text.secondary" sx={{ ml: 3 }}>
                        • {game.awayTeam.shortName} @ {game.homeTeam.shortName} ({format(game.gameTime, 'h:mm a')})
                      </Typography>
                    ))}
                  </Grid>
                )}
                
                {tomorrowGames.length > 0 && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <DateIcon sx={{ fontSize: 16 }} />
                      Tomorrow ({tomorrowGames.length} games)
                    </Typography>
                    {tomorrowGames.slice(0, 3).map(game => (
                      <Typography key={game.id} variant="body2" color="text.secondary" sx={{ ml: 3 }}>
                        • {game.awayTeam.shortName} @ {game.homeTeam.shortName} ({format(game.gameTime, 'h:mm a')})
                      </Typography>
                    ))}
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      )}
    </Grid>
  );
};

// ===== MAIN UPCOMING SCHEDULE DASHBOARD COMPONENT =====

const UpcomingScheduleDashboard: React.FC = () => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [selectedGame, setSelectedGame] = useState<UpcomingGame | null>(null);
  const [gameVariant, setGameVariant] = useState<'default' | 'compact' | 'detailed'>('default');
  const [showPredictions, setShowPredictions] = useState(true);
  const [showBroadcast, setShowBroadcast] = useState(true);
  const [showTickets, setShowTickets] = useState(false);
  const [showInjuries, setShowInjuries] = useState(true);

  // Filter states
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'tomorrow' | 'week' | 'custom'>('week');
  const [customStartDate, setCustomStartDate] = useState<Date | null>(null);
  const [customEndDate, setCustomEndDate] = useState<Date | null>(null);
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [selectedConferences, setSelectedConferences] = useState<string[]>([]);
  const [selectedNetworks, setSelectedNetworks] = useState<string[]>([]);
  const [primetimeOnly, setPrimetimeOnly] = useState(false);
  const [rivalryOnly, setRivalryOnly] = useState(false);
  const [playoffImpactOnly, setPlayoffImpactOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'date' | 'spread' | 'overUnder'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Build filter object
  const buildFilter = (): UpcomingScheduleFilter => {
    const filter: UpcomingScheduleFilter = {
      sortBy,
      sortOrder,
    };

    // Date range filter
    const now = new Date();
    switch (dateFilter) {
      case 'today':
        filter.dateRange = {
          start: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
          end: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59),
        };
        break;
      case 'tomorrow':
        const tomorrow = addDays(now, 1);
        filter.dateRange = {
          start: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate()),
          end: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 23, 59, 59),
        };
        break;
      case 'week':
        filter.dateRange = {
          start: now,
          end: addDays(now, 7),
        };
        break;
      case 'custom':
        if (customStartDate && customEndDate) {
          filter.dateRange = {
            start: customStartDate,
            end: customEndDate,
          };
        }
        break;
    }

    // Other filters
    if (selectedTeams.length > 0) filter.teams = selectedTeams;
    if (selectedConferences.length > 0) filter.conferences = selectedConferences;
    if (selectedNetworks.length > 0) filter.networks = selectedNetworks;
    if (primetimeOnly) filter.primetimeOnly = true;
    if (rivalryOnly) filter.rivalryOnly = true;
    if (playoffImpactOnly) filter.playoffImpactOnly = true;

    return filter;
  };

  const {
    upcomingGames,
    filteredUpcomingGames,
    isLoading,
    error,
    setUpcomingScheduleFilter,
    refreshUpcomingSchedule,
    getTodayGames,
    getTomorrowGames,
    getPrimetimeGames,
    getRivalryGames,
    getPlayoffImplicationGames,
  } = useRecentGames({
    autoRefresh: true,
    refreshInterval: 300000, // Refresh every 5 minutes
    defaultUpcomingScheduleFilter: buildFilter(),
  });

  // Update filter when filter options change
  useEffect(() => {
    setUpcomingScheduleFilter(buildFilter());
  }, [
    dateFilter,
    customStartDate,
    customEndDate,
    selectedTeams,
    selectedConferences,
    selectedNetworks,
    primetimeOnly,
    rivalryOnly,
    playoffImpactOnly,
    sortBy,
    sortOrder,
  ]);

  const handleGameClick = (game: UpcomingGame) => {
    setSelectedGame(game);
    setTabValue(6); // Switch to game details tab
  };

  const handleRefresh = () => {
    refreshUpcomingSchedule();
  };

  // Get unique teams, conferences, and networks for filters
  const allTeams = Array.from(new Set(upcomingGames.flatMap(game => [game.homeTeam, game.awayTeam])));
  const allConferences = Array.from(new Set(allTeams.map(team => team.conference)));
  const allNetworks = Array.from(new Set(upcomingGames.map(game => game.broadcast?.network).filter(Boolean))) as string[];

  // Categorize games
  const todayGames = getTodayGames();
  const tomorrowGames = getTomorrowGames();
  const primetimeGames = getPrimetimeGames();
  const rivalryGames = getRivalryGames();
  const playoffGames = getPlayoffImplicationGames();

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ p: 3, maxWidth: 1400, mx: 'auto' }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h4" gutterBottom>
              Upcoming Schedule Dashboard
            </Typography>
            
            <Button
              variant="outlined"
              startIcon={isLoading ? <LoadingSpinner size={16} /> : <RefreshIcon />}
              onClick={handleRefresh}
              disabled={isLoading}
            >
              Refresh
            </Button>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Typography variant="body1" color="text.secondary">
            View upcoming NFL games with predictions, broadcast information, and ticket details.
          </Typography>
        </Box>

        {/* Schedule Overview */}
        {!isLoading && filteredUpcomingGames.length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <StatsIcon />
              Schedule Overview
            </Typography>
            <ScheduleOverview games={filteredUpcomingGames} />
          </Box>
        )}

        {/* Filters */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <FilterIcon />
              Filters & Settings
            </Typography>
            
            <Grid container spacing={2} alignItems="center">
              {/* Date Filter */}
              <Grid item xs={12} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Date Range</InputLabel>
                  <Select
                    value={dateFilter}
                    label="Date Range"
                    onChange={(e) => setDateFilter(e.target.value as any)}
                  >
                    <MenuItem value="today">Today</MenuItem>
                    <MenuItem value="tomorrow">Tomorrow</MenuItem>
                    <MenuItem value="week">Next Week</MenuItem>
                    <MenuItem value="all">All Games</MenuItem>
                    <MenuItem value="custom">Custom Range</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Custom Date Range */}
              {dateFilter === 'custom' && (
                <>
                  <Grid item xs={12} md={2}>
                    <DatePicker
                      label="Start Date"
                      value={customStartDate}
                      onChange={setCustomStartDate}
                      slotProps={{ textField: { size: 'small', fullWidth: true } }}
                    />
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <DatePicker
                      label="End Date"
                      value={customEndDate}
                      onChange={setCustomEndDate}
                      slotProps={{ textField: { size: 'small', fullWidth: true } }}
                    />
                  </Grid>
                </>
              )}

              {/* Team Filter */}
              <Grid item xs={12} md={3}>
                <Autocomplete
                  multiple
                  size="small"
                  options={allTeams.map(t => t.id)}
                  getOptionLabel={(option) => allTeams.find(t => t.id === option)?.shortName || option}
                  value={selectedTeams}
                  onChange={(_, newValue) => setSelectedTeams(newValue)}
                  renderInput={(params) => (
                    <TextField {...params} label="Teams" />
                  )}
                />
              </Grid>

              {/* Conference Filter */}
              <Grid item xs={12} md={2}>
                <Autocomplete
                  multiple
                  size="small"
                  options={allConferences}
                  value={selectedConferences}
                  onChange={(_, newValue) => setSelectedConferences(newValue)}
                  renderInput={(params) => (
                    <TextField {...params} label="Conference" />
                  )}
                />
              </Grid>

              {/* Network Filter */}
              <Grid item xs={12} md={2}>
                <Autocomplete
                  multiple
                  size="small"
                  options={allNetworks}
                  value={selectedNetworks}
                  onChange={(_, newValue) => setSelectedNetworks(newValue)}
                  renderInput={(params) => (
                    <TextField {...params} label="Network" />
                  )}
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />

            {/* Game Type Filters */}
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={2}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={primetimeOnly}
                      onChange={(e) => setPrimetimeOnly(e.target.checked)}
                    />
                  }
                  label="Primetime Only"
                />
              </Grid>

              <Grid item xs={12} md={2}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={rivalryOnly}
                      onChange={(e) => setRivalryOnly(e.target.checked)}
                    />
                  }
                  label="Rivalries Only"
                />
              </Grid>

              <Grid item xs={12} md={2}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={playoffImpactOnly}
                      onChange={(e) => setPlayoffImpactOnly(e.target.checked)}
                    />
                  }
                  label="Playoff Impact"
                />
              </Grid>

              <Grid item xs={6} md={1.5}>
                <FormControl fullWidth size="small">
                  <InputLabel>Sort By</InputLabel>
                  <Select value={sortBy} label="Sort By" onChange={(e) => setSortBy(e.target.value as any)}>
                    <MenuItem value="date">Date</MenuItem>
                    <MenuItem value="spread">Spread</MenuItem>
                    <MenuItem value="overUnder">Over/Under</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={6} md={1.5}>
                <FormControl fullWidth size="small">
                  <InputLabel>Order</InputLabel>
                  <Select value={sortOrder} label="Order" onChange={(e) => setSortOrder(e.target.value as any)}>
                    <MenuItem value="asc">Earliest First</MenuItem>
                    <MenuItem value="desc">Latest First</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />

            {/* Display Settings */}
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Card Style</InputLabel>
                  <Select
                    value={gameVariant}
                    label="Card Style"
                    onChange={(e) => setGameVariant(e.target.value as any)}
                  >
                    <MenuItem value="default">Default</MenuItem>
                    <MenuItem value="compact">Compact</MenuItem>
                    <MenuItem value="detailed">Detailed</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={2}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={showPredictions}
                      onChange={(e) => setShowPredictions(e.target.checked)}
                    />
                  }
                  label="Predictions"
                />
              </Grid>

              <Grid item xs={12} md={2}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={showBroadcast}
                      onChange={(e) => setShowBroadcast(e.target.checked)}
                    />
                  }
                  label="Broadcast Info"
                />
              </Grid>

              <Grid item xs={12} md={2}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={showTickets}
                      onChange={(e) => setShowTickets(e.target.checked)}
                    />
                  }
                  label="Ticket Info"
                />
              </Grid>

              <Grid item xs={12} md={2}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={showInjuries}
                      onChange={(e) => setShowInjuries(e.target.checked)}
                    />
                  }
                  label="Injury Reports"
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
            <Tab label={`All Upcoming (${filteredUpcomingGames.length})`} />
            <Tab label={`Today (${todayGames.length})`} />
            <Tab label={`Tomorrow (${tomorrowGames.length})`} />
            <Tab label={`Primetime (${primetimeGames.length})`} />
            <Tab label={`Rivalries (${rivalryGames.length})`} />
            <Tab label={`Playoff Impact (${playoffGames.length})`} />
            <Tab label="Game Details" disabled={!selectedGame} />
          </Tabs>
        </Box>

        {/* All Upcoming Games Tab */}
        <TabPanel value={tabValue} index={0}>
          {isLoading ? (
            <TeamListSkeleton items={6} />
          ) : filteredUpcomingGames.length > 0 ? (
            <Grid container spacing={3}>
              {filteredUpcomingGames.map((game) => (
                <Grid item xs={12} md={6} lg={4} key={game.id}>
                  <UpcomingGameCard
                    game={game}
                    variant={gameVariant}
                    showPredictions={showPredictions}
                    showBroadcast={showBroadcast}
                    showTickets={showTickets}
                    showInjuries={showInjuries}
                    onClick={handleGameClick}
                  />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box sx={{ textAlign: 'center', py: 8, color: 'text.secondary' }}>
              <ScheduleIcon sx={{ fontSize: 64, mb: 2, opacity: 0.5 }} />
              <Typography variant="h6">No Upcoming Games Found</Typography>
              <Typography variant="body2">
                Try adjusting your filters to see more games.
              </Typography>
            </Box>
          )}
        </TabPanel>

        {/* Today Games Tab */}
        <TabPanel value={tabValue} index={1}>
          {isLoading ? (
            <TeamListSkeleton items={4} />
          ) : todayGames.length > 0 ? (
            <Grid container spacing={3}>
              {todayGames.map((game) => (
                <Grid item xs={12} md={6} lg={4} key={game.id}>
                  <UpcomingGameCard
                    game={game}
                    variant={gameVariant}
                    showPredictions={showPredictions}
                    showBroadcast={showBroadcast}
                    showTickets={showTickets}
                    showInjuries={showInjuries}
                    onClick={handleGameClick}
                  />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box sx={{ textAlign: 'center', py: 8, color: 'text.secondary' }}>
              <DateIcon sx={{ fontSize: 64, mb: 2, opacity: 0.5 }} />
              <Typography variant="h6">No Games Today</Typography>
              <Typography variant="body2">
                Check the other tabs for upcoming games.
              </Typography>
            </Box>
          )}
        </TabPanel>

        {/* Tomorrow Games Tab */}
        <TabPanel value={tabValue} index={2}>
          {isLoading ? (
            <TeamListSkeleton items={4} />
          ) : tomorrowGames.length > 0 ? (
            <Grid container spacing={3}>
              {tomorrowGames.map((game) => (
                <Grid item xs={12} md={6} lg={4} key={game.id}>
                  <UpcomingGameCard
                    game={game}
                    variant={gameVariant}
                    showPredictions={showPredictions}
                    showBroadcast={showBroadcast}
                    showTickets={showTickets}
                    showInjuries={showInjuries}
                    onClick={handleGameClick}
                  />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box sx={{ textAlign: 'center', py: 8, color: 'text.secondary' }}>
              <DateIcon sx={{ fontSize: 64, mb: 2, opacity: 0.5 }} />
              <Typography variant="h6">No Games Tomorrow</Typography>
              <Typography variant="body2">
                Check the weekly schedule for upcoming games.
              </Typography>
            </Box>
          )}
        </TabPanel>

        {/* Primetime Games Tab */}
        <TabPanel value={tabValue} index={3}>
          {primetimeGames.length > 0 ? (
            <Grid container spacing={3}>
              {primetimeGames.map((game) => (
                <Grid item xs={12} md={6} lg={4} key={game.id}>
                  <UpcomingGameCard
                    game={game}
                    variant={gameVariant}
                    showPredictions={showPredictions}
                    showBroadcast={showBroadcast}
                    showTickets={showTickets}
                    showInjuries={showInjuries}
                    onClick={handleGameClick}
                  />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box sx={{ textAlign: 'center', py: 8, color: 'text.secondary' }}>
              <PrimetimeIcon sx={{ fontSize: 64, mb: 2, opacity: 0.5 }} />
              <Typography variant="h6">No Primetime Games</Typography>
              <Typography variant="body2">
                Monday Night, Thursday Night, and Sunday Night games will appear here.
              </Typography>
            </Box>
          )}
        </TabPanel>

        {/* Rivalry Games Tab */}
        <TabPanel value={tabValue} index={4}>
          {rivalryGames.length > 0 ? (
            <Grid container spacing={3}>
              {rivalryGames.map((game) => (
                <Grid item xs={12} md={6} lg={4} key={game.id}>
                  <UpcomingGameCard
                    game={game}
                    variant={gameVariant}
                    showPredictions={showPredictions}
                    showBroadcast={showBroadcast}
                    showTickets={showTickets}
                    showInjuries={showInjuries}
                    onClick={handleGameClick}
                  />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box sx={{ textAlign: 'center', py: 8, color: 'text.secondary' }}>
              <RivalryIcon sx={{ fontSize: 64, mb: 2, opacity: 0.5 }} />
              <Typography variant="h6">No Rivalry Games</Typography>
              <Typography variant="body2">
                Classic division and historic rivalries will appear here.
              </Typography>
            </Box>
          )}
        </TabPanel>

        {/* Playoff Impact Games Tab */}
        <TabPanel value={tabValue} index={5}>
          {playoffGames.length > 0 ? (
            <Grid container spacing={3}>
              {playoffGames.map((game) => (
                <Grid item xs={12} md={6} lg={4} key={game.id}>
                  <UpcomingGameCard
                    game={game}
                    variant={gameVariant}
                    showPredictions={showPredictions}
                    showBroadcast={showBroadcast}
                    showTickets={showTickets}
                    showInjuries={showInjuries}
                    onClick={handleGameClick}
                  />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box sx={{ textAlign: 'center', py: 8, color: 'text.secondary' }}>
              <PlayoffIcon sx={{ fontSize: 64, mb: 2, opacity: 0.5 }} />
              <Typography variant="h6">No Playoff Impact Games</Typography>
              <Typography variant="body2">
                Games with playoff seeding implications will appear here.
              </Typography>
            </Box>
          )}
        </TabPanel>

        {/* Game Details Tab */}
        <TabPanel value={tabValue} index={6}>
          {selectedGame ? (
            <Box>
              <Button
                variant="outlined"
                onClick={() => setSelectedGame(null)}
                sx={{ mb: 3 }}
              >
                ← Back to Schedule
              </Button>
              <UpcomingGameCard
                game={selectedGame}
                variant="detailed"
                showPredictions={true}
                showBroadcast={true}
                showTickets={true}
                showInjuries={true}
              />
            </Box>
          ) : (
            <Box sx={{ textAlign: 'center', py: 8, color: 'text.secondary' }}>
              <ScheduleIcon sx={{ fontSize: 64, mb: 2, opacity: 0.5 }} />
              <Typography variant="h6">No Game Selected</Typography>
              <Typography variant="body2">
                Click on a game card to view detailed information.
              </Typography>
            </Box>
          )}
        </TabPanel>
      </Box>
    </LocalizationProvider>
  );
};

export default UpcomingScheduleDashboard;