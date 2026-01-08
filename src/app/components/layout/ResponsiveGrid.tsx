import React from 'react';
import {
  Grid,
  Box,
  useTheme,
  useMediaQuery,
} from '@mui/material';

// ===== TYPES =====

export interface ResponsiveGridProps {
  children: React.ReactNode;
  container?: boolean;
  item?: boolean;
  spacing?: number | { xs?: number; sm?: number; md?: number; lg?: number; xl?: number };
  columns?: number | { xs?: number; sm?: number; md?: number; lg?: number; xl?: number };
  xs?: boolean | number | 'auto';
  sm?: boolean | number | 'auto';
  md?: boolean | number | 'auto';
  lg?: boolean | number | 'auto';
  xl?: boolean | number | 'auto';
  direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  justifyContent?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';
  alignItems?: 'flex-start' | 'center' | 'flex-end' | 'stretch' | 'baseline';
  wrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
  zeroMinWidth?: boolean;
  sx?: object;
}

export interface ResponsiveContainerProps {
  children: React.ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
  disableGutters?: boolean;
  fixed?: boolean;
  sx?: object;
}

export interface AutoGridProps {
  children: React.ReactNode;
  minItemWidth?: number | string;
  spacing?: number;
  sx?: object;
}

export interface MasonryGridProps {
  children: React.ReactNode;
  columns?: number | { xs?: number; sm?: number; md?: number; lg?: number; xl?: number };
  spacing?: number;
  sx?: object;
}

// ===== RESPONSIVE GRID COMPONENT =====

export const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  children,
  container = false,
  item = false,
  spacing = 2,
  columns,
  xs,
  sm,
  md,
  lg,
  xl,
  direction = 'row',
  justifyContent = 'flex-start',
  alignItems = 'stretch',
  wrap = 'wrap',
  zeroMinWidth = false,
  sx = {},
}) => {
  const theme = useTheme();

  // Handle responsive spacing
  const getSpacing = () => {
    if (typeof spacing === 'number') {
      return spacing;
    }
    return spacing;
  };

  // Handle responsive columns
  const getColumns = () => {
    if (!columns) return undefined;
    if (typeof columns === 'number') {
      return columns;
    }
    return columns;
  };

  return (
    <Grid
      container={container}
      item={item}
      spacing={getSpacing()}
      columns={getColumns()}
      xs={xs}
      sm={sm}
      md={md}
      lg={lg}
      xl={xl}
      direction={direction}
      justifyContent={justifyContent}
      alignItems={alignItems}
      wrap={wrap}
      zeroMinWidth={zeroMinWidth}
      sx={{
        ...sx,
      }}
    >
      {children}
    </Grid>
  );
};

// ===== RESPONSIVE CONTAINER COMPONENT =====

export const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  children,
  maxWidth = 'lg',
  disableGutters = false,
  fixed = false,
  sx = {},
}) => {
  const theme = useTheme();

  const getMaxWidth = () => {
    if (maxWidth === false) return '100%';
    if (maxWidth === 'xs') return theme.breakpoints.values.xs;
    if (maxWidth === 'sm') return theme.breakpoints.values.sm;
    if (maxWidth === 'md') return theme.breakpoints.values.md;
    if (maxWidth === 'lg') return theme.breakpoints.values.lg;
    if (maxWidth === 'xl') return theme.breakpoints.values.xl;
    return theme.breakpoints.values.lg;
  };

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: getMaxWidth(),
        mx: 'auto',
        px: disableGutters ? 0 : { xs: 2, sm: 3, md: 4 },
        ...sx,
      }}
    >
      {children}
    </Box>
  );
};

// ===== AUTO GRID COMPONENT =====

export const AutoGrid: React.FC<AutoGridProps> = ({
  children,
  minItemWidth = 280,
  spacing = 2,
  sx = {},
}) => {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: `repeat(auto-fit, minmax(${typeof minItemWidth === 'number' ? `${minItemWidth}px` : minItemWidth}, 1fr))`,
        gap: spacing,
        ...sx,
      }}
    >
      {children}
    </Box>
  );
};

// ===== MASONRY GRID COMPONENT =====

export const MasonryGrid: React.FC<MasonryGridProps> = ({
  children,
  columns = { xs: 1, sm: 2, md: 3, lg: 4, xl: 5 },
  spacing = 2,
  sx = {},
}) => {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down('sm'));
  const isSm = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isMd = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const isLg = useMediaQuery(theme.breakpoints.between('lg', 'xl'));

  const getColumnCount = () => {
    if (typeof columns === 'number') return columns;
    
    if (isXs) return columns.xs || 1;
    if (isSm) return columns.sm || columns.xs || 2;
    if (isMd) return columns.md || columns.sm || columns.xs || 3;
    if (isLg) return columns.lg || columns.md || columns.sm || columns.xs || 4;
    return columns.xl || columns.lg || columns.md || columns.sm || columns.xs || 5;
  };

  const columnCount = getColumnCount();

  // Create arrays for each column
  const columnWrappers: React.ReactNode[][] = Array.from({ length: columnCount }, () => []);
  
  // Distribute children across columns
  React.Children.forEach(children, (child, index) => {
    const columnIndex = index % columnCount;
    columnWrappers[columnIndex].push(child);
  });

  return (
    <Box
      sx={{
        display: 'flex',
        gap: spacing,
        alignItems: 'flex-start',
        ...sx,
      }}
    >
      {columnWrappers.map((column, index) => (
        <Box
          key={index}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: spacing,
            flex: 1,
            minWidth: 0,
          }}
        >
          {column}
        </Box>
      ))}
    </Box>
  );
};

// ===== GRID UTILITIES =====

/**
 * Hook for responsive grid configurations
 */
export const useResponsiveGrid = () => {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down('sm'));
  const isSm = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isMd = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const isLg = useMediaQuery(theme.breakpoints.between('lg', 'xl'));
  const isXl = useMediaQuery(theme.breakpoints.up('xl'));

  const getResponsiveValue = <T>(values: {
    xs?: T;
    sm?: T;
    md?: T;
    lg?: T;
    xl?: T;
  }): T | undefined => {
    if (isXs) return values.xs;
    if (isSm) return values.sm || values.xs;
    if (isMd) return values.md || values.sm || values.xs;
    if (isLg) return values.lg || values.md || values.sm || values.xs;
    if (isXl) return values.xl || values.lg || values.md || values.sm || values.xs;
    return undefined;
  };

  const getColumns = (type: 'cards' | 'list' | 'table' = 'cards') => {
    const configurations = {
      cards: { xs: 1, sm: 2, md: 3, lg: 4, xl: 5 },
      list: { xs: 1, sm: 1, md: 2, lg: 2, xl: 3 },
      table: { xs: 1, sm: 1, md: 1, lg: 1, xl: 1 },
    };
    
    return getResponsiveValue(configurations[type]);
  };

  const getSpacing = (dense: boolean = false) => {
    return getResponsiveValue({
      xs: dense ? 1 : 2,
      sm: dense ? 1.5 : 2,
      md: dense ? 2 : 3,
      lg: dense ? 2 : 3,
      xl: dense ? 2.5 : 4,
    });
  };

  return {
    isXs,
    isSm,
    isMd,
    isLg,
    isXl,
    getResponsiveValue,
    getColumns,
    getSpacing,
    breakpoint: isXs ? 'xs' : isSm ? 'sm' : isMd ? 'md' : isLg ? 'lg' : 'xl',
  };
};

/**
 * Common grid patterns
 */
export const GridPatterns = {
  // Card grids for different content types
  GameCards: { xs: 1, sm: 2, md: 2, lg: 3, xl: 4 },
  TeamCards: { xs: 1, sm: 2, md: 3, lg: 4, xl: 6 },
  NewsCards: { xs: 1, sm: 1, md: 2, lg: 3, xl: 3 },
  StatCards: { xs: 2, sm: 3, md: 4, lg: 5, xl: 6 },
  
  // List layouts
  GameList: { xs: 1, sm: 1, md: 1, lg: 2, xl: 2 },
  PlayerList: { xs: 1, sm: 2, md: 3, lg: 4, xl: 5 },
  
  // Dashboard layouts
  DashboardWidgets: { xs: 1, sm: 2, md: 2, lg: 3, xl: 4 },
  StatsOverview: { xs: 2, sm: 4, md: 4, lg: 6, xl: 8 },
  
  // Sidebar layouts
  SidebarItems: { xs: 1, sm: 1, md: 1, lg: 1, xl: 1 },
  QuickActions: { xs: 2, sm: 3, md: 3, lg: 4, xl: 4 },
};

/**
 * Responsive spacing values
 */
export const ResponsiveSpacing = {
  dense: { xs: 1, sm: 1, md: 1.5, lg: 2, xl: 2 },
  normal: { xs: 2, sm: 2, md: 3, lg: 3, xl: 4 },
  loose: { xs: 3, sm: 4, md: 4, lg: 5, xl: 6 },
};

// ===== LAYOUT COMPONENTS =====

/**
 * Pre-configured grid for game cards
 */
export const GameCardGrid: React.FC<{ children: React.ReactNode; spacing?: number }> = ({ 
  children, 
  spacing = 3 
}) => (
  <ResponsiveGrid
    container
    spacing={spacing}
    sx={{
      '& > .MuiGrid-item': GridPatterns.GameCards,
    }}
  >
    {React.Children.map(children, (child, index) => (
      <ResponsiveGrid item key={index} {...GridPatterns.GameCards}>
        {child}
      </ResponsiveGrid>
    ))}
  </ResponsiveGrid>
);

/**
 * Pre-configured grid for team cards
 */
export const TeamCardGrid: React.FC<{ children: React.ReactNode; spacing?: number }> = ({ 
  children, 
  spacing = 2 
}) => (
  <ResponsiveGrid
    container
    spacing={spacing}
    sx={{
      '& > .MuiGrid-item': GridPatterns.TeamCards,
    }}
  >
    {React.Children.map(children, (child, index) => (
      <ResponsiveGrid item key={index} {...GridPatterns.TeamCards}>
        {child}
      </ResponsiveGrid>
    ))}
  </ResponsiveGrid>
);

/**
 * Pre-configured grid for dashboard widgets
 */
export const DashboardGrid: React.FC<{ children: React.ReactNode; spacing?: number }> = ({ 
  children, 
  spacing = 3 
}) => (
  <ResponsiveGrid
    container
    spacing={spacing}
    sx={{
      '& > .MuiGrid-item': GridPatterns.DashboardWidgets,
    }}
  >
    {React.Children.map(children, (child, index) => (
      <ResponsiveGrid item key={index} {...GridPatterns.DashboardWidgets}>
        {child}
      </ResponsiveGrid>
    ))}
  </ResponsiveGrid>
);

export default ResponsiveGrid;