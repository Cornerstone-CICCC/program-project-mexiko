import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  Pressable,
  Alert,
} from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useFocusEffect } from "expo-router";
import axios from "axios";
import { ActivityIndicator } from "react-native-paper";
import { getSocket } from "../utils/socket";
import { calculateSynergy } from "@/utils/mbti";

// 1. Axios Configuration
axios.defaults.baseURL = "http://localhost:3500";
axios.defaults.withCredentials = true;

interface Participant {
  firebaseUid: string;
  mbtiType: string;
}
interface Room {
  _id: string;
  roomId: string;
  expiresAt: string;
  lastMessage?: string;
  lastMessageIsRead?: boolean;
  lastMessageSenderId?: string;
  unreadCount?: number;
  updatedAt: string;
  participants: Participant[];
}

const chat = () => {
  const router = useRouter();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [showRoom1, setShowRoom1] = useState(true);

  const [currentUserId, setCurrentUserId] = useState(
    "qxLtr5RqApbDDBvr5OTifLA70P33",
  );

  const getRemainingTime = (lastActiveAt: string) => {
    if (!lastActiveAt) return "just";

    const lastActive = new Date(lastActiveAt).getTime();
    if (isNaN(lastActive)) return "just";

    const now = new Date().getTime();
    const diff = now - lastActive;

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) return "just";
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    return `${days}d`;
  };

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/chatroom");

      if (response.data.currentUserId) {
        setCurrentUserId(response.data.currentUserId);
      }

      if (response.data && response.data.data) {
        setRooms(response.data.data);
      }
    } catch (error) {
      console.error("Fetch rooms error:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      console.log("fetch room");
      fetchRooms();
    }, []),
  );

  useEffect(() => {
    const socket = getSocket();

    socket.on("update_chat_list", (data) => {
      console.log("Socket Data Received:", data);

      setRooms((prevRooms) => {
        const roomIndex = prevRooms.findIndex((r) => r.roomId === data.roomId);

        if (roomIndex === -1) {
          fetchRooms();
          return prevRooms;
        }

        const updatedRooms = [...prevRooms];
        const targetRoom = updatedRooms[roomIndex];

        const isNewMessageFromOther = data.senderId !== currentUserId;

        updatedRooms[roomIndex] = {
          ...targetRoom,
          lastMessage: data.lastMessage,
          lastMessageIsRead: data.isRead,
          lastMessageSenderId: data.senderId,
          unreadCount:
            (targetRoom.unreadCount || 0) + Number(isNewMessageFromOther),
          updatedAt: data.updatedAt,
        };

        return [...updatedRooms].sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
        );
      });
    });

    socket.on("messages_read", ({ roomId, userId }) => {
      if (userId !== currentUserId) {
        setRooms((prev) =>
          prev.map((r) =>
            r.roomId === roomId ? { ...r, lastMessageIsRead: true } : r,
          ),
        );
      } else {
        setRooms((prev) =>
          prev.map((r) =>
            r.roomId === roomId
              ? { ...r, unreadCount: 0, lastMessageIsRead: true }
              : r,
          ),
        );
      }
    });

    return () => {
      socket.off("update_chat_list");
      socket.off("messages_read");
    };
  }, [currentUserId]);

  // temporary code
  const createTestChatRoom = async () => {
    try {
      const testUserObjectId = "69d42c9dfbea4e811c7c2e83";
      const mockMatchId = "69bc41808fc000fbfa084c40";

      const response = await axios.post("/chatroom", {
        targetId: testUserObjectId,
        matchId: mockMatchId,
      });
      console.log("createTestChatRoom response", response);
      if (response.data) {
        Alert.alert("Success", "Test chat room has been created.");
        fetchRooms();
      }
    } catch (error) {
      console.error("Creation error:", error.response?.data || error.message);
      Alert.alert("Error", "Failed to create room. Check server logs.");
    }
  };

  const deleteChatRoom = async (id: string) => {
    try {
      await axios.delete(`/chatroom/${id}`);
      fetchRooms();
    } catch (error) {
      console.error("Delete error:", error);
      Alert.alert("Error", "Could not delete the room.");
    }
  };

  const handleLeaveChat = (id: string, isMock: boolean = false) => {
    Alert.alert(
      "Leave Chat",
      "Are you sure you want to leave this chat? All messages will be deleted.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Leave",
          style: "destructive",
          onPress: () => (isMock ? setShowRoom1(false) : deleteChatRoom(id)),
        },
      ],
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View className="p-6">
          <View className="mb-8 flex-row justify-between items-center">
            <View>
              <Text className="text-2xl font-bold text-slate-800">Chats</Text>
              <Text className="text-slate-500">Your active conversations</Text>
            </View>
            <Pressable
              onPress={createTestChatRoom}
              className="bg-indigo-100 px-3 py-2 rounded-lg"
            >
              <Text className="text-indigo-600 font-bold">Test Create</Text>
            </Pressable>
          </View>

          {/* --- [Mock Room 1] --- */}
          {showRoom1 && (
            <Pressable
              onPress={() => router.push("/(chat)/room/1")}
              onLongPress={() => handleLeaveChat("1", true)}
              className="flex-row items-center mb-6"
              style={styles.cardContainer}
            >
              <View className="relative w-16 h-16">
                <Image
                  source={require("@/assets/images/man-profile-gray.png")}
                  style={styles.profileImg}
                />
                <View style={styles.timeBadge}>
                  <Text className="text-white text-[8px] mr-1">🕒</Text>
                  <Text className="text-white text-[10px] font-bold">18h</Text>
                </View>
              </View>
              <View className="flex-1 ml-4 justify-center">
                <View className="flex-row items-center mb-1">
                  <Text className="text-xl font-bold text-slate-800 mr-2">
                    ENFP
                  </Text>
                  <View className="bg-green-100 px-2 py-0.5 rounded-full">
                    <Text className="text-green-600 text-[10px] font-bold">
                      94%
                    </Text>
                  </View>
                </View>
                <Text className="text-slate-600 text-sm">
                  Exactly! So what are you...
                </Text>
              </View>
            </Pressable>
          )}

          {/* --- [Real DB Rooms] --- */}
          {loading ? (
            <ActivityIndicator size="small" color="#4F46E5" />
          ) : (
            rooms.map((room) => {
              const otherParticipant = room.participants.find(
                (p) => p.firebaseUid !== currentUserId,
              );

              const me = room.participants.find(
                (p) => p.firebaseUid === currentUserId,
              );

              const targetMbti = otherParticipant?.mbtiType || "ESTJ";
              const myMbti = me?.mbtiType || "ENFP";

              const synergyScore = calculateSynergy(myMbti, targetMbti);

              return (
                <Pressable
                  key={room._id}
                  onPress={() => router.push(`/(chat)/room/${room.roomId}`)}
                  onLongPress={() => handleLeaveChat(room._id)}
                  className="flex-row items-center mb-6"
                  style={styles.cardContainer}
                >
                  <View className="relative w-16 h-16">
                    <View className="w-16 h-16 bg-slate-200 rounded-full overflow-hidden">
                      <Image
                        source={require("@/assets/images/girl-profile-pink.png")}
                        style={styles.profileImg}
                      />
                    </View>
                    <View style={styles.timeBadge}>
                      <Text className="text-white text-[8px] mr-1">🕒</Text>
                      <Text className="text-white text-[10px] font-bold">
                        {getRemainingTime(room.updatedAt)}
                      </Text>
                    </View>
                  </View>

                  <View className="flex-1 ml-4 justify-center">
                    <View className="flex-row items-center justify-between mb-1">
                      <View className="flex-row items-center">
                        <Text className="text-xl font-bold text-slate-800 mr-2">
                          {targetMbti}
                        </Text>
                        <View className="bg-green-100 px-2 py-0.5 rounded-full">
                          <Text className="text-green-600 text-[10px] font-bold">
                            {synergyScore}%
                          </Text>
                        </View>
                      </View>

                      <View className="flex-row items-center">
                        {(room.unreadCount ?? 0) > 0 && (
                          <View className="bg-indigo-500 px-1.5 py-0.5 rounded-full min-w-[18px] items-center justify-center">
                            <Text className="text-white text-[10px] font-bold">
                              {room.unreadCount}
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>

                    <Text
                      className={`${!room.lastMessageIsRead && room.lastMessageSenderId !== currentUserId ? "font-bold text-slate-900" : "text-slate-600"} text-sm`}
                      numberOfLines={1}
                    >
                      {room.lastMessage || "Start a new conversation!"}
                    </Text>
                  </View>
                </Pressable>
              );
            })
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default chat;

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 24,
    backgroundColor: "white",
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  profileImg: { width: "100%", height: "100%", borderRadius: 100 },
  timeBadge: {
    position: "absolute",
    bottom: -4,
    right: -4,
    backgroundColor: "#4F46E5",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderWidth: 2,
    borderColor: "white",
  },
});
