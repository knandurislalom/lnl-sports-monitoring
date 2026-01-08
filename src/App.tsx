import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '@core-config/theme.config';
import { MainLayout } from '@app-main/components/layout';
import { Dashboard } from '@pages-Dashboard';
import '@core-config/../styles/design-system.css';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <MainLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/live" element={<Dashboard />} />
            <Route path="/schedule" element={<Dashboard />} />
            <Route path="/results" element={<Dashboard />} />
            <Route path="/favorites" element={<Dashboard />} />
            {/* Placeholder routes - will be implemented later */}
            <Route path="/settings" element={<div>Settings Page - Coming Soon</div>} />
            <Route path="/about" element={<div>About Page - Coming Soon</div>} />
          </Routes>
        </MainLayout>
      </Router>
    </ThemeProvider>
  );
}

export default App;