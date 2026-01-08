import React from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  AccessTime as TimeIcon,
  LiveTv as LiveIcon,
} from '@mui/icons-material';
import { Game } from '@core-types/game.types';
import { TeamLogo } from '@shared-components/TeamLogo';
import { ScoreDisplay } from '@shared-components/ScoreDisplay';
import { formatGameTime, getGameStatusDisplay } from '@shared-utils/game.utils';

interface GameCardProps {
  game: Game;
  isFavorite?: boolean;
  onFavoriteToggle?: (gameId: string) => void;
  onClick?: (game: Game) => void;
  variant?: 'default' | 'compact' | 'detailed';
}

export const GameCard: React.FC<GameCardProps> = ({
  game,
  isFavorite = false,
  onFavoriteToggle,
  onClick,
  variant = 'default',
}) => {
  const theme = useTheme();
  const isCompact = variant === 'compact';
  const isDetailed = variant === 'detailed';

  const getStatusColor = () => {
    switch (game.status) {
      case 'live':
        return '#D50A0A';        // NFL Red
      case 'completed':
        return '#6B7280';        // Muted gray
      case 'scheduled':
        return '#A5ACAF';        // NFL Silver
      default:
        return '#6B7280';
    }
  };

  const isLiveGame = game.status === 'live';
  const cardHeight = isCompact ? 'auto' : isDetailed ? 300 : 180;

  return (
    <Card
      sx={{
        height: cardHeight,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.2s ease-in-out',
        border: isLiveGame ? `2px solid #D50A0A` : '1px solid',        // NFL Red for live games
        borderColor: isLiveGame ? '#D50A0A' : theme.palette.divider,
        backgroundColor: isLiveGame 
          ? alpha('#D50A0A', 0.02)                                      // Subtle NFL red background
          : theme.palette.background.paper,                             // Use theme paper background
        boxShadow: isLiveGame 
          ? '0px 8px 16px rgba(213, 10, 10, 0.2)'                      // NFL red glow (lighter for light mode)
          : '0px 4px 8px rgba(0, 0, 0, 0.12)',                         // Standard shadow (lighter for light mode)
        '&:hover': onClick ? {
          transform: 'translateY(-2px)',
          boxShadow: isLiveGame 
            ? '0px 12px 24px rgba(213, 10, 10, 0.25)'                    // Enhanced NFL red glow (lighter)
            : '0px 8px 16px rgba(1, 51, 105, 0.2)',                    // NFL blue hover (lighter)
          borderColor: isLiveGame ? '#D50A0A' : '#013369',              // NFL colors
          backgroundColor: isLiveGame 
            ? alpha('#D50A0A', 0.05)
            : alpha(theme.palette.primary.main, 0.04),                 // Use theme-based hover color
        } : {},
      }}
      onClick={() => onClick?.(game)}
    >
      <CardContent sx={{ 
        p: isCompact ? 1.5 : 2, 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Header */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start',
          mb: isCompact ? 1 : 2,
        }}>
          {/* Live Indicator & Sport */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {isLiveGame && (
              <Chip
                icon={<LiveIcon />}
                label="LIVE"
                color="secondary"
                size="small"
                sx={{ 
                  fontWeight: 'bold',
                  backgroundColor: '#D50A0A',    // NFL Red
                  color: '#FFFFFF',
                  animation: 'pulse 2s infinite',
                  boxShadow: '0 0 12px rgba(213, 10, 10, 0.3)',
                  '@keyframes pulse': {
                    '0%': { opacity: 1 },
                    '50%': { opacity: 0.7 },
                    '100%': { opacity: 1 },
                  },
                }}
              />
            )}
            <Chip
              label={game.sport.toUpperCase()}
              size="small"
              variant="outlined"
              sx={{ fontSize: '0.7rem' }}
            />
          </Box>

          {/* Favorite Button */}
          {onFavoriteToggle && (
            <Tooltip title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}>
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onFavoriteToggle(game.id);
                }}
                sx={{ color: isFavorite ? theme.palette.error.main : theme.palette.grey[400] }}
              >
                {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
              </IconButton>
            </Tooltip>
          )}
        </Box>

        {/* Teams & Score */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          {isCompact ? (
            /* Compact Layout */
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
                <TeamLogo
                  teamId={game.awayTeam.id}
                  teamName={game.awayTeam.name}
                  teamColors={game.awayTeam.colors}
                  size="small"
                  sport={game.sport as 'nfl' | 'nba'}
                />
                <Typography variant="body2" noWrap>
                  {game.awayTeam.name}
                </Typography>
              </Box>
              
              <ScoreDisplay
                homeTeam={{
                  name: game.homeTeam.abbreviation,
                  score: game.homeTeam.score,
                  isWinner: game.status === 'completed' && (game.homeTeam.score || 0) > (game.awayTeam.score || 0),
                }}
                awayTeam={{
                  name: game.awayTeam.abbreviation,
                  score: game.awayTeam.score,
                  isWinner: game.status === 'completed' && (game.awayTeam.score || 0) > (game.homeTeam.score || 0),
                }}
                status={game.status}
                gameTime={game.status === 'scheduled' ? formatGameTime(game.startTime) : undefined}
                period={game.status === 'live' ? getGameStatusDisplay(game) : undefined}
                size="compact"
              />
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1, justifyContent: 'flex-end' }}>
                <Typography variant="body2" noWrap>
                  {game.homeTeam.name}
                </Typography>
                <TeamLogo
                  teamId={game.homeTeam.id}
                  teamName={game.homeTeam.name}
                  teamColors={game.homeTeam.colors}
                  size="small"
                  sport={game.sport as 'nfl' | 'nba'}
                />
              </Box>
            </Box>
          ) : (
            /* Normal/Detailed Layout */
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {/* Away Team */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <TeamLogo
                  teamId={game.awayTeam.id}
                  teamName={game.awayTeam.name}
                  teamColors={game.awayTeam.colors}
                  size={isDetailed ? 'large' : 'medium'}
                  sport={game.sport as 'nfl' | 'nba'}
                  showName={isDetailed}
                />
                {!isDetailed && (
                  <Box>
                    <Typography variant="subtitle1" fontWeight="medium">
                      {game.awayTeam.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {game.awayTeam.record}
                    </Typography>
                  </Box>
                )}
                {(game.status === 'live' || game.status === 'completed') && (
                  <Typography 
                    variant="h5" 
                    fontWeight="bold" 
                    sx={{ 
                      ml: 'auto',
                      fontFamily: '"JetBrains Mono", monospace',
                      color: (game.status === 'completed' && (game.awayTeam.score || 0) > (game.homeTeam.score || 0)) 
                        ? '#013369'          // NFL Blue for winner
                        : '#F5F7FA',         // Primary text for others
                    }}
                  >
                    {game.awayTeam.score}
                  </Typography>
                )}
              </Box>

              {/* VS or Score Separator */}
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="body2" color="text.secondary" fontWeight="bold">
                  {game.status === 'scheduled' ? 'VS' : '—'}
                </Typography>
              </Box>

              {/* Home Team */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <TeamLogo
                  teamId={game.homeTeam.id}
                  teamName={game.homeTeam.name}
                  teamColors={game.homeTeam.colors}
                  size={isDetailed ? 'large' : 'medium'}
                  sport={game.sport as 'nfl' | 'nba'}
                  showName={isDetailed}
                />
                {!isDetailed && (
                  <Box>
                    <Typography variant="subtitle1" fontWeight="medium">
                      {game.homeTeam.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {game.homeTeam.record}
                    </Typography>
                  </Box>
                )}
                {(game.status === 'live' || game.status === 'completed') && (
                  <Typography 
                    variant="h5" 
                    fontWeight="bold" 
                    sx={{ 
                      ml: 'auto',
                      fontFamily: '"JetBrains Mono", monospace',
                      color: (game.status === 'completed' && (game.homeTeam.score || 0) > (game.awayTeam.score || 0)) 
                        ? '#013369'          // NFL Blue for winner
                        : '#F5F7FA',         // Primary text for others
                    }}
                  >
                    {game.homeTeam.score}
                  </Typography>
                )}
              </Box>
            </Box>
          )}
        </Box>

        {/* Footer */}
        {!isCompact && (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            mt: 2,
            pt: 1,
            borderTop: `1px solid ${theme.palette.divider}`,
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TimeIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                {game.status === 'scheduled' 
                  ? formatGameTime(game.startTime)
                  : game.status === 'live'
                  ? getGameStatusDisplay(game)
                  : 'Final'
                }
              </Typography>
            </Box>
            
            {game.venue && (
              <Typography variant="body2" color="text.secondary" noWrap>
                {game.venue}
              </Typography>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};