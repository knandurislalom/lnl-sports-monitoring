import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Container,
  useTheme,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  SportsSoccer as SportsIcon,
  Schedule as ScheduleIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { MainLayout } from './MainLayout';
import { Header } from './Header';
import { Footer } from './Footer';

// ===== DEMO NAVIGATION =====

const DemoNavigation: React.FC = () => (
  <Box sx={{ p: 2 }}>
    <Typography variant="h6" sx={{ mb: 2, color: 'text.primary' }}>
      Navigation
    </Typography>
    
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      {[
        { icon: DashboardIcon, label: 'Dashboard', active: true },
        { icon: SportsIcon, label: 'Live Games' },
        { icon: ScheduleIcon, label: 'Schedule' },
        { icon: SettingsIcon, label: 'Settings' },
      ].map(({ icon: Icon, label, active }) => (
        <Button
          key={label}
          startIcon={<Icon />}
          variant={active ? 'contained' : 'text'}
          sx={{
            justifyContent: 'flex-start',
            textAlign: 'left',
            py: 1.5,
            px: 2,
          }}
        >
          {label}
        </Button>
      ))}
    </Box>
  </Box>
);

// ===== DEMO SIDEBAR =====

const DemoSidebar: React.FC = () => (
  <Box sx={{ p: 2 }}>
    <Typography variant="h6" sx={{ mb: 2, color: 'text.primary' }}>
      Quick Stats
    </Typography>
    
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {[
        { label: 'Live Games', value: '8' },
        { label: 'Today\'s Games', value: '24' },
        { label: 'Favorite Teams', value: '5' },
      ].map(({ label, value }) => (
        <Card key={label} variant="outlined" sx={{ bgcolor: 'background.default' }}>
          <CardContent sx={{ py: 1, '&:last-child': { pb: 1 } }}>
            <Typography variant="h6" color="primary.main">
              {value}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {label}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  </Box>
);

// ===== DEMO CONTENT =====

const DemoContent: React.FC = () => {
  const theme = useTheme();

  const demoCards = [
    {
      title: 'Responsive Design',
      description: 'The layout automatically adapts to different screen sizes with a mobile-first approach.',
      color: 'primary.main',
    },
    {
      title: 'Material-UI Integration',
      description: 'Built with Material-UI components following the light theme design system.',
      color: 'secondary.main',
    },
    {
      title: 'User Preferences',
      description: 'Compact mode and other preferences are loaded from local storage and respected throughout the layout.',
      color: 'success.main',
    },
    {
      title: 'Error Boundaries',
      description: 'Comprehensive error handling ensures the layout remains stable even when components fail.',
      color: 'warning.main',
    },
    {
      title: 'Performance Optimized',
      description: 'Smart drawer management, scroll restoration, and efficient re-renders for optimal performance.',
      color: 'info.main',
    },
    {
      title: 'Accessibility Ready',
      description: 'ARIA labels, keyboard navigation, and semantic HTML structure for screen reader compatibility.',
      color: 'text.primary',
    },
  ];

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Main Layout Demo
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          This demonstrates the MainLayout component with header, navigation, sidebar, and footer integration.
          The layout is fully responsive and includes user preference support.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {demoCards.map((card, index) => (
          <Grid item xs={12} sm={6} lg={4} key={index}>
            <Card 
              sx={{ 
                height: '100%',
                borderLeft: `4px solid ${card.color}`,
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: theme.shadows[4],
                },
              }}
            >
              <CardContent>
                <Typography 
                  variant="h6" 
                  component="h2" 
                  gutterBottom
                  sx={{ color: card.color }}
                >
                  {card.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {card.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 4, p: 3, bgcolor: 'background.paper', borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom>
          Layout Features
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" color="primary.main" gutterBottom>
              Responsive Breakpoints
            </Typography>
            <Box component="ul" sx={{ pl: 2, m: 0 }}>
              <Typography component="li" variant="body2">Mobile: Drawer becomes temporary overlay</Typography>
              <Typography component="li" variant="body2">Tablet: Adaptive spacing and button sizes</Typography>
              <Typography component="li" variant="body2">Desktop: Persistent drawer with full features</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" color="secondary.main" gutterBottom>
              User Preferences
            </Typography>
            <Box component="ul" sx={{ pl: 2, m: 0 }}>
              <Typography component="li" variant="body2">Compact mode reduces spacing and sizes</Typography>
              <Typography component="li" variant="body2">Auto-refresh preferences respected</Typography>
              <Typography component="li" variant="body2">Theme preferences with toggle support</Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Try resizing the window or toggling preferences to see the layout adapt in real-time.
        </Typography>
      </Box>
    </Container>
  );
};

// ===== LAYOUT DEMO PAGE =====

const LayoutDemo: React.FC = () => {
  const [refreshing, setRefreshing] = React.useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  };

  const handleSearch = () => {
    console.log('Search triggered');
  };

  const handleSettings = () => {
    console.log('Settings triggered');
  };

  return (
    <MainLayout
      maxWidth="xl"
      showScrollToTop
      header={
        <Header
          title="Sports Monitoring"
          subtitle="Live Demo of Layout System"
          showLiveIndicator
          liveGameCount={3}
          onRefresh={handleRefresh}
          onSearch={handleSearch}
          onSettings={handleSettings}
          refreshing={refreshing}
        />
      }
      navigation={<DemoNavigation />}
      sidebar={<DemoSidebar />}
      footer={
        <Footer
          variant="standard"
          showSocial
          showLinks
          showCopyright
        />
      }
    >
      <DemoContent />
    </MainLayout>
  );
};

export default LayoutDemo;