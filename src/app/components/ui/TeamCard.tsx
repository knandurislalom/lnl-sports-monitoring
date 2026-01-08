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
  LocationOn as LocationIcon,
  Stadium as StadiumIcon,
  Groups as PlayersIcon,
  EmojiEvents as TrophyIcon,
  Share as ShareIcon,
  MoreVert as MoreIcon,
} from '@mui/icons-material';
import { formatNumber, formatPercentage } from '../../utils/format.utils';
import { useLayout } from '../layout/MainLayout';

// ===== TYPES =====

export interface TeamRecord {
  wins: number;
  losses: number;
  ties?: number;
  winPercentage: number;
}

export interface TeamRankings {
  overall: number;
  conference: number;
  division: number;
}

export interface TeamStats {
  pointsFor: number;
  pointsAgainst: number;
  totalYards: number;
  passingYards: number;
  rushingYards: number;
  turnovers: number;
  penalties: number;
  timeOfPossession: string;
}

export interface Team {
  id: string;
  name: string;
  shortName: string;
  city: string;
  logo: string;
  colors: {
    primary: string;
    secondary: string;
  };
  conference: 'AFC' | 'NFC';
  division: 'North' | 'South' | 'East' | 'West';
  record?: TeamRecord;
  rankings?: TeamRankings;
  stats?: TeamStats;
  stadium?: {
    name: string;
    capacity: number;
    surface: string;
  };
  coach?: string;
  established?: number;
  championships?: number;
  playoffAppearances?: number;
  lastPlayoffYear?: number;
  isFavorite?: boolean;
  isFollowing?: boolean;
}

export interface TeamCardProps {
  team: Team;
  variant?: 'default' | 'compact' | 'detailed' | 'minimal';
  showStats?: boolean;
  showRecord?: boolean;
  showRankings?: boolean;
  onFavorite?: (teamId: string, isFavorite: boolean) => void;
  onFollow?: (teamId: string, isFollowing: boolean) => void;
  onShare?: (team: Team) => void;
  onClick?: (team: Team) => void;
  elevation?: number;
}

// ===== TEAM RECORD COMPONENT =====

interface TeamRecordProps {
  record: TeamRecord;
  variant?: 'default' | 'compact';
  showPercentage?: boolean;
}

const TeamRecord: React.FC<TeamRecordProps> = ({
  record,
  variant = 'default',
  showPercentage = true,
}) => {
  const { compactMode } = useLayout();
  const isCompact = variant === 'compact' || compactMode;

  const getRecordColor = (winPercentage: number) => {
    if (winPercentage >= 0.75) return 'success';
    if (winPercentage >= 0.5) return 'warning';
    return 'error';
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Typography
        variant={isCompact ? 'body2' : 'subtitle1'}
        fontWeight="bold"
        color={`${getRecordColor(record.winPercentage)}.main`}
      >
        {record.wins}-{record.losses}{record.ties ? `-${record.ties}` : ''}
      </Typography>
      
      {showPercentage && (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ ml: 0.5 }}
        >
          ({formatPercentage(record.winPercentage)})
        </Typography>
      )}
    </Box>
  );
};

// ===== TEAM RANKINGS COMPONENT =====

interface TeamRankingsProps {
  rankings: TeamRankings;
  variant?: 'default' | 'compact';
}

const TeamRankings: React.FC<TeamRankingsProps> = ({
  rankings,
  variant = 'default',
}) => {
  const { compactMode } = useLayout();
  const isCompact = variant === 'compact' || compactMode;

  const getRankingColor = (rank: number, total: number = 32) => {
    const percentile = rank / total;
    if (percentile <= 0.25) return 'success';
    if (percentile <= 0.5) return 'warning';
    return 'error';
  };

  return (
    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
      <Chip
        label={`#${rankings.overall}`}
        size={isCompact ? 'small' : 'medium'}
        color={getRankingColor(rankings.overall)}
        variant="outlined"
      />
      <Typography variant="caption" color="text.secondary">
        {rankings.conference}° Conf, {rankings.division}° Div
      </Typography>
    </Box>
  );
};

// ===== TEAM STATS PREVIEW COMPONENT =====

interface TeamStatsPreviewProps {
  stats: TeamStats;
  variant?: 'default' | 'compact';
}

const TeamStatsPreview: React.FC<TeamStatsPreviewProps> = ({
  stats,
  variant = 'default',
}) => {
  const { compactMode } = useLayout();
  const isCompact = variant === 'compact' || compactMode;

  const pointsDifferential = stats.pointsFor - stats.pointsAgainst;
  const getDifferentialIcon = () => {
    if (pointsDifferential > 50) return <TrendingUpIcon color="success" fontSize="small" />;
    if (pointsDifferential < -50) return <TrendingDownIcon color="error" fontSize="small" />;
    return <NeutralIcon color="action" fontSize="small" />;
  };

  return (
    <Box>
      <Grid container spacing={1}>
        <Grid item xs={6}>
          <Typography variant="caption" color="text.secondary">
            Points For
          </Typography>
          <Typography variant={isCompact ? 'body2' : 'body1'} fontWeight="medium">
            {formatNumber(stats.pointsFor)}
          </Typography>
        </Grid>
        
        <Grid item xs={6}>
          <Typography variant="caption" color="text.secondary">
            Points Against
          </Typography>
          <Typography variant={isCompact ? 'body2' : 'body1'} fontWeight="medium">
            {formatNumber(stats.pointsAgainst)}
          </Typography>
        </Grid>
        
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
            {getDifferentialIcon()}
            <Typography
              variant="caption"
              color={pointsDifferential > 0 ? 'success.main' : pointsDifferential < 0 ? 'error.main' : 'text.secondary'}
            >
              {pointsDifferential > 0 ? '+' : ''}{pointsDifferential} differential
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

// ===== MAIN TEAM CARD COMPONENT =====

export const TeamCard: React.FC<TeamCardProps> = ({
  team,
  variant = 'default',
  showStats = true,
  showRecord = true,
  showRankings = false,
  onFavorite,
  onFollow,
  onShare,
  onClick,
  elevation = 1,
}) => {
  const theme = useTheme();
  const { compactMode } = useLayout();
  const isCompact = variant === 'compact' || variant === 'minimal' || compactMode;

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFavorite?.(team.id, !team.isFavorite);
  };

  const handleFollowClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFollow?.(team.id, !team.isFollowing);
  };

  const handleShareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onShare?.(team);
  };

  const handleCardClick = () => {
    onClick?.(team);
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
          src={team.logo}
          alt={`${team.name} logo`}
          sx={{
            width: 32,
            height: 32,
            bgcolor: team.colors.primary,
          }}
        >
          {team.shortName.substring(0, 2)}
        </Avatar>
        
        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          <Typography variant="body2" fontWeight="medium" noWrap>
            {team.shortName}
          </Typography>
          {team.record && showRecord && (
            <TeamRecord record={team.record} variant="compact" showPercentage={false} />
          )}
        </Box>

        {team.isFavorite && (
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
        background: `linear-gradient(135deg, ${alpha(team.colors.primary, 0.03)} 0%, ${alpha(team.colors.secondary, 0.03)} 100%)`,
        border: `1px solid ${alpha(team.colors.primary, 0.1)}`,
      }}
    >
      <CardContent sx={{ pb: variant === 'compact' ? 1 : 2 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexGrow: 1, minWidth: 0 }}>
            <Avatar
              src={team.logo}
              alt={`${team.name} logo`}
              sx={{
                width: isCompact ? 48 : 64,
                height: isCompact ? 48 : 64,
                bgcolor: team.colors.primary,
                border: `2px solid ${alpha(team.colors.primary, 0.2)}`,
              }}
            >
              {team.shortName.substring(0, 2)}
            </Avatar>
            
            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
              <Typography
                variant={isCompact ? 'h6' : 'h5'}
                fontWeight="bold"
                color="text.primary"
                noWrap
              >
                {isCompact ? team.shortName : team.name}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                noWrap
              >
                {team.city} • {team.conference} {team.division}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {onFavorite && (
              <Tooltip title={team.isFavorite ? 'Remove from favorites' : 'Add to favorites'}>
                <IconButton size="small" onClick={handleFavoriteClick}>
                  {team.isFavorite ? <StarIcon color="primary" /> : <StarBorderIcon />}
                </IconButton>
              </Tooltip>
            )}
            {onShare && (
              <Tooltip title="Share team">
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

        {/* Team Record */}
        {team.record && showRecord && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="caption" color="text.secondary" gutterBottom display="block">
              Season Record
            </Typography>
            <TeamRecord record={team.record} variant={variant} />
          </Box>
        )}

        {/* Team Rankings */}
        {team.rankings && showRankings && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="caption" color="text.secondary" gutterBottom display="block">
              Rankings
            </Typography>
            <TeamRankings rankings={team.rankings} variant={variant} />
          </Box>
        )}

        {/* Team Stats Preview */}
        {team.stats && showStats && variant !== 'compact' && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="caption" color="text.secondary" gutterBottom display="block">
              Key Stats
            </Typography>
            <TeamStatsPreview stats={team.stats} variant={variant} />
          </Box>
        )}

        {/* Follow Status */}
        {team.isFollowing && (
          <Box sx={{ mt: 2 }}>
            <Chip
              label="Following"
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
          <Button size="small" startIcon={<PlayersIcon />}>
            View Roster
          </Button>
          <Button size="small" startIcon={<StadiumIcon />}>
            Stadium Info
          </Button>
          {onFollow && (
            <Button
              size="small"
              variant={team.isFollowing ? 'contained' : 'outlined'}
              onClick={handleFollowClick}
            >
              {team.isFollowing ? 'Following' : 'Follow'}
            </Button>
          )}
        </CardActions>
      )}
    </Card>
  );
};

// ===== TEAM LIST COMPONENT =====

export interface TeamListProps {
  teams: Team[];
  variant?: 'default' | 'compact' | 'detailed' | 'minimal';
  groupBy?: 'conference' | 'division' | 'none';
  sortBy?: 'name' | 'record' | 'ranking' | 'conference';
  onTeamClick?: (team: Team) => void;
  onFavorite?: (teamId: string, isFavorite: boolean) => void;
  onFollow?: (teamId: string, isFollowing: boolean) => void;
  emptyMessage?: string;
  showStats?: boolean;
  showRecord?: boolean;
  showRankings?: boolean;
}

export const TeamList: React.FC<TeamListProps> = ({
  teams,
  variant = 'default',
  groupBy = 'none',
  sortBy = 'name',
  onTeamClick,
  onFavorite,
  onFollow,
  emptyMessage = 'No teams available',
  showStats = true,
  showRecord = true,
  showRankings = false,
}) => {
  const { compactMode } = useLayout();

  // Sort teams
  const sortedTeams = React.useMemo(() => {
    return [...teams].sort((a, b) => {
      switch (sortBy) {
        case 'record':
          return (b.record?.winPercentage || 0) - (a.record?.winPercentage || 0);
        case 'ranking':
          return (a.rankings?.overall || 999) - (b.rankings?.overall || 999);
        case 'conference':
          if (a.conference !== b.conference) {
            return a.conference.localeCompare(b.conference);
          }
          return a.division.localeCompare(b.division);
        default:
          return a.name.localeCompare(b.name);
      }
    });
  }, [teams, sortBy]);

  // Group teams
  const groupedTeams = React.useMemo(() => {
    if (groupBy === 'none') {
      return { 'All Teams': sortedTeams };
    }

    return sortedTeams.reduce((groups, team) => {
      let key: string;

      switch (groupBy) {
        case 'conference':
          key = team.conference;
          break;
        case 'division':
          key = `${team.conference} ${team.division}`;
          break;
        default:
          key = 'All Teams';
      }

      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(team);
      return groups;
    }, {} as Record<string, Team[]>);
  }, [sortedTeams, groupBy]);

  if (teams.length === 0) {
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
      {Object.entries(groupedTeams).map(([groupName, groupTeams]) => (
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
            {groupTeams.map((team) => (
              <TeamCard
                key={team.id}
                team={team}
                variant={variant}
                onClick={onTeamClick}
                onFavorite={onFavorite}
                onFollow={onFollow}
                showStats={showStats && variant !== 'compact'}
                showRecord={showRecord}
                showRankings={showRankings}
              />
            ))}
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default TeamCard;