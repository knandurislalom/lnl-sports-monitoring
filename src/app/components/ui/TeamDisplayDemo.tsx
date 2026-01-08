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
  useTheme,
} from '@mui/material';
import {
  ViewModule as GridIcon,
  ViewList as ListIcon,
  Sort as SortIcon,
  FilterList as FilterIcon,
  Favorite as FavoriteIcon,
  Groups as TeamsIcon,
} from '@mui/icons-material';
import { TeamCard, TeamList, Team } from './TeamCard';
import { TeamDetails, TeamComparison, DetailedTeam } from './TeamDetails';
import { LoadingSpinner, TeamListSkeleton, useLoadingState } from '../layout/LoadingStates';

// ===== MOCK DATA =====

const createMockTeam = (
  id: string,
  name: string,
  shortName: string,
  city: string,
  conference: 'AFC' | 'NFC',
  division: 'North' | 'South' | 'East' | 'West',
  colors: { primary: string; secondary: string },
  record: { wins: number; losses: number; ties?: number }
): DetailedTeam => {
  const winPercentage = record.wins / (record.wins + record.losses + (record.ties || 0));
  
  return {
    id,
    name,
    shortName,
    city,
    conference,
    division,
    colors,
    logo: `https://via.placeholder.com/80x80/${colors.primary.replace('#', '')}/ffffff?text=${shortName}`,
    record: {
      ...record,
      winPercentage,
    },
    rankings: {
      overall: Math.floor(Math.random() * 32) + 1,
      conference: Math.floor(Math.random() * 16) + 1,
      division: Math.floor(Math.random() * 4) + 1,
    },
    stats: {
      pointsFor: Math.floor(Math.random() * 200) + 300,
      pointsAgainst: Math.floor(Math.random() * 200) + 250,
      totalYards: Math.floor(Math.random() * 2000) + 4000,
      passingYards: Math.floor(Math.random() * 1500) + 2500,
      rushingYards: Math.floor(Math.random() * 1000) + 1500,
      turnovers: Math.floor(Math.random() * 15) + 10,
      penalties: Math.floor(Math.random() * 50) + 80,
      timeOfPossession: `${Math.floor(Math.random() * 5) + 28}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
    },
    detailedStats: {
      offense: {
        pointsPerGame: Math.random() * 15 + 20,
        totalYardsPerGame: Math.random() * 150 + 300,
        passingYardsPerGame: Math.random() * 100 + 200,
        rushingYardsPerGame: Math.random() * 80 + 100,
        thirdDownPercentage: Math.random() * 0.3 + 0.3,
        redZonePercentage: Math.random() * 0.4 + 0.5,
        turnoversPerGame: Math.random() * 1 + 0.5,
      },
      defense: {
        pointsAllowedPerGame: Math.random() * 15 + 15,
        totalYardsAllowedPerGame: Math.random() * 150 + 280,
        passingYardsAllowedPerGame: Math.random() * 100 + 180,
        rushingYardsAllowedPerGame: Math.random() * 80 + 90,
        thirdDownStopsPercentage: Math.random() * 0.3 + 0.5,
        redZoneStopsPercentage: Math.random() * 0.4 + 0.4,
        takeawaysPerGame: Math.random() * 1 + 0.8,
        sacksPerGame: Math.random() * 2 + 1.5,
      },
      specialTeams: {
        fieldGoalPercentage: Math.random() * 0.2 + 0.75,
        extraPointPercentage: Math.random() * 0.1 + 0.9,
        puntAverage: Math.random() * 10 + 40,
        kickReturnAverage: Math.random() * 10 + 20,
        puntReturnAverage: Math.random() * 8 + 8,
      },
    },
    history: {
      founded: Math.floor(Math.random() * 70) + 1950,
      championships: Array.from({ length: Math.floor(Math.random() * 4) }, (_, i) => ({
        year: 2020 - i * 5,
        title: 'Super Bowl Champion',
      })),
      playoffAppearances: Math.floor(Math.random() * 20) + 10,
      divisionTitles: Math.floor(Math.random() * 15) + 5,
      retiredNumbers: [],
      hallOfFamers: Math.floor(Math.random() * 10) + 2,
    },
    roster: {
      totalPlayers: 53,
      averageAge: Math.random() * 3 + 25,
      averageExperience: Math.random() * 3 + 4,
      keyPlayers: [
        {
          id: '1',
          name: 'John Smith',
          position: 'QB',
          number: Math.floor(Math.random() * 99) + 1,
          stats: '3,500 yards, 25 TDs',
        },
        {
          id: '2',
          name: 'Mike Johnson',
          position: 'RB',
          number: Math.floor(Math.random() * 99) + 1,
          stats: '1,200 yards, 12 TDs',
        },
        {
          id: '3',
          name: 'David Wilson',
          position: 'WR',
          number: Math.floor(Math.random() * 99) + 1,
          stats: '80 catches, 1,100 yards',
        },
      ],
    },
    upcomingGames: [
      {
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        opponent: 'Opponent Team',
        isHome: Math.random() > 0.5,
      },
      {
        date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        opponent: 'Another Team',
        isHome: Math.random() > 0.5,
      },
    ],
    stadium: {
      name: `${city} Stadium`,
      capacity: Math.floor(Math.random() * 30000) + 60000,
      surface: Math.random() > 0.5 ? 'Natural Grass' : 'Artificial Turf',
    },
    coach: 'Head Coach Name',
    established: Math.floor(Math.random() * 70) + 1950,
    isFavorite: Math.random() > 0.8,
    isFollowing: Math.random() > 0.7,
  };
};

const mockTeams: DetailedTeam[] = [
  // AFC East
  createMockTeam('buf', 'Buffalo Bills', 'BUF', 'Buffalo', 'AFC', 'East', { primary: '#00338D', secondary: '#C60C30' }, { wins: 11, losses: 6 }),
  createMockTeam('mia', 'Miami Dolphins', 'MIA', 'Miami', 'AFC', 'East', { primary: '#008E97', secondary: '#FC4C02' }, { wins: 9, losses: 8 }),
  createMockTeam('ne', 'New England Patriots', 'NE', 'New England', 'AFC', 'East', { primary: '#002244', secondary: '#C60C30' }, { wins: 4, losses: 13 }),
  createMockTeam('nyj', 'New York Jets', 'NYJ', 'New York', 'AFC', 'East', { primary: '#125740', secondary: '#000000' }, { wins: 7, losses: 10 }),

  // AFC North
  createMockTeam('bal', 'Baltimore Ravens', 'BAL', 'Baltimore', 'AFC', 'North', { primary: '#241773', secondary: '#000000' }, { wins: 13, losses: 4 }),
  createMockTeam('cin', 'Cincinnati Bengals', 'CIN', 'Cincinnati', 'AFC', 'North', { primary: '#FB4F14', secondary: '#000000' }, { wins: 9, losses: 8 }),
  createMockTeam('cle', 'Cleveland Browns', 'CLE', 'Cleveland', 'AFC', 'North', { primary: '#311D00', secondary: '#FF3C00' }, { wins: 11, losses: 6 }),
  createMockTeam('pit', 'Pittsburgh Steelers', 'PIT', 'Pittsburgh', 'AFC', 'North', { primary: '#FFB612', secondary: '#101820' }, { wins: 10, losses: 7 }),

  // NFC East
  createMockTeam('dal', 'Dallas Cowboys', 'DAL', 'Dallas', 'NFC', 'East', { primary: '#003594', secondary: '#041E42' }, { wins: 12, losses: 5 }),
  createMockTeam('nyg', 'New York Giants', 'NYG', 'New York', 'NFC', 'East', { primary: '#0B2265', secondary: '#A71930' }, { wins: 6, losses: 11 }),
  createMockTeam('phi', 'Philadelphia Eagles', 'PHI', 'Philadelphia', 'NFC', 'East', { primary: '#004C54', secondary: '#A5ACAF' }, { wins: 11, losses: 6 }),
  createMockTeam('was', 'Washington Commanders', 'WAS', 'Washington', 'NFC', 'East', { primary: '#5A1414', secondary: '#FFB612' }, { wins: 8, losses: 9 }),

  // NFC West
  createMockTeam('sf', 'San Francisco 49ers', 'SF', 'San Francisco', 'NFC', 'West', { primary: '#AA0000', secondary: '#B3995D' }, { wins: 12, losses: 5 }),
  createMockTeam('sea', 'Seattle Seahawks', 'SEA', 'Seattle', 'NFC', 'West', { primary: '#002244', secondary: '#69BE28' }, { wins: 9, losses: 8 }),
  createMockTeam('lar', 'Los Angeles Rams', 'LAR', 'Los Angeles', 'NFC', 'West', { primary: '#003594', secondary: '#FFA300' }, { wins: 10, losses: 7 }),
  createMockTeam('ari', 'Arizona Cardinals', 'ARI', 'Arizona', 'NFC', 'West', { primary: '#97233F', secondary: '#000000' }, { wins: 4, losses: 13 }),
];

// ===== TEAM DISPLAY DEMO COMPONENT =====

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

const TeamDisplayDemo: React.FC = () => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [selectedTeam, setSelectedTeam] = useState<DetailedTeam | null>(null);
  const [comparisonTeam, setComparisonTeam] = useState<DetailedTeam | null>(null);
  const [teams, setTeams] = useState<DetailedTeam[]>(mockTeams);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'record' | 'ranking'>('record');
  const [groupBy, setGroupBy] = useState<'none' | 'conference' | 'division'>('conference');
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [teamVariant, setTeamVariant] = useState<'default' | 'compact' | 'detailed' | 'minimal'>('default');
  const { loading, startLoading, stopLoading } = useLoadingState();

  const handleTeamClick = (team: DetailedTeam) => {
    setSelectedTeam(team);
    setTabValue(3); // Switch to team details tab
  };

  const handleFavorite = (teamId: string, isFavorite: boolean) => {
    setTeams(prevTeams =>
      prevTeams.map(team =>
        team.id === teamId ? { ...team, isFavorite } : team
      )
    );
  };

  const handleFollow = (teamId: string, isFollowing: boolean) => {
    setTeams(prevTeams =>
      prevTeams.map(team =>
        team.id === teamId ? { ...team, isFollowing } : team
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

  const filteredTeams = React.useMemo(() => {
    if (showOnlyFavorites) {
      return teams.filter(team => team.isFavorite);
    }
    return teams;
  }, [teams, showOnlyFavorites]);

  const favoriteTeams = teams.filter(team => team.isFavorite);
  const afcTeams = teams.filter(team => team.conference === 'AFC');
  const nfcTeams = teams.filter(team => team.conference === 'NFC');

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Team Display Components Demo
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Interactive demonstration of team display components with detailed statistics and comparison tools.
        </Typography>
      </Box>

      {/* Controls */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>View Mode</InputLabel>
                <Select
                  value={viewMode}
                  label="View Mode"
                  onChange={(e) => setViewMode(e.target.value as any)}
                >
                  <MenuItem value="grid">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <GridIcon fontSize="small" />
                      Grid
                    </Box>
                  </MenuItem>
                  <MenuItem value="list">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <ListIcon fontSize="small" />
                      List
                    </Box>
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Variant</InputLabel>
                <Select
                  value={teamVariant}
                  label="Variant"
                  onChange={(e) => setTeamVariant(e.target.value as any)}
                >
                  <MenuItem value="default">Default</MenuItem>
                  <MenuItem value="compact">Compact</MenuItem>
                  <MenuItem value="detailed">Detailed</MenuItem>
                  <MenuItem value="minimal">Minimal</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={sortBy}
                  label="Sort By"
                  onChange={(e) => setSortBy(e.target.value as any)}
                >
                  <MenuItem value="name">Name</MenuItem>
                  <MenuItem value="record">Record</MenuItem>
                  <MenuItem value="ranking">Ranking</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Group By</InputLabel>
                <Select
                  value={groupBy}
                  label="Group By"
                  onChange={(e) => setGroupBy(e.target.value as any)}
                >
                  <MenuItem value="none">None</MenuItem>
                  <MenuItem value="conference">Conference</MenuItem>
                  <MenuItem value="division">Division</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={2}>
              <FormControlLabel
                control={
                  <Switch
                    checked={showOnlyFavorites}
                    onChange={(e) => setShowOnlyFavorites(e.target.checked)}
                  />
                }
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <FavoriteIcon fontSize="small" />
                    Favorites Only
                  </Box>
                }
              />
            </Grid>

            <Grid item xs={12} sm={6} md={2}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={loading ? <LoadingSpinner size={16} /> : <SortIcon />}
                onClick={handleRefresh}
                disabled={loading}
              >
                Refresh
              </Button>
            </Grid>
          </Grid>

          {showOnlyFavorites && favoriteTeams.length === 0 && (
            <Alert severity="info" sx={{ mt: 2 }}>
              No favorite teams selected. Click the star icon on any team card to add it to your favorites.
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
          <Tab
            label={
              <Badge badgeContent={favoriteTeams.length} color="primary">
                All Teams
              </Badge>
            }
          />
          <Tab label={`AFC (${afcTeams.length})`} />
          <Tab label={`NFC (${nfcTeams.length})`} />
          <Tab label="Team Details" disabled={!selectedTeam} />
          <Tab label="Comparison" />
          <Tab label="Components" />
        </Tabs>
      </Box>

      {/* All Teams Tab */}
      <TabPanel value={tabValue} index={0}>
        {loading ? (
          <TeamListSkeleton items={8} />
        ) : (
          <TeamList
            teams={filteredTeams}
            variant={teamVariant}
            groupBy={groupBy}
            sortBy={sortBy}
            onTeamClick={handleTeamClick}
            onFavorite={handleFavorite}
            onFollow={handleFollow}
            showStats={teamVariant !== 'minimal'}
            showRecord={true}
            showRankings={teamVariant === 'detailed'}
          />
        )}
      </TabPanel>

      {/* AFC Teams Tab */}
      <TabPanel value={tabValue} index={1}>
        {loading ? (
          <TeamListSkeleton items={6} />
        ) : (
          <TeamList
            teams={afcTeams}
            variant={teamVariant}
            groupBy={groupBy === 'conference' ? 'division' : groupBy}
            sortBy={sortBy}
            onTeamClick={handleTeamClick}
            onFavorite={handleFavorite}
            onFollow={handleFollow}
            showStats={teamVariant !== 'minimal'}
            showRecord={true}
            showRankings={teamVariant === 'detailed'}
          />
        )}
      </TabPanel>

      {/* NFC Teams Tab */}
      <TabPanel value={tabValue} index={2}>
        {loading ? (
          <TeamListSkeleton items={6} />
        ) : (
          <TeamList
            teams={nfcTeams}
            variant={teamVariant}
            groupBy={groupBy === 'conference' ? 'division' : groupBy}
            sortBy={sortBy}
            onTeamClick={handleTeamClick}
            onFavorite={handleFavorite}
            onFollow={handleFollow}
            showStats={teamVariant !== 'minimal'}
            showRecord={true}
            showRankings={teamVariant === 'detailed'}
          />
        )}
      </TabPanel>

      {/* Team Details Tab */}
      <TabPanel value={tabValue} index={3}>
        {selectedTeam ? (
          <Box>
            <Button
              variant="outlined"
              onClick={() => setSelectedTeam(null)}
              sx={{ mb: 3 }}
            >
              ← Back to Teams
            </Button>
            <TeamDetails
              team={selectedTeam}
              showStats
              showHistory
              showRoster
              showSchedule
            />
          </Box>
        ) : (
          <Box sx={{ textAlign: 'center', py: 8, color: 'text.secondary' }}>
            <TeamsIcon sx={{ fontSize: 64, mb: 2, opacity: 0.5 }} />
            <Typography variant="h6">No Team Selected</Typography>
            <Typography variant="body2">
              Click on a team card to view detailed information.
            </Typography>
          </Box>
        )}
      </TabPanel>

      {/* Comparison Tab */}
      <TabPanel value={tabValue} index={4}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Team Comparison
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>First Team</InputLabel>
                <Select
                  value={selectedTeam?.id || ''}
                  label="First Team"
                  onChange={(e) => {
                    const team = teams.find(t => t.id === e.target.value);
                    setSelectedTeam(team || null);
                  }}
                >
                  {teams.map((team) => (
                    <MenuItem key={team.id} value={team.id}>
                      {team.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Second Team</InputLabel>
                <Select
                  value={comparisonTeam?.id || ''}
                  label="Second Team"
                  onChange={(e) => {
                    const team = teams.find(t => t.id === e.target.value);
                    setComparisonTeam(team || null);
                  }}
                >
                  {teams.map((team) => (
                    <MenuItem key={team.id} value={team.id}>
                      {team.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>

        {selectedTeam && comparisonTeam ? (
          <TeamComparison
            team1={selectedTeam}
            team2={comparisonTeam}
            categories={['offense', 'defense', 'specialTeams']}
          />
        ) : (
          <Box sx={{ textAlign: 'center', py: 8, color: 'text.secondary' }}>
            <Typography variant="h6">Select Two Teams to Compare</Typography>
            <Typography variant="body2">
              Choose teams from the dropdowns above to see a detailed comparison.
            </Typography>
          </Box>
        )}
      </TabPanel>

      {/* Components Tab */}
      <TabPanel value={tabValue} index={5}>
        <Box>
          <Typography variant="h6" gutterBottom>
            Team Card Variants
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" gutterBottom>
                Default Variant
              </Typography>
              <TeamCard
                team={teams[0]}
                variant="default"
                onFavorite={handleFavorite}
                onFollow={handleFollow}
                showStats
                showRecord
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" gutterBottom>
                Compact Variant
              </Typography>
              <TeamCard
                team={teams[1]}
                variant="compact"
                onFavorite={handleFavorite}
                onFollow={handleFollow}
                showRecord
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
                Detailed Variant
              </Typography>
              <TeamCard
                team={teams[0]}
                variant="detailed"
                onFavorite={handleFavorite}
                onFollow={handleFollow}
                showStats
                showRecord
                showRankings
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
                Minimal Variant (List Style)
              </Typography>
              <Box sx={{ maxWidth: 400 }}>
                {teams.slice(0, 5).map((team) => (
                  <TeamCard
                    key={team.id}
                    team={team}
                    variant="minimal"
                    onClick={handleTeamClick}
                    showRecord
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

export default TeamDisplayDemo;