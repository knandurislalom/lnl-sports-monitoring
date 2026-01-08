import { Team } from '@core-types/team.types';

export const mockTeams: Record<string, Team[]> = {
  nfl: [
    {
      id: 'buf',
      name: 'Buffalo Bills',
      abbreviation: 'BUF',
      city: 'Buffalo',
      primaryColor: '#00338D',
      secondaryColor: '#C60C30',
    },
    {
      id: 'mia',
      name: 'Miami Dolphins',
      abbreviation: 'MIA',
      city: 'Miami',
      primaryColor: '#008E97',
      secondaryColor: '#FC4C02',
    },
    {
      id: 'ne',
      name: 'New England Patriots',
      abbreviation: 'NE',
      city: 'New England',
      primaryColor: '#002244',
      secondaryColor: '#C60C30',
    },
    {
      id: 'nyj',
      name: 'New York Jets',
      abbreviation: 'NYJ',
      city: 'New York',
      primaryColor: '#125740',
      secondaryColor: '#FFFFFF',
    },
    {
      id: 'bal',
      name: 'Baltimore Ravens',
      abbreviation: 'BAL',
      city: 'Baltimore',
      primaryColor: '#241773',
      secondaryColor: '#000000',
    },
    {
      id: 'cin',
      name: 'Cincinnati Bengals',
      abbreviation: 'CIN',
      city: 'Cincinnati',
      primaryColor: '#FB4F14',
      secondaryColor: '#000000',
    },
    {
      id: 'cle',
      name: 'Cleveland Browns',
      abbreviation: 'CLE',
      city: 'Cleveland',
      primaryColor: '#311D00',
      secondaryColor: '#FF3C00',
    },
    {
      id: 'pit',
      name: 'Pittsburgh Steelers',
      abbreviation: 'PIT',
      city: 'Pittsburgh',
      primaryColor: '#FFB612',
      secondaryColor: '#101820',
    },
  ],
  nba: [
    {
      id: 'lal',
      name: 'Los Angeles Lakers',
      abbreviation: 'LAL',
      city: 'Los Angeles',
      primaryColor: '#552583',
      secondaryColor: '#FDB927',
    },
    {
      id: 'gsw',
      name: 'Golden State Warriors',
      abbreviation: 'GSW',
      city: 'Golden State',
      primaryColor: '#1D428A',
      secondaryColor: '#FFC72C',
    },
    {
      id: 'bos',
      name: 'Boston Celtics',
      abbreviation: 'BOS',
      city: 'Boston',
      primaryColor: '#007A33',
      secondaryColor: '#BA9653',
    },
    {
      id: 'mia',
      name: 'Miami Heat',
      abbreviation: 'MIA',
      city: 'Miami',
      primaryColor: '#98002E',
      secondaryColor: '#F9A01B',
    },
  ],
};

export const getTeamsBySport = (sport: string): Team[] => {
  return mockTeams[sport] || [];
};

export const getTeamById = (sport: string, teamId: string): Team | undefined => {
  const teams = getTeamsBySport(sport);
  return teams.find(team => team.id === teamId);
};