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
  Schedule as ScheduleIcon,
  CalendarToday as DateIcon,
  AccessTime as TimeIcon,
} from '@mui/icons-material';

export const SchedulePage: React.FC = () => {
  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <ScheduleIcon sx={{ mr: 2, fontSize: '2rem', color: 'primary.main' }} />
        <Typography variant="h4">Upcoming Schedule</Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">Eagles vs Giants</Typography>
                <Chip label="SCHEDULED" color="info" size="small" />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6">PHI</Typography>
                  <Typography variant="body2">11-5</Typography>
                </Box>
                <Typography variant="h6" sx={{ mx: 2 }}>vs</Typography>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6">NYG</Typography>
                  <Typography variant="body2">6-10</Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <DateIcon sx={{ mr: 0.5, fontSize: 'small' }} />
                  <Typography variant="caption">Tomorrow</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TimeIcon sx={{ mr: 0.5, fontSize: 'small' }} />
                  <Typography variant="caption">1:00 PM EST</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">Bengals vs Browns</Typography>
                <Chip label="SCHEDULED" color="info" size="small" />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6">CIN</Typography>
                  <Typography variant="body2">9-7</Typography>
                </Box>
                <Typography variant="h6" sx={{ mx: 2 }}>vs</Typography>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6">CLE</Typography>
                  <Typography variant="body2">5-11</Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <DateIcon sx={{ mr: 0.5, fontSize: 'small' }} />
                  <Typography variant="caption">Sunday</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TimeIcon sx={{ mr: 0.5, fontSize: 'small' }} />
                  <Typography variant="caption">4:25 PM EST</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ mt: 3 }}>
        <Button variant="outlined">
          View Full Schedule
        </Button>
      </Box>
    </Container>
  );
};