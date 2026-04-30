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
import { useEffect, useState, useCallback, useMemo } from "react";

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
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";

const SERVER_URL = "http://localhost:3500";
axios.defaults.baseURL = SERVER_URL;
axios.defaults.withCredentials = true;

const GENDER_OPTIONS: Array<NonNullable<MatchFilters["gender"]>> = [
  "All",
  "Female",
  "Male",
  "Other",
];

const DISTANCE_OPTIONS = [
  { label: "10 mi", value: 10 },
  { label: "25 mi", value: 25 },
  { label: "50 mi", value: 50 },
  { label: "Any", value: undefined },
];

const AGE_CHOICES = Array.from({ length: 33 }, (_, i) => i + 18);

export default function MatchesScreen() {
  const [matches, setMatches] = useState<MatchUiItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedGender, setSelectedGender] =
    useState<NonNullable<MatchFilters["gender"]>>("All");
  const [selectedDistance, setSelectedDistance] = useState<number | undefined>(
    undefined,
  );
  const [ageRange, setAgeRange] = useState({ min: 18, max: 30 });

  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  const [isInitialLoaded, setIsInitialLoaded] = useState(false);

  const router = useRouter();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const dynamicDistanceOptions = useMemo(() => {
    const defaultOptions = [
      { label: "10 mi", value: 10 },
      { label: "25 mi", value: 25 },
      { label: "50 mi", value: 50 },
      { label: "Any", value: undefined },
    ];
    if (
      selectedDistance !== undefined &&
      ![10, 25, 50].includes(selectedDistance)
    ) {
      return [
        { label: `${selectedDistance} mi`, value: selectedDistance },
        ...defaultOptions,
      ];
    }
    return defaultOptions;
  }, [selectedDistance]);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/chatroom");
      if (response.data.currentUserId) {
        setCurrentUserId(response.data.currentUserId);
      }
    } catch (error) {
      console.error("Fetch rooms error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!currentUserId) return;
    const socket = getSocket(currentUserId);
    if (!socket) return;
    if (!socket.connected) socket.connect();
    const interval = setInterval(() => {
      socket.emit("ping_online");
    }, 30000);
    return () => clearInterval(interval);
  }, [currentUserId]);

  useFocusEffect(
    useCallback(() => {
      fetchRooms();
    }, []),
  );

  const fetchMatches = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const user = auth.currentUser;
      if (!user) throw new Error("You need log-in.");

      const userResponse = await fetch(API_ENDPOINTS.USER(user.uid), {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      const userData = await userResponse.json();
      if (!userResponse.ok) throw new Error("Failed to load user info");

      if (!isInitialLoaded) {
        setSelectedGender(userData.preferredGender || "All");
        setSelectedDistance(userData.preferredDistance);
        if (userData.preferredAgeRange) {
          setAgeRange({
            min: userData.preferredAgeRange.min || 18,
            max: userData.preferredAgeRange.max || 30,
          });
        }
        setIsInitialLoaded(true);
      }

      const data = await getMatches(userData.mbtiType || "ISTP", {
        gender: selectedGender,
        maxDistance: selectedDistance,
        minAge: ageRange.min,
        maxAge: ageRange.max,
      } as any);

      setMatches(data.filter((m) => !m.isOpened));
    } catch (err: any) {
      setError(err.message || "Failed to load matches");
    } finally {
      setLoading(false);
    }
  }, [selectedGender, selectedDistance, ageRange, isInitialLoaded]);

  useEffect(() => {
    if (isInitialLoaded) fetchMatches();
  }, [selectedGender, selectedDistance, ageRange]);

  useFocusEffect(
    useCallback(() => {
      fetchMatches();
    }, [fetchMatches]),
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
    setAgeRange({ min: 18, max: 30 });
  };

  if (loading && !isInitialLoaded) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerState}>
          <ActivityIndicator size="large" />
          <Text style={styles.stateText}>Loading matches...</Text>
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
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.title}>Today's Matches</Text>
            <Text style={styles.subtitle}>
              {matches.length} matches for you
            </Text>
          </View>
          <Pressable
            onPress={() => setIsFilterExpanded(!isFilterExpanded)}
            style={styles.filterToggleButton}
          >
            <View style={styles.filterBtnInner}>
              <Text style={styles.filterToggleText}>
                {isFilterExpanded ? "Close" : "Filter"}
              </Text>
              <Ionicons
                name={isFilterExpanded ? "chevron-up" : "options-outline"}
                size={14}
                color="#6A11CB"
                style={{ marginLeft: 4 }}
              />
            </View>
          </Pressable>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            New matches refresh every 24 hours
          </Text>
        </View>

        <View style={styles.filterCard}>
          {!isFilterExpanded ? (
            <View style={styles.filterSummary}>
              <Text style={styles.summaryText}>
                {selectedGender} •{" "}
                {selectedDistance !== undefined
                  ? `${selectedDistance} mi`
                  : "Any distance"}{" "}
                • {ageRange.min}-{ageRange.max}y
              </Text>
            </View>
          ) : (
            <View style={styles.expandedFilters}>
              <View style={styles.filterHeaderInner}>
                <Text style={styles.filterHeaderTitle}>Preferences</Text>
                <Pressable onPress={handleResetFilters}>
                  <Text style={styles.resetText}>Reset</Text>
                </Pressable>
              </View>

              <Text style={styles.filterLabel}>Gender</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.pillScroll}
              >
                {GENDER_OPTIONS.map((opt) => (
                  <Pressable
                    key={opt}
                    onPress={() => setSelectedGender(opt)}
                    style={[
                      styles.miniPill,
                      selectedGender === opt && styles.pillActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.miniPillText,
                        selectedGender === opt && styles.pillTextActive,
                      ]}
                    >
                      {opt}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>

              <Text style={[styles.filterLabel, { marginTop: 16 }]}>
                Max Distance
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.pillScroll}
              >
                {dynamicDistanceOptions.map((opt) => (
                  <Pressable
                    key={opt.label}
                    onPress={() => setSelectedDistance(opt.value)}
                    style={[
                      styles.miniPill,
                      selectedDistance === opt.value && styles.pillActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.miniPillText,
                        selectedDistance === opt.value && styles.pillTextActive,
                      ]}
                    >
                      {opt.label}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>

              <Text style={[styles.filterLabel, { marginTop: 16 }]}>
                Age Range ({ageRange.min} - {ageRange.max})
              </Text>
              <View style={styles.ageContainer}>
                <Text style={styles.ageSubLabel}>Min Age</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.agePillScroll}
                >
                  {AGE_CHOICES.filter((age) => age < ageRange.max).map(
                    (age) => (
                      <Pressable
                        key={`min-${age}`}
                        onPress={() => setAgeRange((p) => ({ ...p, min: age }))}
                        style={[
                          styles.agePill,
                          ageRange.min === age && styles.pillActive,
                        ]}
                      >
                        <Text
                          style={[
                            styles.agePillText,
                            ageRange.min === age && styles.pillTextActive,
                          ]}
                        >
                          {age}
                        </Text>
                      </Pressable>
                    ),
                  )}
                </ScrollView>
                <Text style={styles.ageSubLabel}>Max Age</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.agePillScroll}
                >
                  {AGE_CHOICES.filter((age) => age > ageRange.min).map(
                    (age) => (
                      <Pressable
                        key={`max-${age}`}
                        onPress={() => setAgeRange((p) => ({ ...p, max: age }))}
                        style={[
                          styles.agePill,
                          ageRange.max === age && styles.pillActive,
                        ]}
                      >
                        <Text
                          style={[
                            styles.agePillText,
                            ageRange.max === age && styles.pillTextActive,
                          ]}
                        >
                          {age}
                        </Text>
                      </Pressable>
                    ),
                  )}
                </ScrollView>
              </View>
            </View>
          )}
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
                  mbti={item.mbti}
                  score={item.score}
                  tags={item.tags}
                />
              </Pressable>
            ))}
          </>
        )}

        {!matches.length && !loading && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No matches found</Text>
            <Text style={styles.emptyText}>
              Try adjusting your filters or wait for refresh.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F3F2F7" },
  content: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 32 },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  title: { fontSize: 28, fontWeight: "800", color: "#111827" },
  subtitle: { fontSize: 14, color: "#6B7280" },
  filterToggleButton: {
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  filterBtnInner: { flexDirection: "row", alignItems: "center" },
  filterToggleText: { fontSize: 12, fontWeight: "700", color: "#6A11CB" },
  infoBox: {
    backgroundColor: "#E5E7EB",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  infoText: {
    textAlign: "center",
    color: "#6B7280",
    fontSize: 13,
    fontWeight: "500",
  },
  filterCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 20,
  },
  filterSummary: { paddingVertical: 2 },
  summaryText: { fontSize: 13, color: "#4B5563", fontWeight: "600" },
  filterHeaderInner: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
    alignItems: "center",
  },
  filterHeaderTitle: { fontSize: 15, fontWeight: "700", color: "#111827" },
  resetText: { fontSize: 12, fontWeight: "600", color: "#6A11CB" },
  filterLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#9CA3AF",
    textTransform: "uppercase",
    marginBottom: 8,
  },
  pillScroll: { flexDirection: "row", marginBottom: 4 },
  miniPill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginRight: 8,
  },
  pillActive: { backgroundColor: "#111827", borderColor: "#111827" },
  miniPillText: { fontSize: 12, fontWeight: "600", color: "#6B7280" },
  pillTextActive: { color: "#FFFFFF" },
  ageContainer: { marginTop: 4 },
  ageSubLabel: { fontSize: 10, color: "#9CA3AF", marginBottom: 4 },
  agePillScroll: { marginBottom: 8 },
  agePill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "#F9FAFB",
    marginRight: 6,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  agePillText: { fontSize: 11, fontWeight: "600", color: "#6B7280" },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#6B7280",
    letterSpacing: 0.6,
    marginBottom: 12,
  },
  moreSection: { marginTop: 10 },
  centerState: { flex: 1, justifyContent: "center", alignItems: "center" },
  stateText: { marginTop: 12, fontSize: 15, color: "#6B7280" },
  emptyState: {
    marginTop: 24,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 24,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
    marginBottom: 8,
  },
  emptyText: { fontSize: 14, color: "#6B7280", textAlign: "center" },
});
