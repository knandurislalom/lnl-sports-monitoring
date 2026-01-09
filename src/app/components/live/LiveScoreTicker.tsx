import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Card,
  CardContent,
  Switch,
  FormControlLabel,
  Tooltip,
  Fade,
  useTheme,
} from '@mui/material';
import {
  ChevronLeft as PrevIcon,
  ChevronRight as NextIcon,
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { LiveGameCard } from './LiveGameCard';
import { useLiveScoreTicker } from '../../hooks/useLiveGames';
import { Game } from '../../shared/types/game.types';

// ===== LIVE SCORE TICKER COMPONENT =====

interface LiveScoreTickerProps {
  maxGames?: number;
  autoAdvanceInterval?: number;
  onGameClick?: (game: Game) => void;
  showControls?: boolean;
  height?: number | string;
}

export const LiveScoreTicker: React.FC<LiveScoreTickerProps> = ({
  maxGames = 8,
  autoAdvanceInterval = 4000,
  onGameClick,
  showControls = true,
  height = 120,
}) => {
  const theme = useTheme();
  const {
    tickerGames,
    currentIndex,
    nextGame,
    previousGame,
    goToGame,
    autoAdvance,
    setAutoAdvance,
  } = useLiveScoreTicker({ maxGames });

  const tickerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  // Manual pause/resume
  const handleToggleAutoAdvance = () => {
    setAutoAdvance(!autoAdvance);
    setIsPaused(!autoAdvance);
  };

  // Pause on hover
  const handleMouseEnter = () => {
    if (autoAdvance) {
      setIsPaused(true);
    }
  };

  const handleMouseLeave = () => {
    if (autoAdvance) {
      setIsPaused(false);
    }
  };

  // Handle game click
  const handleGameClick = (game: Game) => {
    if (onGameClick) {
      onGameClick(game);
    }
  };

  if (tickerGames.length === 0) {
    return (
      <Card sx={{ height }}>
        <CardContent sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          height: '100%',
          color: 'text.secondary'
        }}>
          <Typography variant="body2">No live games available</Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      sx={{ 
        height,
        position: 'relative',
        overflow: 'hidden',
        background: `linear-gradient(135deg, ${theme.palette.primary.main}10, ${theme.palette.secondary.main}10)`,
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Header with Controls */}
      {showControls && (
        <Box
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            zIndex: 2,
            display: 'flex',
            gap: 1,
            backgroundColor: 'background.paper',
            borderRadius: 2,
            p: 0.5,
            boxShadow: 1,
          }}
        >
          <Tooltip title="Previous Game">
            <IconButton 
              size="small" 
              onClick={previousGame}
              disabled={tickerGames.length <= 1}
            >
              <PrevIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          
          <Tooltip title={autoAdvance ? 'Pause Auto-Advance' : 'Resume Auto-Advance'}>
            <IconButton 
              size="small" 
              onClick={handleToggleAutoAdvance}
              color={autoAdvance ? 'primary' : 'default'}
            >
              {autoAdvance ? <PauseIcon fontSize="small" /> : <PlayIcon fontSize="small" />}
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Next Game">
            <IconButton 
              size="small" 
              onClick={nextGame}
              disabled={tickerGames.length <= 1}
            >
              <NextIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      )}

      {/* Ticker Content */}
      <CardContent 
        ref={tickerRef}
        sx={{ 
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          p: 2,
        }}
      >
        {/* Game Cards */}
        <Box
          sx={{
            display: 'flex',
            transition: 'transform 0.5s ease-in-out',
            transform: `translateX(-${currentIndex * 100}%)`,
            width: `${tickerGames.length * 100}%`,
          }}
        >
          {tickerGames.map((game, index) => (
            <Box
              key={game.id}
              sx={{
                width: `${100 / tickerGames.length}%`,
                px: 1,
                flexShrink: 0,
              }}
            >
              <Fade in={true} timeout={500}>
                <Box>
                  <LiveGameCard
                    game={game}
                    variant="ticker"
                    onClick={handleGameClick}
                    showStats={false}
                    showProgress={true}
                  />
                </Box>
              </Fade>
            </Box>
          ))}
        </Box>
      </CardContent>

      {/* Game Indicators */}
      {tickerGames.length > 1 && (
        <Box
          sx={{
            position: 'absolute',
            bottom: 8,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: 0.5,
            backgroundColor: 'background.paper',
            borderRadius: 2,
            p: 0.5,
            boxShadow: 1,
          }}
        >
          {tickerGames.map((_, index) => (
            <Box
              key={index}
              onClick={() => goToGame(index)}
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: index === currentIndex 
                  ? theme.palette.primary.main 
                  : theme.palette.grey[400],
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.2)',
                },
              }}
            />
          ))}
        </Box>
      )}

      {/* Pause Indicator */}
      {isPaused && autoAdvance && (
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            borderRadius: 2,
            p: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            zIndex: 3,
          }}
        >
          <PauseIcon fontSize="small" />
          <Typography variant="caption">Paused</Typography>
        </Box>
      )}
    </Card>
  );
};

export default LiveScoreTicker;