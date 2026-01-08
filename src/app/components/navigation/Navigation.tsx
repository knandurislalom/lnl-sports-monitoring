import React, { useState } from 'react';
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Badge,
  Box,
  Typography,
  Divider,
  Chip,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  LiveTv as LiveTvIcon,
  Schedule as ScheduleIcon,
  History as HistoryIcon,
  Sports as SportsIcon,
  Groups as TeamsIcon,
  Settings as SettingsIcon,
  Help as HelpIcon,
  Notifications as NotificationsIcon,
  Favorite as FavoriteIcon,
  TrendingUp as TrendingIcon,
  ExpandLess,
  ExpandMore,
  Circle as CircleIcon,
  SportsSoccer as SoccerIcon,
  SportsFootball as FootballIcon,
  SportsBasketball as BasketballIcon,
  SportsBaseball as BaseballIcon,
  SportsHockey as HockeyIcon,
} from '@mui/icons-material';
import { useLayout } from './MainLayout';
import { getUserPreferences, getFavoriteTeams } from '../core/utils/storage.utils';

// ===== TYPES =====

export interface NavigationItem {
  id: string;
  label: string;
  icon: React.ElementType;
  path: string;
  badge?: {
    count?: number;
    color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
    variant?: 'dot' | 'standard';
  };
  children?: NavigationItem[];
  divider?: boolean;
  chip?: {
    label: string;
    color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
    variant?: 'filled' | 'outlined';
  };
}

export interface NavigationProps {
  items?: NavigationItem[];
  activePath?: string;
  onItemClick?: (item: NavigationItem) => void;
  compact?: boolean;
  showBadges?: boolean;
}

// ===== DEFAULT NAVIGATION ITEMS =====

const getSportIcon = (sport: string) => {
  const iconMap: Record<string, React.ElementType> = {
    nfl: FootballIcon,
    nba: BasketballIcon,
    mlb: BaseballIcon,
    nhl: HockeyIcon,
    soccer: SoccerIcon,
    mls: SoccerIcon,
  };
  return iconMap[sport.toLowerCase()] || SportsIcon;
};

const getDefaultNavigationItems = (favoriteTeams: string[] = []): NavigationItem[] => [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: DashboardIcon,
    path: '/',
  },
  {
    id: 'live-games',
    label: 'Live Games',
    icon: LiveTvIcon,
    path: '/live',
    badge: {
      count: 8,
      color: 'error',
      variant: 'standard',
    },
  },
  {
    id: 'schedule',
    label: 'Schedule',
    icon: ScheduleIcon,
    path: '/schedule',
    badge: {
      count: 24,
      color: 'primary',
    },
  },
  {
    id: 'recent',
    label: 'Recent Games',
    icon: HistoryIcon,
    path: '/recent',
  },
  {
    id: 'divider-1',
    label: '',
    icon: CircleIcon,
    path: '',
    divider: true,
  },
  {
    id: 'sports',
    label: 'Sports',
    icon: SportsIcon,
    path: '/sports',
    children: [
      {
        id: 'nfl',
        label: 'NFL',
        icon: FootballIcon,
        path: '/sports/nfl',
        chip: {
          label: 'Season',
          color: 'success',
          variant: 'outlined',
        },
      },
      {
        id: 'nba',
        label: 'NBA',
        icon: BasketballIcon,
        path: '/sports/nba',
        badge: {
          count: 12,
          color: 'warning',
        },
      },
      {
        id: 'mlb',
        label: 'MLB',
        icon: BaseballIcon,
        path: '/sports/mlb',
        chip: {
          label: 'Off-Season',
          color: 'secondary',
          variant: 'outlined',
        },
      },
      {
        id: 'nhl',
        label: 'NHL',
        icon: HockeyIcon,
        path: '/sports/nhl',
      },
      {
        id: 'soccer',
        label: 'Soccer',
        icon: SoccerIcon,
        path: '/sports/soccer',
        badge: {
          count: 5,
          color: 'info',
        },
      },
    ],
  },
  {
    id: 'teams',
    label: 'Teams',
    icon: TeamsIcon,
    path: '/teams',
  },
  ...(favoriteTeams.length > 0 ? [{
    id: 'favorites',
    label: 'Favorites',
    icon: FavoriteIcon,
    path: '/favorites',
    badge: {
      count: favoriteTeams.length,
      color: 'secondary' as const,
    },
    children: favoriteTeams.slice(0, 5).map((team, index) => ({
      id: `fav-${team}`,
      label: team,
      icon: getSportIcon('nfl'), // In real app, get from team data
      path: `/teams/${team}`,
    })),
  }] : []),
  {
    id: 'divider-2',
    label: '',
    icon: CircleIcon,
    path: '',
    divider: true,
  },
  {
    id: 'trending',
    label: 'Trending',
    icon: TrendingIcon,
    path: '/trending',
    chip: {
      label: 'Hot',
      color: 'error',
      variant: 'filled',
    },
  },
  {
    id: 'notifications',
    label: 'Notifications',
    icon: NotificationsIcon,
    path: '/notifications',
    badge: {
      count: 3,
      color: 'error',
      variant: 'dot',
    },
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: SettingsIcon,
    path: '/settings',
  },
  {
    id: 'help',
    label: 'Help & Support',
    icon: HelpIcon,
    path: '/help',
  },
];

// ===== NAVIGATION ITEM COMPONENT =====

interface NavigationItemComponentProps {
  item: NavigationItem;
  level: number;
  isActive: boolean;
  compact: boolean;
  showBadges: boolean;
  onItemClick: (item: NavigationItem) => void;
}

const NavigationItemComponent: React.FC<NavigationItemComponentProps> = ({
  item,
  level,
  isActive,
  compact,
  showBadges,
  onItemClick,
}) => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);

  // Handle dividers
  if (item.divider) {
    return <Divider sx={{ my: 1 }} />;
  }

  const hasChildren = item.children && item.children.length > 0;
  const isExpanded = open && hasChildren;

  const handleClick = () => {
    if (hasChildren) {
      setOpen(!open);
    } else {
      onItemClick(item);
    }
  };

  const itemIcon = (
    <ListItemIcon
      sx={{
        minWidth: compact ? 32 : 40,
        color: isActive ? 'primary.main' : 'text.secondary',
        '& .MuiSvgIcon-root': {
          fontSize: compact ? 20 : 24,
        },
      }}
    >
      {showBadges && item.badge ? (
        <Badge
          badgeContent={item.badge.count}
          color={item.badge.color || 'primary'}
          variant={item.badge.variant || 'standard'}
          sx={{
            '& .MuiBadge-badge': {
              fontSize: compact ? '0.625rem' : '0.75rem',
              minWidth: compact ? 16 : 20,
              height: compact ? 16 : 20,
            },
          }}
        >
          <item.icon />
        </Badge>
      ) : (
        <item.icon />
      )}
    </ListItemIcon>
  );

  const itemText = (
    <ListItemText
      primary={
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography
            variant={compact ? 'body2' : 'body1'}
            sx={{
              fontWeight: isActive ? 600 : 400,
              color: isActive ? 'primary.main' : 'text.primary',
            }}
          >
            {item.label}
          </Typography>
          
          {item.chip && (
            <Chip
              label={item.chip.label}
              size="small"
              color={item.chip.color || 'primary'}
              variant={item.chip.variant || 'filled'}
              sx={{
                height: compact ? 16 : 20,
                fontSize: compact ? '0.625rem' : '0.75rem',
                '& .MuiChip-label': {
                  px: compact ? 0.5 : 1,
                },
              }}
            />
          )}
        </Box>
      }
      sx={{
        '& .MuiListItemText-primary': {
          fontSize: compact ? '0.875rem' : '1rem',
        },
      }}
    />
  );

  return (
    <>
      <ListItem
        disablePadding
        sx={{
          pl: level * (compact ? 1 : 2),
        }}
      >
        <ListItemButton
          selected={isActive}
          onClick={handleClick}
          sx={{
            minHeight: compact ? 36 : 48,
            borderRadius: 1,
            mx: 0.5,
            mb: 0.5,
            bgcolor: isActive ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
            '&:hover': {
              bgcolor: isActive
                ? alpha(theme.palette.primary.main, 0.15)
                : alpha(theme.palette.action.hover, 0.8),
            },
            '&.Mui-selected': {
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              '&:hover': {
                bgcolor: alpha(theme.palette.primary.main, 0.15),
              },
            },
          }}
        >
          {itemIcon}
          {itemText}
          
          {hasChildren && (
            <ListItemIcon sx={{ minWidth: 'auto', color: 'text.secondary' }}>
              {isExpanded ? (
                <ExpandLess fontSize={compact ? 'small' : 'medium'} />
              ) : (
                <ExpandMore fontSize={compact ? 'small' : 'medium'} />
              )}
            </ListItemIcon>
          )}
        </ListItemButton>
      </ListItem>

      {/* Render children */}
      {hasChildren && (
        <Collapse in={isExpanded} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {item.children!.map((child) => (
              <NavigationItemComponent
                key={child.id}
                item={child}
                level={level + 1}
                isActive={child.path === item.path} // This would be managed by router in real app
                compact={compact}
                showBadges={showBadges}
                onItemClick={onItemClick}
              />
            ))}
          </List>
        </Collapse>
      )}
    </>
  );
};

// ===== MAIN NAVIGATION COMPONENT =====

export const Navigation: React.FC<NavigationProps> = ({
  items,
  activePath = '/',
  onItemClick,
  compact: propCompact,
  showBadges = true,
}) => {
  const { compactMode } = useLayout();
  const preferences = getUserPreferences();
  const favoriteTeams = getFavoriteTeams();

  // Use prop compact if provided, otherwise use layout context
  const compact = propCompact !== undefined ? propCompact : compactMode;

  // Use provided items or generate default ones
  const navigationItems = items || getDefaultNavigationItems(favoriteTeams);

  const handleItemClick = (item: NavigationItem) => {
    if (onItemClick) {
      onItemClick(item);
    } else {
      // Default behavior - would integrate with router
      console.log('Navigate to:', item.path);
    }
  };

  const isItemActive = (item: NavigationItem): boolean => {
    if (item.path === activePath) return true;
    if (item.children) {
      return item.children.some(child => child.path === activePath);
    }
    return false;
  };

  return (
    <Box
      sx={{
        width: '100%',
        bgcolor: 'background.paper',
        overflow: 'auto',
      }}
    >
      {/* Navigation Header */}
      <Box sx={{ p: compact ? 1 : 2, pb: 1 }}>
        <Typography
          variant={compact ? 'caption' : 'subtitle2'}
          sx={{
            fontWeight: 600,
            color: 'text.secondary',
            textTransform: 'uppercase',
            letterSpacing: 1,
            fontSize: compact ? '0.625rem' : '0.75rem',
          }}
        >
          Navigation
        </Typography>
      </Box>

      {/* Navigation Items */}
      <List
        component="nav"
        sx={{
          px: compact ? 0.5 : 1,
          py: 0,
        }}
      >
        {navigationItems.map((item) => (
          <NavigationItemComponent
            key={item.id}
            item={item}
            level={0}
            isActive={isItemActive(item)}
            compact={compact}
            showBadges={showBadges}
            onItemClick={handleItemClick}
          />
        ))}
      </List>

      {/* Quick Actions Footer */}
      <Box sx={{ mt: 2, p: compact ? 1 : 2, borderTop: '1px solid', borderColor: 'divider' }}>
        <Typography
          variant="caption"
          sx={{
            color: 'text.secondary',
            display: 'block',
            textAlign: 'center',
            mb: 1,
          }}
        >
          Quick Actions
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
          <Badge badgeContent={preferences.autoRefresh ? '●' : 0} color="success" variant="dot">
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                p: 0.5,
                borderRadius: 1,
                cursor: 'pointer',
                '&:hover': { bgcolor: 'action.hover' },
              }}
            >
              <LiveTvIcon fontSize="small" color={preferences.autoRefresh ? 'primary' : 'disabled'} />
              <Typography variant="caption" color="text.secondary">
                Live
              </Typography>
            </Box>
          </Badge>

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              p: 0.5,
              borderRadius: 1,
              cursor: 'pointer',
              '&:hover': { bgcolor: 'action.hover' },
            }}
          >
            <FavoriteIcon fontSize="small" color={favoriteTeams.length > 0 ? 'error' : 'disabled'} />
            <Typography variant="caption" color="text.secondary">
              Favs
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              p: 0.5,
              borderRadius: 1,
              cursor: 'pointer',
              '&:hover': { bgcolor: 'action.hover' },
            }}
          >
            <NotificationsIcon fontSize="small" color="primary" />
            <Typography variant="caption" color="text.secondary">
              Alerts
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Navigation;