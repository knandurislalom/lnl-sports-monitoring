import React from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Chip,
  Button,
} from '@mui/material';
import {
  History as HistoryIcon,
  CalendarToday as DateIcon,
} from '@mui/icons-material';

export const RecentGamesPage: React.FC = () => {
  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <HistoryIcon sx={{ mr: 2, fontSize: '2rem', color: 'primary.main' }} />
        <Typography variant="h4">Recent Games</Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">Ravens vs Steelers</Typography>
                <Chip label="FINAL" color="success" size="small" />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4">28</Typography>
                  <Typography variant="body2">BAL</Typography>
                </Box>
                <Typography variant="h6" sx={{ mx: 2 }}>-</Typography>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4">14</Typography>
                  <Typography variant="body2">PIT</Typography>
                </Box>
              </Box>
              <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                <DateIcon sx={{ mr: 1, fontSize: 'small' }} />
                <Typography variant="caption">Yesterday 8:20 PM</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">49ers vs Rams</Typography>
                <Chip label="FINAL" color="success" size="small" />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4">31</Typography>
                  <Typography variant="body2">SF</Typography>
                </Box>
                <Typography variant="h6" sx={{ mx: 2 }}>-</Typography>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4">20</Typography>
                  <Typography variant="body2">LAR</Typography>
                </Box>
              </Box>
              <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                <DateIcon sx={{ mr: 1, fontSize: 'small' }} />
                <Typography variant="caption">Yesterday 5:25 PM</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ mt: 3 }}>
        <Button variant="outlined">
          Load More Games
        </Button>
      </Box>
    </Container>
  );
};