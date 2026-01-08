import React from 'react';
import { Box, Typography, Chip } from '@mui/material';
import { formatScore } from '@shared-utils/game.utils';

interface ScoreDisplayProps {
  homeTeam: {
    name: string;
    score?: number;
    isWinner?: boolean;
  };
  awayTeam: {
    name: string;
    score?: number;
    isWinner?: boolean;
  };
  status: 'scheduled' | 'live' | 'completed';
  gameTime?: string;
  period?: string;
  size?: 'compact' | 'normal' | 'large';
}

export const ScoreDisplay: React.FC<ScoreDisplayProps> = ({
  homeTeam,
  awayTeam,
  status,
  gameTime,
  period,
  size = 'normal',
}) => {
  const isCompact = size === 'compact';
  const isLarge = size === 'large';

  const getStatusColor = () => {
    switch (status) {
      case 'live':
        return 'success';
      case 'completed':
        return 'default';
      case 'scheduled':
        return 'info';
      default:
        return 'default';
    }
  };

  const getStatusText = () => {
    if (status === 'live' && period) {
      return period;
    }
    if (status === 'scheduled' && gameTime) {
      return gameTime;
    }
    if (status === 'completed') {
      return 'Final';
    }
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const scoreVariant = isLarge ? 'h4' : isCompact ? 'body1' : 'h6';
  const teamVariant = isLarge ? 'h6' : isCompact ? 'body2' : 'body1';

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: isCompact ? 0.5 : 1,
        minWidth: isCompact ? 120 : isLarge ? 200 : 160,
      }}
    >
      {/* Status/Time */}
      <Chip
        label={getStatusText()}
        color={getStatusColor() as any}
        size={isCompact ? 'small' : 'medium'}
        variant={status === 'live' ? 'filled' : 'outlined'}
        sx={{
          fontSize: isCompact ? '0.7rem' : '0.8rem',
          fontWeight: status === 'live' ? 'bold' : 'medium',
        }}
      />

      {/* Scores */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          gap: 1,
        }}
      >
        {/* Away Team */}
        <Box sx={{ flex: 1, textAlign: 'right' }}>
          <Typography
            variant={teamVariant}
            fontWeight={awayTeam.isWinner ? 'bold' : 'medium'}
            color={awayTeam.isWinner ? 'primary' : 'text.primary'}
            noWrap
          >
            {awayTeam.name}
          </Typography>
          {(status === 'live' || status === 'completed') && (
            <Typography
              variant={scoreVariant}
              fontWeight="bold"
              color={awayTeam.isWinner ? 'primary' : 'text.primary'}
            >
              {formatScore(awayTeam.score || 0)}
            </Typography>
          )}
        </Box>

        {/* VS or Dash */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mx: 1, fontWeight: 'bold' }}
        >
          {status === 'scheduled' ? 'vs' : '—'}
        </Typography>

        {/* Home Team */}
        <Box sx={{ flex: 1, textAlign: 'left' }}>
          <Typography
            variant={teamVariant}
            fontWeight={homeTeam.isWinner ? 'bold' : 'medium'}
            color={homeTeam.isWinner ? 'primary' : 'text.primary'}
            noWrap
          >
            {homeTeam.name}
          </Typography>
          {(status === 'live' || status === 'completed') && (
            <Typography
              variant={scoreVariant}
              fontWeight="bold"
              color={homeTeam.isWinner ? 'primary' : 'text.primary'}
            >
              {formatScore(homeTeam.score || 0)}
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};