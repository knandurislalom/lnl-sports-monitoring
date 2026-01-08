import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Container,
  Divider,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  LiveTv as LiveTvIcon,
  Schedule as ScheduleIcon,
  History as HistoryIcon,
  Sports as SportsIcon,
  Home as HomeIcon,
  SportsSoccer as SoccerIcon,
  SportsFootball as FootballIcon,
  SportsBasketball as BasketballIcon,
} from '@mui/icons-material';
import { Navigation } from './Navigation';
import { AppBreadcrumbs } from './Breadcrumbs';
import { TabNavigation, TabPanel, useTabs } from './TabNavigation';
import { MainLayout } from '../layout/MainLayout';
import { Header } from '../layout/Header';

// ===== DEMO DATA =====

const sampleBreadcrumbs = [
  { label: 'Home', path: '/', icon: HomeIcon },
  { label: 'Sports', path: '/sports', icon: SportsIcon },
  { label: 'NFL', path: '/sports/nfl', icon: FootballIcon, chip: { label: 'Live', color: 'error' as const } },
  { label: 'Game Details', path: '/sports/nfl/game/123', active: true },
];

const sampleTabs = [
  {
    id: 'live',
    label: 'Live Games',
    icon: LiveTvIcon,
    badge: { count: 8, color: 'error' as const },
  },
  {
    id: 'schedule',
    label: 'Schedule',
    icon: ScheduleIcon,
    badge: { count: 24, color: 'primary' as const },
  },
  {
    id: 'recent',
    label: 'Recent',
    icon: HistoryIcon,
    closable: true,
  },
  {
    id: 'nfl',
    label: 'NFL',
    icon: FootballIcon,
    chip: { label: 'Season', color: 'success' as const },
    closable: true,
  },
  {
    id: 'nba',
    label: 'NBA',
    icon: BasketballIcon,
    badge: { count: 12, color: 'warning' as const },
    closable: true,
  },
  {
    id: 'soccer',
    label: 'Soccer',
    icon: SoccerIcon,
    closable: true,
  },
  {
    id: 'favorites',
    label: 'My Favorites',
    badge: { count: 5, color: 'secondary' as const },
    closable: true,
  },
  {
    id: 'settings',
    label: 'Settings',
    closable: true,
  },
];

// ===== DEMO CONTENT COMPONENTS =====

const NavigationDemo: React.FC = () => {
  const [showBadges, setShowBadges] = useState(true);
  const [compact, setCompact] = useState(false);

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Navigation Component Demo
        </Typography>
        
        <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
          <FormControlLabel
            control={
              <Switch
                checked={showBadges}
                onChange={(e) => setShowBadges(e.target.checked)}
              />
            }
            label="Show Badges"
          />
          <FormControlLabel
            control={
              <Switch
                checked={compact}
                onChange={(e) => setCompact(e.target.checked)}
              />
            }
            label="Compact Mode"
          />
        </Box>
        
        <Box
          sx={{
            height: 400,
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1,
            overflow: 'auto',
            bgcolor: 'background.paper',
          }}
        >
          <Navigation
            activePath="/live"
            compact={compact}
            showBadges={showBadges}
            onItemClick={(item) => console.log('Navigate to:', item.path)}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

const BreadcrumbsDemo: React.FC = () => {
  const [showIcons, setShowIcons] = useState(true);
  const [showBack, setShowBack] = useState(false);
  const [maxItems, setMaxItems] = useState(4);

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Breadcrumbs Component Demo
        </Typography>
        
        <Box sx={{ mb: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <FormControlLabel
            control={
              <Switch
                checked={showIcons}
                onChange={(e) => setShowIcons(e.target.checked)}
              />
            }
            label="Show Icons"
          />
          <FormControlLabel
            control={
              <Switch
                checked={showBack}
                onChange={(e) => setShowBack(e.target.checked)}
              />
            }
            label="Show Back Button"
          />
          <Button
            variant="outlined"
            size="small"
            onClick={() => setMaxItems(prev => prev === 4 ? 2 : 4)}
          >
            Max Items: {maxItems}
          </Button>
        </Box>
        
        <Box
          sx={{
            p: 2,
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1,
            bgcolor: 'background.paper',
          }}
        >
          <AppBreadcrumbs
            items={sampleBreadcrumbs}
            showIcons={showIcons}
            showBackButton={showBack}
            maxItems={maxItems}
            onNavigate={(item) => console.log('Navigate to:', item.path)}
            onBack={() => console.log('Go back')}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

const TabsDemo: React.FC = () => {
  const { tabs, activeTab, setActiveTab, removeTab, addTab } = useTabs('live', sampleTabs);
  const [showBadges, setShowBadges] = useState(true);
  const [allowClosing, setAllowClosing] = useState(true);

  const handleAddRandomTab = () => {
    const newTab = {
      id: `tab-${Date.now()}`,
      label: `New Tab ${tabs.length + 1}`,
      closable: true,
    };
    addTab(newTab);
    setActiveTab(newTab.id);
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Tab Navigation Component Demo
        </Typography>
        
        <Box sx={{ mb: 2, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
          <FormControlLabel
            control={
              <Switch
                checked={showBadges}
                onChange={(e) => setShowBadges(e.target.checked)}
              />
            }
            label="Show Badges"
          />
          <FormControlLabel
            control={
              <Switch
                checked={allowClosing}
                onChange={(e) => setAllowClosing(e.target.checked)}
              />
            }
            label="Allow Closing"
          />
          <Button
            variant="outlined"
            size="small"
            onClick={handleAddRandomTab}
          >
            Add Tab
          </Button>
        </Box>
        
        <Box
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1,
            overflow: 'hidden',
            bgcolor: 'background.paper',
          }}
        >
          <TabNavigation
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onTabClose={allowClosing ? removeTab : undefined}
            showBadges={showBadges}
            allowClosing={allowClosing}
            maxTabs={6}
          />
          
          <Box sx={{ p: 2, minHeight: 200 }}>
            {tabs.map((tab) => (
              <TabPanel key={tab.id} value={tab.id} activeTab={activeTab}>
                <Typography variant="h6" gutterBottom>
                  {tab.label} Content
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  This is the content for the "{tab.label}" tab. Each tab can contain
                  different components and functionality.
                </Typography>
                
                {tab.id === 'live' && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      Live games would be displayed here with real-time updates.
                    </Typography>
                    <Button variant="contained" size="small">
                      Refresh Live Data
                    </Button>
                  </Box>
                )}
                
                {tab.id === 'schedule' && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      Upcoming games schedule would be shown in this section.
                    </Typography>
                    <Button variant="outlined" size="small">
                      View Full Schedule
                    </Button>
                  </Box>
                )}
              </TabPanel>
            ))}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

// ===== MAIN NAVIGATION DEMO PAGE =====

const NavigationDemo_Page: React.FC = () => {
  const [refreshing, setRefreshing] = React.useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  };

  return (
    <MainLayout
      maxWidth="xl"
      header={
        <Header
          title="Navigation Components"
          subtitle="Demo of navigation system components"
          showLiveIndicator
          liveGameCount={5}
          onRefresh={handleRefresh}
          refreshing={refreshing}
        />
      }
    >
      <Container maxWidth="xl">
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Navigation Components Demo
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Interactive demonstration of the navigation components including sidebar navigation,
            breadcrumbs, and tab navigation systems.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* Navigation Component */}
          <Grid item xs={12} lg={6}>
            <NavigationDemo />
          </Grid>

          {/* Breadcrumbs Component */}
          <Grid item xs={12} lg={6}>
            <BreadcrumbsDemo />
          </Grid>

          {/* Tab Navigation Component */}
          <Grid item xs={12}>
            <TabsDemo />
          </Grid>

          {/* Features Overview */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Navigation System Features
                </Typography>
                
                <Grid container spacing={3} sx={{ mt: 1 }}>
                  <Grid item xs={12} md={4}>
                    <Typography variant="subtitle1" color="primary.main" gutterBottom>
                      Sidebar Navigation
                    </Typography>
                    <Box component="ul" sx={{ pl: 2, m: 0 }}>
                      <Typography component="li" variant="body2">Hierarchical menu structure</Typography>
                      <Typography component="li" variant="body2">Badges and status indicators</Typography>
                      <Typography component="li" variant="body2">Collapsible sections</Typography>
                      <Typography component="li" variant="body2">Quick action shortcuts</Typography>
                      <Typography component="li" variant="body2">Favorite team integration</Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <Typography variant="subtitle1" color="secondary.main" gutterBottom>
                      Breadcrumbs
                    </Typography>
                    <Box component="ul" sx={{ pl: 2, m: 0 }}>
                      <Typography component="li" variant="body2">Path navigation with icons</Typography>
                      <Typography component="li" variant="body2">Overflow handling with menu</Typography>
                      <Typography component="li" variant="body2">Back button support</Typography>
                      <Typography component="li" variant="body2">Status chips and badges</Typography>
                      <Typography component="li" variant="body2">Responsive truncation</Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <Typography variant="subtitle1" color="success.main" gutterBottom>
                      Tab Navigation
                    </Typography>
                    <Box component="ul" sx={{ pl: 2, m: 0 }}>
                      <Typography component="li" variant="body2">Scrollable tab interface</Typography>
                      <Typography component="li" variant="body2">Closable tabs support</Typography>
                      <Typography component="li" variant="body2">Overflow menu for many tabs</Typography>
                      <Typography component="li" variant="body2">Badge and chip indicators</Typography>
                      <Typography component="li" variant="body2">Tab state management hook</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </MainLayout>
  );
};

export default NavigationDemo_Page;