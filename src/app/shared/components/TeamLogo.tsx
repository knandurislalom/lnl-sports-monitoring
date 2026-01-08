import React from 'react';
import { Avatar, Box, Typography } from '@mui/material';
import { SportsBasketball, SportsFootball } from '@mui/icons-material';

interface TeamLogoProps {
  teamId: string;
  teamName: string;
  teamColors?: {
    primary: string;
    secondary: string;
  };
  size?: 'small' | 'medium' | 'large';
  sport?: 'nfl' | 'nba';
  showName?: boolean;
}

const sizeMap = {
  small: 32,
  medium: 48,
  large: 64,
};

export const TeamLogo: React.FC<TeamLogoProps> = ({
  teamId,
  teamName,
  teamColors = { primary: '#1976d2', secondary: '#ffffff' },
  size = 'medium',
  sport = 'nfl',
  showName = false,
}) => {
  const avatarSize = sizeMap[size];
  
  // Generate team abbreviation from name
  const getTeamAbbr = (name: string): string => {
    const words = name.split(' ');
    if (words.length >= 2) {
      return words.slice(-2).map(word => word[0]).join('').toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const renderSportIcon = () => {
    const iconProps = {
      sx: { 
        fontSize: avatarSize * 0.6, 
        color: teamColors.secondary 
      }
    };
    
    return sport === 'nba' ? 
      <SportsBasketball {...iconProps} /> : 
      <SportsFootball {...iconProps} />;
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: showName ? 1 : 0,
      }}
    >
      <Avatar
        sx={{
          width: avatarSize,
          height: avatarSize,
          backgroundColor: teamColors.primary,
          color: teamColors.secondary,
          fontWeight: 'bold',
          fontSize: `${avatarSize * 0.25}px`,
          border: `2px solid ${teamColors.secondary}`,
          position: 'relative',
        }}
      >
        {getTeamAbbr(teamName)}
        <Box
          sx={{
            position: 'absolute',
            bottom: -2,
            right: -2,
            backgroundColor: teamColors.primary,
            borderRadius: '50%',
            width: avatarSize * 0.4,
            height: avatarSize * 0.4,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: `1px solid ${teamColors.secondary}`,
          }}
        >
          {renderSportIcon()}
        </Box>
      </Avatar>
      
      {showName && (
        <Typography
          variant={size === 'large' ? 'body1' : 'body2'}
          fontWeight="medium"
          color="text.primary"
        >
          {teamName}
        </Typography>
      )}
    </Box>
  );
};