import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Alert,
  Grid,
  Card,
  CardContent,
  Badge,
  Chip,
  TextField,
  Autocomplete,
  useTheme,
} from '@mui/material';
import {
  ViewModule as GridIcon,
  ViewList as ListIcon,
  Sort as SortIcon,
  FilterList as FilterIcon,
  Favorite as FavoriteIcon,
  Visibility as WatchIcon,
  SportsFootball as PlayersIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { PlayerCard, PlayerList, Player } from './PlayerCard';
import { PlayerDetails, PlayerComparison, DetailedPlayer } from './PlayerDetails';
import { LoadingSpinner, TeamListSkeleton, useLoadingState } from '../layout/LoadingStates';

// ===== MOCK DATA =====

const createMockPlayer = (
  id: string,
  name: string,
  firstName: string,
  lastName: string,
  number: number,
  position: string,
  team: any,
  info: any
): DetailedPlayer => {
  // Generate position-specific stats
  const generateStats = (pos: string) => {
    const baseStats = {
      gamesPlayed: Math.floor(Math.random() * 17) + 1,
      gamesStarted: Math.floor(Math.random() * 17),
    };

    switch (pos.toUpperCase()) {
      case 'QB':
        return {
          ...baseStats,
          passingYards: Math.floor(Math.random() * 3000) + 2000,
          passingTouchdowns: Math.floor(Math.random() * 25) + 15,
          interceptions: Math.floor(Math.random() * 15) + 5,
          completions: Math.floor(Math.random() * 200) + 250,
          attempts: Math.floor(Math.random() * 100) + 400,
          passingRating: Math.random() * 40 + 80,
          rushingYards: Math.floor(Math.random() * 300) + 100,
          rushingTouchdowns: Math.floor(Math.random() * 8) + 2,
        };
      case 'RB':
      case 'FB':
        return {
          ...baseStats,
          rushingYards: Math.floor(Math.random() * 1000) + 800,
          rushingTouchdowns: Math.floor(Math.random() * 12) + 6,
          rushingAttempts: Math.floor(Math.random() * 150) + 200,
          yardsPerCarry: Math.random() * 2 + 3.5,
          receptions: Math.floor(Math.random() * 40) + 20,
          receivingYards: Math.floor(Math.random() * 400) + 200,
          receivingTouchdowns: Math.floor(Math.random() * 5) + 2,
        };
      case 'WR':
      case 'TE':
        return {
          ...baseStats,
          receptions: Math.floor(Math.random() * 60) + 40,
          receivingYards: Math.floor(Math.random() * 800) + 600,
          receivingTouchdowns: Math.floor(Math.random() * 10) + 5,
          targets: Math.floor(Math.random() * 40) + 80,
          yardsPerReception: Math.random() * 5 + 12,
        };
      default:
        return {
          ...baseStats,
          tackles: Math.floor(Math.random() * 80) + 50,
          assistedTackles: Math.floor(Math.random() * 30) + 20,
          sacks: Math.random() * 8 + 2,
          interceptionsCaught: Math.floor(Math.random() * 4) + 1,
          passesDefended: Math.floor(Math.random() * 15) + 8,
          forcedFumbles: Math.floor(Math.random() * 3) + 1,
        };
    }
  };

  const stats = generateStats(position);

  return {
    id,
    name,
    firstName,
    lastName,
    number,
    position,
    team,
    info,
    stats,
    seasonStats: stats,
    careerStats: {
      ...stats,
      // Multiply by years for career stats
      passingYards: stats.passingYards ? stats.passingYards * info.experience : undefined,
      rushingYards: stats.rushingYards ? stats.rushingYards * info.experience : undefined,
      receivingYards: stats.receivingYards ? stats.receivingYards * info.experience : undefined,
      tackles: stats.tackles ? stats.tackles * info.experience : undefined,
    },
    detailedStats: {
      seasons: Array.from({ length: info.experience }, (_, i) => ({
        year: 2024 - i,
        team: team.shortName,
        gamesPlayed: Math.floor(Math.random() * 17) + 1,
        gamesStarted: Math.floor(Math.random() * 17),
        ...generateStats(position),
      })),
      career: {
        seasons: info.experience,
        totalGames: info.experience * 16,
        totalStarts: info.experience * 14,
        awards: Array.from({ length: Math.floor(Math.random() * 3) }, (_, i) => ({
          year: 2023 - i,
          award: ['Pro Bowl', 'All-Pro', 'Offensive Player of the Year'][i] || 'Pro Bowl',
        })),
        passingYards: stats.passingYards ? stats.passingYards * info.experience : undefined,
        passingTouchdowns: stats.passingTouchdowns ? stats.passingTouchdowns * info.experience : undefined,
        completions: stats.completions ? stats.completions * info.experience : undefined,
        completionPercentage: stats.completions && stats.attempts ? stats.completions / stats.attempts : undefined,
        passerRating: stats.passingRating,
        interceptions: stats.interceptions ? stats.interceptions * info.experience : undefined,
      },
    },
    profile: {
      background: {
        birthDate: new Date(2000 - info.age, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
        birthPlace: 'City, State',
        college: ['Alabama', 'Georgia', 'Ohio State', 'LSU', 'Oklahoma', 'USC'][Math.floor(Math.random() * 6)],
        collegeMajor: 'Communications',
      },
      draft: info.experience > 0 ? {
        year: 2024 - info.experience,
        round: Math.floor(Math.random() * 7) + 1,
        pick: Math.floor(Math.random() * 32) + 1,
        team: team.name,
      } : null,
      contract: {
        years: Math.floor(Math.random() * 4) + 2,
        totalValue: Math.floor(Math.random() * 50000000) + 10000000,
        averageValue: Math.floor(Math.random() * 15000000) + 5000000,
        guaranteedMoney: Math.floor(Math.random() * 30000000) + 5000000,
      },
    },
    injuryHistory: {
      injuries: Array.from({ length: Math.floor(Math.random() * 3) }, (_, i) => ({
        date: new Date(2023 - i, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
        injury: ['Knee Sprain', 'Ankle Injury', 'Shoulder Strain', 'Concussion'][Math.floor(Math.random() * 4)],
        severity: (['Minor', 'Moderate', 'Major'] as const)[Math.floor(Math.random() * 3)],
        gamesmissed: Math.floor(Math.random() * 4),
        status: (['Recovered', 'Current'] as const)[Math.floor(Math.random() * 2)],
      })),
    },
    recentGames: Array.from({ length: 5 }, (_, i) => ({
      date: new Date(Date.now() - i * 7 * 24 * 60 * 60 * 1000),
      opponent: `Team ${i + 1}`,
      stats: generateStats(position),
      result: (['W', 'L', 'T'] as const)[Math.floor(Math.random() * 3)],
    })),
    isInjured: Math.random() > 0.9,
    injuryStatus: Math.random() > 0.9 ? 'Questionable' : undefined,
    isFavorite: Math.random() > 0.8,
    isWatching: Math.random() > 0.7,
    fantasyRank: Math.floor(Math.random() * 200) + 1,
    salary: Math.floor(Math.random() * 15000000) + 5000000,
  };
};

const mockTeams = {
  dal: { id: 'dal', name: 'Dallas Cowboys', shortName: 'DAL', logo: 'https://via.placeholder.com/64x64/003594/ffffff?text=DAL', colors: { primary: '#003594', secondary: '#041E42' } },
  phi: { id: 'phi', name: 'Philadelphia Eagles', shortName: 'PHI', logo: 'https://via.placeholder.com/64x64/004C54/ffffff?text=PHI', colors: { primary: '#004C54', secondary: '#A5ACAF' } },
  nyg: { id: 'nyg', name: 'New York Giants', shortName: 'NYG', logo: 'https://via.placeholder.com/64x64/0B2265/ffffff?text=NYG', colors: { primary: '#0B2265', secondary: '#A71930' } },
  was: { id: 'was', name: 'Washington Commanders', shortName: 'WAS', logo: 'https://via.placeholder.com/64x64/5A1414/ffffff?text=WAS', colors: { primary: '#5A1414', secondary: '#FFB612' } },
};

const mockPlayers: DetailedPlayer[] = [
  // Quarterbacks
  createMockPlayer('1', 'Dak Prescott', 'Dak', 'Prescott', 4, 'QB', mockTeams.dal, { height: '6\'2"', weight: 238, age: 30, experience: 8, college: 'Mississippi State' }),
  createMockPlayer('2', 'Jalen Hurts', 'Jalen', 'Hurts', 1, 'QB', mockTeams.phi, { height: '6\'1"', weight: 223, age: 25, experience: 4, college: 'Oklahoma' }),
  createMockPlayer('3', 'Daniel Jones', 'Daniel', 'Jones', 8, 'QB', mockTeams.nyg, { height: '6\'5"', weight: 230, age: 27, experience: 5, college: 'Duke' }),
  
  // Running Backs
  createMockPlayer('4', 'Ezekiel Elliott', 'Ezekiel', 'Elliott', 21, 'RB', mockTeams.dal, { height: '6\'0"', weight: 228, age: 28, experience: 8, college: 'Ohio State' }),
  createMockPlayer('5', 'Saquon Barkley', 'Saquon', 'Barkley', 26, 'RB', mockTeams.phi, { height: '6\'0"', weight: 233, age: 27, experience: 6, college: 'Penn State' }),
  createMockPlayer('6', 'Brian Robinson Jr.', 'Brian', 'Robinson Jr.', 8, 'RB', mockTeams.was, { height: '6\'1"', weight: 225, age: 25, experience: 2, college: 'Alabama' }),
  
  // Wide Receivers
  createMockPlayer('7', 'CeeDee Lamb', 'CeeDee', 'Lamb', 88, 'WR', mockTeams.dal, { height: '6\'2"', weight: 198, age: 25, experience: 4, college: 'Oklahoma' }),
  createMockPlayer('8', 'A.J. Brown', 'A.J.', 'Brown', 11, 'WR', mockTeams.phi, { height: '6\'1"', weight: 226, age: 27, experience: 5, college: 'Ole Miss' }),
  createMockPlayer('9', 'Malik Nabers', 'Malik', 'Nabers', 1, 'WR', mockTeams.nyg, { height: '6\'0"', weight: 200, age: 21, experience: 1, college: 'LSU' }),
  
  // Tight Ends
  createMockPlayer('10', 'Dallas Goedert', 'Dallas', 'Goedert', 88, 'TE', mockTeams.phi, { height: '6\'5"', weight: 256, age: 29, experience: 7, college: 'South Dakota State' }),
  createMockPlayer('11', 'Daniel Bellinger', 'Daniel', 'Bellinger', 82, 'TE', mockTeams.nyg, { height: '6\'5"', weight: 253, age: 23, experience: 2, college: 'San Diego State' }),
  
  // Defensive Players
  createMockPlayer('12', 'Micah Parsons', 'Micah', 'Parsons', 11, 'LB', mockTeams.dal, { height: '6\'3"', weight: 245, age: 25, experience: 3, college: 'Penn State' }),
  createMockPlayer('13', 'Haason Reddick', 'Haason', 'Reddick', 7, 'LB', mockTeams.phi, { height: '6\'1"', weight: 235, age: 30, experience: 8, college: 'Temple' }),
  createMockPlayer('14', 'Brian Burns', 'Brian', 'Burns', 0, 'LB', mockTeams.nyg, { height: '6\'5"', weight: 250, age: 26, experience: 5, college: 'Florida State' }),
  
  // Kickers
  createMockPlayer('15', 'Brandon McManus', 'Brandon', 'McManus', 6, 'K', mockTeams.was, { height: '6\'3"', weight: 201, age: 32, experience: 10, college: 'Temple' }),
];

// ===== PLAYER DISPLAY DEMO COMPONENT =====

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

const PlayerDisplayDemo: React.FC = () => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [selectedPlayer, setSelectedPlayer] = useState<DetailedPlayer | null>(null);
  const [comparisonPlayer, setComparisonPlayer] = useState<DetailedPlayer | null>(null);
  const [players, setPlayers] = useState<DetailedPlayer[]>(mockPlayers);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'position' | 'team' | 'fantasy' | 'stats'>('name');
  const [groupBy, setGroupBy] = useState<'none' | 'position' | 'team'>('position');
  const [selectedPositions, setSelectedPositions] = useState<string[]>([]);
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [showOnlyWatching, setShowOnlyWatching] = useState(false);
  const [showInjured, setShowInjured] = useState(true);
  const [playerVariant, setPlayerVariant] = useState<'default' | 'compact' | 'detailed' | 'minimal' | 'fantasy'>('default');
  const { loading, startLoading, stopLoading } = useLoadingState();

  const positions = ['QB', 'RB', 'WR', 'TE', 'LB', 'K'];
  const teams = Object.values(mockTeams);

  const handlePlayerClick = (player: DetailedPlayer) => {
    setSelectedPlayer(player);
    setTabValue(4); // Switch to player details tab
  };

  const handleFavorite = (playerId: string, isFavorite: boolean) => {
    setPlayers(prevPlayers =>
      prevPlayers.map(player =>
        player.id === playerId ? { ...player, isFavorite } : player
      )
    );
  };

  const handleWatch = (playerId: string, isWatching: boolean) => {
    setPlayers(prevPlayers =>
      prevPlayers.map(player =>
        player.id === playerId ? { ...player, isWatching } : player
      )
    );
  };

  const handleRefresh = async () => {
    startLoading();
    setTimeout(() => {
      stopLoading();
    }, 2000);
  };

  const filteredPlayers = React.useMemo(() => {
    let filtered = [...players];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(player =>
        player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        player.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
        player.team.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Position filter
    if (selectedPositions.length > 0) {
      filtered = filtered.filter(player => selectedPositions.includes(player.position));
    }

    // Team filter
    if (selectedTeams.length > 0) {
      filtered = filtered.filter(player => selectedTeams.includes(player.team.id));
    }

    // Favorites filter
    if (showOnlyFavorites) {
      filtered = filtered.filter(player => player.isFavorite);
    }

    // Watching filter
    if (showOnlyWatching) {
      filtered = filtered.filter(player => player.isWatching);
    }

    // Injury filter
    if (!showInjured) {
      filtered = filtered.filter(player => !player.isInjured);
    }

    return filtered;
  }, [players, searchQuery, selectedPositions, selectedTeams, showOnlyFavorites, showOnlyWatching, showInjured]);

  const favoriteCount = players.filter(p => p.isFavorite).length;
  const watchingCount = players.filter(p => p.isWatching).length;
  const injuredCount = players.filter(p => p.isInjured).length;

  const playersByPosition = React.useMemo(() => {
    return positions.reduce((acc, position) => {
      acc[position] = players.filter(player => player.position === position);
      return acc;
    }, {} as Record<string, DetailedPlayer[]>);
  }, [players]);

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Player Display Components Demo
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Interactive demonstration of player display components with detailed statistics, profiles, and comparison tools.
        </Typography>
      </Box>

      {/* Search and Controls */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            {/* Search */}
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search players..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
                }}
              />
            </Grid>

            {/* Position Filter */}
            <Grid item xs={12} md={2}>
              <Autocomplete
                multiple
                size="small"
                options={positions}
                value={selectedPositions}
                onChange={(_, newValue) => setSelectedPositions(newValue)}
                renderInput={(params) => (
                  <TextField {...params} label="Positions" />
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      {...getTagProps({ index })}
                      key={option}
                      label={option}
                      size="small"
                    />
                  ))
                }
              />
            </Grid>

            {/* Team Filter */}
            <Grid item xs={12} md={2}>
              <Autocomplete
                multiple
                size="small"
                options={teams.map(t => t.id)}
                getOptionLabel={(option) => teams.find(t => t.id === option)?.shortName || option}
                value={selectedTeams}
                onChange={(_, newValue) => setSelectedTeams(newValue)}
                renderInput={(params) => (
                  <TextField {...params} label="Teams" />
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      {...getTagProps({ index })}
                      key={option}
                      label={teams.find(t => t.id === option)?.shortName}
                      size="small"
                    />
                  ))
                }
              />
            </Grid>

            {/* Sort and Group */}
            <Grid item xs={6} md={1.5}>
              <FormControl fullWidth size="small">
                <InputLabel>Sort</InputLabel>
                <Select value={sortBy} label="Sort" onChange={(e) => setSortBy(e.target.value as any)}>
                  <MenuItem value="name">Name</MenuItem>
                  <MenuItem value="position">Position</MenuItem>
                  <MenuItem value="team">Team</MenuItem>
                  <MenuItem value="fantasy">Fantasy</MenuItem>
                  <MenuItem value="stats">Stats</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={6} md={1.5}>
              <FormControl fullWidth size="small">
                <InputLabel>Group</InputLabel>
                <Select value={groupBy} label="Group" onChange={(e) => setGroupBy(e.target.value as any)}>
                  <MenuItem value="none">None</MenuItem>
                  <MenuItem value="position">Position</MenuItem>
                  <MenuItem value="team">Team</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Variant */}
            <Grid item xs={12} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Variant</InputLabel>
                <Select value={playerVariant} label="Variant" onChange={(e) => setPlayerVariant(e.target.value as any)}>
                  <MenuItem value="default">Default</MenuItem>
                  <MenuItem value="compact">Compact</MenuItem>
                  <MenuItem value="detailed">Detailed</MenuItem>
                  <MenuItem value="minimal">Minimal</MenuItem>
                  <MenuItem value="fantasy">Fantasy</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          {/* Filter Switches */}
          <Box sx={{ display: 'flex', gap: 2, mt: 2, flexWrap: 'wrap' }}>
            <FormControlLabel
              control={<Switch checked={showOnlyFavorites} onChange={(e) => setShowOnlyFavorites(e.target.checked)} />}
              label={<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}><FavoriteIcon fontSize="small" /> Favorites Only</Box>}
            />
            <FormControlLabel
              control={<Switch checked={showOnlyWatching} onChange={(e) => setShowOnlyWatching(e.target.checked)} />}
              label={<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}><WatchIcon fontSize="small" /> Watching Only</Box>}
            />
            <FormControlLabel
              control={<Switch checked={showInjured} onChange={(e) => setShowInjured(e.target.checked)} />}
              label="Include Injured"
            />
            <Button
              variant="outlined"
              startIcon={loading ? <LoadingSpinner size={16} /> : <SortIcon />}
              onClick={handleRefresh}
              disabled={loading}
            >
              Refresh
            </Button>
          </Box>

          {filteredPlayers.length !== players.length && (
            <Alert severity="info" sx={{ mt: 2 }}>
              Showing {filteredPlayers.length} of {players.length} players
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
          <Tab label={`All Players (${filteredPlayers.length})`} />
          <Tab label="Offense" />
          <Tab label="Defense" />
          <Tab 
            label={
              <Badge badgeContent={favoriteCount} color="primary">
                Favorites
              </Badge>
            } 
          />
          <Tab label="Player Details" disabled={!selectedPlayer} />
          <Tab label="Comparison" />
          <Tab label="Components" />
        </Tabs>
      </Box>

      {/* All Players Tab */}
      <TabPanel value={tabValue} index={0}>
        {loading ? (
          <TeamListSkeleton items={12} />
        ) : (
          <PlayerList
            players={filteredPlayers}
            variant={playerVariant}
            groupBy={groupBy}
            sortBy={sortBy}
            onPlayerClick={handlePlayerClick}
            onFavorite={handleFavorite}
            onWatch={handleWatch}
            showStats={playerVariant !== 'minimal'}
            showTeam={true}
            showFantasy={playerVariant === 'fantasy'}
          />
        )}
      </TabPanel>

      {/* Offense Tab */}
      <TabPanel value={tabValue} index={1}>
        {loading ? (
          <TeamListSkeleton items={8} />
        ) : (
          <PlayerList
            players={filteredPlayers.filter(p => ['QB', 'RB', 'WR', 'TE'].includes(p.position))}
            variant={playerVariant}
            groupBy="position"
            sortBy={sortBy}
            onPlayerClick={handlePlayerClick}
            onFavorite={handleFavorite}
            onWatch={handleWatch}
            showStats={playerVariant !== 'minimal'}
            showTeam={true}
            showFantasy={playerVariant === 'fantasy'}
          />
        )}
      </TabPanel>

      {/* Defense Tab */}
      <TabPanel value={tabValue} index={2}>
        {loading ? (
          <TeamListSkeleton items={6} />
        ) : (
          <PlayerList
            players={filteredPlayers.filter(p => ['LB', 'CB', 'S', 'DE', 'DT'].includes(p.position))}
            variant={playerVariant}
            groupBy="position"
            sortBy={sortBy}
            onPlayerClick={handlePlayerClick}
            onFavorite={handleFavorite}
            onWatch={handleWatch}
            showStats={playerVariant !== 'minimal'}
            showTeam={true}
          />
        )}
      </TabPanel>

      {/* Favorites Tab */}
      <TabPanel value={tabValue} index={3}>
        {loading ? (
          <TeamListSkeleton items={4} />
        ) : favoriteCount > 0 ? (
          <PlayerList
            players={players.filter(p => p.isFavorite)}
            variant={playerVariant}
            groupBy={groupBy}
            sortBy={sortBy}
            onPlayerClick={handlePlayerClick}
            onFavorite={handleFavorite}
            onWatch={handleWatch}
            showStats={playerVariant !== 'minimal'}
            showTeam={true}
            showFantasy={playerVariant === 'fantasy'}
          />
        ) : (
          <Box sx={{ textAlign: 'center', py: 8, color: 'text.secondary' }}>
            <FavoriteIcon sx={{ fontSize: 64, mb: 2, opacity: 0.5 }} />
            <Typography variant="h6">No Favorite Players</Typography>
            <Typography variant="body2">
              Click the star icon on any player card to add them to your favorites.
            </Typography>
          </Box>
        )}
      </TabPanel>

      {/* Player Details Tab */}
      <TabPanel value={tabValue} index={4}>
        {selectedPlayer ? (
          <Box>
            <Button
              variant="outlined"
              onClick={() => setSelectedPlayer(null)}
              sx={{ mb: 3 }}
            >
              ← Back to Players
            </Button>
            <PlayerDetails
              player={selectedPlayer}
              showStats
              showProfile
              showInjuries
              showGameLog
            />
          </Box>
        ) : (
          <Box sx={{ textAlign: 'center', py: 8, color: 'text.secondary' }}>
            <PlayersIcon sx={{ fontSize: 64, mb: 2, opacity: 0.5 }} />
            <Typography variant="h6">No Player Selected</Typography>
            <Typography variant="body2">
              Click on a player card to view detailed information.
            </Typography>
          </Box>
        )}
      </TabPanel>

      {/* Comparison Tab */}
      <TabPanel value={tabValue} index={5}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Player Comparison
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Autocomplete
                options={players}
                getOptionLabel={(player) => `${player.name} (${player.position} - ${player.team.shortName})`}
                value={selectedPlayer}
                onChange={(_, newValue) => setSelectedPlayer(newValue)}
                renderInput={(params) => (
                  <TextField {...params} label="First Player" fullWidth />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Autocomplete
                options={players}
                getOptionLabel={(player) => `${player.name} (${player.position} - ${player.team.shortName})`}
                value={comparisonPlayer}
                onChange={(_, newValue) => setComparisonPlayer(newValue)}
                renderInput={(params) => (
                  <TextField {...params} label="Second Player" fullWidth />
                )}
              />
            </Grid>
          </Grid>
        </Box>

        {selectedPlayer && comparisonPlayer ? (
          <PlayerComparison
            player1={selectedPlayer}
            player2={comparisonPlayer}
            statType="season"
          />
        ) : (
          <Box sx={{ textAlign: 'center', py: 8, color: 'text.secondary' }}>
            <Typography variant="h6">Select Two Players to Compare</Typography>
            <Typography variant="body2">
              Choose players from the dropdowns above to see a detailed comparison.
            </Typography>
          </Box>
        )}
      </TabPanel>

      {/* Components Tab */}
      <TabPanel value={tabValue} index={6}>
        <Box>
          <Typography variant="h6" gutterBottom>
            Player Card Variants
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" gutterBottom>
                Default Variant
              </Typography>
              <PlayerCard
                player={players[0]}
                variant="default"
                onFavorite={handleFavorite}
                onWatch={handleWatch}
                showStats
                showTeam
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" gutterBottom>
                Compact Variant
              </Typography>
              <PlayerCard
                player={players[1]}
                variant="compact"
                onFavorite={handleFavorite}
                showTeam
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
                Detailed Variant
              </Typography>
              <PlayerCard
                player={players[0]}
                variant="detailed"
                onFavorite={handleFavorite}
                onWatch={handleWatch}
                showStats
                showTeam
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
                Fantasy Variant
              </Typography>
              <PlayerCard
                player={players[4]}
                variant="fantasy"
                onFavorite={handleFavorite}
                showStats
                showTeam
                showFantasy
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
                Minimal Variant (List Style)
              </Typography>
              <Box sx={{ maxWidth: 400 }}>
                {players.slice(0, 5).map((player) => (
                  <PlayerCard
                    key={player.id}
                    player={player}
                    variant="minimal"
                    onClick={handlePlayerClick}
                  />
                ))}
              </Box>
            </Grid>
          </Grid>
        </Box>
      </TabPanel>
    </Box>
  );
};

export default PlayerDisplayDemo;