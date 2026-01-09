import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { 
  Box, 
  Container, 
  Typography, 
  Card, 
  CardContent, 
  Grid, 
  Chip, 
  Button,
  CardActions,
  Stack,
  Divider
} from '@mui/material';
import { 
  SportsBasketball as LiveIcon,
  History as RecentIcon,
  Schedule as ScheduleIcon,
  TrendingUp as TrendingIcon
} from '@mui/icons-material';
import { theme } from './app/core/config/theme.config';
import { MainLayout } from './app/main/layouts/MainLayout';
import { LiveGamesPage } from './app/pages/LiveGamesPage';
import { RecentGamesPage } from './app/pages/RecentGamesPage';
import { SchedulePage } from './app/pages/SchedulePage';
import './app/core/styles/design-system.css';

// Enhanced Dashboard Component with Navigation
const DashboardHome = () => {
  const navigate = useNavigate();

  const dashboardCards = [
    {
      title: 'Live Games',
      description: 'Real-time game monitoring with live scores, game status, and auto-refresh',
      icon: <LiveIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      stats: '5 Active',
      color: 'primary',
      route: '/live',
      features: ['Live Scores', 'Game Clock', 'Auto-refresh', 'Real-time Updates']
    },
    {
      title: 'Recent Results',
      description: 'Game results and statistics with comprehensive filtering',
      icon: <RecentIcon sx={{ fontSize: 40, color: 'success.main' }} />,
      stats: '12 Today',
      color: 'success',
      route: '/recent',
      features: ['Final Scores', 'Winner Indicators', 'Date Filtering', 'Team Search']
    },
    {
      title: 'Upcoming Schedule',
      description: 'Future games with notifications and timezone conversion',
      icon: <ScheduleIcon sx={{ fontSize: 40, color: 'info.main' }} />,
      stats: '8 Tomorrow',
      color: 'info',
      route: '/schedule',
      features: ['Game Notifications', 'Date Grouping', 'Timezone Display', 'Team Filtering']
    }
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
          Sports Monitoring Dashboard
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
          Real-time sports data platform - Track live games, results, and upcoming schedules
        </Typography>
        <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
          <Chip 
            icon={<TrendingIcon />} 
            label="5 Live Games Active" 
            color="success" 
            variant="filled" 
          />
          <Chip 
            label="12 Games Completed Today" 
            color="primary" 
            variant="outlined" 
          />
          <Chip 
            label="8 Games Tomorrow" 
            color="info" 
            variant="outlined" 
          />
        </Stack>
      </Box>

      <Grid container spacing={4}>
        {dashboardCards.map((card, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Card 
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4
                }
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  {card.icon}
                  <Box sx={{ ml: 2 }}>
                    <Typography variant="h5" component="h2" gutterBottom>
                      {card.title}
                    </Typography>
                    <Chip 
                      label={card.stats} 
                      color={card.color as any} 
                      size="small" 
                    />
                  </Box>
                </Box>
                
                <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                  {card.description}
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Key Features:
                </Typography>
                <Box component="ul" sx={{ pl: 2, m: 0 }}>
                  {card.features.map((feature, idx) => (
                    <Typography 
                      component="li" 
                      variant="body2" 
                      color="text.secondary" 
                      key={idx}
                      sx={{ mb: 0.5 }}
                    >
                      {feature}
                    </Typography>
                  ))}
                </Box>
              </CardContent>
              
              <CardActions>
                <Button 
                  variant="contained" 
                  color={card.color as any}
                  fullWidth
                  onClick={() => navigate(card.route)}
                  sx={{ m: 1 }}
                >
                  View {card.title}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 5, p: 3, bgcolor: 'grey.50', borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom>
          🏀 Today's Sports Overview
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          Stay up-to-date with live scores, recent results, and upcoming games across all major sports leagues.
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle2">🔴 Live Games</Typography>
            <Typography variant="body2" color="text.secondary">5 games in progress</Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle2">✅ Completed Today</Typography>
            <Typography variant="body2" color="text.secondary">12 games finished</Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle2">📅 Tomorrow's Schedule</Typography>
            <Typography variant="body2" color="text.secondary">8 games scheduled</Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle2">🏆 Top Leagues</Typography>
            <Typography variant="body2" color="text.secondary">NBA, NFL, MLB, NHL</Typography>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <MainLayout>
          <Routes>
            <Route path="/" element={<DashboardHome />} />
            <Route path="/live" element={<LiveGamesPage />} />
            <Route path="/recent" element={<RecentGamesPage />} />
            <Route path="/schedule" element={<SchedulePage />} />
            <Route path="/results" element={<RecentGamesPage />} />
            <Route path="/favorites" element={<DashboardHome />} />
            <Route path="/settings" element={
              <Container sx={{ py: 3 }}>
                <Typography variant="h4">Settings</Typography>
                <Typography variant="body1" sx={{ mt: 2 }}>Settings page coming soon...</Typography>
              </Container>
            } />
            <Route path="/about" element={
              <Container sx={{ py: 3 }}>
                <Typography variant="h4">About</Typography>
                <Typography variant="body1" sx={{ mt: 2 }}>Sports Monitoring MVP - Real-time sports data platform</Typography>
              </Container>
            } />
          </Routes>
        </MainLayout>
      </Router>
    </ThemeProvider>
  );
}

export default App;