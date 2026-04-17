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

export interface ReportUser {
  _id: string;
  email?: string;
  fullName?: {
    first?: string;
    last?: string;
  };
}

export interface ReportItem {
  _id: string;
  reporterId?: string | ReportUser;
  targetId?: string | ReportUser;
  category?: 'Abuse' | 'Harassment' | 'FakeProfile' | 'Spam' | 'Other';
  description?: string;
  status?: 'Pending' | 'Resolved' | 'Dismissed';
  adminAction?: string;
  createdAt?: string;
}