import React from 'react';
import { Avatar, Box, Typography } from '@mui/material';
import { SportsBasketball, SportsFootball } from '@mui/icons-material';
import { teamColorService } from '@shared-services/teamColors.service';

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
  teamColors,
  size = 'medium',
  sport = 'nfl',
  showName = false,
}) => {
  const avatarSize = sizeMap[size];
  
  // Use team colors service if no colors provided
  const actualColors = teamColors || teamColorService.getTeamColors(teamName);
  
  // Generate team abbreviation from name
  const getTeamAbbr = (name: string): string => {
    const words = name.split(' ');
    if (words.length >= 2) {
      return words.slice(-1)[0].substring(0, 3).toUpperCase(); // Use last word, first 3 letters
    }
    return name.substring(0, 3).toUpperCase();
  };

  const renderSportIcon = () => {
    const iconProps = {
      sx: { 
        fontSize: avatarSize * 0.5, 
        color: actualColors.secondary 
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
          backgroundColor: actualColors.primary,
          color: teamColorService.getAccessibleTextColor(actualColors.primary),
          fontWeight: 'bold',
          fontSize: `${avatarSize * 0.25}px`,
          border: `2px solid ${actualColors.secondary}`,
          position: 'relative',
        }}
      >
        {getTeamAbbr(teamName)}
        <Box
          sx={{
            position: 'absolute',
            bottom: -2,
            right: -2,
            backgroundColor: actualColors.primary,
            borderRadius: '50%',
            width: avatarSize * 0.35,
            height: avatarSize * 0.35,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: `1px solid ${actualColors.secondary}`,
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