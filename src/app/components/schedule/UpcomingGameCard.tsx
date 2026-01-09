import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Box,
  Typography,
  Chip,
  Button,
  Collapse,
  Grid,
  Avatar,
  Divider,
  IconButton,
  Badge,
  Tooltip,
  useTheme,
  alpha,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Schedule as ScheduleIcon,
  LocationOn as LocationIcon,
  Tv as TvIcon,
  ConfirmationNumber as TicketIcon,
  TrendingUp as TrendingIcon,
  Warning as InjuryIcon,
  Star as StarIcon,
  Sports as GameIcon,
  AccessTime as TimeIcon,
  Paid as MoneyIcon,
} from '@mui/icons-material';
import { format, formatDistanceToNow, isToday, isTomorrow } from 'date-fns';
import { UpcomingGame } from '../../services/UpcomingScheduleService';

// ===== COMPONENT PROPS INTERFACE =====
interface UpcomingGameCardProps {
  game: UpcomingGame;
  variant?: 'default' | 'compact' | 'detailed';
  showPredictions?: boolean;
  showBroadcast?: boolean;
  showTickets?: boolean;
  showInjuries?: boolean;
  onClick?: (game: UpcomingGame) => void;
}

// ===== MAIN UPCOMING GAME CARD COMPONENT =====
export const UpcomingGameCard: React.FC<UpcomingGameCardProps> = ({
  game,
  variant = 'default',
  showPredictions = true,
  showBroadcast = true,
  showTickets = false,
  showInjuries = true,
  onClick,
}) => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setExpanded(!expanded);
  };

  const handleCardClick = () => {
    if (onClick) {
      onClick(game);
    }
  };

  // Format game time
  const formatGameTime = () => {
    if (isToday(game.gameTime)) {
      return `Today, ${format(game.gameTime, 'h:mm a')}`;
    } else if (isTomorrow(game.gameTime)) {
      return `Tomorrow, ${format(game.gameTime, 'h:mm a')}`;
    } else {
      return format(game.gameTime, 'EEE MMM d, h:mm a');
    }
  };

  // Get time until game
  const timeUntilGame = formatDistanceToNow(game.gameTime, { addSuffix: true });

  // Determine if game is primetime
  const isPrimetime = game.isPrimetime;
  const isRivalry = game.isRivalry;
  const hasPlayoffImplications = game.playoffImplications;

  // Get injury count
  const totalInjuries = (game.injuryReport?.homeTeam?.length || 0) + (game.injuryReport?.awayTeam?.length || 0);

  // Card styling based on variant and game importance
  const getCardSx = () => {
    const baseSx = {
      cursor: onClick ? 'pointer' : 'default',
      transition: 'all 0.2s ease-in-out',
      '&:hover': onClick ? {
        transform: 'translateY(-2px)',
        boxShadow: theme.shadows[8],
      } : {},
    };

    if (isPrimetime) {
      return {
        ...baseSx,
        border: `2px solid ${theme.palette.warning.main}`,
        background: `linear-gradient(135deg, ${alpha(theme.palette.warning.main, 0.05)}, ${alpha(theme.palette.primary.main, 0.05)})`,
      };
    }

    if (isRivalry) {
      return {
        ...baseSx,
        border: `2px solid ${theme.palette.error.main}`,
        background: `linear-gradient(135deg, ${alpha(theme.palette.error.main, 0.05)}, ${alpha(theme.palette.secondary.main, 0.05)})`,
      };
    }

    return baseSx;
  };

  // Compact variant
  if (variant === 'compact') {
    return (
      <Card sx={getCardSx()} onClick={handleCardClick}>
        <CardContent sx={{ pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {isPrimetime && <StarIcon sx={{ color: 'warning.main', fontSize: 16 }} />}
              {isRivalry && <Badge color="error" variant="dot" />}
            </Box>
            <Typography variant="caption" color="text.secondary">
              {timeUntilGame}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar
                src={game.awayTeam.logo}
                sx={{ width: 24, height: 24 }}
              />
              <Typography variant="body2" fontWeight="bold">
                {game.awayTeam.shortName}
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">@</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" fontWeight="bold">
                {game.homeTeam.shortName}
              </Typography>
              <Avatar
                src={game.homeTeam.logo}
                sx={{ width: 24, height: 24 }}
              />
            </Box>
          </Box>

          <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <TimeIcon sx={{ fontSize: 12 }} />
            {formatGameTime()}
          </Typography>

          {showBroadcast && game.broadcast && (
            <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
              <TvIcon sx={{ fontSize: 12 }} />
              {game.broadcast.network}
            </Typography>
          )}
        </CardContent>
      </Card>
    );
  }

  // Default and detailed variants
  return (
    <Card sx={getCardSx()} onClick={handleCardClick}>
      <CardContent>
        {/* Header with game status and time */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {isPrimetime && (
              <Chip
                icon={<StarIcon />}
                label="Primetime"
                size="small"
                color="warning"
                variant="outlined"
              />
            )}
            {isRivalry && (
              <Chip
                label="Rivalry"
                size="small"
                color="error"
                variant="outlined"
              />
            )}
            {hasPlayoffImplications && (
              <Chip
                label="Playoff Impact"
                size="small"
                color="success"
                variant="outlined"
              />
            )}
            {totalInjuries > 0 && showInjuries && (
              <Tooltip title={`${totalInjuries} injury report${totalInjuries > 1 ? 's' : ''}`}>
                <Chip
                  icon={<InjuryIcon />}
                  label={totalInjuries}
                  size="small"
                  color="warning"
                  variant="outlined"
                />
              </Tooltip>
            )}
          </Box>
          
          <Typography variant="caption" color="text.secondary">
            {timeUntilGame}
          </Typography>
        </Box>

        {/* Teams */}
        <Box sx={{ mb: 2 }}>
          {/* Away Team */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar
                src={game.awayTeam.logo}
                sx={{ width: 40, height: 40 }}
              />
              <Box>
                <Typography variant="h6" fontWeight="bold">
                  {game.awayTeam.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {game.awayTeam.record} • {game.awayTeam.conference}
                </Typography>
              </Box>
            </Box>
            {showPredictions && game.predictions && (
              <Typography variant="body2" color="text.secondary">
                {game.predictions.spread > 0 ? `+${game.predictions.spread}` : game.predictions.spread}
              </Typography>
            )}
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', my: 1 }}>
            @
          </Typography>

          {/* Home Team */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar
                src={game.homeTeam.logo}
                sx={{ width: 40, height: 40 }}
              />
              <Box>
                <Typography variant="h6" fontWeight="bold">
                  {game.homeTeam.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {game.homeTeam.record} • {game.homeTeam.conference}
                </Typography>
              </Box>
            </Box>
            {showPredictions && game.predictions && (
              <Typography variant="body2" color="text.secondary">
                {game.predictions.spread < 0 ? game.predictions.spread : `+${game.predictions.spread}`}
              </Typography>
            )}
          </Box>
        </Box>

        {/* Game Info */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <ScheduleIcon sx={{ fontSize: 16 }} />
            {formatGameTime()}
          </Typography>
          
          <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <LocationIcon sx={{ fontSize: 16 }} />
            {game.venue}
          </Typography>

          {showBroadcast && game.broadcast && (
            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <TvIcon sx={{ fontSize: 16 }} />
              {game.broadcast.network}
              {game.broadcast.announcers && (
                <Typography variant="caption" color="text.secondary">
                  • {game.broadcast.announcers.join(', ')}
                </Typography>
              )}
            </Typography>
          )}
        </Box>

        {/* Predictions */}
        {showPredictions && game.predictions && (
          <Box sx={{ mb: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="caption" color="text.secondary">Spread</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {game.predictions.spread > 0 ? `${game.homeTeam.shortName} -${game.predictions.spread}` : `${game.awayTeam.shortName} -${Math.abs(game.predictions.spread)}`}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="caption" color="text.secondary">O/U</Typography>
                  <Typography variant="body2" fontWeight="bold">{game.predictions.overUnder}</Typography>
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="caption" color="text.secondary">Win %</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {game.predictions.winProbability.home}%
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Tickets */}
        {showTickets && game.ticketInfo && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <TicketIcon sx={{ fontSize: 16 }} />
              Tickets from ${game.ticketInfo.minPrice}
              {game.ticketInfo.availability && (
                <Chip 
                  label={game.ticketInfo.availability} 
                  size="small"
                  color={game.ticketInfo.availability === 'Limited' ? 'warning' : 'default'}
                />
              )}
            </Typography>
          </Box>
        )}
      </CardContent>

      {/* Expandable Actions */}
      {(variant === 'detailed' || (game.injuryReport && Object.keys(game.injuryReport).length > 0)) && (
        <CardActions sx={{ pt: 0 }}>
          <Button
            size="small"
            onClick={handleExpandClick}
            endIcon={expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          >
            {expanded ? 'Show Less' : 'Show Details'}
          </Button>
          
          {showTickets && game.ticketInfo && (
            <Button size="small" startIcon={<TicketIcon />}>
              Buy Tickets
            </Button>
          )}
        </CardActions>
      )}

      {/* Expandable Content */}
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent sx={{ pt: 0 }}>
          <Divider sx={{ mb: 2 }} />

          {/* Weather */}
          {game.weather && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>Weather Conditions</Typography>
              <Typography variant="body2" color="text.secondary">
                {game.weather.temperature}°F, {game.weather.conditions}
              </Typography>
              {game.weather.windSpeed && (
                <Typography variant="body2" color="text.secondary">
                  Wind: {game.weather.windSpeed} mph
                </Typography>
              )}
            </Box>
          )}

          {/* Injury Reports */}
          {showInjuries && game.injuryReport && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <InjuryIcon sx={{ fontSize: 16 }} />
                Injury Report
              </Typography>
              
              {game.injuryReport.awayTeam && game.injuryReport.awayTeam.length > 0 && (
                <Box sx={{ mb: 1 }}>
                  <Typography variant="body2" fontWeight="bold" color="text.secondary">
                    {game.awayTeam.shortName}
                  </Typography>
                  {game.injuryReport.awayTeam.map((injury, index) => (
                    <Typography key={index} variant="body2" color="text.secondary">
                      • {injury.player} ({injury.position}) - {injury.injury} - {injury.status}
                    </Typography>
                  ))}
                </Box>
              )}
              
              {game.injuryReport.homeTeam && game.injuryReport.homeTeam.length > 0 && (
                <Box>
                  <Typography variant="body2" fontWeight="bold" color="text.secondary">
                    {game.homeTeam.shortName}
                  </Typography>
                  {game.injuryReport.homeTeam.map((injury, index) => (
                    <Typography key={index} variant="body2" color="text.secondary">
                      • {injury.player} ({injury.position}) - {injury.injury} - {injury.status}
                    </Typography>
                  ))}
                </Box>
              )}
            </Box>
          )}

          {/* Playoff Implications */}
          {hasPlayoffImplications && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>Playoff Implications</Typography>
              <Typography variant="body2" color="text.secondary">
                {game.playoffImplications}
              </Typography>
            </Box>
          )}

          {/* Additional Game Info */}
          {game.notes && (
            <Box>
              <Typography variant="subtitle2" gutterBottom>Notes</Typography>
              <Typography variant="body2" color="text.secondary">
                {game.notes}
              </Typography>
            </Box>
          )}
        </CardContent>
      </Collapse>
    </Card>
  );
};

export default UpcomingGameCard;