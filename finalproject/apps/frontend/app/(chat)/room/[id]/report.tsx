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
import { Entypo } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

const report = () => {
  const { id } = useLocalSearchParams();
  const reportReasons = [
    {
      id: 1,
      label: "User profile",
      reason: [
        "Attempted/committed fraud",
        "fraud and misinformation",
        "Pornography",
        "Dating",
        "Foul language and racism",
        "Social media marketing or advertising",
        "Religion, politics, and other controversial topics",
      ],
      other: "",
    },
    {
      id: 2,
      label: "Chat",
      reason: [
        "Attempted/committed fraud",
        "fraud and misinformation",
        "Pornography",
        "Dating",
        "Foul language and racism",
        "Social media marketing or advertising",
        "Religion, politics, and other controversial topics",
      ],
      other: "",
    },
    {
      id: 3,
      label: "Moments",
      reason: [
        "Attempted/committed fraud",
        "fraud and misinformation",
        "Pornography",
        "Dating",
        "Foul language and racism",
        "Social media marketing or advertising",
        "Religion, politics, and other controversial topics",
      ],
      other: "",
    },
  ];
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
      {/* header */}
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.headerTopBar}>
        <View className="flex-row items-center justify-between px-5 py-8 bg-white ">
          <Link href="../" push asChild>
            <TouchableOpacity>
              <Entypo name="cross" size={20} color="#1e293b" />
            </TouchableOpacity>
          </Link>
          <View className="flex-1 items-center mr-10">
            <View className="flex-row items-center">
              <Text className="text-2l font-bold text-slate-900 mr-2 ml-2">
                Report UserName
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.groupCard}>
        <View
          style={[
            styles.itemContainer,
            { flexDirection: "column", alignItems: "flex-start", gap: 8 },
          ]}
        >
          <Text
            style={[
              styles.itemText,
              { marginLeft: 0, fontSize: 14, color: "#64748b" },
            ]}
          >
            Thank you for helping keep the MBTI Dating app community safe. Your
            report will be reviewed by our community moderators. User will not
            be notified of the report details
          </Text>

          <Text
            style={[
              styles.itemText,
              { marginLeft: 0, fontWeight: "700", marginTop: 10 },
            ]}
          >
            What is this report About
          </Text>
        </View>

        <View style={styles.listContainer}>
          {reportReasons.map((reason, index) => (
            <TouchableOpacity
              key={reason.id}
              style={[
                styles.itemContainer,
                index !== reportReasons.length - 1 && {
                  borderBottomWidth: 1,
                  borderBottomColor: "#F1F5F9",
                },
              ]}
            >
              <Link href={`/room/${id}/reportDetail`} asChild>
                <Text style={styles.itemText}>
                  {reason.label}

                  <Entypo
                    name="chevron-small-right"
                    size={24}
                    color="#CBD5E1"
                  />
                </Text>
              </Link>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default report;

const styles = StyleSheet.create({
  headerTopBar: {
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  groupCard: {
    backgroundColor: "white",
    borderRadius: 16,
    paddingHorizontal: 20,
    marginHorizontal: 20,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    paddingVertical: 15,
  },
  listContainer: {
    marginTop: 10,
    width: "100%",
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    minHeight: 56,
  },
  itemText: {
    marginLeft: 12,
    fontSize: 16,
    fontWeight: "500",
    color: "#334155",
  },
});
