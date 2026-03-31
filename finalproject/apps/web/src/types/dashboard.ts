export type StatIconType = 'users' | 'matches' | 'messages' | 'reports';

export interface StatItem {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: StatIconType;
}

export interface MatchSuccessItem {
  month: string;
  matches: number;
  reveals: number;
}

export interface UserGrowthItem {
  month: string;
  users: number;
}

export interface RecentUser {
  id: string;
  name: string;
  mbti: string;
  status: 'Active' | 'Inactive';
  joined: string;
}

export interface ReportItem {
  id: string;
  reporter: string;
  type: string;
  status: 'Pending' | 'Reviewing' | 'Resolved';
}