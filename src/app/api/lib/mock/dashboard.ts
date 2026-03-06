import {
    DashboardStat,
    MatchSuccessData,
    UserGrowthData,
    RecentUser,
    Report,
  } from "@/app/types/dashboard";
  
  export const dashboardStats: DashboardStat[] = [
    {
      title: "Total Users",
      value: 12847,
      change: "+12.5%",
      trend: "up",
    },
    {
      title: "Active Matches",
      value: 3421,
      change: "+8.2%",
      trend: "up",
    },
    {
      title: "Messages Today",
      value: 28459,
      change: "+15.3%",
      trend: "up",
    },
    {
      title: "Reports Pending",
      value: 12,
      change: "-5.1%",
      trend: "down",
    },
  ];
  
  export const matchSuccessData: MatchSuccessData[] = [
    { month: "Aug", matches: 420, reveals: 300 },
    { month: "Sep", matches: 560, reveals: 420 },
    { month: "Oct", matches: 700, reveals: 560 },
    { month: "Nov", matches: 880, reveals: 700 },
    { month: "Dec", matches: 1020, reveals: 860 },
    { month: "Jan", matches: 1160, reveals: 940 },
  ];
  
  export const userGrowthData: UserGrowthData[] = [
    { month: "Aug", users: 420 },
    { month: "Sep", users: 580 },
    { month: "Oct", users: 720 },
    { month: "Nov", users: 900 },
    { month: "Dec", users: 1040 },
    { month: "Jan", users: 1180 },
  ];
  
  export const recentUsers: RecentUser[] = [
    {
      name: "Emma Wilson",
      mbti: "ENFP",
      status: "Active",
      joined: "2 hours ago",
    },
    {
      name: "James Chen",
      mbti: "INTJ",
      status: "Active",
      joined: "5 hours ago",
    },
    {
      name: "Sofia Rodriguez",
      mbti: "INFJ",
      status: "Inactive",
      joined: "1 day ago",
    },
    {
      name: "Michael Brown",
      mbti: "ESTP",
      status: "Active",
      joined: "2 days ago",
    },
    {
      name: "Olivia Taylor",
      mbti: "ISFP",
      status: "Active",
      joined: "3 days ago",
    },
  ];
  
  export const reports: Report[] = [
    {
      reporter: "User #2847",
      type: "Inappropriate Content",
      status: "Pending",
    },
    {
      reporter: "User #1932",
      type: "Harassment",
      status: "Reviewing",
    },
    {
      reporter: "User #5621",
      type: "Fake Profile",
      status: "Resolved",
    },
  ];