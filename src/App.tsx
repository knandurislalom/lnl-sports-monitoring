import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { Box, Container, Typography, Card, CardContent, Grid, Chip } from '@mui/material';
import { theme } from './app/core/config/theme.config';
import { MainLayout } from './app/main/layouts/MainLayout';
import { LiveGamesPage } from './app/pages/LiveGamesPage';
import { RecentGamesPage } from './app/pages/RecentGamesPage';
import { SchedulePage } from './app/pages/SchedulePage';
import './app/core/styles/design-system.css';

// Temporary Dashboard Component
const DashboardHome = () => (
  <Container maxWidth="xl" sx={{ py: 3 }}>
    <Typography variant="h4" gutterBottom>
      Sports Monitoring Dashboard
    </Typography>
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h6">Live Games</Typography>
            <Typography variant="body2" color="text.secondary">
              Real-time game monitoring
            </Typography>
            <Chip label="5 Active" color="primary" size="small" sx={{ mt: 1 }} />
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h6">Recent Results</Typography>
            <Typography variant="body2" color="text.secondary">
              Game results and statistics
            </Typography>
            <Chip label="12 Today" color="success" size="small" sx={{ mt: 1 }} />
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h6">Upcoming Schedule</Typography>
            <Typography variant="body2" color="text.secondary">
              Future games and predictions
            </Typography>
            <Chip label="8 Tomorrow" color="info" size="small" sx={{ mt: 1 }} />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  </Container>
);

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