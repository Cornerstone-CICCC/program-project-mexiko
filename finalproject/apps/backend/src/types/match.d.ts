export interface MatchedUser {
  targetId: string;
  synergyScore: number;
  isOpened: boolean;
  recommendedAt: Date;
  expiresAt: Date;
}

export interface IMatch {
  userId: string;
  matchedUsers: MatchedUser[];
  createdAt: Date;
  updatedAt: Date;
}