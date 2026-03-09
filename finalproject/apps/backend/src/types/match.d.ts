export interface MatchedUser {
  targetId: string;
  synergyScore: number;
  isOpened: boolean;
}

export interface IMatch {
  userId: string;
  matchedUsers: MatchedUser[];
  matchDate: string;
  createdAt: Date;
}
