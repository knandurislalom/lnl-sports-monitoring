import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Chip,
  Avatar,
  Grid,
  IconButton,
  Button,
  Switch,
  FormControlLabel,
  Badge,
  Tooltip,
  Fade,
  Zoom,
  useTheme,
} from '@mui/material';
import {
  PlayArrow as LiveIcon,
  Pause as PauseIcon,
  Refresh as RefreshIcon,
  Fullscreen as FullscreenIcon,
  ChevronLeft as PrevIcon,
  ChevronRight as NextIcon,
  Sports as SportsIcon,
  Timeline as StatsIcon,
  Visibility as WatchIcon,
  NotificationImportant as AlertIcon,
} from '@mui/icons-material';
import { Game, GameStatus } from '../../shared/types/game.types';
import { useLiveGames, useGameStats, useLiveScoreTicker } from '../../hooks/useLiveGames';
import { formatDistanceToNow } from '../../utils/dateUtils';

// ===== LIVE GAME CARD COMPONENT =====

interface LiveGameCardProps {
  game: Game;
  variant?: 'default' | 'compact' | 'detailed' | 'ticker';
  showStats?: boolean;
  showProgress?: boolean;
  onClick?: (game: Game) => void;
  onWatch?: (gameId: string, isWatching: boolean) => void;
  isWatching?: boolean;
}

export const LiveGameCard: React.FC<LiveGameCardProps> = ({
  game,
  variant = 'default',
  showStats = true,
  showProgress = true,
  onClick,
  onWatch,
  isWatching = false,
}) => {
  const theme = useTheme();
  const { progress, statusText, scoreLeader, timeSinceLastUpdate } = useGameStats({ 
    gameId: game.id, 
    autoRefresh: false 
  });

  const isLive = game.status === GameStatus.LIVE;
  const isFinal = game.status === GameStatus.FINAL;

  const handleCardClick = () => {
    if (onClick) {
      onClick(game);
    }
  };

  const handleWatchToggle = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (onWatch) {
      onWatch(game.id, !isWatching);
    }
  };

  const getScoreColor = (team: 'home' | 'away') => {
    if (!isFinal && scoreLeader === 'tie') return 'text.primary';
    return scoreLeader === team ? theme.palette.primary.main : 'text.secondary';
  };

  if (variant === 'ticker') {
    return (
      <Card 
        sx={{ 
          minWidth: 300, 
          cursor: onClick ? 'pointer' : 'default',
          transition: 'all 0.3s ease',
          '&:hover': onClick ? { transform: 'scale(1.02)' } : {},
        }}
        onClick={handleCardClick}
      >
        <CardContent sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Chip 
              label={statusText} 
              color={isLive ? 'error' : 'default'}
              size="small"
              icon={isLive ? <LiveIcon /> : undefined}
            />
            {onWatch && (
              <IconButton size="small" onClick={handleWatchToggle} color={isWatching ? 'primary' : 'default'}>
                <WatchIcon fontSize="small" />
              </IconButton>
            )}
          </Box>
          
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={5}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Avatar src={game.awayTeam.logo} sx={{ width: 24, height: 24 }} />
                <Box>
                  <Typography variant="body2" fontWeight="medium">{game.awayTeam.shortName}</Typography>
                </Box>
              </Box>
            </Grid>
            
            <Grid item xs={2} sx={{ textAlign: 'center' }}>
              <Typography variant="h6" sx={{ color: getScoreColor('away') }}>
                {game.awayScore}
              </Typography>
              <Typography variant="body2" color="text.secondary">-</Typography>
              <Typography variant="h6" sx={{ color: getScoreColor('home') }}>
                {game.homeScore}
              </Typography>
            </Grid>
            
            <Grid item xs={5}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'flex-end' }}>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="body2" fontWeight="medium">{game.homeTeam.shortName}</Typography>
                </Box>
                <Avatar src={game.homeTeam.logo} sx={{ width: 24, height: 24 }} />
              </Box>
            </Grid>
          </Grid>

          {isLive && showProgress && (
            <Box sx={{ mt: 1 }}>
              <LinearProgress 
                variant="determinate" 
                value={progress} 
                sx={{ height: 4, borderRadius: 2 }}
                color="primary"
              />
            </Box>
          )}
        </CardContent>
      </Card>
    );
  }

  if (variant === 'compact') {
    return (
      <Card 
        sx={{ 
          cursor: onClick ? 'pointer' : 'default',
          transition: 'all 0.3s ease',
          '&:hover': onClick ? { boxShadow: 6 } : {},
        }}
        onClick={handleCardClick}
      >
        <CardContent sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Chip 
              label={statusText} 
              color={isLive ? 'error' : 'default'}
              size="small"
              icon={isLive ? <LiveIcon /> : undefined}
            />
            {isLive && timeSinceLastUpdate > 0 && (
              <Typography variant="caption" color="text.secondary">
                {timeSinceLastUpdate}s ago
              </Typography>
            )}
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
              <Avatar src={game.awayTeam.logo} sx={{ width: 32, height: 32 }} />
              <Box>
                <Typography variant="body1" fontWeight="medium">{game.awayTeam.shortName}</Typography>
                <Typography variant="caption" color="text.secondary">{game.awayTeam.name}</Typography>
              </Box>
            </Box>

            <Box sx={{ mx: 2, textAlign: 'center' }}>
              <Typography variant="h5" sx={{ color: getScoreColor('away') }}>
                {game.awayScore}
              </Typography>
              <Typography variant="body2" color="text.secondary">-</Typography>
              <Typography variant="h5" sx={{ color: getScoreColor('home') }}>
                {game.homeScore}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1, justifyContent: 'flex-end' }}>
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="body1" fontWeight="medium">{game.homeTeam.shortName}</Typography>
                <Typography variant="caption" color="text.secondary">{game.homeTeam.name}</Typography>
              </Box>
              <Avatar src={game.homeTeam.logo} sx={{ width: 32, height: 32 }} />
            </Box>
          </Box>

          {isLive && showProgress && (
            <Box sx={{ mt: 2 }}>
              <LinearProgress 
                variant="determinate" 
                value={progress} 
                sx={{ height: 6, borderRadius: 3 }}
                color="primary"
              />
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                Game Progress: {Math.round(progress)}%
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
        position: 'relative',
        overflow: 'visible',
        '&:hover': onClick ? { 
          boxShadow: 8,
          transform: 'translateY(-2px)',
        } : {},
      }}
      onClick={handleCardClick}
    >
      {isLive && (
        <Box
          sx={{
            position: 'absolute',
            top: -8,
            right: -8,
            zIndex: 1,
          }}
        >
          <Badge
            badgeContent={<LiveIcon sx={{ fontSize: 16 }} />}
            color="error"
            sx={{
              '& .MuiBadge-badge': {
                width: 32,
                height: 32,
                borderRadius: '50%',
                animation: 'pulse 2s infinite',
              },
              '@keyframes pulse': {
                '0%': { transform: 'scale(1)' },
                '50%': { transform: 'scale(1.1)' },
                '100%': { transform: 'scale(1)' },
              },
            }}
          />
        </Box>
      )}

      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip 
              label={statusText} 
              color={isLive ? 'error' : isFinal ? 'success' : 'default'}
              icon={isLive ? <LiveIcon /> : undefined}
            />
            {game.venue && (
              <Typography variant="caption" color="text.secondary">
                {game.venue}
              </Typography>
            )}
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {isLive && timeSinceLastUpdate > 0 && (
              <Tooltip title={`Last updated ${timeSinceLastUpdate} seconds ago`}>
                <Typography variant="caption" color="text.secondary">
                  {timeSinceLastUpdate}s
                </Typography>
              </Tooltip>
            )}
            {onWatch && (
              <IconButton size="small" onClick={handleWatchToggle} color={isWatching ? 'primary' : 'default'}>
                <WatchIcon />
              </IconButton>
            )}
          </Box>
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
                  border: scoreLeader === 'away' ? `2px solid ${theme.palette.primary.main}` : 'none'
                }} 
              />
              <Box>
                <Typography variant="h6" fontWeight="bold">{game.awayTeam.shortName}</Typography>
                <Typography variant="body2" color="text.secondary">{game.awayTeam.name}</Typography>
                {game.awayTeam.conference && (
                  <Typography variant="caption" color="text.secondary">
                    {game.awayTeam.conference} {game.awayTeam.division}
                  </Typography>
                )}
              </Box>
            </Box>
          </Grid>

          <Grid item xs={2} sx={{ textAlign: 'center' }}>
            <Typography variant="h3" fontWeight="bold" sx={{ color: getScoreColor('away') }}>
              {game.awayScore}
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ my: 1 }}>-</Typography>
            <Typography variant="h3" fontWeight="bold" sx={{ color: getScoreColor('home') }}>
              {game.homeScore}
            </Typography>
          </Grid>

          <Grid item xs={5}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'flex-end' }}>
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="h6" fontWeight="bold">{game.homeTeam.shortName}</Typography>
                <Typography variant="body2" color="text.secondary">{game.homeTeam.name}</Typography>
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
                  border: scoreLeader === 'home' ? `2px solid ${theme.palette.primary.main}` : 'none'
                }} 
              />
            </Box>
          </Grid>
        </Grid>

        {/* Game Progress */}
        {isLive && showProgress && (
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Game Progress
              </Typography>
              <Typography variant="body2" fontWeight="medium">
                {Math.round(progress)}%
              </Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={progress} 
              sx={{ height: 8, borderRadius: 4 }}
              color="primary"
            />
          </Box>
        )}

        {/* Live Game Details */}
        {isLive && variant === 'detailed' && (
          <Box sx={{ mt: 2, p: 2, backgroundColor: 'grey.50', borderRadius: 2 }}>
            <Grid container spacing={2}>
              {game.possession && (
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Possession</Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {game.possession === 'home' ? game.homeTeam.shortName : game.awayTeam.shortName}
                  </Typography>
                </Grid>
              )}
              
              {game.down && game.distance && (
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Down & Distance</Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {game.down}{['st', 'nd', 'rd', 'th'][game.down - 1] || 'th'} & {game.distance}
                  </Typography>
                </Grid>
              )}

              {game.yardLine && (
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Field Position</Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {game.yardLine} yard line
                    {game.isRedZone && (
                      <Chip 
                        label="Red Zone" 
                        size="small" 
                        color="error" 
                        sx={{ ml: 1, fontSize: '0.75rem' }} 
                      />
                    )}
                  </Typography>
                </Grid>
              )}

              {game.weather && (
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Weather</Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {game.weather.temperature}° {game.weather.condition}
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Box>
        )}

        {/* Drive Statistics */}
        {showStats && game.drives && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Team Statistics
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {game.awayTeam.shortName}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption">Total Yards</Typography>
                  <Typography variant="caption" fontWeight="medium">
                    {game.drives.away.totalYards}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption">Passing</Typography>
                  <Typography variant="caption" fontWeight="medium">
                    {game.drives.away.passingYards}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption">Rushing</Typography>
                  <Typography variant="caption" fontWeight="medium">
                    {game.drives.away.rushingYards}
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {game.homeTeam.shortName}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption">Total Yards</Typography>
                  <Typography variant="caption" fontWeight="medium">
                    {game.drives.home.totalYards}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption">Passing</Typography>
                  <Typography variant="caption" fontWeight="medium">
                    {game.drives.home.passingYards}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption">Rushing</Typography>
                  <Typography variant="caption" fontWeight="medium">
                    {game.drives.home.rushingYards}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default LiveGameCard;