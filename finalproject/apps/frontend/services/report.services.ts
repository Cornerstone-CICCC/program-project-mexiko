import { API_ENDPOINTS } from "@/config/api";

export type MobileReport = {
  _id: string;
  category: "Abuse" | "Harassment" | "FakeProfile" | "Spam" | "Other";
  description: string;
  status: "Pending" | "Resolved" | "Dismissed";
  createdAt: string;
  targetId?: {
    _id: string;
    email?: string;
    fullName?: {
      first?: string;
      last?: string;
    };
  };
};

type GetMyReportsResponse = {
  message: string;
  reports: MobileReport[];
};

const reportService = {
  async getMyReports(): Promise<MobileReport[]> {
    const response = await fetch(API_ENDPOINTS.MY_REPORTS, {
      method: "GET",
      credentials: "include",
    });

    const data: GetMyReportsResponse | { error: string } = await response.json();

    if (!response.ok) {
      const errorMessage =
        "error" in data ? data.error : "Failed to fetch reports";
      throw new Error(errorMessage);
    }

    return "reports" in data ? data.reports : [];
  },
};

export default reportService;