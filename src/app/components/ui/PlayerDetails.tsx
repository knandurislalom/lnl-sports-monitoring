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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  useTheme,
  alpha,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Remove as NeutralIcon,
  EmojiEvents as AwardIcon,
  LocalHospital as InjuryIcon,
  School as CollegeIcon,
  CalendarToday as DateIcon,
  Height as HeightIcon,
  FitnessCenter as WeightIcon,
  SportsFootball as FootballIcon,
} from '@mui/icons-material';
import { formatNumber, formatPercentage } from '../../utils/format.utils';
import { useLayout } from '../layout/MainLayout';

// ===== TYPES =====

export interface DetailedPlayerStats {
  // Season by season stats
  seasons: Array<{
    year: number;
    team: string;
    gamesPlayed: number;
    gamesStarted: number;
    // Position-specific stats will be added dynamically
    [key: string]: any;
  }>;
  
  // Career totals
  career: {
    seasons: number;
    totalGames: number;
    totalStarts: number;
    awards: Array<{
      year: number;
      award: string;
    }>;
    // Position-specific career stats
    [key: string]: any;
  };
}

export interface PlayerProfile {
  background: {
    birthDate: Date;
    birthPlace: string;
    highSchool?: string;
    college: string;
    collegeMajor?: string;
  };
  draft: {
    year: number;
    round: number;
    pick: number;
    team: string;
  } | null;
  contract: {
    years: number;
    totalValue: number;
    averageValue: number;
    guaranteedMoney: number;
    signingBonus?: number;
  } | null;
  personalLife?: {
    family?: string;
    charity?: string;
    interests?: string[];
  };
}

export interface InjuryHistory {
  injuries: Array<{
    date: Date;
    injury: string;
    severity: 'Minor' | 'Moderate' | 'Major';
    gamesmissed: number;
    status: 'Recovered' | 'Current';
  }>;
  currentInjury?: {
    injury: string;
    date: Date;
    expectedReturn?: Date;
    status: string;
  };
}

export interface DetailedPlayer extends Player {
  detailedStats?: DetailedPlayerStats;
  profile?: PlayerProfile;
  injuryHistory?: InjuryHistory;
  recentGames?: Array<{
    date: Date;
    opponent: string;
    stats: any;
    result: 'W' | 'L' | 'T';
  }>;
  news?: Array<{
    title: string;
    date: Date;
    summary: string;
    source: string;
  }>;
}

// Re-export Player types for convenience
export type { Player, PlayerStats, PlayerInfo } from './PlayerCard';

// ===== PLAYER DETAILS COMPONENT =====

export interface PlayerDetailsProps {
  player: DetailedPlayer;
  variant?: 'default' | 'compact';
  showStats?: boolean;
  showProfile?: boolean;
  showInjuries?: boolean;
  showGameLog?: boolean;
}

export const PlayerDetails: React.FC<PlayerDetailsProps> = ({
  player,
  variant = 'default',
  showStats = true,
  showProfile = true,
  showInjuries = true,
  showGameLog = true,
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

  const getPositionColor = (position: string) => {
    const pos = position.toUpperCase();
    if (['QB'].includes(pos)) return theme.palette.error.main;
    if (['RB', 'FB'].includes(pos)) return theme.palette.success.main;
    if (['WR', 'TE'].includes(pos)) return theme.palette.primary.main;
    return theme.palette.secondary.main;
  };

  return (
    <Box>
      {/* Player Header */}
      <Card sx={{ 
        mb: 3, 
        background: `linear-gradient(135deg, ${alpha(player.team.colors.primary, 0.1)} 0%, ${alpha(player.team.colors.secondary, 0.1)} 100%)`,
        border: `1px solid ${alpha(player.team.colors.primary, 0.2)}`,
      }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 2 }}>
            <Avatar
              src={player.photo}
              alt={`${player.name} photo`}
              sx={{
                width: isCompact ? 80 : 100,
                height: isCompact ? 80 : 100,
                bgcolor: player.team.colors.primary,
                border: `3px solid ${player.team.colors.primary}`,
                fontSize: '1.5rem',
                fontWeight: 'bold',
              }}
            >
              {player.number}
            </Avatar>
            
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant={isCompact ? 'h5' : 'h4'} fontWeight="bold" gutterBottom>
                {player.name}
              </Typography>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                #{player.number} • {player.position} • {player.team.name}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                <Chip
                  label={player.position}
                  sx={{ bgcolor: getPositionColor(player.position), color: 'white' }}
                />
                <Typography variant="body2" color="text.secondary">
                  {player.info.height} • {player.info.weight} lbs • Age {player.info.age}
                </Typography>
              </Box>
            </Box>

            {/* Team Logo */}
            <Avatar
              src={player.team.logo}
              alt={`${player.team.name} logo`}
              sx={{ width: 60, height: 60 }}
            />
          </Box>

          {/* Current Injury Status */}
          {player.isInjured && player.injuryHistory?.currentInjury && (
            <Box sx={{ 
              p: 2, 
              bgcolor: alpha(theme.palette.error.main, 0.1),
              border: `1px solid ${alpha(theme.palette.error.main, 0.3)}`,
              borderRadius: 1,
              mt: 2,
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <InjuryIcon color="error" />
                <Typography variant="subtitle1" fontWeight="bold" color="error.main">
                  Current Injury
                </Typography>
              </Box>
              <Typography variant="body2">
                {player.injuryHistory.currentInjury.injury} 
                {player.injuryHistory.currentInjury.expectedReturn && (
                  ` • Expected return: ${player.injuryHistory.currentInjury.expectedReturn.toLocaleDateString()}`
                )}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Status: {player.injuryHistory.currentInjury.status}
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Player Profile */}
      {showProfile && player.profile && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Player Profile
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Personal Information
                  </Typography>
                  
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <DateIcon fontSize="small" color="action" />
                      <Typography variant="body2">
                        Born: {player.profile.background.birthDate.toLocaleDateString()}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {player.profile.background.birthPlace}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <CollegeIcon fontSize="small" color="action" />
                      <Typography variant="body2">
                        College: {player.profile.background.college}
                      </Typography>
                    </Box>
                    {player.profile.background.collegeMajor && (
                      <Typography variant="body2" color="text.secondary">
                        Major: {player.profile.background.collegeMajor}
                      </Typography>
                    )}
                  </Box>

                  <Box sx={{ mb: 1 }}>
                    <Typography variant="body2">
                      Experience: {player.info.experience} years
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={6}>
                {/* Draft Information */}
                {player.profile.draft && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Draft Information
                    </Typography>
                    <Typography variant="body2">
                      {player.profile.draft.year} NFL Draft
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Round {player.profile.draft.round}, Pick {player.profile.draft.pick}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Selected by {player.profile.draft.team}
                    </Typography>
                  </Box>
                )}

                {/* Contract Information */}
                {player.profile.contract && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Contract
                    </Typography>
                    <Typography variant="body2">
                      {player.profile.contract.years} years, ${formatNumber(player.profile.contract.totalValue)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Avg: ${formatNumber(player.profile.contract.averageValue)}/year
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Guaranteed: ${formatNumber(player.profile.contract.guaranteedMoney)}
                    </Typography>
                  </Box>
                )}
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Career Statistics */}
      {showStats && player.detailedStats && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Career Statistics
            </Typography>
            
            {/* Career Summary */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={3}>
                <Box sx={{ textAlign: 'center', p: 2, bgcolor: alpha(theme.palette.primary.main, 0.05), borderRadius: 1 }}>
                  <Typography variant="h4" fontWeight="bold" color="primary.main">
                    {player.detailedStats.career.seasons}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Seasons
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={3}>
                <Box sx={{ textAlign: 'center', p: 2, bgcolor: alpha(theme.palette.success.main, 0.05), borderRadius: 1 }}>
                  <Typography variant="h4" fontWeight="bold" color="success.main">
                    {player.detailedStats.career.totalGames}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Games
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={3}>
                <Box sx={{ textAlign: 'center', p: 2, bgcolor: alpha(theme.palette.warning.main, 0.05), borderRadius: 1 }}>
                  <Typography variant="h4" fontWeight="bold" color="warning.main">
                    {player.detailedStats.career.totalStarts}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Starts
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={3}>
                <Box sx={{ textAlign: 'center', p: 2, bgcolor: alpha(theme.palette.info.main, 0.05), borderRadius: 1 }}>
                  <Typography variant="h4" fontWeight="bold" color="info.main">
                    {player.detailedStats.career.awards.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Awards
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            {/* Position-specific Career Stats */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Career Totals
              </Typography>
              
              {player.position.toUpperCase() === 'QB' && (
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    {renderStatBar('Passing Yards', player.detailedStats.career.passingYards || 0, 80000)}
                    {renderStatBar('Touchdowns', player.detailedStats.career.passingTouchdowns || 0, 600)}
                  </Grid>
                  <Grid item xs={12} md={4}>
                    {renderStatBar('Completions', player.detailedStats.career.completions || 0, 7000)}
                    {renderStatBar('Completion %', (player.detailedStats.career.completionPercentage || 0) * 100, 100, 'percentage')}
                  </Grid>
                  <Grid item xs={12} md={4}>
                    {renderStatBar('Passer Rating', player.detailedStats.career.passerRating || 0, 120, 'number', 'success')}
                    {renderStatBar('Interceptions', player.detailedStats.career.interceptions || 0, 300, 'number', 'error')}
                  </Grid>
                </Grid>
              )}
            </Box>

            {/* Awards and Achievements */}
            {player.detailedStats.career.awards.length > 0 && (
              <Box>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Awards & Achievements
                </Typography>
                <List dense>
                  {player.detailedStats.career.awards.map((award, index) => (
                    <ListItem key={index} sx={{ px: 0 }}>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'warning.main', width: 32, height: 32 }}>
                          <AwardIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={award.award}
                        secondary={award.year}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}
          </CardContent>
        </Card>
      )}

      {/* Injury History */}
      {showInjuries && player.injuryHistory && player.injuryHistory.injuries.length > 0 && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Injury History
            </Typography>
            
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Injury</TableCell>
                    <TableCell>Severity</TableCell>
                    <TableCell>Games Missed</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {player.injuryHistory.injuries.slice(-10).map((injury, index) => (
                    <TableRow key={index}>
                      <TableCell>{injury.date.toLocaleDateString()}</TableCell>
                      <TableCell>{injury.injury}</TableCell>
                      <TableCell>
                        <Chip
                          label={injury.severity}
                          size="small"
                          color={
                            injury.severity === 'Major' ? 'error' :
                            injury.severity === 'Moderate' ? 'warning' : 'success'
                          }
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>{injury.gamesmissed}</TableCell>
                      <TableCell>
                        <Chip
                          label={injury.status}
                          size="small"
                          color={injury.status === 'Recovered' ? 'success' : 'error'}
                          variant="outlined"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      {/* Recent Game Log */}
      {showGameLog && player.recentGames && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Recent Games
            </Typography>
            
            <List>
              {player.recentGames.slice(-5).map((game, index) => (
                <ListItem key={index} divider={index < player.recentGames!.length - 1}>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="subtitle2">
                          vs {game.opponent}
                        </Typography>
                        <Chip
                          label={game.result}
                          size="small"
                          color={game.result === 'W' ? 'success' : game.result === 'L' ? 'error' : 'default'}
                          variant="outlined"
                        />
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          {game.date.toLocaleDateString()}
                        </Typography>
                        {/* Position-specific game stats would go here */}
                      </Box>
                    }
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

// ===== PLAYER COMPARISON COMPONENT =====

export interface PlayerComparisonProps {
  player1: DetailedPlayer;
  player2: DetailedPlayer;
  statType?: 'season' | 'career';
}

export const PlayerComparison: React.FC<PlayerComparisonProps> = ({
  player1,
  player2,
  statType = 'season',
}) => {
  const theme = useTheme();

  const compareStats = (stat1: number, stat2: number, higherIsBetter: boolean = true) => {
    if (stat1 === stat2) return { winner: 'tie', difference: 0 };
    
    const winner = higherIsBetter 
      ? (stat1 > stat2 ? 'player1' : 'player2')
      : (stat1 < stat2 ? 'player1' : 'player2');
    
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
            fontWeight={comparison.winner === 'player1' ? 'bold' : 'normal'}
            color={comparison.winner === 'player1' ? 'primary.main' : 'text.primary'}
          >
            {formatValue(stat1)}
          </Typography>
          <Typography
            variant="body2"
            fontWeight={comparison.winner === 'player2' ? 'bold' : 'normal'}
            color={comparison.winner === 'player2' ? 'primary.main' : 'text.primary'}
          >
            {formatValue(stat2)}
          </Typography>
        </Box>
      </Box>
    );
  };

  const getStats = (player: DetailedPlayer) => {
    return statType === 'career' 
      ? player.detailedStats?.career 
      : player.stats || player.seasonStats;
  };

  const stats1 = getStats(player1);
  const stats2 = getStats(player2);

  if (!stats1 || !stats2) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom textAlign="center">
            Player Comparison
          </Typography>
          <Typography variant="body2" color="text.secondary" textAlign="center">
            Statistics not available for comparison.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom textAlign="center">
          Player Comparison ({statType === 'career' ? 'Career' : 'Season'})
        </Typography>
        
        {/* Player Headers */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar src={player1.photo} sx={{ width: 32, height: 32 }} />
            <Typography variant="subtitle1" fontWeight="bold">
              {player1.name}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              {player2.name}
            </Typography>
            <Avatar src={player2.photo} sx={{ width: 32, height: 32 }} />
          </Box>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* Statistics Comparison */}
        <Grid container spacing={2}>
          {/* Position-specific comparisons */}
          {player1.position.toUpperCase() === 'QB' && player2.position.toUpperCase() === 'QB' && (
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="error.main" gutterBottom>
                Passing Statistics
              </Typography>
              {renderStatComparison('Passing Yards', stats1.passingYards || 0, stats2.passingYards || 0)}
              {renderStatComparison('Touchdowns', stats1.passingTouchdowns || 0, stats2.passingTouchdowns || 0)}
              {renderStatComparison('Interceptions', stats1.interceptions || 0, stats2.interceptions || 0, 'number', false)}
              {renderStatComparison('Passer Rating', stats1.passerRating || 0, stats2.passerRating || 0)}
            </Grid>
          )}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default PlayerDetails;