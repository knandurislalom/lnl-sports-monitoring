import React, { useState, useEffect } from 'react';
import {
  Tabs,
  Tab,
  Box,
  Badge,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
  Typography,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { useLayout } from '../layout/MainLayout';

// ===== TYPES =====

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ElementType;
  badge?: {
    count?: number;
    color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
    variant?: 'dot' | 'standard';
  };
  chip?: {
    label: string;
    color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
    variant?: 'filled' | 'outlined';
  };
  closable?: boolean;
  disabled?: boolean;
}

export interface TabNavigationProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  onTabClose?: (tabId: string) => void;
  variant?: 'standard' | 'scrollable' | 'fullWidth';
  orientation?: 'horizontal' | 'vertical';
  showBadges?: boolean;
  allowClosing?: boolean;
  maxTabs?: number;
}

// ===== TAB CONTENT COMPONENT =====

interface TabContentProps {
  tab: TabItem;
  showBadges: boolean;
  compactMode: boolean;
  onClose?: (tabId: string) => void;
}

const TabContent: React.FC<TabContentProps> = ({ tab, showBadges, compactMode, onClose }) => {
  const TabIcon = tab.icon;

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 0.5,
        minWidth: 0, // Allow text truncation
      }}
    >
      {/* Icon */}
      {TabIcon && (
        <TabIcon
          sx={{
            fontSize: compactMode ? 16 : 18,
            flexShrink: 0,
          }}
        />
      )}

      {/* Badge wrapper for icon or text */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, minWidth: 0 }}>
        {showBadges && tab.badge ? (
          <Badge
            badgeContent={tab.badge.count}
            color={tab.badge.color || 'primary'}
            variant={tab.badge.variant || 'standard'}
            sx={{
              '& .MuiBadge-badge': {
                fontSize: compactMode ? '0.625rem' : '0.75rem',
                minWidth: compactMode ? 14 : 16,
                height: compactMode ? 14 : 16,
              },
            }}
          >
            <Typography
              variant={compactMode ? 'body2' : 'body1'}
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: 120,
              }}
            >
              {tab.label}
            </Typography>
          </Badge>
        ) : (
          <Typography
            variant={compactMode ? 'body2' : 'body1'}
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: 120,
            }}
          >
            {tab.label}
          </Typography>
        )}

        {/* Chip */}
        {tab.chip && (
          <Chip
            label={tab.chip.label}
            size="small"
            color={tab.chip.color || 'primary'}
            variant={tab.chip.variant || 'filled'}
            sx={{
              height: compactMode ? 16 : 18,
              fontSize: compactMode ? '0.625rem' : '0.75rem',
              '& .MuiChip-label': {
                px: compactMode ? 0.5 : 0.75,
              },
            }}
          />
        )}
      </Box>

      {/* Close button */}
      {tab.closable && onClose && (
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            onClose(tab.id);
          }}
          sx={{
            ml: 0.5,
            width: compactMode ? 16 : 20,
            height: compactMode ? 16 : 20,
            '&:hover': {
              bgcolor: 'action.hover',
            },
          }}
        >
          <CloseIcon sx={{ fontSize: compactMode ? 12 : 14 }} />
        </IconButton>
      )}
    </Box>
  );
};

// ===== TAB NAVIGATION COMPONENT =====

export const TabNavigation: React.FC<TabNavigationProps> = ({
  tabs,
  activeTab,
  onTabChange,
  onTabClose,
  variant = 'scrollable',
  orientation = 'horizontal',
  showBadges = true,
  allowClosing = false,
  maxTabs = 8,
}) => {
  const theme = useTheme();
  const { isMobile, compactMode } = useLayout();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // Determine if we need to show overflow menu
  const shouldShowOverflow = tabs.length > maxTabs;
  const visibleTabs = shouldShowOverflow ? tabs.slice(0, maxTabs - 1) : tabs;
  const overflowTabs = shouldShowOverflow ? tabs.slice(maxTabs - 1) : [];

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    onTabChange(newValue);
  };

  const handleOverflowClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleOverflowClose = () => {
    setAnchorEl(null);
  };

  const handleOverflowItemClick = (tabId: string) => {
    onTabChange(tabId);
    handleOverflowClose();
  };

  // Auto-adjust variant based on screen size
  const effectiveVariant = isMobile ? 'scrollable' : variant;

  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          minHeight: compactMode ? 40 : 48,
        }}
      >
        {/* Main Tabs */}
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant={effectiveVariant}
          orientation={orientation}
          scrollButtons="auto"
          allowScrollButtonsMobile
          sx={{
            flexGrow: 1,
            minHeight: compactMode ? 40 : 48,
            '& .MuiTab-root': {
              minHeight: compactMode ? 40 : 48,
              fontSize: compactMode ? '0.875rem' : '1rem',
              textTransform: 'none',
              fontWeight: 500,
              px: compactMode ? 1.5 : 2,
              minWidth: compactMode ? 80 : 120,
              maxWidth: 200,
            },
            '& .MuiTabs-indicator': {
              height: 3,
              borderRadius: '3px 3px 0 0',
            },
            '& .MuiTabs-scrollButtons': {
              '&.Mui-disabled': {
                opacity: 0.3,
              },
            },
          }}
        >
          {visibleTabs.map((tab) => (
            <Tab
              key={tab.id}
              value={tab.id}
              disabled={tab.disabled}
              label={
                <TabContent
                  tab={tab}
                  showBadges={showBadges}
                  compactMode={compactMode}
                  onClose={allowClosing ? onTabClose : undefined}
                />
              }
              sx={{
                '&.Mui-selected': {
                  color: 'primary.main',
                  fontWeight: 600,
                },
              }}
            />
          ))}
        </Tabs>

        {/* Overflow Menu */}
        {shouldShowOverflow && (
          <Box>
            <IconButton
              onClick={handleOverflowClick}
              size={compactMode ? 'small' : 'medium'}
              sx={{
                color: 'text.secondary',
                mr: 1,
              }}
            >
              <MoreVertIcon />
            </IconButton>
            
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleOverflowClose}
              PaperProps={{
                elevation: 3,
                sx: {
                  minWidth: 200,
                  maxHeight: 300,
                },
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              {overflowTabs.map((tab) => (
                <MenuItem
                  key={tab.id}
                  selected={tab.id === activeTab}
                  disabled={tab.disabled}
                  onClick={() => handleOverflowItemClick(tab.id)}
                  sx={{
                    py: 1,
                    px: 2,
                  }}
                >
                  <TabContent
                    tab={tab}
                    showBadges={showBadges}
                    compactMode={compactMode}
                    onClose={allowClosing ? onTabClose : undefined}
                  />
                </MenuItem>
              ))}
            </Menu>
          </Box>
        )}
      </Box>
    </Box>
  );
};

// ===== TAB PANEL COMPONENT =====

interface TabPanelProps {
  children?: React.ReactNode;
  value: string;
  activeTab: string;
  keepMounted?: boolean;
}

export const TabPanel: React.FC<TabPanelProps> = ({
  children,
  value,
  activeTab,
  keepMounted = false,
}) => {
  const isActive = value === activeTab;

  if (!isActive && !keepMounted) {
    return null;
  }

  return (
    <Box
      role="tabpanel"
      hidden={!isActive}
      id={`tabpanel-${value}`}
      aria-labelledby={`tab-${value}`}
      sx={{
        display: isActive ? 'block' : 'none',
      }}
    >
      {children}
    </Box>
  );
};

// ===== HOOKS =====

/**
 * Hook to manage tab state
 */
export const useTabs = (initialTab: string, initialTabs: TabItem[] = []) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [tabs, setTabs] = useState<TabItem[]>(initialTabs);

  const addTab = (tab: TabItem) => {
    setTabs(prev => {
      if (prev.find(t => t.id === tab.id)) {
        return prev; // Tab already exists
      }
      return [...prev, tab];
    });
  };

  const removeTab = (tabId: string) => {
    setTabs(prev => {
      const newTabs = prev.filter(tab => tab.id !== tabId);
      
      // If removing active tab, switch to another tab
      if (tabId === activeTab && newTabs.length > 0) {
        const currentIndex = prev.findIndex(tab => tab.id === tabId);
        const nextTab = newTabs[Math.min(currentIndex, newTabs.length - 1)];
        setActiveTab(nextTab.id);
      }
      
      return newTabs;
    });
  };

  const updateTab = (tabId: string, updates: Partial<TabItem>) => {
    setTabs(prev =>
      prev.map(tab =>
        tab.id === tabId ? { ...tab, ...updates } : tab
      )
    );
  };

  return {
    tabs,
    activeTab,
    setActiveTab,
    addTab,
    removeTab,
    updateTab,
  };
};

export default TabNavigation;