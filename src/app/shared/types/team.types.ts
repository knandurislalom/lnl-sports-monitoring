export interface Team {
  id: string;
  name: string;
  abbreviation: string;
  city: string;
  logo?: string;
  primaryColor?: string;
  secondaryColor?: string;
}

export interface TeamRecord {
  wins: number;
  losses: number;
  ties?: number;
  percentage: number;
}