import { useTheme, useMediaQuery } from '@mui/material';
import { useMemo } from 'react';

// ===== RESPONSIVE BREAKPOINT HOOK =====

export interface ResponsiveBreakpoints {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isSmallMobile: boolean;
  isLargeMobile: boolean;
  isSmallTablet: boolean;
  isLargeTablet: boolean;
  isSmallDesktop: boolean;
  isLargeDesktop: boolean;
  screenSize: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export const useResponsive = (): ResponsiveBreakpoints => {
  const theme = useTheme();

  const isXs = useMediaQuery(theme.breakpoints.only('xs'));
  const isSm = useMediaQuery(theme.breakpoints.only('sm'));
  const isMd = useMediaQuery(theme.breakpoints.only('md'));
  const isLg = useMediaQuery(theme.breakpoints.only('lg'));
  const isXl = useMediaQuery(theme.breakpoints.only('xl'));

  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));

  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isLargeMobile = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  
  const isSmallTablet = useMediaQuery(theme.breakpoints.only('md'));
  const isLargeTablet = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  
  const isSmallDesktop = useMediaQuery(theme.breakpoints.only('lg'));
  const isLargeDesktop = useMediaQuery(theme.breakpoints.up('xl'));

  const screenSize = useMemo(() => {
    if (isXs) return 'xs';
    if (isSm) return 'sm';
    if (isMd) return 'md';
    if (isLg) return 'lg';
    if (isXl) return 'xl';
    return 'md';
  }, [isXs, isSm, isMd, isLg, isXl]);

  return {
    isMobile,
    isTablet,
    isDesktop,
    isSmallMobile,
    isLargeMobile,
    isSmallTablet,
    isLargeTablet,
    isSmallDesktop,
    isLargeDesktop,
    screenSize,
  };
};

// ===== RESPONSIVE GRID HOOK =====

export interface ResponsiveGridConfig {
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
}

export interface ResponsiveGrid {
  getGridProps: (config?: ResponsiveGridConfig) => {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  getCardColumns: (totalItems: number) => number;
  getOptimalColumns: () => ResponsiveGridConfig;
}

export const useResponsiveGrid = (): ResponsiveGrid => {
  const { screenSize, isMobile, isTablet } = useResponsive();

  const getGridProps = (config?: ResponsiveGridConfig) => {
    const defaults = {
      xs: 12,
      sm: 6,
      md: 4,
      lg: 3,
      xl: 2,
    };

    return {
      ...defaults,
      ...config,
    };
  };

  const getCardColumns = (totalItems: number) => {
    if (isMobile) {
      return totalItems > 4 ? 1 : 1; // Always 1 column on mobile
    }
    
    if (isTablet) {
      return totalItems > 6 ? 2 : totalItems > 3 ? 2 : 1;
    }

    // Desktop
    if (totalItems <= 3) return totalItems;
    if (totalItems <= 8) return 4;
    if (totalItems <= 12) return 4;
    return 6;
  };

  const getOptimalColumns = (): ResponsiveGridConfig => {
    switch (screenSize) {
      case 'xs':
        return { xs: 12, sm: 12, md: 6, lg: 4, xl: 3 };
      case 'sm':
        return { xs: 12, sm: 6, md: 4, lg: 3, xl: 2 };
      case 'md':
        return { xs: 12, sm: 6, md: 4, lg: 3, xl: 2 };
      case 'lg':
        return { xs: 12, sm: 6, md: 4, lg: 3, xl: 2 };
      case 'xl':
        return { xs: 12, sm: 6, md: 4, lg: 3, xl: 2 };
      default:
        return { xs: 12, sm: 6, md: 4, lg: 3, xl: 2 };
    }
  };

  return {
    getGridProps,
    getCardColumns,
    getOptimalColumns,
  };
};

// ===== RESPONSIVE TYPOGRAPHY HOOK =====

export interface ResponsiveTypography {
  getHeadingVariant: (level: 1 | 2 | 3 | 4 | 5 | 6) => 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  getBodyVariant: () => 'body1' | 'body2';
  getCaptionVariant: () => 'caption' | 'body2';
  getButtonSize: () => 'small' | 'medium' | 'large';
  getChipSize: () => 'small' | 'medium';
  getIconSize: () => 'small' | 'medium' | 'large';
}

export const useResponsiveTypography = (): ResponsiveTypography => {
  const { isMobile, isTablet } = useResponsive();

  const getHeadingVariant = (level: 1 | 2 | 3 | 4 | 5 | 6) => {
    if (isMobile) {
      // Make headings smaller on mobile
      const mobileMap: Record<number, 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'> = {
        1: 'h3',
        2: 'h4',
        3: 'h5',
        4: 'h6',
        5: 'h6',
        6: 'h6',
      };
      return mobileMap[level];
    }

    if (isTablet) {
      // Slightly smaller on tablet
      const tabletMap: Record<number, 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'> = {
        1: 'h2',
        2: 'h3',
        3: 'h4',
        4: 'h5',
        5: 'h6',
        6: 'h6',
      };
      return tabletMap[level];
    }

    // Desktop - use actual heading level
    return `h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  };

  const getBodyVariant = () => {
    return isMobile ? 'body2' : 'body1';
  };

  const getCaptionVariant = () => {
    return isMobile ? 'caption' : 'body2';
  };

  const getButtonSize = () => {
    if (isMobile) return 'small';
    if (isTablet) return 'medium';
    return 'medium';
  };

  const getChipSize = () => {
    return isMobile ? 'small' : 'medium';
  };

  const getIconSize = () => {
    if (isMobile) return 'small';
    if (isTablet) return 'medium';
    return 'medium';
  };

  return {
    getHeadingVariant,
    getBodyVariant,
    getCaptionVariant,
    getButtonSize,
    getChipSize,
    getIconSize,
  };
};

// ===== RESPONSIVE SPACING HOOK =====

export interface ResponsiveSpacing {
  getContainerSpacing: () => number;
  getCardSpacing: () => number;
  getSectionSpacing: () => number;
  getElementSpacing: () => number;
  getPadding: (size: 'small' | 'medium' | 'large') => number;
  getMargin: (size: 'small' | 'medium' | 'large') => number;
}

export const useResponsiveSpacing = (): ResponsiveSpacing => {
  const { isMobile, isTablet } = useResponsive();
  const theme = useTheme();

  const getContainerSpacing = () => {
    if (isMobile) return 1;
    if (isTablet) return 2;
    return 3;
  };

  const getCardSpacing = () => {
    if (isMobile) return 2;
    if (isTablet) return 3;
    return 3;
  };

  const getSectionSpacing = () => {
    if (isMobile) return 3;
    if (isTablet) return 4;
    return 6;
  };

  const getElementSpacing = () => {
    if (isMobile) return 1;
    if (isTablet) return 2;
    return 2;
  };

  const getPadding = (size: 'small' | 'medium' | 'large') => {
    const sizeMap = {
      small: isMobile ? 1 : 2,
      medium: isMobile ? 2 : 3,
      large: isMobile ? 3 : 4,
    };
    return theme.spacing(sizeMap[size]);
  };

  const getMargin = (size: 'small' | 'medium' | 'large') => {
    const sizeMap = {
      small: isMobile ? 1 : 2,
      medium: isMobile ? 2 : 3,
      large: isMobile ? 3 : 4,
    };
    return theme.spacing(sizeMap[size]);
  };

  return {
    getContainerSpacing,
    getCardSpacing,
    getSectionSpacing,
    getElementSpacing,
    getPadding,
    getMargin,
  };
};

// ===== RESPONSIVE LAYOUT HOOK =====

export interface ResponsiveLayout {
  shouldStackVertically: (threshold?: number) => boolean;
  shouldShowCompactView: () => boolean;
  shouldShowFullView: () => boolean;
  getMaxContainerWidth: () => 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
  getDrawerWidth: () => number;
  getAppBarHeight: () => number;
  shouldHideElement: (breakpoint: 'mobile' | 'tablet' | 'desktop') => boolean;
}

export const useResponsiveLayout = (): ResponsiveLayout => {
  const { isMobile, isTablet, isDesktop } = useResponsive();
  const theme = useTheme();

  const shouldStackVertically = (threshold = 768) => {
    return window.innerWidth < threshold;
  };

  const shouldShowCompactView = () => {
    return isMobile;
  };

  const shouldShowFullView = () => {
    return isDesktop;
  };

  const getMaxContainerWidth = () => {
    if (isMobile) return 'sm';
    if (isTablet) return 'lg';
    return 'xl';
  };

  const getDrawerWidth = () => {
    if (isMobile) return 280;
    if (isTablet) return 320;
    return 340;
  };

  const getAppBarHeight = () => {
    return isMobile ? 56 : 64;
  };

  const shouldHideElement = (breakpoint: 'mobile' | 'tablet' | 'desktop') => {
    switch (breakpoint) {
      case 'mobile':
        return !isMobile;
      case 'tablet':
        return !isTablet;
      case 'desktop':
        return !isDesktop;
      default:
        return false;
    }
  };

  return {
    shouldStackVertically,
    shouldShowCompactView,
    shouldShowFullView,
    getMaxContainerWidth,
    getDrawerWidth,
    getAppBarHeight,
    shouldHideElement,
  };
};