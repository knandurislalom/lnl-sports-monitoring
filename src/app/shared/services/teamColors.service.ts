// NFL Team Colors Service - Design System Implementation
import { TeamColors } from '@core-types/team.types';

interface NFLTeamColors {
  primary: string;
  secondary: string;
}

export const nflTeams: Record<string, NFLTeamColors> = {
  // AFC East
  bills: { primary: '#00338D', secondary: '#C60C30' },
  dolphins: { primary: '#008E97', secondary: '#FC4C02' },
  patriots: { primary: '#002244', secondary: '#C60C30' },
  jets: { primary: '#125740', secondary: '#FFFFFF' },
  
  // AFC North  
  ravens: { primary: '#241773', secondary: '#000000' },
  bengals: { primary: '#FB4F14', secondary: '#000000' },
  browns: { primary: '#311D00', secondary: '#FF3C00' },
  steelers: { primary: '#FFB612', secondary: '#101820' },
  
  // AFC South
  texans: { primary: '#03202F', secondary: '#A71930' },
  colts: { primary: '#002C5F', secondary: '#A2AAAD' },
  jaguars: { primary: '#006778', secondary: '#9F792C' },
  titans: { primary: '#0C2340', secondary: '#4B92DB' },
  
  // AFC West
  broncos: { primary: '#FB4F14', secondary: '#002244' },
  chiefs: { primary: '#E31837', secondary: '#FFB81C' },
  raiders: { primary: '#000000', secondary: '#A5ACAF' },
  chargers: { primary: '#0080C6', secondary: '#FFC20E' },
  
  // NFC East
  cowboys: { primary: '#041E42', secondary: '#869397' },
  giants: { primary: '#0B2265', secondary: '#A71930' },
  eagles: { primary: '#004C54', secondary: '#A5ACAF' },
  commanders: { primary: '#5A1414', secondary: '#FFB612' },
  
  // NFC North
  bears: { primary: '#0B162A', secondary: '#C83803' },
  lions: { primary: '#0076B6', secondary: '#B0B7BC' },
  packers: { primary: '#203731', secondary: '#FFB612' },
  vikings: { primary: '#4F2683', secondary: '#FFC62F' },
  
  // NFC South
  falcons: { primary: '#A71930', secondary: '#000000' },
  panthers: { primary: '#0085CA', secondary: '#101820' },
  saints: { primary: '#D3BC8D', secondary: '#101820' },
  buccaneers: { primary: '#D50A0A', secondary: '#FF7900' },
  
  // NFC West
  cardinals: { primary: '#97233F', secondary: '#000000' },
  rams: { primary: '#003594', secondary: '#FFA300' },
  '49ers': { primary: '#AA0000', secondary: '#B3995D' },
  seahawks: { primary: '#002244', secondary: '#69BE28' },
  
  // Default NBA teams (for cross-sport support)
  lakers: { primary: '#552583', secondary: '#FDB927' },
  warriors: { primary: '#1D428A', secondary: '#FFC72C' },
  celtics: { primary: '#007A33', secondary: '#BA9653' },
  bulls: { primary: '#CE1141', secondary: '#000000' },
  heat: { primary: '#98002E', secondary: '#F9A01B' },
  spurs: { primary: '#C4CED4', secondary: '#000000' },
  nets: { primary: '#000000', secondary: '#FFFFFF' },
  knicks: { primary: '#006BB6', secondary: '#F58426' },
};

// Calculate luminance for contrast ratio
const getLuminance = (hex: string): number => {
  const rgb = parseInt(hex.slice(1), 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >> 8) & 0xff;
  const b = (rgb >> 0) & 0xff;
  
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
};

export const teamColorService = {
  /**
   * Get team colors by team abbreviation
   */
  getTeamColors: (teamAbbr: string): NFLTeamColors => {
    const normalized = teamAbbr.toLowerCase().replace(/\s+/g, '');
    return nflTeams[normalized] || {
      primary: '#013369',   // Fallback to NFL blue
      secondary: '#A5ACAF', // Fallback to NFL silver
    };
  },
  
  /**
   * Calculate contrast ratio between two colors (WCAG standard)
   */
  getContrastRatio: (color1: string, color2: string): number => {
    const lum1 = getLuminance(color1);
    const lum2 = getLuminance(color2);
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    return (brightest + 0.05) / (darkest + 0.05);
  },
  
  /**
   * Get accessible text color for a given background
   */
  getAccessibleTextColor: (backgroundColor: string): string => {
    const contrastWithWhite = teamColorService.getContrastRatio(backgroundColor, '#FFFFFF');
    const contrastWithDark = teamColorService.getContrastRatio(backgroundColor, '#0A0E27');
    
    return contrastWithWhite >= 4.5 ? '#FFFFFF' : '#0A0E27';
  },
  
  /**
   * Ensure team color meets accessibility standards
   */
  getAccessibleTeamColor: (teamColor: string, background: string = '#0A0E27'): string => {
    const contrast = teamColorService.getContrastRatio(teamColor, background);
    
    if (contrast < 3.0) {
      return '#013369'; // Fallback to accessible NFL blue
    }
    
    return teamColor;
  },
  
  /**
   * Get team colors with opacity for subtle backgrounds
   */
  getTeamColorsWithAlpha: (teamAbbr: string, alpha: number = 0.1): { primary: string; secondary: string } => {
    const colors = teamColorService.getTeamColors(teamAbbr);
    const hexToRgba = (hex: string, alpha: number): string => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };
    
    return {
      primary: hexToRgba(colors.primary, alpha),
      secondary: hexToRgba(colors.secondary, alpha),
    };
  },
  
  /**
   * Get status colors following NFL design system
   */
  getStatusColors: () => ({
    live: '#D50A0A',         // NFL red for live games
    scheduled: '#A5ACAF',    // NFL silver for upcoming
    final: '#6B7280',        // Muted gray for completed
    postponed: '#F59E0B',    // Warning amber for postponed
    halftime: '#013369',     // NFL blue for intermission
    overtime: '#D50A0A',     // NFL red for overtime (urgent)
  }),
  
  /**
   * Check if a team abbreviation exists in our database
   */
  isValidTeam: (teamAbbr: string): boolean => {
    const normalized = teamAbbr.toLowerCase().replace(/\s+/g, '');
    return normalized in nflTeams;
  },
  
  /**
   * Get all available team abbreviations
   */
  getAllTeams: (): string[] => {
    return Object.keys(nflTeams);
  },
};