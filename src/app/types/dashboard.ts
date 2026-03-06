export type DashboardStat = {
    title: string;
    value: number;
    change: string;
    trend: "up" | "down";
  };
  
  export type MatchSuccessData = {
    month: string;
    matches: number;
    reveals: number;
  };
  
  export type UserGrowthData = {
    month: string;
    users: number;
  };
  
  export type RecentUser = {
    name: string;
    mbti: string;
    status: "Active" | "Inactive";
    joined: string;
  };
  
  export type Report = {
    reporter: string;
    type: string;
    status: "Pending" | "Reviewing" | "Resolved";
  };