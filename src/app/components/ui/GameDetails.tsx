import React from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  Avatar,
  Chip,
  LinearProgress,
  Grid,
  Divider,
  useTheme,
  alpha,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Remove as NeutralIcon,
  Schedule as ScheduleIcon,
  SportsFootball as FootballIcon,
} from '@mui/icons-material';
import { formatNumber, formatPercentage } from '../../utils/format.utils';
import { useLayout } from '../layout/MainLayout';

// ===== TYPES =====

export interface GameStats {
  firstDowns: number;
  totalYards: number;
  passingYards: number;
  rushingYards: number;
  turnovers: number;
  penalties: number;
  penaltyYards: number;
  timeOfPossession: string;
  thirdDownEfficiency: {
    attempts: number;
    conversions: number;
  };
  redZoneEfficiency: {
    attempts: number;
    scores: number;
  };
}

export interface QuarterScore {
  quarter: number;
  home: number;
  away: number;
}

export interface ScoringPlay {
  id: string;
  quarter: number;
  time: string;
  team: 'home' | 'away';
  type: 'touchdown' | 'field_goal' | 'safety' | 'extra_point' | 'two_point';
  description: string;
  yards?: number;
  player?: string;
}

export interface DetailedGame extends Game {
  stats?: {
    home: GameStats;
    away: GameStats;
  };
  quarterScores?: QuarterScore[];
  scoringPlays?: ScoringPlay[];
  attendance?: number;
  officials?: string[];
  gameNotes?: string[];
}

// Re-export Game type for convenience
export type { Game, Team, GameScore } from './GameCard';

// ===== GAME DETAILS COMPONENT =====

export interface GameDetailsProps {
  game: DetailedGame;
  variant?: 'default' | 'compact';
  showStats?: boolean;
  showScoring?: boolean;
  showQuarters?: boolean;
}

export const GameDetails: React.FC<GameDetailsProps> = ({
  game,
  variant = 'default',
  showStats = true,
  showScoring = true,
  showQuarters = true,
}) => {
  const theme = useTheme();
  const { compactMode } = useLayout();
  const isCompact = variant === 'compact' || compactMode;

  const renderStatComparison = (
    label: string,
    homeValue: number | string,
    awayValue: number | string,
    format?: 'number' | 'percentage' | 'time',
    higherIsBetter: boolean = true
  ) => {
    const formatValue = (value: number | string) => {
      if (typeof value === 'string') return value;
      switch (format) {
        case 'percentage':
          return formatPercentage(value / 100);
        case 'number':
          return formatNumber(value);
        case 'time':
          return value.toString();
        default:
          return value.toString();
      }
    };

    const homeVal = typeof homeValue === 'number' ? homeValue : parseFloat(homeValue.toString());
    const awayVal = typeof awayValue === 'number' ? awayValue : parseFloat(awayValue.toString());
    
    const homeIsBetter = higherIsBetter ? homeVal > awayVal : homeVal < awayVal;
    const awayIsBetter = higherIsBetter ? awayVal > homeVal : awayVal < homeVal;

    return (
      <Box key={label} sx={{ mb: 2 }}>
        <Typography 
          variant="caption" 
          color="text.secondary" 
          sx={{ display: 'block', textAlign: 'center', mb: 0.5 }}
        >
          {label}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography 
            variant="body2" 
            fontWeight={homeIsBetter ? 'bold' : 'normal'}
            color={homeIsBetter ? 'primary.main' : 'text.primary'}
          >
            {formatValue(homeValue)}
          </Typography>
          <Typography 
            variant="body2" 
            fontWeight={awayIsBetter ? 'bold' : 'normal'}
            color={awayIsBetter ? 'primary.main' : 'text.primary'}
          >
            {formatValue(awayValue)}
          </Typography>
        </Box>
      </Box>
    );
  };

  return (
    <Box>
      {/* Quarter-by-Quarter Scores */}
      {showQuarters && game.quarterScores && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Line Score
            </Typography>
            
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: `auto repeat(${game.quarterScores.length}, 1fr) auto`,
              gap: 1,
              alignItems: 'center',
            }}>
              {/* Header */}
              <Typography variant="body2" fontWeight="bold">Team</Typography>
              {game.quarterScores.map(q => (
                <Typography key={q.quarter} variant="body2" fontWeight="bold" textAlign="center">
                  Q{q.quarter}
                </Typography>
              ))}
              <Typography variant="body2" fontWeight="bold" textAlign="center">Final</Typography>
              
              {/* Away Team Row */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Avatar src={game.awayTeam.logo} sx={{ width: 24, height: 24 }} />
                <Typography variant="body2" noWrap>{game.awayTeam.shortName}</Typography>
              </Box>
              {game.quarterScores.map(q => (
                <Typography key={`away-${q.quarter}`} variant="body2" textAlign="center">
                  {q.away}
                </Typography>
              ))}
              <Typography variant="h6" textAlign="center" fontWeight="bold">
                {game.score?.away || 0}
              </Typography>
              
              {/* Home Team Row */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Avatar src={game.homeTeam.logo} sx={{ width: 24, height: 24 }} />
                <Typography variant="body2" noWrap>{game.homeTeam.shortName}</Typography>
              </Box>
              {game.quarterScores.map(q => (
                <Typography key={`home-${q.quarter}`} variant="body2" textAlign="center">
                  {q.home}
                </Typography>
              ))}
              <Typography variant="h6" textAlign="center" fontWeight="bold">
                {game.score?.home || 0}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Game Statistics */}
      {showStats && game.stats && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ textAlign: 'center' }}>
              Team Statistics
            </Typography>
            
            {/* Team Headers */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Avatar src={game.awayTeam.logo} sx={{ width: 32, height: 32 }} />
                <Typography variant="subtitle1" fontWeight="bold">
                  {game.awayTeam.shortName}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  {game.homeTeam.shortName}
                </Typography>
                <Avatar src={game.homeTeam.logo} sx={{ width: 32, height: 32 }} />
              </Box>
            </Box>

            <Divider sx={{ mb: 2 }} />

            {/* Statistics Comparison */}
            <Grid container spacing={isCompact ? 2 : 4}>
              <Grid item xs={12} md={6}>
                {renderStatComparison('First Downs', game.stats.away.firstDowns, game.stats.home.firstDowns, 'number')}
                {renderStatComparison('Total Yards', game.stats.away.totalYards, game.stats.home.totalYards, 'number')}
                {renderStatComparison('Passing Yards', game.stats.away.passingYards, game.stats.home.passingYards, 'number')}
                {renderStatComparison('Rushing Yards', game.stats.away.rushingYards, game.stats.home.rushingYards, 'number')}
              </Grid>
              
              <Grid item xs={12} md={6}>
                {renderStatComparison('Turnovers', game.stats.away.turnovers, game.stats.home.turnovers, 'number', false)}
                {renderStatComparison('Time of Possession', game.stats.away.timeOfPossession, game.stats.home.timeOfPossession, 'time')}
                {renderStatComparison(
                  '3rd Down Efficiency',
                  `${game.stats.away.thirdDownEfficiency.conversions}/${game.stats.away.thirdDownEfficiency.attempts}`,
                  `${game.stats.home.thirdDownEfficiency.conversions}/${game.stats.home.thirdDownEfficiency.attempts}`,
                  'string'
                )}
                {renderStatComparison(
                  'Red Zone Efficiency',
                  `${game.stats.away.redZoneEfficiency.scores}/${game.stats.away.redZoneEfficiency.attempts}`,
                  `${game.stats.home.redZoneEfficiency.scores}/${game.stats.home.redZoneEfficiency.attempts}`,
                  'string'
                )}
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Scoring Plays */}
      {showScoring && game.scoringPlays && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Scoring Summary
            </Typography>
            
            {game.scoringPlays.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
                <FootballIcon sx={{ fontSize: 48, mb: 1, opacity: 0.5 }} />
                <Typography variant="body2">No scoring plays yet</Typography>
              </Box>
            ) : (
              <Box>
                {game.scoringPlays.map((play, index) => {
                  const team = play.team === 'home' ? game.homeTeam : game.awayTeam;
                  const isHome = play.team === 'home';
                  
                  return (
                    <Box key={play.id} sx={{ mb: index < game.scoringPlays!.length - 1 ? 2 : 0 }}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 120 }}>
                          <Avatar 
                            src={team.logo} 
                            sx={{ width: 24, height: 24 }}
                          />
                          <Typography variant="body2" fontWeight="medium">
                            {team.shortName}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ flexGrow: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                            <Chip
                              label={play.type.replace('_', ' ').toUpperCase()}
                              size="small"
                              color={
                                play.type === 'touchdown' ? 'success' :
                                play.type === 'field_goal' ? 'primary' :
                                play.type === 'safety' ? 'error' : 'default'
                              }
                              variant="outlined"
                            />
                            <Typography variant="caption" color="text.secondary">
                              Q{play.quarter} - {play.time}
                            </Typography>
                          </Box>
                          
                          <Typography variant="body2">
                            {play.description}
                          </Typography>
                          
                          {play.player && (
                            <Typography variant="caption" color="text.secondary">
                              {play.player}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                      
                      {index < game.scoringPlays!.length - 1 && (
                        <Divider sx={{ mt: 2 }} />
                      )}
                    </Box>
                  );
                })}
              </Box>
            )}
          </CardContent>
        </Card>
      )}

      {/* Game Information */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Game Information
          </Typography>
          
          <Grid container spacing={2}>
            {game.venue && (
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Venue
                </Typography>
                <Typography variant="body2">
                  {game.venue.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {game.venue.city}, {game.venue.state}
                </Typography>
              </Grid>
            )}
            
            {game.attendance && (
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Attendance
                </Typography>
                <Typography variant="body2">
                  {formatNumber(game.attendance)}
                </Typography>
              </Grid>
            )}
            
            {game.weather && (
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Weather
                </Typography>
                <Typography variant="body2">
                  {game.weather.temperature}°F, {game.weather.condition}
                  {game.weather.windSpeed && ` • Wind: ${game.weather.windSpeed} mph`}
                </Typography>
              </Grid>
            )}
            
            {game.broadcast && (
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Broadcast
                </Typography>
                <Typography variant="body2">
                  {game.broadcast.network}
                </Typography>
              </Grid>
            )}
          </Grid>

          {game.gameNotes && game.gameNotes.length > 0 && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Game Notes
              </Typography>
              {game.gameNotes.map((note, index) => (
                <Typography key={index} variant="body2" sx={{ mb: 1 }}>
                  • {note}
                </Typography>
              ))}
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

// ===== GAME SUMMARY COMPONENT =====

export interface GameSummaryProps {
  game: DetailedGame;
  variant?: 'default' | 'compact';
  showMomentum?: boolean;
}

export const GameSummary: React.FC<GameSummaryProps> = ({
  game,
  variant = 'default',
  showMomentum = true,
}) => {
  const theme = useTheme();
  const { compactMode } = useLayout();
  const isCompact = variant === 'compact' || compactMode;

  // Calculate momentum based on recent scoring
  const getMomentum = () => {
    if (!game.scoringPlays || game.scoringPlays.length === 0) {
      return { team: null, strength: 0 };
    }

    // Look at last 3 scoring plays
    const recentPlays = game.scoringPlays.slice(-3);
    const homeScores = recentPlays.filter(play => play.team === 'home').length;
    const awayScores = recentPlays.filter(play => play.team === 'away').length;

    if (homeScores > awayScores) {
      return { team: 'home', strength: (homeScores - awayScores) / recentPlays.length };
    } else if (awayScores > homeScores) {
      return { team: 'away', strength: (awayScores - homeScores) / recentPlays.length };
    }

    return { team: null, strength: 0 };
  };

  const momentum = getMomentum();

  const getMomentumIcon = () => {
    if (momentum.strength > 0.5) return <TrendingUpIcon color="success" />;
    if (momentum.strength > 0) return <TrendingUpIcon color="warning" />;
    return <NeutralIcon color="action" />;
  };

  return (
    <Card>
      <CardContent>
        {/* Score Display */}
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="h4" gutterBottom>
            {game.score?.away || 0} - {game.score?.home || 0}
          </Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar src={game.awayTeam.logo} sx={{ width: 32, height: 32 }} />
              <Typography variant="h6">
                {game.awayTeam.shortName}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="h6">
                {game.homeTeam.shortName}
              </Typography>
              <Avatar src={game.homeTeam.logo} sx={{ width: 32, height: 32 }} />
            </Box>
          </Box>

          {game.status === 'live' && game.score && (
            <Typography variant="body2" color="error.main" fontWeight="bold">
              Q{game.score.quarter} - {game.score.timeRemaining}
            </Typography>
          )}
        </Box>

        {/* Momentum Indicator */}
        {showMomentum && momentum.team && (
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            gap: 1,
            p: 1,
            bgcolor: alpha(theme.palette.success.main, 0.1),
            borderRadius: 1,
            mb: 2,
          }}>
            {getMomentumIcon()}
            <Typography variant="body2" color="text.secondary">
              {momentum.team === 'home' ? game.homeTeam.shortName : game.awayTeam.shortName} has momentum
            </Typography>
          </Box>
        )}

        {/* Key Stats Summary */}
        {game.stats && (
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Key Stats
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary">
                  Total Yards
                </Typography>
                <Typography variant="body2">
                  {game.awayTeam.shortName}: {formatNumber(game.stats.away.totalYards)}
                </Typography>
                <Typography variant="body2">
                  {game.homeTeam.shortName}: {formatNumber(game.stats.home.totalYards)}
                </Typography>
              </Grid>
              
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary">
                  Turnovers
                </Typography>
                <Typography variant="body2">
                  {game.awayTeam.shortName}: {game.stats.away.turnovers}
                </Typography>
                <Typography variant="body2">
                  {game.homeTeam.shortName}: {game.stats.home.turnovers}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default GameDetails;