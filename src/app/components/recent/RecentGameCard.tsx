import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Avatar,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  LinearProgress,
  IconButton,
  Tooltip,
  Button,
  useTheme,
} from '@mui/material';
import {
  ExpandMore as ExpandIcon,
  SportsFootball as ScoreIcon,
  Schedule as TimeIcon,
  Stadium as VenueIcon,
  Tv as BroadcastIcon,
  ThermostatAuto as WeatherIcon,
  Timeline as StatsIcon,
  EmojiEvents as TrophyIcon,
} from '@mui/icons-material';
import { DetailedGameResult } from '../../services/RecentGamesService';
import { formatDistanceToNow, format } from '../../utils/dateUtils';

// ===== RECENT GAME CARD COMPONENT =====

interface RecentGameCardProps {
  game: DetailedGameResult;
  variant?: 'default' | 'compact' | 'detailed';
  showStats?: boolean;
  showQuarterScores?: boolean;
  onClick?: (game: DetailedGameResult) => void;
}

export const RecentGameCard: React.FC<RecentGameCardProps> = ({
  game,
  variant = 'default',
  showStats = true,
  showQuarterScores = false,
  onClick,
}) => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);

  const isHomeWinner = game.homeScore > game.awayScore;
  const isAwayWinner = game.awayScore > game.homeScore;
  const margin = Math.abs(game.homeScore - game.awayScore);
  
  const handleCardClick = () => {
    if (onClick) {
      onClick(game);
    }
  };

  const getTeamScoreColor = (isWinner: boolean) => {
    if (isWinner) return theme.palette.primary.main;
    return theme.palette.text.secondary;
  };

  if (variant === 'compact') {
    return (
      <Card 
        sx={{ 
          cursor: onClick ? 'pointer' : 'default',
          transition: 'all 0.3s ease',
          '&:hover': onClick ? { boxShadow: 4 } : {},
        }}
        onClick={handleCardClick}
      >
        <CardContent sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="caption" color="text.secondary">
              {format(game.date, 'EEE, MMM d • h:mm a')}
            </Typography>
            <Chip 
              label="FINAL" 
              color="success" 
              size="small" 
              variant="outlined"
            />
          </Box>

          <Grid container spacing={2} alignItems="center">
            <Grid item xs={5}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Avatar src={game.awayTeam.logo} sx={{ width: 24, height: 24 }} />
                <Box>
                  <Typography 
                    variant="body2" 
                    fontWeight={isAwayWinner ? 'bold' : 'medium'}
                    color={getTeamScoreColor(isAwayWinner)}
                  >
                    {game.awayTeam.shortName}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            
            <Grid item xs={2} sx={{ textAlign: 'center' }}>
              <Typography 
                variant="h6" 
                fontWeight="bold"
                color={getTeamScoreColor(isAwayWinner)}
              >
                {game.awayScore}
              </Typography>
              <Typography variant="body2" color="text.secondary">-</Typography>
              <Typography 
                variant="h6" 
                fontWeight="bold"
                color={getTeamScoreColor(isHomeWinner)}
              >
                {game.homeScore}
              </Typography>
            </Grid>
            
            <Grid item xs={5}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'flex-end' }}>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography 
                    variant="body2" 
                    fontWeight={isHomeWinner ? 'bold' : 'medium'}
                    color={getTeamScoreColor(isHomeWinner)}
                  >
                    {game.homeTeam.shortName}
                  </Typography>
                </Box>
                <Avatar src={game.homeTeam.logo} sx={{ width: 24, height: 24 }} />
              </Box>
            </Grid>
          </Grid>

          {game.venue && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
              <VenueIcon fontSize="small" color="action" />
              <Typography variant="caption" color="text.secondary">
                {game.venue}
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      sx={{ 
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.3s ease',
        '&:hover': onClick ? { 
          boxShadow: 6,
          transform: 'translateY(-2px)',
        } : {},
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {/* Game Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Chip 
              label="FINAL" 
              color="success" 
              icon={<TrophyIcon />}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TimeIcon fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                {format(game.date, 'EEEE, MMMM d, yyyy • h:mm a')}
              </Typography>
            </Box>
          </Box>
          
          <Typography variant="caption" color="text.secondary">
            {formatDistanceToNow(game.date, { addSuffix: true })}
          </Typography>
        </Box>

        {/* Team Matchup */}
        <Grid container spacing={3} alignItems="center" sx={{ mb: 2 }}>
          <Grid item xs={5}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar 
                src={game.awayTeam.logo} 
                sx={{ 
                  width: 48, 
                  height: 48,
                  border: isAwayWinner ? `3px solid ${theme.palette.primary.main}` : 'none'
                }} 
              />
              <Box>
                <Typography 
                  variant="h6" 
                  fontWeight={isAwayWinner ? 'bold' : 'medium'}
                  color={getTeamScoreColor(isAwayWinner)}
                >
                  {game.awayTeam.shortName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {game.awayTeam.name}
                </Typography>
                {game.awayTeam.conference && (
                  <Typography variant="caption" color="text.secondary">
                    {game.awayTeam.conference} {game.awayTeam.division}
                  </Typography>
                )}
              </Box>
            </Box>
          </Grid>

          <Grid item xs={2} sx={{ textAlign: 'center' }}>
            <Typography 
              variant="h2" 
              fontWeight="bold" 
              color={getTeamScoreColor(isAwayWinner)}
            >
              {game.awayScore}
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ my: 1 }}>-</Typography>
            <Typography 
              variant="h2" 
              fontWeight="bold" 
              color={getTeamScoreColor(isHomeWinner)}
            >
              {game.homeScore}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {margin === 0 ? 'TIE' : `${margin} point margin`}
            </Typography>
          </Grid>

          <Grid item xs={5}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'flex-end' }}>
              <Box sx={{ textAlign: 'right' }}>
                <Typography 
                  variant="h6" 
                  fontWeight={isHomeWinner ? 'bold' : 'medium'}
                  color={getTeamScoreColor(isHomeWinner)}
                >
                  {game.homeTeam.shortName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {game.homeTeam.name}
                </Typography>
                {game.homeTeam.conference && (
                  <Typography variant="caption" color="text.secondary">
                    {game.homeTeam.conference} {game.homeTeam.division}
                  </Typography>
                )}
              </Box>
              <Avatar 
                src={game.homeTeam.logo} 
                sx={{ 
                  width: 48, 
                  height: 48,
                  border: isHomeWinner ? `3px solid ${theme.palette.primary.main}` : 'none'
                }} 
              />
            </Box>
          </Grid>
        </Grid>

        {/* Quarter Scores */}
        {showQuarterScores && (
          <Box sx={{ mb: 2 }}>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="subtitle2" gutterBottom>
              Quarter by Quarter
            </Typography>
            <Grid container spacing={1}>
              <Grid item xs={3}><Typography variant="caption" align="center" display="block">Q1</Typography></Grid>
              <Grid item xs={3}><Typography variant="caption" align="center" display="block">Q2</Typography></Grid>
              <Grid item xs={3}><Typography variant="caption" align="center" display="block">Q3</Typography></Grid>
              <Grid item xs={3}><Typography variant="caption" align="center" display="block">Q4</Typography></Grid>
            </Grid>
            <Grid container spacing={1} sx={{ mb: 1 }}>
              <Grid item xs={3}>
                <Typography variant="body2" align="center" color={getTeamScoreColor(isAwayWinner)}>
                  {game.quarterScores.quarter1.away}
                </Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography variant="body2" align="center" color={getTeamScoreColor(isAwayWinner)}>
                  {game.quarterScores.quarter2.away}
                </Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography variant="body2" align="center" color={getTeamScoreColor(isAwayWinner)}>
                  {game.quarterScores.quarter3.away}
                </Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography variant="body2" align="center" color={getTeamScoreColor(isAwayWinner)}>
                  {game.quarterScores.quarter4.away}
                </Typography>
              </Grid>
            </Grid>
            <Grid container spacing={1}>
              <Grid item xs={3}>
                <Typography variant="body2" align="center" color={getTeamScoreColor(isHomeWinner)}>
                  {game.quarterScores.quarter1.home}
                </Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography variant="body2" align="center" color={getTeamScoreColor(isHomeWinner)}>
                  {game.quarterScores.quarter2.home}
                </Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography variant="body2" align="center" color={getTeamScoreColor(isHomeWinner)}>
                  {game.quarterScores.quarter3.home}
                </Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography variant="body2" align="center" color={getTeamScoreColor(isHomeWinner)}>
                  {game.quarterScores.quarter4.home}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Game Info */}
        <Box sx={{ display: 'flex', flex: 1, gap: 3, mb: 2, flexWrap: 'wrap' }}>
          {game.venue && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <VenueIcon fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                {game.venue}
              </Typography>
            </Box>
          )}
          
          {game.broadcast && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <BroadcastIcon fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                {game.broadcast}
              </Typography>
            </Box>
          )}

          {game.weather && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <WeatherIcon fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                {game.weather.temperature}° {game.weather.condition}
              </Typography>
            </Box>
          )}

          {game.attendance && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Attendance: {game.attendance.toLocaleString()}
              </Typography>
            </Box>
          )}
        </Box>

        {/* Expandable Stats Section */}
        {showStats && game.gameStats && (
          <Accordion 
            expanded={expanded} 
            onChange={() => setExpanded(!expanded)}
            sx={{ mt: 2 }}
          >
            <AccordionSummary expandIcon={<ExpandIcon />}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <StatsIcon />
                <Typography variant="subtitle2">Game Statistics</Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={3}>
                {/* Away Team Stats */}
                <Grid item xs={6}>
                  <Typography variant="body2" fontWeight="bold" gutterBottom color={getTeamScoreColor(isAwayWinner)}>
                    {game.awayTeam.shortName} Statistics
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="caption">Total Yards</Typography>
                      <Typography variant="caption" fontWeight="medium">
                        {game.gameStats.away.totalYards}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="caption">Passing Yards</Typography>
                      <Typography variant="caption" fontWeight="medium">
                        {game.gameStats.away.passingYards}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="caption">Rushing Yards</Typography>
                      <Typography variant="caption" fontWeight="medium">
                        {game.gameStats.away.rushingYards}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="caption">Turnovers</Typography>
                      <Typography variant="caption" fontWeight="medium">
                        {game.gameStats.away.turnovers}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="caption">Time of Possession</Typography>
                      <Typography variant="caption" fontWeight="medium">
                        {game.gameStats.away.timeOfPossession}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="caption">3rd Down Conv.</Typography>
                      <Typography variant="caption" fontWeight="medium">
                        {game.gameStats.away.thirdDownConversions}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                {/* Home Team Stats */}
                <Grid item xs={6}>
                  <Typography variant="body2" fontWeight="bold" gutterBottom color={getTeamScoreColor(isHomeWinner)}>
                    {game.homeTeam.shortName} Statistics
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="caption">Total Yards</Typography>
                      <Typography variant="caption" fontWeight="medium">
                        {game.gameStats.home.totalYards}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="caption">Passing Yards</Typography>
                      <Typography variant="caption" fontWeight="medium">
                        {game.gameStats.home.passingYards}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="caption">Rushing Yards</Typography>
                      <Typography variant="caption" fontWeight="medium">
                        {game.gameStats.home.rushingYards}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="caption">Turnovers</Typography>
                      <Typography variant="caption" fontWeight="medium">
                        {game.gameStats.home.turnovers}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="caption">Time of Possession</Typography>
                      <Typography variant="caption" fontWeight="medium">
                        {game.gameStats.home.timeOfPossession}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="caption">3rd Down Conv.</Typography>
                      <Typography variant="caption" fontWeight="medium">
                        {game.gameStats.home.thirdDownConversions}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>

              {/* Key Plays */}
              {game.keyPlays && game.keyPlays.length > 0 && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="body2" fontWeight="bold" gutterBottom>
                    Key Plays
                  </Typography>
                  {game.keyPlays.slice(0, 4).map((play, index) => (
                    <Box key={index} sx={{ mb: 1 }}>
                      <Typography variant="caption" color="text.secondary">
                        Q{play.quarter} - {play.time}
                      </Typography>
                      <Typography variant="body2">
                        {play.description}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}
            </AccordionDetails>
          </Accordion>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentGameCard;