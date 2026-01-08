import React, { useState } from 'react';
import {
  Breadcrumbs,
  Link,
  Typography,
  Box,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  NavigateNext as NavigateNextIcon,
  Home as HomeIcon,
  MoreHoriz as MoreIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { useLayout } from '../layout/MainLayout';

// ===== TYPES =====

export interface BreadcrumbItem {
  label: string;
  path?: string;
  icon?: React.ElementType;
  active?: boolean;
  chip?: {
    label: string;
    color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
    variant?: 'filled' | 'outlined';
  };
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  maxItems?: number;
  showIcons?: boolean;
  showBackButton?: boolean;
  onNavigate?: (item: BreadcrumbItem) => void;
  onBack?: () => void;
}

// ===== BREADCRUMBS COMPONENT =====

export const AppBreadcrumbs: React.FC<BreadcrumbsProps> = ({
  items,
  maxItems = 4,
  showIcons = true,
  showBackButton = false,
  onNavigate,
  onBack,
}) => {
  const theme = useTheme();
  const { isMobile, compactMode } = useLayout();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleNavigate = (item: BreadcrumbItem) => {
    if (onNavigate && item.path) {
      onNavigate(item);
    }
  };

  const handleMoreClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMoreClose = () => {
    setAnchorEl(null);
  };

  // Handle overflow items
  const shouldCollapse = items.length > maxItems;
  const visibleItems = shouldCollapse ? [
    items[0], // Always show first item (home)
    ...items.slice(-(maxItems - 2)), // Show last items
  ] : items;

  const hiddenItems = shouldCollapse ? items.slice(1, -(maxItems - 2)) : [];

  const renderBreadcrumbItem = (item: BreadcrumbItem, index: number, isLast: boolean) => {
    const ItemIcon = item.icon;
    const isClickable = !isLast && item.path && onNavigate;

    const content = (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        {showIcons && ItemIcon && (
          <ItemIcon
            sx={{
              fontSize: compactMode ? 16 : 18,
              color: isLast ? 'text.primary' : 'text.secondary',
            }}
          />
        )}
        
        <Typography
          variant={compactMode ? 'body2' : 'body1'}
          sx={{
            fontWeight: isLast ? 600 : 400,
            color: isLast ? 'text.primary' : 'text.secondary',
            maxWidth: isMobile ? 120 : 200,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
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
              height: compactMode ? 16 : 20,
              fontSize: compactMode ? '0.625rem' : '0.75rem',
              ml: 0.5,
            }}
          />
        )}
      </Box>
    );

    if (isClickable) {
      return (
        <Link
          key={`breadcrumb-${index}`}
          component="button"
          variant="body1"
          onClick={() => handleNavigate(item)}
          sx={{
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            p: 0,
            '&:hover': {
              '& .MuiTypography-root': {
                color: 'primary.main',
              },
              '& .MuiSvgIcon-root': {
                color: 'primary.main',
              },
            },
          }}
        >
          {content}
        </Link>
      );
    }

    return (
      <Box key={`breadcrumb-${index}`} sx={{ display: 'flex', alignItems: 'center' }}>
        {content}
      </Box>
    );
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        minHeight: compactMode ? 32 : 40,
        py: compactMode ? 0.5 : 1,
        px: 0,
      }}
    >
      {/* Back Button */}
      {showBackButton && onBack && (
        <IconButton
          onClick={onBack}
          size={compactMode ? 'small' : 'medium'}
          sx={{
            mr: 1,
            color: 'text.secondary',
            '&:hover': { color: 'primary.main' },
          }}
        >
          <ArrowBackIcon />
        </IconButton>
      )}

      {/* Breadcrumbs */}
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" sx={{ color: 'text.disabled' }} />}
        maxItems={isMobile ? 2 : maxItems}
        sx={{
          '& .MuiBreadcrumbs-ol': {
            flexWrap: 'nowrap',
          },
          '& .MuiBreadcrumbs-li': {
            display: 'flex',
            alignItems: 'center',
          },
        }}
      >
        {/* Home/First item */}
        {visibleItems.length > 0 && renderBreadcrumbItem(visibleItems[0], 0, visibleItems.length === 1)}

        {/* Collapsed items indicator */}
        {shouldCollapse && hiddenItems.length > 0 && (
          <Box key="more-items">
            <IconButton
              onClick={handleMoreClick}
              size="small"
              sx={{
                color: 'text.secondary',
                '&:hover': { color: 'primary.main' },
              }}
            >
              <MoreIcon />
            </IconButton>
            
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMoreClose}
              PaperProps={{
                elevation: 3,
                sx: { minWidth: 200 },
              }}
            >
              {hiddenItems.map((item, index) => (
                <MenuItem
                  key={`hidden-${index}`}
                  onClick={() => {
                    handleNavigate(item);
                    handleMoreClose();
                  }}
                  disabled={!item.path}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {item.icon && <item.icon fontSize="small" />}
                    <Typography variant="body2">{item.label}</Typography>
                    {item.chip && (
                      <Chip
                        label={item.chip.label}
                        size="small"
                        color={item.chip.color}
                        variant={item.chip.variant}
                        sx={{ height: 18, fontSize: '0.625rem' }}
                      />
                    )}
                  </Box>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        )}

        {/* Remaining visible items */}
        {visibleItems.slice(1).map((item, index) =>
          renderBreadcrumbItem(item, index + 1, index === visibleItems.length - 2)
        )}
      </Breadcrumbs>
    </Box>
  );
};

export default AppBreadcrumbs;