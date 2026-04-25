import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  Modal,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Stack, Link, useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Entypo } from "@expo/vector-icons";
import { Switch } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";

const SERVER_URL = "http://localhost:3500";

axios.defaults.baseURL = SERVER_URL;
axios.defaults.withCredentials = true;

const chatSettings = () => {
  const { id, gender, name } = useLocalSearchParams();
  const [isRevealed, setIsRevealed] = useState(false);

  console.log("name", name);
  console.log("id", id);
  console.log("chatroom");

  const router = useRouter();
  const [image, setImage] = useState<string | null>(null);

  const [me, setMe] = useState<any>(null);
  const [otherUser, setOtherUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/chatroom/${id}`);
        const { room, myId } = response.data;

        const myData = room.participants.find(
          (p: any) => p.firebaseUid === myId,
        );
        const otherData = room.participants.find(
          (p: any) => p.firebaseUid !== myId,
        );

        console.log("MongoDB ID (_id):", otherData._id);
        console.log("Firebase UID:", otherData.firebaseUid);

        console.log(
          "Full ID from Server:",
          otherData._id,
          "Length:",
          otherData._id?.length,
        );

        setMe(myData);
        setOtherUser(otherData);
        setIsRevealed(room.isRevealed || false);
      } catch (error) {
        console.error("data loading failed:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchInfo();
  }, [id]);

  const getOtherProfileImage = () => {
    if (isRevealed && otherUser?.profileImage) {
      const imageUrl = otherUser.profileImage.startsWith("http")
        ? otherUser.profileImage
        : `${axios.defaults.baseURL}/uploads/${otherUser.profileImage}`;
      return { uri: imageUrl };
    }
    return otherUser?.gender === "Female"
      ? require("@/assets/images/girl-profile.png")
      : require("@/assets/images/man-profile-gray.png");
  };

  const getDisplayName = () => {
    if (!otherUser) return "Loading...";

    if (isRevealed && otherUser.fullName) {
      return `${otherUser.fullName.first} ${otherUser.fullName.last || ""}`;
    }
    return `${otherUser.mbtiType}`;
  };

  const [isNotifEnabled, setIsNotifEnabled] = useState(true);

  const [isBlockModalVisible, setBlockModalVisible] = useState(false);
  const toggleSwitch = () =>
    setIsNotifEnabled((previousState) => !previousState);

  const handleClearChat = (roomId: string) => {
    console.log("roomid", roomId, typeof roomId);
    Alert.alert(
      "Clear Chat History",
      "Are you sure you want to delete all messages in this chat?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: async () => {
            try {
              await axios.post(`/chatroom/${roomId}/clear`);
              console.log(`Room ${roomId} history cleared`);
              Alert.alert("Success", "Chat history has been cleared.");
            } catch (error) {
              console.error("❌ Failed clearing chat history:", error);
              Alert.alert(
                "Error",
                "Could not clear chat history. Please try again.",
              );
            }
          },
        },
      ],
    );
  };

  // const handleBlockUser = async (roomId: string) => {
  //   try {
  //     const response = await axios.post(`/chatroom/${roomId}/block`);
  //     if (response.data.success) {
  //       setBlockModalVisible(false);

  //       Alert.alert(
  //         "Blocked",
  //         `${otherUser?.mbtiType || "User"} has been blocked.`,
  //       );
  //       router.replace("/(dashboard)/chat");
  //     }
  //   } catch (error) {
  //     Alert.alert("Error", "Could not block user.");
  //   }
  // };

  const handleBlockUser = async (roomId: string) => {
    try {
      const response = await axios.post(`/chatroom/${roomId}/block`);
      console.log("blockUser response:", response);
      if (response.data.success) {
        setBlockModalVisible(false);

        Alert.alert("User Blocked", "The conversation has been closed.", [
          {
            text: "OK",
            onPress: () => router.replace("/(dashboard)/chat"),
          },
        ]);
      }
    } catch (error: any) {
      console.error("Block User Error:", error);
      Alert.alert(
        "Error",
        error.response?.data?.error ||
          "Failed to block user. Please try again.",
      );
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
      {/* header */}
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.headerTopBar}>
        <View className="flex-row items-center justify-between px-5 py-8 bg-white ">
          <Link href="../" push asChild>
            <TouchableOpacity>
              <Entypo name="chevron-thin-left" size={20} color="#1e293b" />
            </TouchableOpacity>
          </Link>
          <View className="flex-1 items-center mr-10">
            <View className="flex-row items-center">
              <Text className="text-2l font-bold text-slate-900 mr-2 ml-2">
                Chat Settings
              </Text>
            </View>
          </View>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Personal info */}
        <View className="bg-grey-600 p-10 items-center ">
          <View className="w-32 h-32 bg-slate-200 rounded-full relative">
            <Image
              source={getOtherProfileImage()}
              style={{ width: "100%", height: "100%", borderRadius: 100 }}
              resizeMode="cover"
            />
          </View>

          <View className="flex-row justify-between items-center mb-5">
            <Text className="text-2xl font-bold text-slate-900">
              {getDisplayName()}
            </Text>
          </View>
        </View>

        {/*  Notifications */}
        <View style={styles.groupCard}>
          <View style={styles.itemContainer}>
            <View style={styles.leftSection}>
              <View style={styles.iconWrapper}>
                <Ionicons name="notifications" size={18} color="#6366F1" />
              </View>
              <Text style={styles.itemText}>Notifications</Text>
            </View>

            <Switch
              trackColor={{ false: "#CBD5E1", true: "#818CF8" }}
              thumbColor={isNotifEnabled ? "#FFFFFF" : "#F8FAFC"}
              onValueChange={toggleSwitch}
              value={isNotifEnabled}
              style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
            />
          </View>
        </View>

        {/*  Clear Chat History */}
        <View style={styles.groupCard}>
          <TouchableOpacity
            onPress={() => handleClearChat(id)}
            activeOpacity={0.7}
          >
            <View style={styles.itemContainer}>
              <View style={styles.leftSection}>
                <View style={styles.iconWrapper}>
                  <Ionicons name="trash-outline" size={18} color="#EF4444" />
                </View>
                <Text style={styles.itemText}>Clear Chat History</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Block */}
        <View style={styles.groupCard}>
          <TouchableOpacity
            style={styles.itemContainer}
            onPress={() => setBlockModalVisible(true)}
            activeOpacity={0.7}
          >
            <View style={styles.leftSection}>
              <View style={styles.iconWrapper}>
                <Ionicons name="ban" size={18} color="#EF4444" />
              </View>
              <Text style={styles.itemText}>Block</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/*  Report */}
        <View style={styles.groupCard}>
          <TouchableOpacity
            style={styles.itemContainer}
            activeOpacity={0.7}
            onPress={() => {
              console.log("Sending targetId to ReportScreen:", otherUser?._id);

              router.push({
                pathname: `/room/${id}/report`,
                params: {
                  id: id,
                  targetId: otherUser?._id || otherUser?.firebaseUid,
                  name: getDisplayName(),
                },
              });
            }}
          >
            <View style={styles.leftSection}>
              <View style={styles.iconWrapper}>
                <Ionicons name="warning-outline" size={18} color="#EF4444" />
              </View>
              <Text style={styles.itemText}>Report</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* block modal */}
        <Modal
          visible={isBlockModalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setBlockModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.bottomSheet}>
              <Text style={styles.modalTitle}>
                Block{" "}
                {isRevealed ? otherUser?.fullName?.first : otherUser?.mbtiType}?
              </Text>

              <Text style={styles.modalSubTitle}>
                {isRevealed ? otherUser?.fullName?.first : "This user"} won't be
                able to send you messages or see your profile. This action will
                end your conversation.
              </Text>

              <TouchableOpacity
                style={styles.blockButton}
                onPress={() => {
                  //setBlockModalVisible(false);
                  //alert("Successfully blocked user");
                  handleBlockUser(id as string);
                }}
              >
                <Text style={styles.blockButtonText}>Block</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setBlockModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

export default chatSettings;

const styles = StyleSheet.create({
  headerTopBar: {
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  groupCard: {
    backgroundColor: "white",
    borderRadius: 16,
    paddingHorizontal: 16,
    marginHorizontal: 20,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    padding: 5,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    minHeight: 56,
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  itemText: {
    marginLeft: 12,
    fontSize: 16,
    fontWeight: "500",
    color: "#334155",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "flex-end",
  },
  bottomSheet: {
    backgroundColor: "white",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
    paddingBottom: 40,
    alignItems: "center",
    width: "100%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 12,
    marginTop: 10,
  },
  modalSubTitle: {
    fontSize: 14,
    color: "#64748b",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
    paddingHorizontal: 10,
  },
  blockButton: {
    backgroundColor: "#6366F1",
    width: "100%",
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: "center",
    marginBottom: 12,
  },
  blockButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelButton: {
    width: "100%",
    paddingVertical: 12,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#94a3b8",
    fontSize: 16,
    fontWeight: "500",
  },
});
