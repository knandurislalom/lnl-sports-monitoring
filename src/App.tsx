import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from '@core-config/theme.config';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h1>Sports Monitoring MVP</h1>
        <p>Welcome to the Sports Monitoring Platform</p>
        <p>🏈 🏀 ⚾ 🏒</p>
      </div>
    </ThemeProvider>
  );
}

export default App;