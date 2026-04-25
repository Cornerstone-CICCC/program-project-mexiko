import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Pressable,
} from "react-native";
import { useEffect, useState, useCallback } from "react";

import FeaturedMatchCard from "@/components/FeaturedMatchCard";
import CompactMatchCard from "@/components/CompactMatchCard";
import {
  getMatches,
  MatchUiItem,
  openMatchChat,
  MatchFilters,
} from "@/services/matchService";
import { auth } from "@/config/firebase";
import { API_ENDPOINTS } from "@/config/api";
import { useRouter, useFocusEffect } from "expo-router";
import { getSocket } from "../utils/socket";

const GENDER_OPTIONS: Array<NonNullable<MatchFilters["gender"]>> = [
  "All",
  "Female",
  "Male",
  "Other",
];

const DISTANCE_OPTIONS: Array<{ label: string; value?: number }> = [
  { label: "10 km", value: 10 },
  { label: "25 km", value: 25 },
  { label: "50 km", value: 50 },
  { label: "Any", value: undefined },
];

import axios from "axios";

const SERVER_URL = "http://localhost:3500";

axios.defaults.baseURL = SERVER_URL;
axios.defaults.withCredentials = true;

export default function MatchesScreen() {
  const [matches, setMatches] = useState<MatchUiItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [myMbti, setMyMbti] = useState("ISTP");
  const [selectedGender, setSelectedGender] =
    useState<NonNullable<MatchFilters["gender"]>>("All");
  const [selectedDistance, setSelectedDistance] = useState<number | undefined>(
    undefined,
  );

  const router = useRouter();

  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/chatroom");
      console.log("chat room response", response);
      if (response.data.currentUserId) {
        setCurrentUserId(response.data.currentUserId);
      }
    } catch (error) {
      console.error("Fetch rooms error:", error);
    } finally {
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   if (!currentUserId) return;

  //   const socket = getSocket(currentUserId);

  //   if (!socket) return;

  //   if (!socket.connected) {
  //     socket.connect();
  //   }

  //   const interval = setInterval(() => {
  //     socket.emit("ping_online");
  //   }, 30000);

  //   return () => clearInterval(interval);
  // }, [currentUserId]);

  useFocusEffect(
    useCallback(() => {
      console.log("fetch room");
      fetchRooms();
    }, []),
  );

  const fetchMatches = useCallback(async (filters?: MatchFilters) => {
    try {
      setLoading(true);
      setError(null);

      const user = auth.currentUser;

      if (!user) {
        throw new Error("You need log-in.");
      }

      const userResponse = await fetch(API_ENDPOINTS.USER(user.uid), {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const userData = await userResponse.json();

      if (!userResponse.ok) {
        throw new Error("Failed to load user info");
      }

      const currentMbti = userData.mbtiType || "ISTP";
      setMyMbti(currentMbti);

      const data = await getMatches(currentMbti, filters);

      setMatches(data.filter((m) => !m.isOpened));
    } catch (err: any) {
      setError(err.message || "Failed to load matches");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMatches({
      gender: selectedGender,
      maxDistance: selectedDistance,
    });
  }, [fetchMatches, selectedGender, selectedDistance]);

  useFocusEffect(
    useCallback(() => {
      fetchMatches({
        gender: selectedGender,
        maxDistance: selectedDistance,
      });
    }, [fetchMatches, selectedGender, selectedDistance]),
  );

  const featured = matches.slice(0, 3);
  const others = matches.slice(3);

  const handleCardPress = async (matchId: string, targetUserId: string) => {
    try {
      const chatRoomId = await openMatchChat(matchId, targetUserId);
      router.push(`/(chat)/room/${chatRoomId}`);
    } catch (err: any) {
      Alert.alert("Error", err.message);
    }
  };

  const handleResetFilters = () => {
    setSelectedGender("All");
    setSelectedDistance(undefined);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerState}>
          <ActivityIndicator size="large" />
          <Text style={styles.stateText}>Loading matches...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerState}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Today's Matches</Text>

        <Text style={styles.subtitle}>
          {matches.length} carefully selected matches for you
        </Text>

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            New matches refresh every 24 hours
          </Text>
        </View>

        <View style={styles.filterCard}>
          <View style={styles.filterHeader}>
            <Text style={styles.filterTitle}>Filters</Text>

            <Pressable onPress={handleResetFilters}>
              <Text style={styles.resetText}>Reset</Text>
            </Pressable>
          </View>

          <Text style={styles.filterLabel}>Gender</Text>
          <View style={styles.pillRow}>
            {GENDER_OPTIONS.map((option) => {
              const active = selectedGender === option;

              return (
                <Pressable
                  key={option}
                  onPress={() => setSelectedGender(option)}
                  style={[styles.pill, active && styles.pillActive]}
                >
                  <Text
                    style={[styles.pillText, active && styles.pillTextActive]}
                  >
                    {option}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={[styles.filterLabel, styles.filterSectionSpacing]}>
            Distance
          </Text>
          <View style={styles.pillRow}>
            {DISTANCE_OPTIONS.map((option) => {
              const active = selectedDistance === option.value;

              return (
                <Pressable
                  key={option.label}
                  onPress={() => setSelectedDistance(option.value)}
                  style={[styles.pill, active && styles.pillActive]}
                >
                  <Text
                    style={[styles.pillText, active && styles.pillTextActive]}
                  >
                    {option.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {featured.length > 0 && (
          <>
            <Text style={styles.sectionLabel}>↗ TOP COMPATIBILITY</Text>

            {featured.map((item) => (
              <Pressable
                key={item.id}
                onPress={() => handleCardPress(item.matchId, item.targetUserId)}
              >
                <FeaturedMatchCard
                  key={item.id}
                  mbti={item.mbti}
                  score={item.score}
                  tags={item.tags}
                />
              </Pressable>
            ))}
          </>
        )}

        {others.length > 0 && (
          <>
            <Text style={[styles.sectionLabel, styles.moreSection]}>
              ✧ MORE MATCHES
            </Text>

            {others.map((item) => (
              <Pressable
                key={item.id}
                onPress={() => handleCardPress(item.matchId, item.targetUserId)}
              >
                <CompactMatchCard
                  key={item.id}
                  mbti={item.mbti}
                  score={item.score}
                  tags={item.tags}
                />
              </Pressable>
            ))}
          </>
        )}

        {!matches.length && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No matches found</Text>
            <Text style={styles.emptyText}>
              Try adjusting your filters or wait for the next daily refresh.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F2F7",
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
    marginBottom: 18,
  },
  infoBox: {
    backgroundColor: "#E5E7EB",
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  infoText: {
    textAlign: "center",
    color: "#6B7280",
    fontSize: 14,
    fontWeight: "500",
  },
  filterCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 24,
  },
  filterHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  resetText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6A11CB",
  },
  filterLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#6B7280",
    marginBottom: 10,
  },
  filterSectionSpacing: {
    marginTop: 14,
  },
  pillRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  pillActive: {
    backgroundColor: "#111827",
    borderColor: "#111827",
  },
  pillText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6B7280",
  },
  pillTextActive: {
    color: "#FFFFFF",
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#6B7280",
    letterSpacing: 0.6,
    marginBottom: 12,
  },
  moreSection: {
    marginTop: 10,
  },
  centerState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  stateText: {
    marginTop: 12,
    fontSize: 15,
    color: "#6B7280",
  },
  errorText: {
    fontSize: 15,
    color: "#DC2626",
    textAlign: "center",
  },
  emptyState: {
    marginTop: 24,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    paddingVertical: 24,
    paddingHorizontal: 18,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
    textAlign: "center",
  },
  emptyText: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 20,
  },
});
