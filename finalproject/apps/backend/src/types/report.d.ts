export type ReportCategory =
  | "Abuse"
  | "Harassment"
  | "FakeProfile"
  | "Spam"
  | "Other";

export type ReportStatus = "Pending" | "Resolved" | "Dismissed";

export interface IReport {
  reporterId: string;
  targetId: string;
  chatRoomId?: string;
  category: ReportCategory;
  description: string;
  evidenceImages: string[];
  status: ReportStatus;
  adminAction?: string;
  createdAt: Date;
}
