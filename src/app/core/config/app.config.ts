export const appConfig = {
  app: {
    name: 'Sports Monitoring MVP',
    version: '1.0.0',
    description: 'Real-time sports scores and schedules',
  },
  features: {
    autoRefresh: true,
    refreshInterval: 30000, // 30 seconds
    maxGamesPerPage: 50,
    defaultSport: 'nfl',
    supportedSports: ['nfl', 'nba', 'mlb', 'nhl'],
  },
  ui: {
    defaultTheme: 'light',
    compactMode: false,
    showAnimations: true,
  },
} as const;