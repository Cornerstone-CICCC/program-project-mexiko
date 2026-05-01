export type Gender = "Male" | "Female" | "Other";

export interface IUser {
  id: string;
  firebaseUid: string;
  email: string;
  fullName: {
    first: string;
    last: string;
  };
  gender: Gender;
  birthDate: Date;
  isAdmin: boolean;
  mbtiType: string;
  keywords: string[];
  hobbies: string[];
  bio: string;
  profileImage?: string;
  subImages: string[];
  lastDailyMatchDate: string;
  isSuspended: boolean;
  reportedCount: number;
  lastLogin: Date;
  isDeleted: boolean;
  deletedAt: Date | null;
}
