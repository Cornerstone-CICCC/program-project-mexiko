import { API_ENDPOINTS } from "@/config/api";
import { calculateSynergy, MBTI_DETAILS } from "@/utils/mbti";

export type MatchApiItem = {
  matchId: string;
  targetUserId: string;
  synergyScore: number;
  isOpened: boolean;
  recommendedAt: string;
  expiresAt: string;
  distanceKm?: number;
  targetUser: {
    email?: string | null;
    fullName?: {
      first?: string;
      last?: string;
    } | null;
    mbtiType?: string | null;
    images?: string[];
    bio?: string | null;
    gender?: string | null;
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
  distanceKm?: number;
  gender?: string;
};

export type MatchFilters = {
  gender?: "Male" | "Female" | "Other" | "All";
  maxDistance?: number;
};

type GetMatchesResponse = {
  data: MatchApiItem[];
};

const getFullName = (
  fullName?: { first?: string; last?: string } | null,
): string => {
  const first = fullName?.first?.trim() ?? "";
  const last = fullName?.last?.trim() ?? "";
  return `${first} ${last}`.trim() || "Unknown User";
};

const mapMatchToUi = (item: MatchApiItem, myMbti: string): MatchUiItem => {
  const targetMbti = item.targetUser?.mbtiType || "N/A";
  const mbti = item.targetUser?.mbtiType || "N/A";
  const mbtiInfo = MBTI_DETAILS[targetMbti];
  const tags = mbtiInfo?.traits ?? ["Compatible", "Interesting", "Potential"];

  return {
    matchId: item.matchId,
    targetUserId: item.targetUserId,
    id: item.targetUserId,
    name: getFullName(item.targetUser?.fullName),
    email: item.targetUser?.email ?? "No email",
    mbti,
    score: calculateSynergy(myMbti, targetMbti),
    tags,
    bio: item.targetUser?.bio ?? "",
    isOpened: item.isOpened,
    recommendedAt: item.recommendedAt,
    expiresAt: item.expiresAt,
    distanceKm: item.distanceKm,
    gender: item.targetUser?.gender ?? undefined,
  };
};

export async function getMatches(
  myMbti: string,
  filters?: MatchFilters,
): Promise<MatchUiItem[]> {
  const params = new URLSearchParams();

  if (filters?.gender && filters.gender !== "All") {
    params.append("gender", filters.gender);
  }

  if (typeof filters?.maxDistance === "number") {
    params.append("maxDistance", String(filters.maxDistance));
  }

  const endpoint =
    params.toString().length > 0
      ? API_ENDPOINTS.MATCHES_WITH_FILTERS(params)
      : API_ENDPOINTS.MATCHES;

  const response = await fetch(endpoint, {
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

  const mappedData = data.data.map((item) => mapMatchToUi(item, myMbti));
  return mappedData.sort((a, b) => b.score - a.score);
}

export async function openMatchChat(
  matchId: string,
  targetUserId: string,
): Promise<string> {
  const response = await fetch(
    `http://localhost:3500/match/${matchId}/interact`,
    {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ targetUserId }),
    },
  );

  const resData = await response.json();
  if (!response.ok) throw new Error(resData.error || "Failed to open chat");

  return resData.chatRoomId;
}