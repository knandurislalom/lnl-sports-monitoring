# Tech Rules - Sports Monitoring MVP

## Overview
This document defines the technical architecture, coding standards, file structure, and development guidelines for building the Sports Monitoring MVP platform.

---

## Technology Stack

### Core Technologies
- **Framework:** React 18.x
- **Language:** TypeScript 5.x (strict mode)
- **UI Library:** Material-UI (MUI) v5.x
- **State Management:** React Context API + useReducer (or Redux Toolkit if complexity grows)
- **Routing:** React Router v6.x
- **HTTP Client:** Axios
- **Build Tool:** Vite
- **Package Manager:** npm or yarn

### Authentication
- **Type:** Token-based authentication (JWT)
- **Storage:** localStorage for access token, httpOnly cookie for refresh token (if implemented)
- **Flow:** 
  - User logs in → receives JWT access token
  - Token included in Authorization header for API requests
  - Token refresh mechanism for expired tokens

### Development Tools
- **Linting:** ESLint with TypeScript support
- **Formatting:** Prettier
- **Testing:** Jest + React Testing Library
- **Git Hooks:** Husky + lint-staged

---

## Project Structure

### Root Directory Structure
```
sports-monitoring-mvp/
├── public/
│   ├── index.html
│   └── assets/
├── src/
│   ├── app/
│   │   ├── core/          # @core-*
│   │   ├── main/          # @app-main/*
│   │   ├── pages/         # @pages-*
│   │   └── shared/        # @shared-*
│   ├── App.tsx
│   ├── main.tsx
│   └── vite-env.d.ts
├── .env.example
├── .eslintrc.json
├── .prettierrc
├── tsconfig.json
├── vite.config.ts
└── package.json
```

---

## File Structure Patterns

### 1. Core Module (`src/app/core/`) - `@core-*`

**Purpose:** Contains core application functionality, configuration, and infrastructure code that is fundamental to the app's operation.

**Structure:**
```
src/app/core/
├── api/
│   ├── client.ts              # Axios instance configuration
│   ├── interceptors.ts        # Request/response interceptors
│   └── endpoints.ts           # API endpoint constants
├── auth/
│   ├── AuthContext.tsx        # Authentication context provider
│   ├── AuthGuard.tsx          # Protected route wrapper
│   ├── authService.ts         # Authentication business logic
│   └── tokenManager.ts        # Token storage and retrieval
├── config/
│   ├── app.config.ts          # App-wide configuration
│   ├── api.config.ts          # API configuration (base URLs, timeouts)
│   └── theme.config.ts        # MUI theme configuration
├── hooks/
│   ├── useAuth.ts             # Authentication hook
│   └── useApi.ts              # Generic API call hook
├── types/
│   ├── auth.types.ts          # Authentication type definitions
│   ├── api.types.ts           # API response type definitions
│   └── common.types.ts        # Common/shared type definitions
└── utils/
    ├── storage.utils.ts       # localStorage/sessionStorage utilities
    ├── date.utils.ts          # Date formatting and manipulation
    └── validation.utils.ts    # Input validation utilities
```

**Naming Convention:**
- Import alias: `@core-*` 
- Example: `import { apiClient } from '@core-api/client';`

**Rules:**
- All files must be TypeScript (`.ts` or `.tsx`)
- No React components except Context Providers and Guards
- Pure functions and utilities only
- Must be framework-agnostic where possible (easy to extract/test)
- No direct imports from `@pages-*` or `@app-main/*`

---

### 2. Main Module (`src/app/main/`) - `@app-main/*`

**Purpose:** Contains the main application shell, layout components, navigation, and top-level routing.

**Structure:**
```
src/app/main/
├── layouts/
│   ├── MainLayout/
│   │   ├── MainLayout.tsx
│   │   ├── MainLayout.styles.ts
│   │   └── index.ts
│   ├── AuthLayout/
│   │   ├── AuthLayout.tsx
│   │   ├── AuthLayout.styles.ts
│   │   └── index.ts
│   └── components/
│       ├── Header/
│       │   ├── Header.tsx
│       │   ├── Header.styles.ts
│       │   └── index.ts
│       ├── Footer/
│       │   ├── Footer.tsx
│       │   ├── Footer.styles.ts
│       │   └── index.ts
│       └── Sidebar/
│           ├── Sidebar.tsx
│           ├── Sidebar.styles.ts
│           └── index.ts
├── navigation/
│   ├── AppRouter.tsx          # Main router configuration
│   ├── routes.config.ts       # Route definitions and paths
│   └── PrivateRoute.tsx       # Protected route wrapper
└── App.tsx                    # Root app component (optional, can be in src/)
```

**Naming Convention:**
- Import alias: `@app-main/*`
- Example: `import { MainLayout } from '@app-main/layouts/MainLayout';`

**Rules:**
- Layout components should be reusable and composition-based
- Each layout/component folder should have:
  - Main component file (`.tsx`)
  - Styles file (`.styles.ts`) using MUI's `styled` or `sx` prop
  - Barrel export (`index.ts`)
- No business logic in layout components
- Can import from `@core-*` and `@shared-*`
- Should NOT import from `@pages-*` (use component composition instead)

---

### 3. Pages Module (`src/app/pages/`) - `@pages-*`

**Purpose:** Contains all page-level components corresponding to routes in the application.

**Structure:**
```
src/app/pages/
├── LiveGames/
│   ├── LiveGames.tsx
│   ├── LiveGames.styles.ts
│   ├── LiveGames.types.ts
│   ├── useLiveGames.ts        # Custom hook for page logic
│   ├── components/
│   │   ├── GameCard/
│   │   │   ├── GameCard.tsx
│   │   │   ├── GameCard.styles.ts
│   │   │   ├── GameCard.types.ts
│   │   │   └── index.ts
│   │   └── GameStatusBadge/
│   │       ├── GameStatusBadge.tsx
│   │       ├── GameStatusBadge.styles.ts
│   │       └── index.ts
│   ├── services/
│   │   └── liveGames.service.ts
│   └── index.ts
├── RecentGames/
│   ├── RecentGames.tsx
│   ├── RecentGames.styles.ts
│   ├── RecentGames.types.ts
│   ├── useRecentGames.ts
│   ├── components/
│   │   ├── GameSummaryCard/
│   │   └── StatsTable/
│   ├── services/
│   │   └── recentGames.service.ts
│   └── index.ts
├── UpcomingSchedule/
│   ├── UpcomingSchedule.tsx
│   ├── UpcomingSchedule.styles.ts
│   ├── UpcomingSchedule.types.ts
│   ├── useUpcomingSchedule.ts
│   ├── components/
│   │   ├── ScheduleCard/
│   │   ├── DateFilter/
│   │   └── BroadcastInfo/
│   ├── services/
│   │   └── schedule.service.ts
│   └── index.ts
├── Login/
│   ├── Login.tsx
│   ├── Login.styles.ts
│   ├── useLogin.ts
│   └── index.ts
└── NotFound/
    ├── NotFound.tsx
    └── index.ts
```

**Naming Convention:**
- Import alias: `@pages-*`
- Example: `import { LiveGames } from '@pages-LiveGames';`

**Rules:**
- Each page should be in its own folder with PascalCase naming
- Page-specific components go in `components/` subfolder
- Page-specific services go in `services/` subfolder
- Use custom hooks (e.g., `useLiveGames.ts`) to separate business logic from UI
- Types specific to the page go in `.types.ts` file
- Can import from `@core-*`, `@shared-*`, and `@app-main/*` (layouts only)
- Should NOT import from other pages (use `@shared-*` for cross-page components)
- Each page folder must have `index.ts` barrel export

---

### 4. Shared Module (`src/app/shared/`) - `@shared-*`

**Purpose:** Contains reusable components, hooks, types, and utilities used across multiple pages or features.

**Structure:**
```
src/app/shared/
├── components/
│   ├── LoadingSpinner/
│   │   ├── LoadingSpinner.tsx
│   │   ├── LoadingSpinner.styles.ts
│   │   └── index.ts
│   ├── ErrorBoundary/
│   │   ├── ErrorBoundary.tsx
│   │   └── index.ts
│   ├── EmptyState/
│   │   ├── EmptyState.tsx
│   │   ├── EmptyState.types.ts
│   │   └── index.ts
│   ├── TeamLogo/
│   │   ├── TeamLogo.tsx
│   │   ├── TeamLogo.types.ts
│   │   └── index.ts
│   └── ScoreDisplay/
│       ├── ScoreDisplay.tsx
│       ├── ScoreDisplay.types.ts
│       └── index.ts
├── hooks/
│   ├── useDebounce.ts
│   ├── useLocalStorage.ts
│   ├── useInfiniteScroll.ts
│   └── usePrevious.ts
├── types/
│   ├── game.types.ts          # Game-related type definitions
│   ├── team.types.ts          # Team-related type definitions
│   ├── league.types.ts        # League-related type definitions
│   └── index.ts               # Barrel export for all types
├── constants/
│   ├── routes.constants.ts
│   ├── leagues.constants.ts
│   └── sports.constants.ts
├── services/
│   ├── sports-api/
│   │   ├── games.api.ts
│   │   ├── teams.api.ts
│   │   └── leagues.api.ts
│   └── analytics/
│       └── tracking.service.ts
└── utils/
    ├── format.utils.ts        # Formatting utilities (scores, times)
    ├── filter.utils.ts        # Data filtering utilities
    └── transform.utils.ts     # Data transformation utilities
```

**Naming Convention:**
- Import alias: `@shared-*`
- Example: `import { LoadingSpinner } from '@shared-components/LoadingSpinner';`

**Rules:**
- Only truly reusable components belong here
- Components must be generic and configurable via props
- No page-specific logic or hardcoded data
- Each component/hook should be in its own folder with barrel export
- Must have TypeScript types defined
- Can import from `@core-*`
- Should NOT import from `@pages-*` or `@app-main/*`
- Utilities should be pure functions with no side effects

---

## Import Alias Configuration

**TypeScript Configuration (`tsconfig.json`):**
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@core-*": ["src/app/core/*"],
      "@app-main/*": ["src/app/main/*"],
      "@pages-*": ["src/app/pages/*"],
      "@shared-*": ["src/app/shared/*"]
    }
  }
}
```

**Vite Configuration (`vite.config.ts`):**
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@core-api': path.resolve(__dirname, './src/app/core/api'),
      '@core-auth': path.resolve(__dirname, './src/app/core/auth'),
      '@core-config': path.resolve(__dirname, './src/app/core/config'),
      '@core-hooks': path.resolve(__dirname, './src/app/core/hooks'),
      '@core-types': path.resolve(__dirname, './src/app/core/types'),
      '@core-utils': path.resolve(__dirname, './src/app/core/utils'),
      '@app-main': path.resolve(__dirname, './src/app/main'),
      '@pages-LiveGames': path.resolve(__dirname, './src/app/pages/LiveGames'),
      '@pages-RecentGames': path.resolve(__dirname, './src/app/pages/RecentGames'),
      '@pages-UpcomingSchedule': path.resolve(__dirname, './src/app/pages/UpcomingSchedule'),
      '@pages-Login': path.resolve(__dirname, './src/app/pages/Login'),
      '@shared-components': path.resolve(__dirname, './src/app/shared/components'),
      '@shared-hooks': path.resolve(__dirname, './src/app/shared/hooks'),
      '@shared-types': path.resolve(__dirname, './src/app/shared/types'),
      '@shared-constants': path.resolve(__dirname, './src/app/shared/constants'),
      '@shared-services': path.resolve(__dirname, './src/app/shared/services'),
      '@shared-utils': path.resolve(__dirname, './src/app/shared/utils'),
    },
  },
});
```

---

## Coding Standards

### TypeScript Guidelines

**1. Type Definitions**
```typescript
// ✅ GOOD - Explicit types
interface Game {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  status: GameStatus;
  startTime: Date;
}

type GameStatus = 'scheduled' | 'live' | 'final' | 'postponed';

// ❌ BAD - Using 'any'
const fetchGames = (): any => { ... }

// ✅ GOOD - Proper return type
const fetchGames = (): Promise<Game[]> => { ... }
```

**2. Interface vs Type**
- Use `interface` for object shapes that may be extended
- Use `type` for unions, intersections, and primitives
- Use `enum` sparingly (prefer union types)

```typescript
// ✅ GOOD
interface BaseGame {
  id: string;
  status: GameStatus;
}

interface LiveGame extends BaseGame {
  currentPeriod: number;
  timeRemaining: string;
}

type GameStatus = 'scheduled' | 'live' | 'final';

// ❌ BAD
enum GameStatus {
  SCHEDULED = 'scheduled',
  LIVE = 'live',
  FINAL = 'final',
}
```

**3. Strict Mode**
- Always use TypeScript strict mode
- No implicit `any`
- Null checks required
- Strict function types

---

### React Component Guidelines

**1. Component Structure**
```typescript
// ✅ GOOD - Functional component with proper typing
import React from 'react';
import { Box, Typography } from '@mui/material';
import type { GameCardProps } from './GameCard.types';

export const GameCard: React.FC<GameCardProps> = ({ game, onClick }) => {
  // Hooks at the top
  const [isHovered, setIsHovered] = React.useState(false);
  
  // Event handlers
  const handleClick = () => {
    onClick?.(game.id);
  };
  
  // Early returns for conditional rendering
  if (!game) {
    return null;
  }
  
  // Main render
  return (
    <Box 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      <Typography variant="h6">{game.homeTeam.name}</Typography>
      <Typography variant="h6">{game.awayTeam.name}</Typography>
    </Box>
  );
};
```

**2. Props Naming**
- Use descriptive prop names
- Boolean props should start with `is`, `has`, `should`, `can`
- Event handler props should start with `on`

```typescript
// ✅ GOOD
interface GameCardProps {
  game: Game;
  isHighlighted?: boolean;
  showDetails?: boolean;
  onGameClick?: (gameId: string) => void;
  onFavoriteToggle?: (gameId: string) => void;
}

// ❌ BAD
interface GameCardProps {
  game: Game;
  highlighted?: boolean;  // Missing 'is' prefix
  details?: boolean;       // Unclear meaning
  click?: Function;        // Should use 'on' prefix and proper type
}
```

**3. Component File Organization**
```typescript
// 1. Imports - external libraries first, then internal
import React from 'react';
import { Box, Card } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { GameCard } from '@shared-components/GameCard';
import { useAuth } from '@core-hooks/useAuth';
import type { GameCardProps } from './GameCard.types';

// 2. Constants (if any)
const MAX_GAMES_PER_PAGE = 10;

// 3. Types (if not in separate .types.ts file)

// 4. Helper functions (internal to this component)
const formatScore = (score: number): string => {
  return score.toString().padStart(2, '0');
};

// 5. Main component
export const GameCard: React.FC<GameCardProps> = (props) => {
  // Component logic
};

// 6. Exports
export default GameCard;
```

---

### Custom Hooks Guidelines

**1. Hook Naming**
- Always start with `use`
- Name should describe what it does

```typescript
// ✅ GOOD
export const useAuth = () => { ... }
export const useLiveGames = () => { ... }
export const useDebounce = <T>(value: T, delay: number) => { ... }

// ❌ BAD
export const authHook = () => { ... }
export const getLiveGames = () => { ... }
```

**2. Hook Structure**
```typescript
import { useState, useEffect } from 'react';
import type { Game } from '@shared-types';

export const useLiveGames = () => {
  // State
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Effects
  useEffect(() => {
    fetchLiveGames();
  }, []);
  
  // Functions
  const fetchLiveGames = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/games/live');
      const data = await response.json();
      setGames(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };
  
  const refetch = () => {
    fetchLiveGames();
  };
  
  // Return object
  return {
    games,
    loading,
    error,
    refetch,
  };
};
```

---

### MUI Styling Guidelines

**1. Styling Approaches (in order of preference)**

**Option A: `sx` prop (preferred for simple, one-off styles)**
```typescript
<Box 
  sx={{ 
    display: 'flex',
    gap: 2,
    p: 3,
    bgcolor: 'background.paper',
    '&:hover': {
      bgcolor: 'action.hover',
    },
  }}
>
  Content
</Box>
```

**Option B: `styled` API (for reusable styled components)**
```typescript
// GameCard.styles.ts
import { styled } from '@mui/material/styles';
import { Card } from '@mui/material';

export const StyledGameCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
  transition: theme.transitions.create(['box-shadow', 'transform']),
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[8],
  },
}));
```

**Option C: Theme customization (for global styles)**
```typescript
// theme.config.ts
import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
  },
});
```

**2. Responsive Design**
```typescript
// Use theme breakpoints
<Box 
  sx={{
    display: 'flex',
    flexDirection: { xs: 'column', md: 'row' },
    gap: { xs: 1, sm: 2, md: 3 },
    p: { xs: 2, sm: 3, md: 4 },
  }}
>
  Content
</Box>
```

**3. Theme Access**
```typescript
import { useTheme } from '@mui/material/styles';

const MyComponent = () => {
  const theme = useTheme();
  
  return (
    <Box sx={{ color: theme.palette.primary.main }}>
      Content
    </Box>
  );
};
```

---

### Authentication Implementation

**1. Token Management**
```typescript
// @core-auth/tokenManager.ts
const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

export const tokenManager = {
  getToken: (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
  },
  
  setToken: (token: string): void => {
    localStorage.setItem(TOKEN_KEY, token);
  },
  
  removeToken: (): void => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },
  
  getRefreshToken: (): string | null => {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },
  
  setRefreshToken: (token: string): void => {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  },
};
```

**2. Axios Interceptors**
```typescript
// @core-api/interceptors.ts
import axios from 'axios';
import { tokenManager } from '@core-auth/tokenManager';

export const setupInterceptors = () => {
  // Request interceptor - add token to headers
  axios.interceptors.request.use(
    (config) => {
      const token = tokenManager.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
  
  // Response interceptor - handle 401 errors
  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        
        try {
          const refreshToken = tokenManager.getRefreshToken();
          const { data } = await axios.post('/api/auth/refresh', {
            refreshToken,
          });
          
          tokenManager.setToken(data.accessToken);
          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
          
          return axios(originalRequest);
        } catch (refreshError) {
          tokenManager.removeToken();
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }
      
      return Promise.reject(error);
    }
  );
};
```

**3. Auth Context**
```typescript
// @core-auth/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { tokenManager } from './tokenManager';
import type { User, AuthContextType } from '@core-types/auth.types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Check if user is already logged in
    const token = tokenManager.getToken();
    if (token) {
      // Fetch user data or validate token
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);
  
  const fetchUser = async () => {
    try {
      // Fetch user data from API
      const response = await fetch('/api/auth/me', {
        headers: {
          Authorization: `Bearer ${tokenManager.getToken()}`,
        },
      });
      const userData = await response.json();
      setUser(userData);
    } catch (error) {
      console.error('Failed to fetch user:', error);
      tokenManager.removeToken();
    } finally {
      setLoading(false);
    }
  };
  
  const login = async (email: string, password: string) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    
    if (!response.ok) {
      throw new Error('Login failed');
    }
    
    const { accessToken, refreshToken, user } = await response.json();
    tokenManager.setToken(accessToken);
    tokenManager.setRefreshToken(refreshToken);
    setUser(user);
  };
  
  const logout = () => {
    tokenManager.removeToken();
    setUser(null);
  };
  
  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
```

**4. Protected Routes**
```typescript
// @app-main/navigation/PrivateRoute.tsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@core-hooks/useAuth';
import { LoadingSpinner } from '@shared-components/LoadingSpinner';

export const PrivateRoute: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};
```

---

## API Integration Guidelines

**1. API Service Structure**
```typescript
// @shared-services/sports-api/games.api.ts
import { apiClient } from '@core-api/client';
import type { Game, GameFilters } from '@shared-types/game.types';

export const gamesApi = {
  getLiveGames: async (): Promise<Game[]> => {
    const { data } = await apiClient.get<Game[]>('/games/live');
    return data;
  },
  
  getRecentGames: async (filters?: GameFilters): Promise<Game[]> => {
    const { data } = await apiClient.get<Game[]>('/games/recent', {
      params: filters,
    });
    return data;
  },
  
  getUpcomingGames: async (days: number = 7): Promise<Game[]> => {
    const { data } = await apiClient.get<Game[]>('/games/upcoming', {
      params: { days },
    });
    return data;
  },
  
  getGameDetails: async (gameId: string): Promise<Game> => {
    const { data } = await apiClient.get<Game>(`/games/${gameId}`);
    return data;
  },
};
```

**2. Error Handling**
```typescript
// @shared-hooks/useApiQuery.ts
import { useState, useEffect } from 'react';

interface UseApiQueryResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

export const useApiQuery = <T>(
  queryFn: () => Promise<T>,
  dependencies: any[] = []
): UseApiQueryResult<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await queryFn();
      setData(result);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchData();
  }, dependencies);
  
  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
};
```

---

## Testing Guidelines

**1. Component Testing**
```typescript
// GameCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { GameCard } from './GameCard';
import type { Game } from '@shared-types/game.types';

const mockGame: Game = {
  id: '1',
  homeTeam: { id: 'LAL', name: 'Lakers' },
  awayTeam: { id: 'GSW', name: 'Warriors' },
  status: 'live',
  homeScore: 95,
  awayScore: 92,
};

describe('GameCard', () => {
  it('renders game information correctly', () => {
    render(<GameCard game={mockGame} />);
    
    expect(screen.getByText('Lakers')).toBeInTheDocument();
    expect(screen.getByText('Warriors')).toBeInTheDocument();
    expect(screen.getByText('95')).toBeInTheDocument();
    expect(screen.getByText('92')).toBeInTheDocument();
  });
  
  it('calls onGameClick when clicked', () => {
    const handleClick = jest.fn();
    render(<GameCard game={mockGame} onGameClick={handleClick} />);
    
    fireEvent.click(screen.getByRole('button'));
    
    expect(handleClick).toHaveBeenCalledWith('1');
  });
});
```

**2. Hook Testing**
```typescript
// useLiveGames.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { useLiveGames } from './useLiveGames';

describe('useLiveGames', () => {
  it('fetches live games on mount', async () => {
    const { result } = renderHook(() => useLiveGames());
    
    expect(result.current.loading).toBe(true);
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    expect(result.current.games).toHaveLength(5);
    expect(result.current.error).toBeNull();
  });
});
```

---

## Performance Guidelines

**1. Code Splitting**
```typescript
// Lazy load pages
import { lazy, Suspense } from 'react';
import { LoadingSpinner } from '@shared-components/LoadingSpinner';

const LiveGames = lazy(() => import('@pages-LiveGames'));
const RecentGames = lazy(() => import('@pages-RecentGames'));

const App = () => (
  <Suspense fallback={<LoadingSpinner />}>
    <Routes>
      <Route path="/live" element={<LiveGames />} />
      <Route path="/recent" element={<RecentGames />} />
    </Routes>
  </Suspense>
);
```

**2. Memoization**
```typescript
import React, { useMemo, useCallback } from 'react';

const GameList: React.FC<{ games: Game[] }> = ({ games }) => {
  // Memoize expensive computations
  const sortedGames = useMemo(() => {
    return [...games].sort((a, b) => 
      new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    );
  }, [games]);
  
  // Memoize callback functions
  const handleGameClick = useCallback((gameId: string) => {
    console.log('Game clicked:', gameId);
  }, []);
  
  return (
    <>
      {sortedGames.map(game => (
        <GameCard key={game.id} game={game} onGameClick={handleGameClick} />
      ))}
    </>
  );
};

// Memoize component to prevent unnecessary re-renders
export default React.memo(GameList);
```

**3. Virtual Scrolling (for large lists)**
```typescript
import { FixedSizeList } from 'react-window';

const VirtualGameList: React.FC<{ games: Game[] }> = ({ games }) => {
  const Row = ({ index, style }: any) => (
    <div style={style}>
      <GameCard game={games[index]} />
    </div>
  );
  
  return (
    <FixedSizeList
      height={600}
      itemCount={games.length}
      itemSize={120}
      width="100%"
    >
      {Row}
    </FixedSizeList>
  );
};
```

---

## Git Workflow

**1. Branch Naming**
- `feature/description` - New features
- `bugfix/description` - Bug fixes
- `hotfix/description` - Critical production fixes
- `refactor/description` - Code refactoring

**2. Commit Messages**
```
<type>(<scope>): <subject>

<body>

<footer>
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

Example:
```
feat(live-games): add auto-refresh functionality

- Implement polling mechanism to update scores every 30 seconds
- Add loading indicator during refresh
- Handle error states gracefully

Closes #123
```

**3. Pull Request Guidelines**
- Link related issues
- Describe changes clearly
- Include screenshots for UI changes
- Ensure all tests pass
- Get at least one approval before merging

---

## Environment Variables

**`.env.example`**
```bash
# API Configuration
VITE_API_BASE_URL=https://api.sports-monitoring.com
VITE_API_TIMEOUT=10000

# Authentication
VITE_AUTH_TOKEN_KEY=auth_token
VITE_AUTH_REFRESH_KEY=refresh_token

# Feature Flags
VITE_ENABLE_LIVE_UPDATES=true
VITE_ENABLE_PUSH_NOTIFICATIONS=false

# Analytics
VITE_ANALYTICS_ID=UA-XXXXXXXXX-X
```

**Usage:**
```typescript
// @core-config/api.config.ts
export const apiConfig = {
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: parseInt(import.meta.env.VITE_API_TIMEOUT, 10),
};
```

---

## Documentation Requirements

Every module should include:
1. **README.md** - Overview and usage instructions
2. **JSDoc comments** - For public functions and complex logic
3. **Type definitions** - Comprehensive TypeScript types
4. **Examples** - Sample usage in comments

**Example:**
```typescript
/**
 * Fetches live games from the API
 * 
 * @returns Promise resolving to array of live games
 * @throws {ApiError} When the API request fails
 * 
 * @example
 * ```typescript
 * const games = await getLiveGames();
 * console.log(games.length); // 5
 * ```
 */
export const getLiveGames = async (): Promise<Game[]> => {
  // Implementation
};
```

---

## Checklist for New Features

Before submitting a PR, ensure:

- [ ] TypeScript types are defined
- [ ] Component is responsive (mobile, tablet, desktop)
- [ ] Loading and error states are handled
- [ ] Unit tests are written and passing
- [ ] Code follows style guidelines (ESLint + Prettier)
- [ ] No console.log statements in production code
- [ ] Documentation is updated
- [ ] Accessibility considerations (ARIA labels, keyboard navigation)
- [ ] Performance optimized (memoization, lazy loading if needed)
- [ ] Import aliases are used correctly

---

## Additional Resources

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [MUI Documentation](https://mui.com/)
- [React Router Documentation](https://reactrouter.com/)
- [Testing Library Documentation](https://testing-library.com/react)

---

**Document Version:** 1.0  
**Last Updated:** January 6, 2026
