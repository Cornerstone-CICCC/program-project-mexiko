import { API_ENDPOINTS } from "@/config/api";

export type MatchApiItem = {
  matchId: string;
  targetUserId: string;
  synergyScore: number;
  isOpened: boolean;
  recommendedAt: string;
  expiresAt: string;
  targetUser: {
    email?: string | null;
    fullName?: {
      first?: string;
      last?: string;
    } | null;
    mbtiType?: string | null;
    images?: string[];
    bio?: string | null;
  };
};

export type MatchUiItem = {
  matchId: string;
  targetUserId: string;
  id: string;
  name: string;
  email: string;
  mbti: string;
  score: number;
  tags: string[];
  bio: string;
  isOpened: boolean;
  recommendedAt: string;
  expiresAt: string;
};

type GetMatchesResponse = {
  data: MatchApiItem[];
};

const fallbackTagsByMbti: Record<string, string[]> = {
  ENFP: ["Creative", "Enthusiastic", "Spontaneous"],
  ENTP: ["Innovative", "Curious", "Quick-witted"],
  INFP: ["Idealistic", "Empathetic", "Authentic"],
  INTJ: ["Strategic", "Independent", "Analytical"],
  ENFJ: ["Charismatic", "Warm", "Inspiring"],
  ISTP: ["Practical", "Calm", "Independent"],
};

const getFullName = (
  fullName?: { first?: string; last?: string } | null,
): string => {
  const first = fullName?.first?.trim() ?? "";
  const last = fullName?.last?.trim() ?? "";
  return `${first} ${last}`.trim() || "Unknown User";
};

const mapMatchToUi = (item: MatchApiItem): MatchUiItem => {
  const mbti = item.targetUser?.mbtiType || "N/A";

  return {
    matchId: item.matchId,
    targetUserId: item.targetUserId,
    id: item.targetUserId,
    name: getFullName(item.targetUser?.fullName),
    email: item.targetUser?.email ?? "No email",
    mbti,
    score: Math.round(item.synergyScore),
    tags:
      fallbackTagsByMbti[mbti] ?? ["Compatible", "Interesting", "Potential"],
    bio: item.targetUser?.bio ?? "",
    isOpened: item.isOpened,
    recommendedAt: item.recommendedAt,
    expiresAt: item.expiresAt,
  };
};

export async function getMatches(): Promise<MatchUiItem[]> {
  const response = await fetch(API_ENDPOINTS.MATCHES, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data: GetMatchesResponse | { error?: string } = await response.json();

  if (!response.ok) {
    throw new Error(
      "error" in data && data.error ? data.error : "Failed to fetch matches",
    );
  }

  if (!("data" in data)) {
    throw new Error("Invalid response from server");
  }

  return data.data.map(mapMatchToUi);
}