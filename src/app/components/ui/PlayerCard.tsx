import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Box,
  Typography,
  Avatar,
  Chip,
  Button,
  LinearProgress,
  Grid,
  IconButton,
  Tooltip,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Remove as NeutralIcon,
  Height as HeightIcon,
  FitnessCenter as WeightIcon,
  School as CollegeIcon,
  CalendarToday as AgeIcon,
  SportsFootball as PositionIcon,
  Share as ShareIcon,
  MoreVert as MoreIcon,
} from '@mui/icons-material';
import { formatNumber } from '../../utils/format.utils';
import { useLayout } from '../layout/MainLayout';

// ===== TYPES =====

export interface PlayerStats {
  // Universal stats
  gamesPlayed: number;
  gamesStarted: number;
  
  // Passing stats (QB)
  passingYards?: number;
  passingTouchdowns?: number;
  interceptions?: number;
  completions?: number;
  attempts?: number;
  passingRating?: number;
  
  // Rushing stats (RB, QB)
  rushingYards?: number;
  rushingTouchdowns?: number;
  rushingAttempts?: number;
  yardsPerCarry?: number;
  
  // Receiving stats (WR, TE, RB)
  receptions?: number;
  receivingYards?: number;
  receivingTouchdowns?: number;
  targets?: number;
  yardsPerReception?: number;
  
  // Defensive stats
  tackles?: number;
  assistedTackles?: number;
  sacks?: number;
  interceptionsCaught?: number;
  passesDefended?: number;
  forcedFumbles?: number;
  fumbleRecoveries?: number;
  
  // Kicking stats
  fieldGoalsMade?: number;
  fieldGoalsAttempted?: number;
  extraPointsMade?: number;
  extraPointsAttempted?: number;
  longestFieldGoal?: number;
}

export interface PlayerInfo {
  height: string;
  weight: number;
  age: number;
  experience: number;
  college: string;
  birthPlace?: string;
  drafted?: {
    year: number;
    round: number;
    pick: number;
    team: string;
  };
}

export interface Player {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  number: number;
  position: string;
  team: {
    id: string;
    name: string;
    shortName: string;
    logo: string;
    colors: {
      primary: string;
      secondary: string;
    };
  };
  photo?: string;
  info: PlayerInfo;
  stats?: PlayerStats;
  seasonStats?: PlayerStats;
  careerStats?: PlayerStats;
  isInjured?: boolean;
  injuryStatus?: string;
  isFavorite?: boolean;
  isWatching?: boolean;
  fantasyRank?: number;
  salary?: number;
}

export interface PlayerCardProps {
  player: Player;
  variant?: 'default' | 'compact' | 'detailed' | 'minimal' | 'fantasy';
  showStats?: boolean;
  showTeam?: boolean;
  showFantasy?: boolean;
  onFavorite?: (playerId: string, isFavorite: boolean) => void;
  onWatch?: (playerId: string, isWatching: boolean) => void;
  onShare?: (player: Player) => void;
  onClick?: (player: Player) => void;
  elevation?: number;
}

// ===== PLAYER POSITION UTILS =====

const getPositionColor = (position: string): 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success' => {
  const pos = position.toUpperCase();
  if (['QB'].includes(pos)) return 'error';
  if (['RB', 'FB'].includes(pos)) return 'success';
  if (['WR', 'TE'].includes(pos)) return 'primary';
  if (['OL', 'OT', 'OG', 'C'].includes(pos)) return 'warning';
  if (['DL', 'DE', 'DT', 'NT'].includes(pos)) return 'info';
  if (['LB', 'MLB', 'OLB'].includes(pos)) return 'secondary';
  if (['DB', 'CB', 'S', 'FS', 'SS'].includes(pos)) return 'primary';
  if (['K', 'P', 'LS'].includes(pos)) return 'warning';
  return 'primary';
};

const getPositionGroup = (position: string): string => {
  const pos = position.toUpperCase();
  if (['QB'].includes(pos)) return 'Quarterback';
  if (['RB', 'FB'].includes(pos)) return 'Running Back';
  if (['WR', 'TE'].includes(pos)) return 'Receiver';
  if (['OL', 'OT', 'OG', 'C'].includes(pos)) return 'Offensive Line';
  if (['DL', 'DE', 'DT', 'NT'].includes(pos)) return 'Defensive Line';
  if (['LB', 'MLB', 'OLB'].includes(pos)) return 'Linebacker';
  if (['DB', 'CB', 'S', 'FS', 'SS'].includes(pos)) return 'Defensive Back';
  if (['K', 'P', 'LS'].includes(pos)) return 'Special Teams';
  return 'Player';
};

// ===== PLAYER STATS PREVIEW COMPONENT =====

interface PlayerStatsPreviewProps {
  player: Player;
  variant?: 'default' | 'compact';
  statsPeriod?: 'season' | 'career';
}

const PlayerStatsPreview: React.FC<PlayerStatsPreviewProps> = ({
  player,
  variant = 'default',
  statsPeriod = 'season',
}) => {
  const { compactMode } = useLayout();
  const isCompact = variant === 'compact' || compactMode;
  const stats = statsPeriod === 'career' ? player.careerStats : player.seasonStats || player.stats;

  if (!stats) return null;

  const renderStatsByPosition = () => {
    const position = player.position.toUpperCase();

    if (position === 'QB') {
      return (
        <Grid container spacing={1}>
          <Grid item xs={4}>
            <Typography variant="caption" color="text.secondary">Yards</Typography>
            <Typography variant={isCompact ? 'body2' : 'body1'} fontWeight="medium">
              {formatNumber(stats.passingYards || 0)}
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="caption" color="text.secondary">TDs</Typography>
            <Typography variant={isCompact ? 'body2' : 'body1'} fontWeight="medium">
              {stats.passingTouchdowns || 0}
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="caption" color="text.secondary">Rating</Typography>
            <Typography variant={isCompact ? 'body2' : 'body1'} fontWeight="medium">
              {stats.passingRating?.toFixed(1) || 'N/A'}
            </Typography>
          </Grid>
        </Grid>
      );
    }

    if (['RB', 'FB'].includes(position)) {
      return (
        <Grid container spacing={1}>
          <Grid item xs={4}>
            <Typography variant="caption" color="text.secondary">Yards</Typography>
            <Typography variant={isCompact ? 'body2' : 'body1'} fontWeight="medium">
              {formatNumber(stats.rushingYards || 0)}
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="caption" color="text.secondary">TDs</Typography>
            <Typography variant={isCompact ? 'body2' : 'body1'} fontWeight="medium">
              {stats.rushingTouchdowns || 0}
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="caption" color="text.secondary">YPC</Typography>
            <Typography variant={isCompact ? 'body2' : 'body1'} fontWeight="medium">
              {stats.yardsPerCarry?.toFixed(1) || 'N/A'}
            </Typography>
          </Grid>
        </Grid>
      );
    }

    if (['WR', 'TE'].includes(position)) {
      return (
        <Grid container spacing={1}>
          <Grid item xs={4}>
            <Typography variant="caption" color="text.secondary">Rec</Typography>
            <Typography variant={isCompact ? 'body2' : 'body1'} fontWeight="medium">
              {stats.receptions || 0}
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="caption" color="text.secondary">Yards</Typography>
            <Typography variant={isCompact ? 'body2' : 'body1'} fontWeight="medium">
              {formatNumber(stats.receivingYards || 0)}
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="caption" color="text.secondary">TDs</Typography>
            <Typography variant={isCompact ? 'body2' : 'body1'} fontWeight="medium">
              {stats.receivingTouchdowns || 0}
            </Typography>
          </Grid>
        </Grid>
      );
    }

    if (['LB', 'MLB', 'OLB', 'CB', 'S', 'FS', 'SS', 'DE', 'DT', 'NT'].includes(position)) {
      return (
        <Grid container spacing={1}>
          <Grid item xs={4}>
            <Typography variant="caption" color="text.secondary">Tackles</Typography>
            <Typography variant={isCompact ? 'body2' : 'body1'} fontWeight="medium">
              {stats.tackles || 0}
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="caption" color="text.secondary">Sacks</Typography>
            <Typography variant={isCompact ? 'body2' : 'body1'} fontWeight="medium">
              {stats.sacks?.toFixed(1) || '0.0'}
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="caption" color="text.secondary">INT</Typography>
            <Typography variant={isCompact ? 'body2' : 'body1'} fontWeight="medium">
              {stats.interceptionsCaught || 0}
            </Typography>
          </Grid>
        </Grid>
      );
    }

    if (['K'].includes(position)) {
      const fgPercentage = stats.fieldGoalsAttempted ? 
        (stats.fieldGoalsMade! / stats.fieldGoalsAttempted * 100) : 0;
      
      return (
        <Grid container spacing={1}>
          <Grid item xs={4}>
            <Typography variant="caption" color="text.secondary">FG%</Typography>
            <Typography variant={isCompact ? 'body2' : 'body1'} fontWeight="medium">
              {fgPercentage.toFixed(1)}%
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="caption" color="text.secondary">Long</Typography>
            <Typography variant={isCompact ? 'body2' : 'body1'} fontWeight="medium">
              {stats.longestFieldGoal || 0}
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="caption" color="text.secondary">XP</Typography>
            <Typography variant={isCompact ? 'body2' : 'body1'} fontWeight="medium">
              {stats.extraPointsMade || 0}
            </Typography>
          </Grid>
        </Grid>
      );
    }

    // Default for other positions
    return (
      <Grid container spacing={1}>
        <Grid item xs={6}>
          <Typography variant="caption" color="text.secondary">Games</Typography>
          <Typography variant={isCompact ? 'body2' : 'body1'} fontWeight="medium">
            {stats.gamesPlayed || 0}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="caption" color="text.secondary">Starts</Typography>
          <Typography variant={isCompact ? 'body2' : 'body1'} fontWeight="medium">
            {stats.gamesStarted || 0}
          </Typography>
        </Grid>
      </Grid>
    );
  };

  return (
    <Box>
      {renderStatsByPosition()}
    </Box>
  );
};

// ===== MAIN PLAYER CARD COMPONENT =====

export const PlayerCard: React.FC<PlayerCardProps> = ({
  player,
  variant = 'default',
  showStats = true,
  showTeam = true,
  showFantasy = false,
  onFavorite,
  onWatch,
  onShare,
  onClick,
  elevation = 1,
}) => {
  const theme = useTheme();
  const { compactMode } = useLayout();
  const isCompact = variant === 'compact' || variant === 'minimal' || compactMode;

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFavorite?.(player.id, !player.isFavorite);
  };

  const handleWatchClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onWatch?.(player.id, !player.isWatching);
  };

  const handleShareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onShare?.(player);
  };

  const handleCardClick = () => {
    onClick?.(player);
  };

  if (variant === 'minimal') {
    return (
      <Box
        onClick={handleCardClick}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          p: 1,
          borderRadius: 1,
          cursor: onClick ? 'pointer' : 'default',
          '&:hover': onClick ? {
            bgcolor: alpha(theme.palette.primary.main, 0.04),
          } : {},
        }}
      >
        <Avatar
          src={player.photo}
          alt={`${player.name} photo`}
          sx={{
            width: 32,
            height: 32,
            bgcolor: player.team.colors.primary,
            fontSize: '0.75rem',
          }}
        >
          {player.number}
        </Avatar>
        
        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          <Typography variant="body2" fontWeight="medium" noWrap>
            {player.name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {player.position} • {player.team.shortName}
          </Typography>
        </Box>

        {player.isFavorite && (
          <StarIcon color="primary" fontSize="small" />
        )}
      </Box>
    );
  }

  return (
    <Card
      elevation={elevation}
      onClick={handleCardClick}
      sx={{
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.2s ease-in-out',
        '&:hover': onClick ? {
          elevation: elevation + 2,
          transform: 'translateY(-2px)',
        } : {},
        background: showTeam ? 
          `linear-gradient(135deg, ${alpha(player.team.colors.primary, 0.03)} 0%, ${alpha(player.team.colors.secondary, 0.03)} 100%)` : 
          'inherit',
        border: showTeam ? `1px solid ${alpha(player.team.colors.primary, 0.1)}` : 'inherit',
      }}
    >
      <CardContent sx={{ pb: variant === 'compact' ? 1 : 2 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexGrow: 1, minWidth: 0 }}>
            <Avatar
              src={player.photo}
              alt={`${player.name} photo`}
              sx={{
                width: isCompact ? 48 : 64,
                height: isCompact ? 48 : 64,
                bgcolor: player.team.colors.primary,
                border: showTeam ? `2px solid ${alpha(player.team.colors.primary, 0.2)}` : 'none',
                fontSize: isCompact ? '0.875rem' : '1rem',
                fontWeight: 'bold',
              }}
            >
              {player.number}
            </Avatar>
            
            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
              <Typography
                variant={isCompact ? 'h6' : 'h5'}
                fontWeight="bold"
                color="text.primary"
                noWrap
              >
                {player.name}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <Chip
                  label={player.position}
                  size={isCompact ? 'small' : 'medium'}
                  color={getPositionColor(player.position)}
                  variant="outlined"
                />
                {showTeam && (
                  <Typography variant="caption" color="text.secondary">
                    {player.team.shortName}
                  </Typography>
                )}
              </Box>
              
              <Typography
                variant="caption"
                color="text.secondary"
              >
                {getPositionGroup(player.position)} • #{player.number}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {onFavorite && (
              <Tooltip title={player.isFavorite ? 'Remove from favorites' : 'Add to favorites'}>
                <IconButton size="small" onClick={handleFavoriteClick}>
                  {player.isFavorite ? <StarIcon color="primary" /> : <StarBorderIcon />}
                </IconButton>
              </Tooltip>
            )}
            {onShare && (
              <Tooltip title="Share player">
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

        {/* Player Info */}
        {variant !== 'compact' && (
          <Box sx={{ mb: 2 }}>
            <Grid container spacing={1}>
              <Grid item xs={3}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <AgeIcon fontSize="small" color="action" />
                  <Typography variant="caption" color="text.secondary">
                    {player.info.age}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={3}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <HeightIcon fontSize="small" color="action" />
                  <Typography variant="caption" color="text.secondary">
                    {player.info.height}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={3}>
                <Box sx={ { display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <WeightIcon fontSize="small" color="action" />
                  <Typography variant="caption" color="text.secondary">
                    {player.info.weight}lb
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={3}>
                <Typography variant="caption" color="text.secondary">
                  Exp: {player.info.experience}
                </Typography>
              </Grid>
            </Grid>
            
            {variant === 'detailed' && (
              <Box sx={{ mt: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                  <CollegeIcon fontSize="small" color="action" />
                  <Typography variant="caption" color="text.secondary">
                    {player.info.college}
                  </Typography>
                </Box>
                {player.info.drafted && (
                  <Typography variant="caption" color="text.secondary">
                    Draft: {player.info.drafted.year} Rd {player.info.drafted.round}, Pick {player.info.drafted.pick}
                  </Typography>
                )}
              </Box>
            )}
          </Box>
        )}

        {/* Player Stats */}
        {showStats && player.stats && variant !== 'compact' && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="caption" color="text.secondary" gutterBottom display="block">
              Season Stats
            </Typography>
            <PlayerStatsPreview player={player} variant={variant} />
          </Box>
        )}

        {/* Fantasy Info */}
        {showFantasy && variant === 'fantasy' && (
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={1}>
              {player.fantasyRank && (
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">
                    Fantasy Rank
                  </Typography>
                  <Typography variant="body2" fontWeight="medium">
                    #{player.fantasyRank}
                  </Typography>
                </Grid>
              )}
              {player.salary && (
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">
                    Salary
                  </Typography>
                  <Typography variant="body2" fontWeight="medium">
                    ${formatNumber(player.salary)}
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Box>
        )}

        {/* Injury Status */}
        {player.isInjured && (
          <Box sx={{ mt: 2 }}>
            <Chip
              label={player.injuryStatus || 'Injured'}
              color="error"
              size="small"
              variant="outlined"
            />
          </Box>
        )}

        {/* Watch Status */}
        {player.isWatching && (
          <Box sx={{ mt: 1 }}>
            <Chip
              label="Watching"
              color="primary"
              size="small"
              variant="outlined"
            />
          </Box>
        )}
      </CardContent>

      {/* Actions for detailed variant */}
      {variant === 'detailed' && (
        <CardActions sx={{ pt: 0, px: 2, pb: 2 }}>
          <Button size="small" startIcon={<PositionIcon />}>
            View Stats
          </Button>
          <Button size="small">
            Game Log
          </Button>
          {onWatch && (
            <Button
              size="small"
              variant={player.isWatching ? 'contained' : 'outlined'}
              onClick={handleWatchClick}
            >
              {player.isWatching ? 'Watching' : 'Watch'}
            </Button>
          )}
        </CardActions>
      )}
    </Card>
  );
};

// ===== PLAYER LIST COMPONENT =====

export interface PlayerListProps {
  players: Player[];
  variant?: 'default' | 'compact' | 'detailed' | 'minimal' | 'fantasy';
  groupBy?: 'position' | 'team' | 'none';
  sortBy?: 'name' | 'position' | 'team' | 'fantasy' | 'stats';
  filterBy?: {
    position?: string[];
    team?: string[];
    injured?: boolean;
  };
  onPlayerClick?: (player: Player) => void;
  onFavorite?: (playerId: string, isFavorite: boolean) => void;
  onWatch?: (playerId: string, isWatching: boolean) => void;
  emptyMessage?: string;
  showStats?: boolean;
  showTeam?: boolean;
  showFantasy?: boolean;
}

export const PlayerList: React.FC<PlayerListProps> = ({
  players,
  variant = 'default',
  groupBy = 'none',
  sortBy = 'name',
  filterBy,
  onPlayerClick,
  onFavorite,
  onWatch,
  emptyMessage = 'No players available',
  showStats = true,
  showTeam = true,
  showFantasy = false,
}) => {
  const { compactMode } = useLayout();

  // Filter players
  const filteredPlayers = React.useMemo(() => {
    let filtered = [...players];

    if (filterBy?.position && filterBy.position.length > 0) {
      filtered = filtered.filter(player => 
        filterBy.position!.includes(player.position)
      );
    }

    if (filterBy?.team && filterBy.team.length > 0) {
      filtered = filtered.filter(player => 
        filterBy.team!.includes(player.team.id)
      );
    }

    if (filterBy?.injured !== undefined) {
      filtered = filtered.filter(player => 
        filterBy.injured ? player.isInjured : !player.isInjured
      );
    }

    return filtered;
  }, [players, filterBy]);

  // Sort players
  const sortedPlayers = React.useMemo(() => {
    return [...filteredPlayers].sort((a, b) => {
      switch (sortBy) {
        case 'position':
          return a.position.localeCompare(b.position);
        case 'team':
          return a.team.name.localeCompare(b.team.name);
        case 'fantasy':
          return (a.fantasyRank || 999) - (b.fantasyRank || 999);
        case 'stats':
          // Sort by primary stat based on position
          const getStatValue = (player: Player) => {
            const stats = player.stats || player.seasonStats;
            if (!stats) return 0;
            
            const pos = player.position.toUpperCase();
            if (pos === 'QB') return stats.passingYards || 0;
            if (['RB', 'FB'].includes(pos)) return stats.rushingYards || 0;
            if (['WR', 'TE'].includes(pos)) return stats.receivingYards || 0;
            return stats.tackles || 0;
          };
          return getStatValue(b) - getStatValue(a);
        default:
          return a.name.localeCompare(b.name);
      }
    });
  }, [filteredPlayers, sortBy]);

  // Group players
  const groupedPlayers = React.useMemo(() => {
    if (groupBy === 'none') {
      return { 'All Players': sortedPlayers };
    }

    return sortedPlayers.reduce((groups, player) => {
      let key: string;

      switch (groupBy) {
        case 'position':
          key = getPositionGroup(player.position);
          break;
        case 'team':
          key = player.team.name;
          break;
        default:
          key = 'All Players';
      }

      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(player);
      return groups;
    }, {} as Record<string, Player[]>);
  }, [sortedPlayers, groupBy]);

  if (filteredPlayers.length === 0) {
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
      {Object.entries(groupedPlayers).map(([groupName, groupPlayers]) => (
        <Box key={groupName} sx={{ mb: groupBy !== 'none' ? 4 : 0 }}>
          {groupBy !== 'none' && (
            <Typography
              variant="h6"
              color="text.primary"
              sx={{ mb: 2, fontWeight: 'medium' }}
            >
              {groupName} ({groupPlayers.length})
            </Typography>
          )}
          
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: variant === 'compact' || variant === 'minimal' || compactMode 
                  ? 'repeat(2, 1fr)' 
                  : '1fr',
                md: variant === 'compact' || variant === 'minimal' || compactMode 
                  ? 'repeat(3, 1fr)' 
                  : 'repeat(2, 1fr)',
                lg: variant === 'compact' || variant === 'minimal' || compactMode 
                  ? 'repeat(4, 1fr)' 
                  : 'repeat(3, 1fr)',
                xl: variant === 'minimal' ? 'repeat(6, 1fr)' : 'repeat(4, 1fr)',
              },
              gap: variant === 'minimal' ? 1 : 2,
            }}
          >
            {groupPlayers.map((player) => (
              <PlayerCard
                key={player.id}
                player={player}
                variant={variant}
                onClick={onPlayerClick}
                onFavorite={onFavorite}
                onWatch={onWatch}
                showStats={showStats && variant !== 'compact'}
                showTeam={showTeam}
                showFantasy={showFantasy}
              />
            ))}
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default PlayerCard;