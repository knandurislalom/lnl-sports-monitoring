import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Chip,
  Button,
  Tab,
  Tabs,
  Alert,
} from '@mui/material';
import {
  Sports as LiveIcon,
  Refresh as RefreshIcon,
  Timeline as StatsIcon,
} from '@mui/icons-material';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = ({ children, value, index }: TabPanelProps) => (
  <div role="tabpanel" hidden={value !== index}>
    {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
  </div>
);

export const LiveGamesDashboard: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <LiveIcon sx={{ mr: 2, fontSize: '2rem', color: 'primary.main' }} />
        <Typography variant="h4">Live Games</Typography>
        <Chip 
          label="LIVE" 
          color="error" 
          size="small" 
          sx={{ ml: 2, animation: 'pulse 2s infinite' }} 
        />
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Active Games" />
          <Tab label="Game Stats" />
          <Tab label="Score Ticker" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6">Chiefs vs Bills</Typography>
                  <Chip label="Q3 - 8:42" color="primary" size="small" />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4">21</Typography>
                    <Typography variant="body2">KC</Typography>
                  </Box>
                  <Typography variant="h6" sx={{ mx: 2 }}>vs</Typography>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4">17</Typography>
                    <Typography variant="body2">BUF</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6">Cowboys vs Packers</Typography>
                  <Chip label="Q2 - 3:15" color="primary" size="small" />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4">14</Typography>
                    <Typography variant="body2">DAL</Typography>
                  </Box>
                  <Typography variant="h6" sx={{ mx: 2 }}>vs</Typography>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4">10</Typography>
                    <Typography variant="body2">GB</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2">
            Real-time game statistics will be displayed here
          </Typography>
        </Alert>
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <StatsIcon sx={{ fontSize: '4rem', color: 'text.secondary' }} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Game Statistics Coming Soon
          </Typography>
        </Box>
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2">
            Live score ticker with real-time updates
          </Typography>
        </Alert>
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <LiveIcon sx={{ fontSize: '4rem', color: 'text.secondary' }} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Score Ticker Coming Soon
          </Typography>
        </Box>
      </TabPanel>

      <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
        <Button 
          variant="contained" 
          startIcon={<RefreshIcon />}
          onClick={() => console.log('Refreshing...')}
        >
          Refresh Games
        </Button>
      </Box>
    </Container>
  );
};