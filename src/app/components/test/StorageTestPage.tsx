import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  TextField,
  Switch,
  FormControlLabel,
  Divider,
  Chip,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
  Refresh as RefreshIcon,
  Clear as ClearIcon,
  Storage as StorageIcon,
} from '@mui/icons-material';
import {
  localStorageService,
  getUserPreferences,
  saveUserPreferences,
  getFavoriteTeams,
  addFavoriteTeam,
  removeFavoriteTeam,
  getFilterSettings,
  saveFilterSettings,
  getRecentSearches,
  addRecentSearch,
  clearRecentSearches,
  gameDataCache,
  apiCache,
  cacheGameData,
  getCachedGameData,
  exportUserData,
  importUserData,
  cleanupExpiredData,
  getStorageStats,
  getStorageUsage,
  UserPreferences,
} from '../core/utils/storage.utils';

const StorageTestPage: React.FC = () => {
  const [preferences, setPreferences] = useState<UserPreferences>(getUserPreferences());
  const [favoriteTeams, setFavoriteTeams] = useState<string[]>(getFavoriteTeams());
  const [recentSearches, setRecentSearches] = useState<string[]>(getRecentSearches());
  const [newTeam, setNewTeam] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [testData, setTestData] = useState('');
  const [cacheKey, setCacheKey] = useState('');
  const [storageStats, setStorageStats] = useState<any>(null);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [exportData, setExportData] = useState('');
  const [importData, setImportData] = useState('');
  const [alerts, setAlerts] = useState<Array<{ type: 'success' | 'error' | 'info'; message: string }>>([]);

  useEffect(() => {
    refreshStats();
  }, []);

  const showAlert = (type: 'success' | 'error' | 'info', message: string) => {
    setAlerts(prev => [...prev, { type, message }]);
    setTimeout(() => {
      setAlerts(prev => prev.slice(1));
    }, 5000);
  };

  const refreshStats = () => {
    const stats = getStorageStats();
    setStorageStats(stats);
  };

  const handlePreferenceChange = (key: keyof UserPreferences, value: any) => {
    const newPrefs = { ...preferences, [key]: value };
    setPreferences(newPrefs);
    if (saveUserPreferences(newPrefs)) {
      showAlert('success', `Updated ${key} preference`);
    } else {
      showAlert('error', `Failed to update ${key} preference`);
    }
  };

  const handleNestedPreferenceChange = (parent: string, key: string, value: any) => {
    const newPrefs = {
      ...preferences,
      [parent]: {
        ...(preferences as any)[parent],
        [key]: value,
      },
    };
    setPreferences(newPrefs);
    if (saveUserPreferences(newPrefs)) {
      showAlert('success', `Updated ${parent}.${key} preference`);
    } else {
      showAlert('error', `Failed to update ${parent}.${key} preference`);
    }
  };

  const handleAddFavoriteTeam = () => {
    if (newTeam.trim()) {
      if (addFavoriteTeam(newTeam.trim())) {
        setFavoriteTeams(getFavoriteTeams());
        setNewTeam('');
        showAlert('success', `Added ${newTeam} to favorites`);
      } else {
        showAlert('error', 'Failed to add favorite team');
      }
    }
  };

  const handleRemoveFavoriteTeam = (teamId: string) => {
    if (removeFavoriteTeam(teamId)) {
      setFavoriteTeams(getFavoriteTeams());
      showAlert('success', `Removed ${teamId} from favorites`);
    } else {
      showAlert('error', 'Failed to remove favorite team');
    }
  };

  const handleAddSearch = () => {
    if (searchQuery.trim()) {
      if (addRecentSearch(searchQuery.trim())) {
        setRecentSearches(getRecentSearches());
        setSearchQuery('');
        showAlert('success', `Added "${searchQuery}" to recent searches`);
      } else {
        showAlert('error', 'Failed to add search');
      }
    }
  };

  const handleClearSearches = () => {
    if (clearRecentSearches()) {
      setRecentSearches([]);
      showAlert('success', 'Cleared recent searches');
    } else {
      showAlert('error', 'Failed to clear searches');
    }
  };

  const handleCacheData = () => {
    if (cacheKey.trim() && testData.trim()) {
      try {
        const data = JSON.parse(testData);
        cacheGameData(cacheKey.trim(), data);
        showAlert('success', `Cached data for key: ${cacheKey}`);
        refreshStats();
      } catch (error) {
        showAlert('error', 'Invalid JSON data');
      }
    }
  };

  const handleGetCachedData = () => {
    if (cacheKey.trim()) {
      const data = getCachedGameData(cacheKey.trim());
      if (data) {
        setTestData(JSON.stringify(data, null, 2));
        showAlert('success', `Retrieved cached data for key: ${cacheKey}`);
      } else {
        showAlert('error', `No cached data found for key: ${cacheKey}`);
      }
    }
  };

  const handleExportData = () => {
    const data = exportUserData();
    setExportData(JSON.stringify(data, null, 2));
    setShowExportDialog(true);
  };

  const handleImportData = () => {
    try {
      const data = JSON.parse(importData);
      if (importUserData(data)) {
        setPreferences(getUserPreferences());
        setFavoriteTeams(getFavoriteTeams());
        setRecentSearches(getRecentSearches());
        showAlert('success', 'Successfully imported user data');
        refreshStats();
      } else {
        showAlert('error', 'Failed to import user data');
      }
    } catch (error) {
      showAlert('error', 'Invalid JSON format');
    }
  };

  const handleCleanup = () => {
    const cleaned = cleanupExpiredData();
    showAlert('success', `Cleaned up ${cleaned} expired items`);
    refreshStats();
  };

  const handleClearAllData = () => {
    if (window.confirm('Are you sure you want to clear all storage data?')) {
      localStorageService.clear();
      gameDataCache.clear();
      apiCache.clear();
      
      // Reset states
      setPreferences(getUserPreferences());
      setFavoriteTeams(getFavoriteTeams());
      setRecentSearches(getRecentSearches());
      
      showAlert('success', 'Cleared all storage data');
      refreshStats();
    }
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        <StorageIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
        Storage Utilities Test Page
      </Typography>

      {/* Alert Messages */}
      {alerts.map((alert, index) => (
        <Alert key={index} severity={alert.type} sx={{ mb: 2 }}>
          {alert.message}
        </Alert>
      ))}

      <Grid container spacing={3}>
        {/* Storage Statistics */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Storage Statistics</Typography>
                <Button startIcon={<RefreshIcon />} onClick={refreshStats}>
                  Refresh
                </Button>
              </Box>
              {storageStats && (
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <Typography variant="subtitle2">Usage</Typography>
                    <Typography>Used: {formatBytes(storageStats.usage.used)}</Typography>
                    <Typography>Available: {formatBytes(storageStats.usage.available)}</Typography>
                    <Typography>Percentage: {storageStats.usage.percentage.toFixed(1)}%</Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="subtitle2">Items</Typography>
                    <Typography>Total Items: {storageStats.stats.totalItems}</Typography>
                    <Typography>Hit Count: {storageStats.stats.hitCount}</Typography>
                    <Typography>Miss Count: {storageStats.stats.missCount}</Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="subtitle2">Cache Info</Typography>
                    <Typography>Game Cache: {storageStats.cacheInfo.gameCache} items</Typography>
                    <Typography>API Cache: {storageStats.cacheInfo.apiCache} items</Typography>
                    <Typography>Image Cache: {storageStats.cacheInfo.imageCache} items</Typography>
                  </Grid>
                </Grid>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* User Preferences */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>User Preferences</Typography>
              
              <TextField
                fullWidth
                label="Default Sport"
                value={preferences.defaultSport}
                onChange={(e) => handlePreferenceChange('defaultSport', e.target.value)}
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="Refresh Interval (seconds)"
                type="number"
                value={preferences.refreshInterval}
                onChange={(e) => handlePreferenceChange('refreshInterval', parseInt(e.target.value))}
                sx={{ mb: 2 }}
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={preferences.compactMode}
                    onChange={(e) => handlePreferenceChange('compactMode', e.target.checked)}
                  />
                }
                label="Compact Mode"
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={preferences.autoRefresh}
                    onChange={(e) => handlePreferenceChange('autoRefresh', e.target.checked)}
                  />
                }
                label="Auto Refresh"
              />

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle2" gutterBottom>Display Settings</Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={preferences.displaySettings.showLogos}
                    onChange={(e) => handleNestedPreferenceChange('displaySettings', 'showLogos', e.target.checked)}
                  />
                }
                label="Show Logos"
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={preferences.displaySettings.showRecords}
                    onChange={(e) => handleNestedPreferenceChange('displaySettings', 'showRecords', e.target.checked)}
                  />
                }
                label="Show Records"
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Favorite Teams */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Favorite Teams</Typography>
              
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <TextField
                  fullWidth
                  label="Add Team"
                  value={newTeam}
                  onChange={(e) => setNewTeam(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddFavoriteTeam()}
                />
                <Button variant="contained" onClick={handleAddFavoriteTeam}>
                  Add
                </Button>
              </Box>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {favoriteTeams.map((team) => (
                  <Chip
                    key={team}
                    label={team}
                    onDelete={() => handleRemoveFavoriteTeam(team)}
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Searches */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Recent Searches</Typography>
                <Button startIcon={<ClearIcon />} onClick={handleClearSearches} size="small">
                  Clear All
                </Button>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <TextField
                  fullWidth
                  label="Search Query"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddSearch()}
                />
                <Button variant="contained" onClick={handleAddSearch}>
                  Add
                </Button>
              </Box>

              <List dense>
                {recentSearches.map((search, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={search} />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Cache Testing */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Cache Testing</Typography>
              
              <TextField
                fullWidth
                label="Cache Key"
                value={cacheKey}
                onChange={(e) => setCacheKey(e.target.value)}
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="Test Data (JSON)"
                value={testData}
                onChange={(e) => setTestData(e.target.value)}
                multiline
                rows={4}
                sx={{ mb: 2 }}
              />

              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button variant="contained" onClick={handleCacheData}>
                  Cache Data
                </Button>
                <Button variant="outlined" onClick={handleGetCachedData}>
                  Get Cached
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Data Export/Import */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Data Management</Typography>
              
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <Button
                  startIcon={<DownloadIcon />}
                  variant="contained"
                  onClick={handleExportData}
                >
                  Export Data
                </Button>
                <Button
                  startIcon={<UploadIcon />}
                  variant="outlined"
                  onClick={handleImportData}
                  disabled={!importData.trim()}
                >
                  Import Data
                </Button>
                <Button
                  startIcon={<RefreshIcon />}
                  variant="outlined"
                  onClick={handleCleanup}
                >
                  Cleanup Expired
                </Button>
                <Button
                  startIcon={<DeleteIcon />}
                  variant="outlined"
                  color="error"
                  onClick={handleClearAllData}
                >
                  Clear All Data
                </Button>
              </Box>

              <TextField
                fullWidth
                label="Import Data (JSON)"
                value={importData}
                onChange={(e) => setImportData(e.target.value)}
                multiline
                rows={6}
                placeholder="Paste exported JSON data here..."
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Export Dialog */}
      <Dialog open={showExportDialog} onClose={() => setShowExportDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Export Data</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={15}
            value={exportData}
            variant="outlined"
            InputProps={{
              readOnly: true,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowExportDialog(false)}>Close</Button>
          <Button
            onClick={() => {
              navigator.clipboard.writeText(exportData);
              showAlert('success', 'Copied to clipboard');
            }}
            variant="contained"
          >
            Copy to Clipboard
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StorageTestPage;