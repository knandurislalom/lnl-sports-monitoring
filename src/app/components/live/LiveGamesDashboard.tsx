import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Alert,
  Chip,
  Switch,
  FormControlLabel,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tabs,
  Tab,
  Badge,
  Collapse,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { PerformanceMonitorWrapper } from '../performance/PerformanceMonitor';
import { usePerformanceMonitor } from '../../hooks/usePerformance';
import {
  Sports as LiveIcon,
  Refresh as RefreshIcon,
  Settings as SettingsIcon,
  Visibility as WatchIcon,
  Timeline as StatsIcon,
  Notifications as AlertsIcon,
  PlayArrow as StartIcon,
  Stop as StopIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';
import { LiveGameCard } from './LiveGameCard';
import { LiveScoreTicker } from './LiveScoreTicker';
import { useLiveGames } from '../../hooks/useLiveGames';
import { useResponsive, useResponsiveGrid, useResponsiveTypography, useResponsiveSpacing } from '../../hooks/useResponsive';
import { Game, GameStatus } from '../../shared/types/game.types';
import { LoadingSpinner, TeamListSkeleton } from '../layout/LoadingStates';

// ===== LIVE GAMES DASHBOARD COMPONENT =====

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => (
  <div role="tabpanel" hidden={value !== index}>
    {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
  </div>
);

const LiveGamesDashboard: React.FC = () => {
  const theme = useTheme();
  const { isMobile, isTablet } = useResponsive();
  const { getOptimalColumns } = useResponsiveGrid();
  const { getHeadingVariant, getButtonSize } = useResponsiveTypography();
  const { getContainerSpacing, getCardSpacing, getSectionSpacing } = useResponsiveSpacing();
  const performanceMetrics = usePerformanceMonitor('LiveGamesDashboard');
  
  const [tabValue, setTabValue] = useState(0);
  const [watchedGames, setWatchedGames] = useState<Set<string>>(new Set());
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [cardVariant, setCardVariant] = useState<'default' | 'compact' | 'detailed'>(
    isMobile ? 'compact' : 'default'
  );
  const [showTicker, setShowTicker] = useState(!isMobile);
  const [notifications, setNotifications] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  const {
    games,
    liveGames,
    isConnected,
    isLoading,
    error,
    startTracking,
    stopTracking,
    refreshGames,
    updateInterval,
    setUpdateInterval,
  } = useLiveGames({
    autoStart: true,
    onGameUpdate: (updatedGames) => {
      // Handle game updates (could trigger notifications here)
      console.log('Games updated:', updatedGames.length);
    },
    onError: (error) => {
      console.error('Live games error:', error);
    },
  });

  // Performance monitoring in development
  if (process.env.NODE_ENV === 'development' && performanceMetrics.isSlowRender) {
    console.warn(`LiveGamesDashboard slow render: ${performanceMetrics.lastRenderTime.toFixed(2)}ms`);
  }

  const handleGameClick = (game: Game) => {
    setSelectedGame(game);
    setTabValue(3); // Switch to game details tab
  };

  const handleWatchToggle = (gameId: string, isWatching: boolean) => {
    setWatchedGames(prev => {
      const newSet = new Set(prev);
      if (isWatching) {
        newSet.add(gameId);
      } else {
        newSet.delete(gameId);
      }
      return newSet;
    });
  };

  const handleRefresh = async () => {
    refreshGames();
  };

  const handleStartStop = () => {
    if (isConnected) {
      stopTracking();
    } else {
      startTracking();
    }
  };

  // Filter games by status
  const scheduledGames = games.filter(game => game.status === GameStatus.SCHEDULED);
  const finalGames = games.filter(game => game.status === GameStatus.FINAL);
  const watchedGamesList = games.filter(game => watchedGames.has(game.id));

  // Connection status indicator
  const getConnectionStatus = () => {
    if (isLoading) return { color: 'warning', text: 'Connecting...' };
    if (error) return { color: 'error', text: 'Connection Error' };
    if (isConnected) return { color: 'success', text: 'Live' };
    return { color: 'default', text: 'Disconnected' };
  };

  const connectionStatus = getConnectionStatus();

  return (
    <PerformanceMonitorWrapper componentName="LiveGamesDashboard">
      <Box sx={{ p: getContainerSpacing(), maxWidth: 1400, mx: 'auto' }}>
        {/* Header */}
        <Box sx={{ mb: getSectionSpacing() }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: isMobile ? 'flex-start' : 'center',
            flexDirection: isMobile ? 'column' : 'row',
            gap: isMobile ? 2 : 0,
            mb: 2 
        }}>
          <Typography variant={getHeadingVariant(4)} gutterBottom>
            Live Games Dashboard
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: isMobile ? 1 : 2, flexWrap: isMobile ? 'wrap' : 'nowrap' }}>
            <Chip
              icon={<LiveIcon />}
              label={connectionStatus.text}
              color={connectionStatus.color as any}
              variant={isConnected ? 'filled' : 'outlined'}
              size={isMobile ? 'small' : 'medium'}
            />
            
            {isMobile && (
              <IconButton
                onClick={() => setShowSettings(!showSettings)}
                size="small"
              >
                {showSettings ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            )}
            
            <Button
              variant="outlined"
              size={getButtonSize()}
              startIcon={isConnected ? <StopIcon /> : <StartIcon />}
              onClick={handleStartStop}
              color={isConnected ? 'error' : 'primary'}
            >
              {isMobile ? (isConnected ? 'Stop' : 'Start') : `${isConnected ? 'Stop' : 'Start'} Tracking`}
            </Button>
            
            <Button
              variant="outlined"
              startIcon={isLoading ? <LoadingSpinner size={16} /> : <RefreshIcon />}
              onClick={handleRefresh}
              disabled={isLoading || !isConnected}
            >
              Refresh
            </Button>
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
            <Button size={getButtonSize()} onClick={startTracking} sx={{ ml: 1 }}>
              Retry Connection
            </Button>
          </Alert>
        )}

        <Typography variant="body1" color="text.secondary">
          Real-time tracking of NFL games with live scores, statistics, and game updates.
        </Typography>
      </Box>

      {/* Live Score Ticker */}
      {showTicker && liveGames.length > 0 && (
        <Box sx={{ mb: getSectionSpacing() }}>
          <Typography variant={getHeadingVariant(6)} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LiveIcon color="primary" fontSize={isMobile ? 'small' : 'medium'} />
            {isMobile ? 'Live Scores' : 'Live Score Ticker'}
          </Typography>
          <LiveScoreTicker
            maxGames={isMobile ? 4 : 8}
            onGameClick={handleGameClick}
            showControls={!isMobile}
            variant={isMobile ? 'compact' : 'default'}
          />
        </Box>
      )}

      {/* Settings Panel */}
      <Collapse in={!isMobile || showSettings}>
        <Card sx={{ mb: getSectionSpacing() }}>
          <CardContent>
            <Typography variant={getHeadingVariant(6)} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SettingsIcon fontSize={isMobile ? 'small' : 'medium'} />
              Dashboard Settings
            </Typography>
            
            <Grid container spacing={getCardSpacing()} alignItems="center">
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size={isMobile ? 'small' : 'medium'}>
                  <InputLabel>Card Style</InputLabel>
                  <Select
                    value={cardVariant}
                    label="Card Style"
                    onChange={(e) => setCardVariant(e.target.value as any)}
                  >
                    <MenuItem value="default">Default</MenuItem>
                    <MenuItem value="compact">Compact</MenuItem>
                    <MenuItem value="detailed">Detailed</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size={isMobile ? 'small' : 'medium'}>
                <InputLabel>Update Interval</InputLabel>
                <Select
                  value={updateInterval}
                  label="Update Interval"
                  onChange={(e) => setUpdateInterval(Number(e.target.value))}
                >
                  <MenuItem value={1000}>1 second</MenuItem>
                  <MenuItem value={3000}>3 seconds</MenuItem>
                  <MenuItem value={5000}>5 seconds</MenuItem>
                  <MenuItem value={10000}>10 seconds</MenuItem>
                  <MenuItem value={30000}>30 seconds</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {!isMobile && (
              <>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={showTicker}
                        onChange={(e) => setShowTicker(e.target.checked)}
                        size={isMobile ? 'small' : 'medium'}
                      />
                    }
                    label="Show Score Ticker"
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notifications}
                        onChange={(e) => setNotifications(e.target.checked)}
                        size={isMobile ? 'small' : 'medium'}
                      />
                    }
                    label="Score Notifications"
                  />
                </Grid>
              </>
            )}
          </Grid>
        </CardContent>
      </Card>
      </Collapse>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: getCardSpacing() }}>
        <Tabs 
          value={tabValue} 
          onChange={(_, newValue) => setTabValue(newValue)}
          variant={isMobile ? 'scrollable' : isTablet ? 'fullWidth' : 'standard'}
          scrollButtons={isMobile ? 'auto' : false}
          allowScrollButtonsMobile={isMobile}
        >
          <Tab 
            label={
              <Badge badgeContent={liveGames.length} color="error" showZero>
                {isMobile ? 'Live' : 'Live Games'}
              </Badge>
            } 
          />
          <Tab label={isMobile ? `Scheduled (${scheduledGames.length})` : `Scheduled (${scheduledGames.length})`} />
          <Tab label={isMobile ? `Final (${finalGames.length})` : `Final (${finalGames.length})`} />
          <Tab 
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <WatchIcon fontSize="small" />
                {isMobile ? `Watch (${watchedGamesList.length})` : `Watching (${watchedGamesList.length})`}
              </Box>
            } 
          />
          <Tab label={isMobile ? 'Details' : 'Game Details'} disabled={!selectedGame} />
        </Tabs>
      </Box>

      {/* Live Games Tab */}
      <TabPanel value={tabValue} index={0}>
        {isLoading ? (
          <TeamListSkeleton items={6} />
        ) : liveGames.length > 0 ? (
          <Grid container spacing={getCardSpacing()}>
            {liveGames.map((game) => {
              const gridProps = getOptimalColumns();
              return (
                <Grid item {...gridProps} key={game.id}>
                  <LiveGameCard
                    game={game}
                    variant={cardVariant}
                    showStats={!isMobile}
                    showProgress={true}
                    onClick={handleGameClick}
                    onWatch={handleWatchToggle}
                    isWatching={watchedGames.has(game.id)}
                  />
                </Grid>
              );
            })}
          </Grid>
        ) : (
          <Box sx={{ textAlign: 'center', py: 8, color: 'text.secondary' }}>
            <LiveIcon sx={{ fontSize: 64, mb: 2, opacity: 0.5 }} />
            <Typography variant="h6">No Live Games</Typography>
            <Typography variant="body2">
              {isConnected 
                ? 'There are no games currently in progress.' 
                : 'Start tracking to see live games.'
              }
            </Typography>
            {!isConnected && (
              <Button 
                variant="contained" 
                startIcon={<StartIcon />}
                onClick={startTracking}
                sx={{ mt: 2 }}
              >
                Start Live Tracking
              </Button>
            )}
          </Box>
        )}
      </TabPanel>

      {/* Scheduled Games Tab */}
      <TabPanel value={tabValue} index={1}>
        {isLoading ? (
          <TeamListSkeleton items={6} />
        ) : scheduledGames.length > 0 ? (
          <Grid container spacing={3}>
            {scheduledGames.map((game) => (
              <Grid item xs={12} md={6} lg={4} key={game.id}>
                <LiveGameCard
                  game={game}
                  variant={cardVariant}
                  showStats={false}
                  showProgress={false}
                  onClick={handleGameClick}
                  onWatch={handleWatchToggle}
                  isWatching={watchedGames.has(game.id)}
                />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box sx={{ textAlign: 'center', py: 8, color: 'text.secondary' }}>
            <Typography variant="h6">No Scheduled Games</Typography>
            <Typography variant="body2">
              Check back later for upcoming games.
            </Typography>
          </Box>
        )}
      </TabPanel>

      {/* Final Games Tab */}
      <TabPanel value={tabValue} index={2}>
        {isLoading ? (
          <TeamListSkeleton items={6} />
        ) : finalGames.length > 0 ? (
          <Grid container spacing={3}>
            {finalGames.map((game) => (
              <Grid item xs={12} md={6} lg={4} key={game.id}>
                <LiveGameCard
                  game={game}
                  variant={cardVariant}
                  showStats={true}
                  showProgress={false}
                  onClick={handleGameClick}
                />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box sx={{ textAlign: 'center', py: 8, color: 'text.secondary' }}>
            <Typography variant="h6">No Final Games</Typography>
            <Typography variant="body2">
              Completed games will appear here.
            </Typography>
          </Box>
        )}
      </TabPanel>

      {/* Watching Tab */}
      <TabPanel value={tabValue} index={3}>
        {watchedGamesList.length > 0 ? (
          <Grid container spacing={3}>
            {watchedGamesList.map((game) => (
              <Grid item xs={12} md={6} lg={4} key={game.id}>
                <LiveGameCard
                  game={game}
                  variant={cardVariant}
                  showStats={true}
                  showProgress={game.status === GameStatus.LIVE}
                  onClick={handleGameClick}
                  onWatch={handleWatchToggle}
                  isWatching={true}
                />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box sx={{ textAlign: 'center', py: 8, color: 'text.secondary' }}>
            <WatchIcon sx={{ fontSize: 64, mb: 2, opacity: 0.5 }} />
            <Typography variant="h6">No Games Being Watched</Typography>
            <Typography variant="body2">
              Click the watch icon on any game card to add it to your watchlist.
            </Typography>
          </Box>
        )}
      </TabPanel>

      {/* Game Details Tab */}
      <TabPanel value={tabValue} index={4}>
        {selectedGame ? (
          <Box>
            <Button
              variant="outlined"
              onClick={() => setSelectedGame(null)}
              sx={{ mb: 3 }}
            >
              ← Back to Games
            </Button>
            <LiveGameCard
              game={selectedGame}
              variant="detailed"
              showStats={true}
              showProgress={true}
              onWatch={handleWatchToggle}
              isWatching={watchedGames.has(selectedGame.id)}
            />
          </Box>
        ) : (
          <Box sx={{ textAlign: 'center', py: 8, color: 'text.secondary' }}>
            <StatsIcon sx={{ fontSize: 64, mb: 2, opacity: 0.5 }} />
            <Typography variant="h6">No Game Selected</Typography>
            <Typography variant="body2">
              Click on a game card to view detailed information.
            </Typography>
          </Box>
        )}
      </TabPanel>
      </Box>
    </PerformanceMonitorWrapper>
  );
};

export default LiveGamesDashboard;