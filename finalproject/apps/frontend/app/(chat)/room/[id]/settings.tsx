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
import React, { useState } from "react";
import { Stack, Link, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Entypo } from "@expo/vector-icons";
import { Switch } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const chatSettings = () => {
  const { id } = useLocalSearchParams();
  console.log("id", id);
  const [image, setImage] = useState<string | null>(null);

  const [isNotifEnabled, setIsNotifEnabled] = useState(true);

  const [isBlockModalVisible, setBlockModalVisible] = useState(false);
  const toggleSwitch = () =>
    setIsNotifEnabled((previousState) => !previousState);

  const handleClearChat = (roomId: number) => {
    Alert.alert(
      "Clear Chat History",
      "Are you sure you want to delete all messages in this chat?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: () => {
            console.log(`Room ${roomId} history cleared`);
          },
        },
      ],
    );
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
              source={
                image
                  ? { uri: image }
                  : require("@/assets/images/man-profile-gray.png")
              }
              style={{ width: "100%", height: "100%", borderRadius: 100 }}
              resizeMode="cover"
            />
          </View>

          <View className="flex-row justify-between items-center mb-5">
            <Text className="text-2xl font-bold text-slate-900">Dueon Han</Text>
            <Link href="/1/edit" asChild>
              <TouchableOpacity>
                <Entypo name="pencil" size={24} color="#6366f1" />
              </TouchableOpacity>
            </Link>
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
            onPress={() => handleClearChat(Number(id))}
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
          <Link href={`/room/${id}/report`} asChild>
            <TouchableOpacity style={styles.itemContainer} activeOpacity={0.7}>
              <View style={styles.leftSection}>
                <View style={styles.iconWrapper}>
                  <Ionicons name="warning-outline" size={18} color="#EF4444" />
                </View>

                <Text style={styles.itemText}>Report</Text>
              </View>
            </TouchableOpacity>
          </Link>
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
              <Text style={styles.modalTitle}>Block User</Text>

              <Text style={styles.modalSubTitle}>
                They won't be able to send you messages or see your Moments.
                They won't receive a notification that they've been blocked
                either.
              </Text>

              <TouchableOpacity
                style={styles.blockButton}
                onPress={() => {
                  setBlockModalVisible(false);
                  alert("Successfully blocked user");
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
