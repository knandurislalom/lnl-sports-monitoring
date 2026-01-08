import React, { ReactNode, useState, useEffect } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Container,
  useTheme,
  useMediaQuery,
  Drawer,
  IconButton,
  Typography,
  Fab,
  Zoom,
  useScrollTrigger,
} from '@mui/material';
import {
  Menu as MenuIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
} from '@mui/icons-material';
import { ErrorBoundary } from '../shared/ErrorBoundary';
import { getUserPreferences, getViewPreferences } from '../core/utils/storage.utils';

// ===== TYPES =====

export interface MainLayoutProps {
  children: ReactNode;
  header?: ReactNode;
  navigation?: ReactNode;
  footer?: ReactNode;
  sidebar?: ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
  disableGutters?: boolean;
  showScrollToTop?: boolean;
}

interface LayoutContextType {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  drawerOpen: boolean;
  toggleDrawer: () => void;
  compactMode: boolean;
  refreshLayout: () => void;
}

// ===== CONTEXT =====

export const LayoutContext = React.createContext<LayoutContextType>({
  isMobile: false,
  isTablet: false,
  isDesktop: true,
  drawerOpen: false,
  toggleDrawer: () => {},
  compactMode: false,
  refreshLayout: () => {},
});

// ===== SCROLL TO TOP COMPONENT =====

interface ScrollTopProps {
  children: React.ReactElement;
  window?: () => Window;
}

const ScrollTop: React.FC<ScrollTopProps> = ({ children, window }) => {
  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
    disableHysteresis: true,
    threshold: 100,
  });

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const anchor = (
      (event.target as HTMLDivElement).ownerDocument || document
    ).querySelector('#back-to-top-anchor');

    if (anchor) {
      anchor.scrollIntoView({
        block: 'center',
        behavior: 'smooth',
      });
    }
  };

  return (
    <Zoom in={trigger}>
      <Box
        onClick={handleClick}
        role="presentation"
        sx={{ position: 'fixed', bottom: 16, right: 16, zIndex: 1000 }}
      >
        {children}
      </Box>
    </Zoom>
  );
};

// ===== MAIN LAYOUT COMPONENT =====

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  header,
  navigation,
  footer,
  sidebar,
  maxWidth = 'xl',
  disableGutters = false,
  showScrollToTop = true,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));
  
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [preferences, setPreferences] = useState(getUserPreferences());
  const [viewPrefs, setViewPrefs] = useState(getViewPreferences());
  const [layoutVersion, setLayoutVersion] = useState(0);

  // Drawer width based on screen size
  const drawerWidth = isMobile ? 280 : isTablet ? 320 : 340;

  useEffect(() => {
    // Load user preferences on mount
    setPreferences(getUserPreferences());
    setViewPrefs(getViewPreferences());
  }, [layoutVersion]);

  useEffect(() => {
    // Close drawer on desktop if it's open
    if (isDesktop && drawerOpen) {
      setDrawerOpen(false);
    }
  }, [isDesktop, drawerOpen]);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const refreshLayout = () => {
    setLayoutVersion(prev => prev + 1);
  };

  const layoutContextValue: LayoutContextType = {
    isMobile,
    isTablet,
    isDesktop,
    drawerOpen,
    toggleDrawer,
    compactMode: preferences.compactMode,
    refreshLayout,
  };

  // Calculate content padding based on layout
  const contentPaddingTop = header ? 8 : 3;
  const contentPaddingBottom = footer ? 8 : 3;

  return (
    <LayoutContext.Provider value={layoutContextValue}>
      <ErrorBoundary>
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
          {/* App Bar / Header */}
          {header && (
            <AppBar
              position="fixed"
              elevation={1}
              sx={{
                zIndex: theme.zIndex.drawer + 1,
                bgcolor: 'background.paper',
                color: 'text.primary',
                borderBottom: `1px solid ${theme.palette.divider}`,
              }}
            >
              <Toolbar
                variant={preferences.compactMode ? 'dense' : 'regular'}
                sx={{
                  minHeight: preferences.compactMode ? 48 : 64,
                  px: { xs: 1, sm: 2, md: 3 },
                }}
              >
                {/* Mobile menu button */}
                {(navigation || sidebar) && (isMobile || isTablet) && (
                  <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="start"
                    onClick={toggleDrawer}
                    sx={{ mr: 2 }}
                  >
                    <MenuIcon />
                  </IconButton>
                )}
                
                {/* Header content */}
                <Box sx={{ flexGrow: 1 }}>
                  {header}
                </Box>
              </Toolbar>
            </AppBar>
          )}

          {/* Navigation Drawer */}
          {(navigation || sidebar) && (
            <Drawer
              variant={isDesktop ? 'persistent' : 'temporary'}
              anchor="left"
              open={isDesktop || drawerOpen}
              onClose={() => setDrawerOpen(false)}
              ModalProps={{
                keepMounted: true, // Better open performance on mobile
              }}
              sx={{
                width: drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                  width: drawerWidth,
                  boxSizing: 'border-box',
                  borderRight: `1px solid ${theme.palette.divider}`,
                  bgcolor: 'background.paper',
                  marginTop: header ? (preferences.compactMode ? '48px' : '64px') : 0,
                  height: header ? (preferences.compactMode ? 'calc(100% - 48px)' : 'calc(100% - 64px)') : '100%',
                },
              }}
            >
              {/* Navigation content */}
              <Box sx={{ overflow: 'auto', height: '100%' }}>
                {navigation && (
                  <Box sx={{ p: 1 }}>
                    {navigation}
                  </Box>
                )}
                
                {/* Sidebar content */}
                {sidebar && (
                  <Box sx={{ p: 1, borderTop: navigation ? `1px solid ${theme.palette.divider}` : 'none' }}>
                    {sidebar}
                  </Box>
                )}
              </Box>
            </Drawer>
          )}

          {/* Main content area */}
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              display: 'flex',
              flexDirection: 'column',
              minHeight: '100vh',
              marginLeft: {
                xs: 0,
                lg: (navigation || sidebar) && isDesktop ? `${drawerWidth}px` : 0,
              },
              transition: theme.transitions.create(['margin'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
              }),
            }}
          >
            {/* Back to top anchor */}
            <Box id="back-to-top-anchor" />

            {/* Content container */}
            <Container
              maxWidth={maxWidth}
              disableGutters={disableGutters}
              sx={{
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
                pt: contentPaddingTop,
                pb: contentPaddingBottom,
                px: {
                  xs: disableGutters ? 0 : 2,
                  sm: disableGutters ? 0 : 3,
                  md: disableGutters ? 0 : 4,
                },
              }}
            >
              <ErrorBoundary>
                {children}
              </ErrorBoundary>
            </Container>

            {/* Footer */}
            {footer && (
              <Box
                component="footer"
                sx={{
                  mt: 'auto',
                  bgcolor: 'background.paper',
                  borderTop: `1px solid ${theme.palette.divider}`,
                  py: 2,
                }}
              >
                <Container maxWidth={maxWidth} disableGutters={disableGutters}>
                  {footer}
                </Container>
              </Box>
            )}
          </Box>

          {/* Scroll to top button */}
          {showScrollToTop && (
            <ScrollTop>
              <Fab
                color="primary"
                size="small"
                aria-label="scroll back to top"
                sx={{
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  },
                }}
              >
                <KeyboardArrowUpIcon />
              </Fab>
            </ScrollTop>
          )}
        </Box>
      </ErrorBoundary>
    </LayoutContext.Provider>
  );
};

// ===== LAYOUT HOOK =====

export const useLayout = () => {
  const context = React.useContext(LayoutContext);
  if (!context) {
    throw new Error('useLayout must be used within a MainLayout');
  }
  return context;
};

// ===== RESPONSIVE LAYOUT VARIANTS =====

/**
 * Full-width layout for dashboard-style pages
 */
export const DashboardLayout: React.FC<Omit<MainLayoutProps, 'maxWidth' | 'disableGutters'>> = (props) => (
  <MainLayout {...props} maxWidth={false} disableGutters />
);

/**
 * Centered content layout for forms and content pages
 */
export const ContentLayout: React.FC<Omit<MainLayoutProps, 'maxWidth'>> = (props) => (
  <MainLayout {...props} maxWidth="lg" />
);

/**
 * Compact layout for mobile-optimized pages
 */
export const CompactLayout: React.FC<MainLayoutProps> = (props) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  return (
    <MainLayout
      {...props}
      maxWidth={isMobile ? 'sm' : 'md'}
      showScrollToTop={!isMobile}
    />
  );
};

// ===== LAYOUT UTILITIES =====

/**
 * Get layout configuration based on current breakpoint
 */
export const useLayoutConfig = () => {
  const theme = useTheme();
  const { isMobile, isTablet, isDesktop, compactMode } = useLayout();
  
  return {
    spacing: compactMode ? 1 : 2,
    cardSpacing: compactMode ? 1 : 3,
    containerPadding: {
      xs: isMobile ? 1 : 2,
      sm: isTablet ? 2 : 3,
      md: isDesktop ? 3 : 4,
    },
    itemsPerRow: {
      xs: 1,
      sm: 2,
      md: 3,
      lg: 4,
      xl: 5,
    },
    breakpoints: {
      isMobile,
      isTablet,
      isDesktop,
    },
    compactMode,
  };
};

/**
 * Responsive grid columns based on content type
 */
export const useResponsiveColumns = (contentType: 'cards' | 'list' | 'table' = 'cards') => {
  const { isMobile, isTablet, compactMode } = useLayout();
  
  const configs = {
    cards: {
      xs: 1,
      sm: compactMode ? 3 : 2,
      md: compactMode ? 4 : 3,
      lg: compactMode ? 5 : 4,
      xl: compactMode ? 6 : 5,
    },
    list: {
      xs: 1,
      sm: 1,
      md: compactMode ? 2 : 1,
      lg: compactMode ? 2 : 1,
      xl: compactMode ? 3 : 2,
    },
    table: {
      xs: 1,
      sm: 1,
      md: 1,
      lg: 1,
      xl: 1,
    },
  };
  
  return configs[contentType];
};

export default MainLayout;