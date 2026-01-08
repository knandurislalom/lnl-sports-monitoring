import React from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  Avatar,
  Grid,
  Divider,
  LinearProgress,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  useTheme,
  alpha,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Remove as NeutralIcon,
  Stadium as StadiumIcon,
  Groups as PlayersIcon,
  EmojiEvents as TrophyIcon,
  CalendarMonth as CalendarIcon,
  LocationOn as LocationIcon,
} from '@mui/icons-material';
import { formatNumber, formatPercentage } from '../../utils/format.utils';
import { useLayout } from '../layout/MainLayout';

// ===== TYPES =====

export interface DetailedTeamStats {
  offense: {
    pointsPerGame: number;
    totalYardsPerGame: number;
    passingYardsPerGame: number;
    rushingYardsPerGame: number;
    thirdDownPercentage: number;
    redZonePercentage: number;
    turnoversPerGame: number;
  };
  defense: {
    pointsAllowedPerGame: number;
    totalYardsAllowedPerGame: number;
    passingYardsAllowedPerGame: number;
    rushingYardsAllowedPerGame: number;
    thirdDownStopsPercentage: number;
    redZoneStopsPercentage: number;
    takeawaysPerGame: number;
    sacksPerGame: number;
  };
  specialTeams: {
    fieldGoalPercentage: number;
    extraPointPercentage: number;
    puntAverage: number;
    kickReturnAverage: number;
    puntReturnAverage: number;
  };
}

export interface TeamHistory {
  founded: number;
  championships: Array<{
    year: number;
    title: string;
  }>;
  playoffAppearances: number;
  divisionTitles: number;
  retiredNumbers: Array<{
    number: number;
    player: string;
    position: string;
  }>;
  hallOfFamers: number;
}

export interface TeamRoster {
  totalPlayers: number;
  averageAge: number;
  averageExperience: number;
  keyPlayers: Array<{
    id: string;
    name: string;
    position: string;
    number: number;
    photo?: string;
    stats?: string;
  }>;
}

export interface DetailedTeam extends Team {
  detailedStats?: DetailedTeamStats;
  history?: TeamHistory;
  roster?: TeamRoster;
  upcomingGames?: Array<{
    date: Date;
    opponent: string;
    isHome: boolean;
  }>;
  recentNews?: Array<{
    title: string;
    date: Date;
    summary: string;
  }>;
}

// Re-export Team type for convenience
export type { Team, TeamRecord, TeamRankings, TeamStats } from './TeamCard';

// ===== TEAM DETAILS COMPONENT =====

export interface TeamDetailsProps {
  team: DetailedTeam;
  variant?: 'default' | 'compact';
  showStats?: boolean;
  showHistory?: boolean;
  showRoster?: boolean;
  showSchedule?: boolean;
}

export const TeamDetails: React.FC<TeamDetailsProps> = ({
  team,
  variant = 'default',
  showStats = true,
  showHistory = true,
  showRoster = true,
  showSchedule = true,
}) => {
  const theme = useTheme();
  const { compactMode } = useLayout();
  const isCompact = variant === 'compact' || compactMode;

  const renderStatBar = (label: string, value: number, maxValue: number, format: 'number' | 'percentage' = 'number', color: 'primary' | 'success' | 'error' | 'warning' = 'primary') => {
    const percentage = (value / maxValue) * 100;
    const formattedValue = format === 'percentage' ? formatPercentage(value / 100) : formatNumber(value);

    return (
      <Box key={label} sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
          <Typography variant="body2" color="text.secondary">
            {label}
          </Typography>
          <Typography variant="body2" fontWeight="medium">
            {formattedValue}
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={Math.min(percentage, 100)}
          color={color}
          sx={{
            height: 6,
            borderRadius: 3,
            bgcolor: alpha(theme.palette.grey[300], 0.3),
          }}
        />
      </Box>
    );
  };

  return (
    <Box>
      {/* Team Header */}
      <Card sx={{ mb: 3, background: `linear-gradient(135deg, ${alpha(team.colors.primary, 0.1)} 0%, ${alpha(team.colors.secondary, 0.1)} 100%)` }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 2 }}>
            <Avatar
              src={team.logo}
              alt={`${team.name} logo`}
              sx={{
                width: isCompact ? 64 : 80,
                height: isCompact ? 64 : 80,
                bgcolor: team.colors.primary,
                border: `3px solid ${team.colors.primary}`,
              }}
            >
              {team.shortName}
            </Avatar>
            
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant={isCompact ? 'h5' : 'h4'} fontWeight="bold" gutterBottom>
                {team.name}
              </Typography>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                {team.city} • {team.conference} {team.division}
              </Typography>
              
              {team.record && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                  <Chip
                    label={`${team.record.wins}-${team.record.losses}${team.record.ties ? `-${team.record.ties}` : ''}`}
                    color={team.record.winPercentage >= 0.5 ? 'success' : 'error'}
                    variant="filled"
                  />
                  {team.rankings && (
                    <Chip
                      label={`#${team.rankings.overall} Overall`}
                      color="primary"
                      variant="outlined"
                    />
                  )}
                </Box>
              )}
            </Box>
          </Box>

          {/* Stadium Info */}
          {team.stadium && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
              <StadiumIcon color="action" />
              <Typography variant="body2" color="text.secondary">
                {team.stadium.name} • Capacity: {formatNumber(team.stadium.capacity)} • {team.stadium.surface}
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Team Statistics */}
      {showStats && team.detailedStats && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Team Statistics
            </Typography>
            
            <Grid container spacing={4}>
              {/* Offense */}
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom color="success.main">
                  Offense
                </Typography>
                {renderStatBar('Points/Game', team.detailedStats.offense.pointsPerGame, 35, 'number', 'success')}
                {renderStatBar('Total Yards/Game', team.detailedStats.offense.totalYardsPerGame, 500, 'number', 'primary')}
                {renderStatBar('Passing Yards/Game', team.detailedStats.offense.passingYardsPerGame, 350, 'number', 'primary')}
                {renderStatBar('Rushing Yards/Game', team.detailedStats.offense.rushingYardsPerGame, 200, 'number', 'primary')}
                {renderStatBar('3rd Down %', team.detailedStats.offense.thirdDownPercentage * 100, 100, 'percentage', 'success')}
                {renderStatBar('Red Zone %', team.detailedStats.offense.redZonePercentage * 100, 100, 'percentage', 'success')}
              </Grid>
              
              {/* Defense */}
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom color="error.main">
                  Defense
                </Typography>
                {renderStatBar('Points Allowed/Game', team.detailedStats.defense.pointsAllowedPerGame, 35, 'number', 'error')}
                {renderStatBar('Yards Allowed/Game', team.detailedStats.defense.totalYardsAllowedPerGame, 500, 'number', 'warning')}
                {renderStatBar('Pass Yards Allowed/Game', team.detailedStats.defense.passingYardsAllowedPerGame, 350, 'number', 'warning')}
                {renderStatBar('Rush Yards Allowed/Game', team.detailedStats.defense.rushingYardsAllowedPerGame, 200, 'number', 'warning')}
                {renderStatBar('3rd Down Stops %', team.detailedStats.defense.thirdDownStopsPercentage * 100, 100, 'percentage', 'success')}
                {renderStatBar('Sacks/Game', team.detailedStats.defense.sacksPerGame, 4, 'number', 'success')}
              </Grid>
              
              {/* Special Teams */}
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom color="primary.main">
                  Special Teams
                </Typography>
                {renderStatBar('Field Goal %', team.detailedStats.specialTeams.fieldGoalPercentage * 100, 100, 'percentage', 'primary')}
                {renderStatBar('Extra Point %', team.detailedStats.specialTeams.extraPointPercentage * 100, 100, 'percentage', 'primary')}
                {renderStatBar('Punt Average', team.detailedStats.specialTeams.puntAverage, 55, 'number', 'primary')}
                {renderStatBar('Kick Return Avg', team.detailedStats.specialTeams.kickReturnAverage, 30, 'number', 'primary')}
                {renderStatBar('Punt Return Avg', team.detailedStats.specialTeams.puntReturnAverage, 15, 'number', 'primary')}
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Team History */}
      {showHistory && team.history && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Team History
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Founded
                  </Typography>
                  <Typography variant="h6">
                    {team.history.founded}
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Achievements
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Box sx={{ textAlign: 'center', p: 1 }}>
                        <TrophyIcon color="warning" sx={{ fontSize: 32, mb: 0.5 }} />
                        <Typography variant="h6" fontWeight="bold">
                          {team.history.championships.length}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Championships
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ textAlign: 'center', p: 1 }}>
                        <CalendarIcon color="primary" sx={{ fontSize: 32, mb: 0.5 }} />
                        <Typography variant="h6" fontWeight="bold">
                          {team.history.playoffAppearances}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Playoff Apps
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={6}>
                {team.history.championships.length > 0 && (
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Championships
                    </Typography>
                    <List dense>
                      {team.history.championships.slice(-5).map((championship, index) => (
                        <ListItem key={index} sx={{ px: 0 }}>
                          <ListItemText
                            primary={championship.title}
                            secondary={championship.year}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Team Roster Summary */}
      {showRoster && team.roster && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Roster Overview
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: 'center', p: 2, bgcolor: alpha(theme.palette.primary.main, 0.05), borderRadius: 1 }}>
                  <PlayersIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="h4" fontWeight="bold" color="primary.main">
                    {team.roster.totalPlayers}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Players
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: 'center', p: 2, bgcolor: alpha(theme.palette.success.main, 0.05), borderRadius: 1 }}>
                  <Typography variant="h4" fontWeight="bold" color="success.main">
                    {team.roster.averageAge.toFixed(1)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Average Age
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: 'center', p: 2, bgcolor: alpha(theme.palette.warning.main, 0.05), borderRadius: 1 }}>
                  <Typography variant="h4" fontWeight="bold" color="warning.main">
                    {team.roster.averageExperience.toFixed(1)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Avg Experience (yrs)
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            {/* Key Players */}
            {team.roster.keyPlayers && team.roster.keyPlayers.length > 0 && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Key Players
                </Typography>
                <List>
                  {team.roster.keyPlayers.map((player, index) => (
                    <ListItem key={player.id} divider={index < team.roster!.keyPlayers.length - 1}>
                      <ListItemAvatar>
                        <Avatar
                          src={player.photo}
                          sx={{ bgcolor: team.colors.primary }}
                        >
                          {player.number}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="subtitle2" fontWeight="bold">
                              #{player.number} {player.name}
                            </Typography>
                            <Chip label={player.position} size="small" variant="outlined" />
                          </Box>
                        }
                        secondary={player.stats}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}
          </CardContent>
        </Card>
      )}

      {/* Upcoming Schedule */}
      {showSchedule && team.upcomingGames && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Upcoming Games
            </Typography>
            
            <List>
              {team.upcomingGames.map((game, index) => (
                <ListItem key={index} divider={index < team.upcomingGames!.length - 1}>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="subtitle2">
                          {game.isHome ? 'vs' : '@'} {game.opponent}
                        </Typography>
                        <Chip
                          label={game.isHome ? 'HOME' : 'AWAY'}
                          size="small"
                          color={game.isHome ? 'success' : 'primary'}
                          variant="outlined"
                        />
                      </Box>
                    }
                    secondary={game.date.toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit',
                    })}
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

// ===== TEAM COMPARISON COMPONENT =====

export interface TeamComparisonProps {
  team1: DetailedTeam;
  team2: DetailedTeam;
  categories?: Array<'offense' | 'defense' | 'specialTeams'>;
}

export const TeamComparison: React.FC<TeamComparisonProps> = ({
  team1,
  team2,
  categories = ['offense', 'defense', 'specialTeams'],
}) => {
  const theme = useTheme();

  const compareStats = (stat1: number, stat2: number, higherIsBetter: boolean = true) => {
    if (stat1 === stat2) return { winner: 'tie', difference: 0 };
    
    const winner = higherIsBetter 
      ? (stat1 > stat2 ? 'team1' : 'team2')
      : (stat1 < stat2 ? 'team1' : 'team2');
    
    const difference = Math.abs(stat1 - stat2);
    
    return { winner, difference };
  };

  const renderStatComparison = (
    label: string,
    stat1: number,
    stat2: number,
    format: 'number' | 'percentage' = 'number',
    higherIsBetter: boolean = true
  ) => {
    const comparison = compareStats(stat1, stat2, higherIsBetter);
    
    const formatValue = (value: number) => {
      return format === 'percentage' ? formatPercentage(value / 100) : formatNumber(value);
    };

    return (
      <Box key={label} sx={{ mb: 2 }}>
        <Typography variant="caption" color="text.secondary" gutterBottom display="block">
          {label}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography
            variant="body2"
            fontWeight={comparison.winner === 'team1' ? 'bold' : 'normal'}
            color={comparison.winner === 'team1' ? 'primary.main' : 'text.primary'}
          >
            {formatValue(stat1)}
          </Typography>
          <Typography
            variant="body2"
            fontWeight={comparison.winner === 'team2' ? 'bold' : 'normal'}
            color={comparison.winner === 'team2' ? 'primary.main' : 'text.primary'}
          >
            {formatValue(stat2)}
          </Typography>
        </Box>
      </Box>
    );
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom textAlign="center">
          Team Comparison
        </Typography>
        
        {/* Team Headers */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar src={team1.logo} sx={{ width: 32, height: 32 }} />
            <Typography variant="subtitle1" fontWeight="bold">
              {team1.shortName}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              {team2.shortName}
            </Typography>
            <Avatar src={team2.logo} sx={{ width: 32, height: 32 }} />
          </Box>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* Statistics Comparison */}
        {team1.detailedStats && team2.detailedStats && (
          <Grid container spacing={3}>
            {categories.includes('offense') && (
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle2" color="success.main" gutterBottom>
                  Offense
                </Typography>
                {renderStatComparison('Points/Game', team1.detailedStats.offense.pointsPerGame, team2.detailedStats.offense.pointsPerGame)}
                {renderStatComparison('Total Yards/Game', team1.detailedStats.offense.totalYardsPerGame, team2.detailedStats.offense.totalYardsPerGame)}
                {renderStatComparison('3rd Down %', team1.detailedStats.offense.thirdDownPercentage * 100, team2.detailedStats.offense.thirdDownPercentage * 100, 'percentage')}
              </Grid>
            )}
            
            {categories.includes('defense') && (
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle2" color="error.main" gutterBottom>
                  Defense
                </Typography>
                {renderStatComparison('Points Allowed/Game', team1.detailedStats.defense.pointsAllowedPerGame, team2.detailedStats.defense.pointsAllowedPerGame, 'number', false)}
                {renderStatComparison('Yards Allowed/Game', team1.detailedStats.defense.totalYardsAllowedPerGame, team2.detailedStats.defense.totalYardsAllowedPerGame, 'number', false)}
                {renderStatComparison('Sacks/Game', team1.detailedStats.defense.sacksPerGame, team2.detailedStats.defense.sacksPerGame)}
              </Grid>
            )}
            
            {categories.includes('specialTeams') && (
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle2" color="primary.main" gutterBottom>
                  Special Teams
                </Typography>
                {renderStatComparison('Field Goal %', team1.detailedStats.specialTeams.fieldGoalPercentage * 100, team2.detailedStats.specialTeams.fieldGoalPercentage * 100, 'percentage')}
                {renderStatComparison('Punt Average', team1.detailedStats.specialTeams.puntAverage, team2.detailedStats.specialTeams.puntAverage)}
              </Grid>
            )}
          </Grid>
        )}
      </CardContent>
    </Card>
  );
};

export default TeamDetails;