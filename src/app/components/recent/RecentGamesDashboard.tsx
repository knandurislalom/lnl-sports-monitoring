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
  Collapse,
  IconButton,
  useTheme,
} from '@mui/material';
import {
  History as RecentIcon,
  Refresh as RefreshIcon,
  FilterList as FilterIcon,
  TrendingUp as TrendingIcon,
  EmojiEvents as TrophyIcon,
  Timeline as StatsIcon,
  DateRange as DateIcon,
  Sports as GameIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from '@mui/icons-material';
import { RecentGameCard } from './RecentGameCard';
import { useRecentGames } from '../../hooks/useRecentGames';
import { useResponsive, useResponsiveGrid, useResponsiveTypography, useResponsiveSpacing } from '../../hooks/useResponsive';
import { DetailedGameResult, RecentGamesFilter } from '../../services/RecentGamesService';
import { LoadingSpinner, TeamListSkeleton } from '../layout/LoadingStates';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { subDays, format } from 'date-fns';

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

// ===== GAME STATS SUMMARY COMPONENT =====
interface GameStatsSummaryProps {
  games: DetailedGameResult[];
}

const GameStatsSummary: React.FC<GameStatsSummaryProps> = ({ games }) => {
  const theme = useTheme();
  
  if (games.length === 0) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" color="text.secondary">
            No games available for statistics
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const totalGames = games.length;
  const totalPoints = games.reduce((sum, game) => sum + game.homeScore + game.awayScore, 0);
  const averageScore = totalPoints / totalGames;

  const highestScoringGame = games.reduce((highest, game) =>
    (game.homeScore + game.awayScore) > (highest.homeScore + highest.awayScore) ? game : highest
  );

  const closestGame = games.reduce((closest, game) => {
    const gameMargin = Math.abs(game.homeScore - game.awayScore);
    const closestMargin = Math.abs(closest.homeScore - closest.awayScore);
    return gameMargin < closestMargin ? game : closest;
  });

  const biggestBlowout = games.reduce((biggest, game) => {
    const gameMargin = Math.abs(game.homeScore - game.awayScore);
    const biggestMargin = Math.abs(biggest.homeScore - biggest.awayScore);
    return gameMargin > biggestMargin ? game : biggest;
  });

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={3}>
        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <GameIcon sx={{ fontSize: 40, color: theme.palette.primary.main, mb: 1 }} />
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
            <StatsIcon sx={{ fontSize: 40, color: theme.palette.secondary.main, mb: 1 }} />
            <Typography variant="h4" fontWeight="bold">
              {averageScore.toFixed(1)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Avg Total Score
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} md={3}>
        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <TrendingIcon sx={{ fontSize: 40, color: theme.palette.success.main, mb: 1 }} />
            <Typography variant="h4" fontWeight="bold">
              {highestScoringGame.homeScore + highestScoringGame.awayScore}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Highest Scoring
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {highestScoringGame.awayTeam.shortName} vs {highestScoringGame.homeTeam.shortName}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} md={3}>
        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <TrophyIcon sx={{ fontSize: 40, color: theme.palette.warning.main, mb: 1 }} />
            <Typography variant="h4" fontWeight="bold">
              {Math.abs(closestGame.homeScore - closestGame.awayScore)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Closest Margin
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {closestGame.awayTeam.shortName} vs {closestGame.homeTeam.shortName}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

// ===== MAIN RECENT GAMES DASHBOARD COMPONENT =====

const RecentGamesDashboard: React.FC = () => {
  const theme = useTheme();
  const { isMobile, isTablet } = useResponsive();
  const { getOptimalColumns } = useResponsiveGrid();
  const { getHeadingVariant, getButtonSize } = useResponsiveTypography();
  const { getContainerSpacing, getCardSpacing, getSectionSpacing } = useResponsiveSpacing();
  
  const [tabValue, setTabValue] = useState(0);
  const [selectedGame, setSelectedGame] = useState<DetailedGameResult | null>(null);
  const [gameVariant, setGameVariant] = useState<'default' | 'compact' | 'detailed'>(
    isMobile ? 'compact' : 'default'
  );
  const [showStats, setShowStats] = useState(!isMobile);
  const [showQuarterScores, setShowQuarterScores] = useState(!isMobile);
  const [showFilters, setShowFilters] = useState(false);

  // Filter states
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'yesterday' | '24h' | 'week' | 'custom'>('24h');
  const [customStartDate, setCustomStartDate] = useState<Date | null>(null);
  const [customEndDate, setCustomEndDate] = useState<Date | null>(null);
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [selectedConferences, setSelectedConferences] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'date' | 'score' | 'margin'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [minScore, setMinScore] = useState<number | ''>('');
  const [maxMargin, setMaxMargin] = useState<number | ''>('');

  // Build filter object
  const buildFilter = (): RecentGamesFilter => {
    const filter: RecentGamesFilter = {
      sortBy,
      sortOrder,
    };

    // Date range filter
    const now = new Date();
    switch (dateFilter) {
      case 'today':
        filter.dateRange = {
          start: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
          end: now,
        };
        break;
      case 'yesterday':
        const yesterday = subDays(now, 1);
        filter.dateRange = {
          start: new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate()),
          end: new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 23, 59, 59),
        };
        break;
      case '24h':
        filter.dateRange = {
          start: subDays(now, 1),
          end: now,
        };
        break;
      case 'week':
        filter.dateRange = {
          start: subDays(now, 7),
          end: now,
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
    if (minScore !== '') filter.minScore = Number(minScore);

    return filter;
  };

  const {
    games,
    filteredGames,
    isLoading,
    error,
    setFilter,
    refreshGames,
    getLast24Hours,
    getLastWeek,
    getHighScoringGames,
    getCloseGames,
    getBlowoutGames,
  } = useRecentGames({
    autoRefresh: true,
    refreshInterval: 60000, // Refresh every minute
    defaultFilter: buildFilter(),
  });

  // Update filter when filter options change
  useEffect(() => {
    setFilter(buildFilter());
  }, [
    dateFilter,
    customStartDate,
    customEndDate,
    selectedTeams,
    selectedConferences,
    sortBy,
    sortOrder,
    minScore,
  ]);

  const handleGameClick = (game: DetailedGameResult) => {
    setSelectedGame(game);
    setTabValue(4); // Switch to game details tab
  };

  const handleRefresh = () => {
    refreshGames();
  };

  // Get unique teams and conferences for filters
  const allTeams = Array.from(new Set(games.flatMap(game => [game.homeTeam, game.awayTeam])));
  const allConferences = Array.from(new Set(allTeams.map(team => team.conference)));

  // Categorize games
  const last24HourGames = getLast24Hours();
  const lastWeekGames = getLastWeek();
  const highScoringGames = getHighScoringGames(50);
  const closeGames = getCloseGames(7);
  const blowoutGames = getBlowoutGames(21);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ p: 3, maxWidth: 1400, mx: 'auto' }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h4" gutterBottom>
              Recent Games Dashboard
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
            View completed NFL games with detailed scores, statistics, and analysis.
          </Typography>
        </Box>

        {/* Game Statistics Summary */}
        {!isLoading && filteredGames.length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <StatsIcon />
              Game Statistics Summary
            </Typography>
            <GameStatsSummary games={filteredGames} />
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
                    <MenuItem value="24h">Last 24 Hours</MenuItem>
                    <MenuItem value="today">Today</MenuItem>
                    <MenuItem value="yesterday">Yesterday</MenuItem>
                    <MenuItem value="week">Last Week</MenuItem>
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

              {/* Sort Options */}
              <Grid item xs={6} md={1.5}>
                <FormControl fullWidth size="small">
                  <InputLabel>Sort By</InputLabel>
                  <Select value={sortBy} label="Sort By" onChange={(e) => setSortBy(e.target.value as any)}>
                    <MenuItem value="date">Date</MenuItem>
                    <MenuItem value="score">Score</MenuItem>
                    <MenuItem value="margin">Margin</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={6} md={1.5}>
                <FormControl fullWidth size="small">
                  <InputLabel>Order</InputLabel>
                  <Select value={sortOrder} label="Order" onChange={(e) => setSortOrder(e.target.value as any)}>
                    <MenuItem value="desc">Newest First</MenuItem>
                    <MenuItem value="asc">Oldest First</MenuItem>
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

              <Grid item xs={12} md={3}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={showStats}
                      onChange={(e) => setShowStats(e.target.checked)}
                    />
                  }
                  label="Show Statistics"
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={showQuarterScores}
                      onChange={(e) => setShowQuarterScores(e.target.checked)}
                    />
                  }
                  label="Show Quarter Scores"
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
            <Tab label={`All Recent (${filteredGames.length})`} />
            <Tab label={`Last 24 Hours (${last24HourGames.length})`} />
            <Tab label={`High Scoring (${highScoringGames.length})`} />
            <Tab label={`Close Games (${closeGames.length})`} />
            <Tab label="Game Details" disabled={!selectedGame} />
          </Tabs>
        </Box>

        {/* All Recent Games Tab */}
        <TabPanel value={tabValue} index={0}>
          {isLoading ? (
            <TeamListSkeleton items={6} />
          ) : filteredGames.length > 0 ? (
            <Grid container spacing={3}>
              {filteredGames.map((game) => (
                <Grid item xs={12} md={6} lg={4} key={game.id}>
                  <RecentGameCard
                    game={game}
                    variant={gameVariant}
                    showStats={showStats}
                    showQuarterScores={showQuarterScores}
                    onClick={handleGameClick}
                  />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box sx={{ textAlign: 'center', py: 8, color: 'text.secondary' }}>
              <RecentIcon sx={{ fontSize: 64, mb: 2, opacity: 0.5 }} />
              <Typography variant="h6">No Recent Games Found</Typography>
              <Typography variant="body2">
                Try adjusting your filters to see more games.
              </Typography>
            </Box>
          )}
        </TabPanel>

        {/* Last 24 Hours Tab */}
        <TabPanel value={tabValue} index={1}>
          {isLoading ? (
            <TeamListSkeleton items={4} />
          ) : last24HourGames.length > 0 ? (
            <Grid container spacing={3}>
              {last24HourGames.map((game) => (
                <Grid item xs={12} md={6} lg={4} key={game.id}>
                  <RecentGameCard
                    game={game}
                    variant={gameVariant}
                    showStats={showStats}
                    showQuarterScores={showQuarterScores}
                    onClick={handleGameClick}
                  />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box sx={{ textAlign: 'center', py: 8, color: 'text.secondary' }}>
              <DateIcon sx={{ fontSize: 64, mb: 2, opacity: 0.5 }} />
              <Typography variant="h6">No Games in Last 24 Hours</Typography>
              <Typography variant="body2">
                Check back later for recently completed games.
              </Typography>
            </Box>
          )}
        </TabPanel>

        {/* High Scoring Games Tab */}
        <TabPanel value={tabValue} index={2}>
          {highScoringGames.length > 0 ? (
            <Grid container spacing={3}>
              {highScoringGames.map((game) => (
                <Grid item xs={12} md={6} lg={4} key={game.id}>
                  <RecentGameCard
                    game={game}
                    variant={gameVariant}
                    showStats={showStats}
                    showQuarterScores={showQuarterScores}
                    onClick={handleGameClick}
                  />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box sx={{ textAlign: 'center', py: 8, color: 'text.secondary' }}>
              <TrendingIcon sx={{ fontSize: 64, mb: 2, opacity: 0.5 }} />
              <Typography variant="h6">No High Scoring Games</Typography>
              <Typography variant="body2">
                Games with 50+ total points will appear here.
              </Typography>
            </Box>
          )}
        </TabPanel>

        {/* Close Games Tab */}
        <TabPanel value={tabValue} index={3}>
          {closeGames.length > 0 ? (
            <Grid container spacing={3}>
              {closeGames.map((game) => (
                <Grid item xs={12} md={6} lg={4} key={game.id}>
                  <RecentGameCard
                    game={game}
                    variant={gameVariant}
                    showStats={showStats}
                    showQuarterScores={showQuarterScores}
                    onClick={handleGameClick}
                  />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box sx={{ textAlign: 'center', py: 8, color: 'text.secondary' }}>
              <TrophyIcon sx={{ fontSize: 64, mb: 2, opacity: 0.5 }} />
              <Typography variant="h6">No Close Games</Typography>
              <Typography variant="body2">
                Games decided by 7 points or less will appear here.
              </Typography>
            </Box>
          )}
        </TabPanel>

        {/* Game Details Tab */}
        <TabPanel value={tabValue} index={4}>
          {selectedGame ? (
            <Box>
              <Button
                variant="outlined"
                onClick={() => setSelectedGame(null)}
                sx={{ mb: 3 }}
              >
                ← Back to Games
              </Button>
              <RecentGameCard
                game={selectedGame}
                variant="detailed"
                showStats={true}
                showQuarterScores={true}
              />
            </Box>
          ) : (
            <Box sx={{ textAlign: 'center', py: 8, color: 'text.secondary' }}>
              <GameIcon sx={{ fontSize: 64, mb: 2, opacity: 0.5 }} />
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

export default RecentGamesDashboard;