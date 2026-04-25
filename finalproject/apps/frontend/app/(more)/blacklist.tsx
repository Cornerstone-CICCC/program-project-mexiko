import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import SettingsScreenHeader from "@/components/SettingsScreenHeader";
import axios from "axios";

export default function BlacklistScreen() {
  const [blockedRooms, setBlockedRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch Blacklist from Backend
  const fetchBlacklist = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/chatroom/blacklist/list");
      if (response.data.success) {
        setBlockedRooms(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch blacklist:", error);
      Alert.alert("Error", "Could not load the blacklist.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlacklist();
  }, []);

  // 2. Unblock Handler
  const handleUnblock = (roomId: string, userName: string) => {
    Alert.alert(
      "Unblock User",
      `Are you sure you want to unblock ${userName}? This chat will reappear in your chat list.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Unblock",
          style: "destructive",
          onPress: async () => {
            try {
              const response = await axios.post(`/chatroom/${roomId}/unblock`);
              if (response.data.success) {
                // Remove from UI immediately
                setBlockedRooms((prev) =>
                  prev.filter((room) => room.roomId !== roomId),
                );
                Alert.alert("Success", "User has been unblocked.");
              }
            } catch (error) {
              console.error("Unblock error:", error);
              Alert.alert("Error", "Failed to unblock the user.");
            }
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <SettingsScreenHeader title="Blacklist" />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.description}>
          This is your list of blocked users. Unblocking them will restore your
          previous conversation.
        </Text>

        {loading ? (
          <ActivityIndicator
            size="large"
            color="#6366F1"
            style={{ marginTop: 20 }}
          />
        ) : blockedRooms.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No blocked users found.</Text>
          </View>
        ) : (
          blockedRooms.map((room) => {
            const otherUser = room.otherUser;
            const displayName = otherUser?.fullName
              ? `${otherUser.fullName.first} ${otherUser.fullName.last || ""}`
              : otherUser?.mbtiType || "Unknown User";

            return (
              <View key={room.roomId} style={styles.card}>
                <View style={styles.cardInfo}>
                  <Text style={styles.name}>{displayName}</Text>
                  <Text style={styles.reason}>Manually Blocked</Text>
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>Blocked</Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.unblockButton}
                  onPress={() => handleUnblock(room.roomId, displayName)}
                >
                  <Text style={styles.unblockButtonText}>Unblock</Text>
                </TouchableOpacity>
              </View>
            );
          })
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
    paddingTop: 10,
    paddingBottom: 40,
  },
  description: {
    fontSize: 14,
    lineHeight: 21,
    color: "#6B7280",
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 10,
  },
  cardInfo: {
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  reason: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 8,
  },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: "#FEF2F2",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#DC2626",
  },
  unblockButton: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    marginLeft: 10,
  },
  unblockButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#4B5563",
  },
  emptyContainer: {
    alignItems: "center",
    marginTop: 40,
  },
  emptyText: {
    color: "#9CA3AF",
    fontSize: 15,
  },
});
