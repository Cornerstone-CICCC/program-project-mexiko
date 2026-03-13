import type {
    MatchSuccessItem,
    RecentUser,
    ReportItem,
    StatItem,
    UserGrowthItem,
  } from '../types/dashboard';
  
  export const stats: StatItem[] = [
    {
      title: 'Total Users',
      value: '12,847',
      change: '+12.5%',
      trend: 'up',
      icon: 'users',
    },
    {
      title: 'Active Matches',
      value: '3,421',
      change: '+8.2%',
      trend: 'up',
      icon: 'matches',
    },
    {
      title: 'Messages Today',
      value: '28,459',
      change: '+15.3%',
      trend: 'up',
      icon: 'messages',
    },
    {
      title: 'Reports Pending',
      value: '12',
      change: '-5.1%',
      trend: 'down',
      icon: 'reports',
    },
  ];
  
  export const matchSuccessData: MatchSuccessItem[] = [
    { month: 'Aug', matches: 420, reveals: 300 },
    { month: 'Sep', matches: 580, reveals: 450 },
    { month: 'Oct', matches: 710, reveals: 580 },
    { month: 'Nov', matches: 880, reveals: 700 },
    { month: 'Dec', matches: 1010, reveals: 840 },
    { month: 'Jan', matches: 1150, reveals: 980 },
  ];
  
  export const userGrowthData: UserGrowthItem[] = [
    { month: 'Aug', users: 420 },
    { month: 'Sep', users: 590 },
    { month: 'Oct', users: 730 },
    { month: 'Nov', users: 900 },
    { month: 'Dec', users: 1030 },
    { month: 'Jan', users: 1170 },
  ];
  
  export const recentUsers: RecentUser[] = [
    { id: '1', name: 'Emma Wilson', mbti: 'ENFP', status: 'Active', joined: '2 hours ago' },
    { id: '2', name: 'James Chen', mbti: 'INTJ', status: 'Active', joined: '5 hours ago' },
    { id: '3', name: 'Sofia Rodriguez', mbti: 'INFJ', status: 'Inactive', joined: '1 day ago' },
    { id: '4', name: 'Michael Brown', mbti: 'ESTP', status: 'Active', joined: '2 days ago' },
    { id: '5', name: 'Olivia Taylor', mbti: 'ISFP', status: 'Active', joined: '3 days ago' },
  ];
  
  export const reportManagement: ReportItem[] = [
    { id: '1', reporter: 'User #2847', type: 'Inappropriate Content', status: 'Pending' },
    { id: '2', reporter: 'User #1932', type: 'Harassment', status: 'Reviewing' },
    { id: '3', reporter: 'User #5621', type: 'Fake Profile', status: 'Resolved' },
  ];