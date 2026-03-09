export type ChatRoomStatus = "active" | "expired" | "revealed" | "restricted";

export interface ChatRoomConsent {
  userA: boolean;
  userB: boolean;
}

export interface IChatRoom {
  participants: string[];
  matchId: string;
  status: ChatRoomStatus;
  consent: ChatRoomConsent;
  expiresAt: Date;
  lastMessage?: string;
  createdAt: Date;
  updatedAt: Date;
}
