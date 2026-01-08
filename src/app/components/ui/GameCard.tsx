import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Box,
  Typography,
  Chip,
  Button,
  Avatar,
  LinearProgress,
  Divider,
  IconButton,
  Tooltip,
  useTheme,
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CompleteIcon,
  LocationOn as LocationIcon,
  Tv as TvIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Share as ShareIcon,
  MoreVert as MoreIcon,
} from '@mui/icons-material';
import { formatGameTime, getGameStatus } from '../../utils/data.utils';
import { useLayout } from '../layout/MainLayout';

// ===== TYPES =====

export interface Team {
  id: string;
  name: string;
  shortName: string;
  logo: string;
  city: string;
  conference?: string;
  division?: string;
  colors?: {
    primary: string;
    secondary: string;
  };
}

export interface GameScore {
  home: number;
  away: number;
  quarter?: number;
  timeRemaining?: string;
  possession?: 'home' | 'away';
}

export interface Game {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  startTime: Date;
  status: 'scheduled' | 'live' | 'halftime' | 'finished' | 'postponed' | 'cancelled';
  score?: GameScore;
  week?: number;
  season?: number;
  venue?: {
    name: string;
    city: string;
    state: string;
  };
  weather?: {
    temperature: number;
    condition: string;
    windSpeed?: number;
  };
  broadcast?: {
    network: string;
    streamingUrl?: string;
  };
  isPlayoffs?: boolean;
  isFavorite?: boolean;
}

export interface GameCardProps {
  game: Game;
  variant?: 'default' | 'compact' | 'detailed' | 'live';
  onFavorite?: (gameId: string, isFavorite: boolean) => void;
  onShare?: (game: Game) => void;
  onClick?: (game: Game) => void;
  showBroadcast?: boolean;
  showWeather?: boolean;
  showVenue?: boolean;
  elevation?: number;
}

// ===== GAME STATUS UTILS =====

const getStatusColor = (status: Game['status']) => {
  switch (status) {
    case 'live':
    case 'halftime':
      return 'error';
    case 'finished':
      return 'success';
    case 'scheduled':
      return 'primary';
    case 'postponed':
    case 'cancelled':
      return 'warning';
    default:
      return 'default';
  }
};

const getStatusLabel = (status: Game['status']) => {
  switch (status) {
    case 'live':
      return 'LIVE';
    case 'halftime':
      return 'HALFTIME';
    case 'finished':
      return 'FINAL';
    case 'scheduled':
      return 'UPCOMING';
    case 'postponed':
      return 'POSTPONED';
    case 'cancelled':
      return 'CANCELLED';
    default:
      return status.toUpperCase();
  }
};

const getStatusIcon = (status: Game['status']) => {
  switch (status) {
    case 'live':
      return <PlayIcon />;
    case 'halftime':
      return <PauseIcon />;
    case 'finished':
      return <CompleteIcon />;
    case 'scheduled':
      return <ScheduleIcon />;
    default:
      return <ScheduleIcon />;
  }
};

// ===== TEAM DISPLAY COMPONENT =====

interface TeamDisplayProps {
  team: Team;
  score?: number;
  isHome?: boolean;
  variant?: 'default' | 'compact';
  showRecord?: boolean;
}

const TeamDisplay: React.FC<TeamDisplayProps> = ({
  team,
  score,
  isHome = false,
  variant = 'default',
  showRecord = false,
}) => {
  const { compactMode } = useLayout();
  const isCompact = variant === 'compact' || compactMode;

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: isCompact ? 1 : 2,
        flexDirection: isCompact ? 'row' : 'row',
      }}
    >
      <Avatar
        src={team.logo}
        alt={`${team.name} logo`}
        sx={{
          width: isCompact ? 32 : 48,
          height: isCompact ? 32 : 48,
          bgcolor: team.colors?.primary || 'grey.300',
        }}
      >
        {team.shortName.substring(0, 2)}
      </Avatar>
      
      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
        <Typography
          variant={isCompact ? 'body2' : 'subtitle1'}
          fontWeight="medium"
          noWrap
        >
          {isCompact ? team.shortName : team.name}
        </Typography>
        {!isCompact && (
          <Typography variant="caption" color="text.secondary" noWrap>
            {team.city}
          </Typography>
        )}
      </Box>

      {score !== undefined && (
        <Typography
          variant={isCompact ? 'h6' : 'h5'}
          fontWeight="bold"
          color="text.primary"
          sx={{ minWidth: 'auto' }}
        >
          {score}
        </Typography>
      )}
    </Box>
  );
};

// ===== GAME PROGRESS COMPONENT =====

interface GameProgressProps {
  game: Game;
  variant?: 'default' | 'compact';
}

const GameProgress: React.FC<GameProgressProps> = ({ game, variant = 'default' }) => {
  const { compactMode } = useLayout();
  const isCompact = variant === 'compact' || compactMode;

  if (game.status === 'scheduled' || game.status === 'postponed' || game.status === 'cancelled') {
    return null;
  }

  const getProgressValue = () => {
    if (!game.score?.quarter) return 0;
    if (game.status === 'finished') return 100;
    
    // Estimate progress based on quarter (NFL has 4 quarters)
    const baseProgress = (game.score.quarter - 1) * 25;
    
    // Add time-based progress within current quarter if available
    if (game.score.timeRemaining) {
      const [minutes, seconds] = game.score.timeRemaining.split(':').map(Number);
      const totalSeconds = minutes * 60 + seconds;
      const maxSeconds = 15 * 60; // 15 minutes per quarter
      const quarterProgress = ((maxSeconds - totalSeconds) / maxSeconds) * 25;
      return baseProgress + quarterProgress;
    }
    
    return baseProgress;
  };

  const progressValue = getProgressValue();

  return (
    <Box sx={{ mt: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
        <Typography variant="caption" color="text.secondary">
          {game.score?.quarter ? `Q${game.score.quarter}` : 'Game'}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {game.score?.timeRemaining || ''}
        </Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={progressValue}
        color={game.status === 'live' ? 'error' : 'primary'}
        sx={{
          height: isCompact ? 3 : 4,
          borderRadius: 2,
        }}
      />
    </Box>
  );
};

// ===== MAIN GAME CARD COMPONENT =====

export const GameCard: React.FC<GameCardProps> = ({
  game,
  variant = 'default',
  onFavorite,
  onShare,
  onClick,
  showBroadcast = true,
  showWeather = false,
  showVenue = false,
  elevation = 1,
}) => {
  const theme = useTheme();
  const { compactMode } = useLayout();
  const isCompact = variant === 'compact' || compactMode;
  const isLive = game.status === 'live' || game.status === 'halftime';

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFavorite?.(game.id, !game.isFavorite);
  };

  const handleShareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onShare?.(game);
  };

  const handleCardClick = () => {
    onClick?.(game);
  };

  return (
    <Card
      elevation={elevation}
      onClick={handleCardClick}
      sx={{
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.2s ease-in-out',
        border: isLive ? `2px solid ${theme.palette.error.main}` : 'none',
        '&:hover': onClick ? {
          elevation: elevation + 2,
          transform: 'translateY(-2px)',
        } : {},
        position: 'relative',
        overflow: 'visible',
      }}
    >
      {/* Live indicator */}
      {isLive && (
        <Box
          sx={{
            position: 'absolute',
            top: -1,
            right: 8,
            bgcolor: 'error.main',
            color: 'white',
            px: 1,
            py: 0.5,
            borderRadius: '0 0 8px 8px',
            zIndex: 1,
          }}
        >
          <Typography variant="caption" fontWeight="bold">
            LIVE
          </Typography>
        </Box>
      )}

      <CardContent sx={{ pb: variant === 'compact' ? 1 : 2 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Chip
              icon={getStatusIcon(game.status)}
              label={getStatusLabel(game.status)}
              color={getStatusColor(game.status)}
              size={isCompact ? 'small' : 'medium'}
              variant={isLive ? 'filled' : 'outlined'}
            />
            {game.week && (
              <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                Week {game.week}
              </Typography>
            )}
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {onFavorite && (
              <Tooltip title={game.isFavorite ? 'Remove from favorites' : 'Add to favorites'}>
                <IconButton size="small" onClick={handleFavoriteClick}>
                  {game.isFavorite ? <StarIcon color="primary" /> : <StarBorderIcon />}
                </IconButton>
              </Tooltip>
            )}
            {onShare && (
              <Tooltip title="Share game">
                <IconButton size="small" onClick={handleShareClick}>
                  <ShareIcon />
                </IconButton>
              </Tooltip>
            )}
            <IconButton size="small">
              <MoreIcon />
            </IconButton>
          </Box>
        </Box>

        {/* Teams and Scores */}
        <Box sx={{ mb: 2 }}>
          {/* Away Team */}
          <Box sx={{ mb: 1.5 }}>
            <TeamDisplay
              team={game.awayTeam}
              score={game.score?.away}
              variant={variant}
            />
          </Box>

          {/* Home Team */}
          <Box sx={{ mb: 1 }}>
            <TeamDisplay
              team={game.homeTeam}
              score={game.score?.home}
              isHome
              variant={variant}
            />
          </Box>
        </Box>

        {/* Game Progress */}
        <GameProgress game={game} variant={variant} />

        {/* Game Details */}
        {variant !== 'compact' && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              {formatGameTime(game.startTime)}
            </Typography>
            
            {showVenue && game.venue && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                <LocationIcon fontSize="small" color="action" />
                <Typography variant="caption" color="text.secondary">
                  {game.venue.name}, {game.venue.city}
                </Typography>
              </Box>
            )}

            {showBroadcast && game.broadcast && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                <TvIcon fontSize="small" color="action" />
                <Typography variant="caption" color="text.secondary">
                  {game.broadcast.network}
                </Typography>
              </Box>
            )}

            {showWeather && game.weather && (
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                {game.weather.temperature}°F, {game.weather.condition}
              </Typography>
            )}
          </Box>
        )}
      </CardContent>

      {/* Actions for detailed variant */}
      {variant === 'detailed' && (
        <CardActions sx={{ pt: 0, px: 2, pb: 2 }}>
          <Button size="small" startIcon={<PlayIcon />}>
            Watch Highlights
          </Button>
          <Button size="small">
            Game Stats
          </Button>
        </CardActions>
      )}
    </Card>
  );
};

// ===== GAME LIST COMPONENT =====

export interface GameListProps {
  games: Game[];
  variant?: 'default' | 'compact' | 'detailed';
  groupBy?: 'date' | 'week' | 'status' | 'none';
  onGameClick?: (game: Game) => void;
  onFavorite?: (gameId: string, isFavorite: boolean) => void;
  emptyMessage?: string;
}

export const GameList: React.FC<GameListProps> = ({
  games,
  variant = 'default',
  groupBy = 'none',
  onGameClick,
  onFavorite,
  emptyMessage = 'No games available',
}) => {
  const { compactMode } = useLayout();

  // Group games based on groupBy prop
  const groupedGames = React.useMemo(() => {
    if (groupBy === 'none') {
      return { 'All Games': games };
    }

    return games.reduce((groups, game) => {
      let key: string;

      switch (groupBy) {
        case 'date':
          key = game.startTime.toDateString();
          break;
        case 'week':
          key = `Week ${game.week || 'TBD'}`;
          break;
        case 'status':
          key = getStatusLabel(game.status);
          break;
        default:
          key = 'All Games';
      }

      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(game);
      return groups;
    }, {} as Record<string, Game[]>);
  }, [games, groupBy]);

  if (games.length === 0) {
    return (
      <Box
        sx={{
          textAlign: 'center',
          py: 4,
          color: 'text.secondary',
        }}
      >
        <Typography variant="h6">{emptyMessage}</Typography>
      </Box>
    );
  }

  return (
    <Box>
      {Object.entries(groupedGames).map(([groupName, groupGames]) => (
        <Box key={groupName} sx={{ mb: groupBy !== 'none' ? 4 : 0 }}>
          {groupBy !== 'none' && (
            <Typography
              variant="h6"
              color="text.primary"
              sx={{ mb: 2, fontWeight: 'medium' }}
            >
              {groupName}
            </Typography>
          )}
          
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: variant === 'compact' || compactMode ? 'repeat(2, 1fr)' : '1fr',
                md: variant === 'compact' || compactMode ? 'repeat(3, 1fr)' : 'repeat(2, 1fr)',
                lg: variant === 'compact' || compactMode ? 'repeat(4, 1fr)' : 'repeat(3, 1fr)',
              },
              gap: 2,
            }}
          >
            {groupGames.map((game) => (
              <GameCard
                key={game.id}
                game={game}
                variant={variant}
                onClick={onGameClick}
                onFavorite={onFavorite}
                showBroadcast={variant !== 'compact'}
                showVenue={variant === 'detailed'}
                showWeather={variant === 'detailed'}
              />
            ))}
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default GameCard;