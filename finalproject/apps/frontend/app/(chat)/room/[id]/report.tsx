import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React from "react";
import { Stack, Link, useLocalSearchParams, useRouter } from "expo-router";
import { Entypo } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

const ReportScreen = () => {
  const router = useRouter();
  // id: ChatRoom ID, targetId: Reported User's ID, name: Reported User's Name
  const { id, targetId, name } = useLocalSearchParams();
  console.log("ChatRoom ID id", id);

  const reportReasons = [
    { id: 1, label: "User profile" },
    { id: 2, label: "Chat" },
    { id: 3, label: "Moments" },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View style={styles.headerTopBar}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => router.back()}>
            <Entypo name="cross" size={24} color="#1e293b" />
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <Text style={styles.headerTitle}>Report {name || "User"}</Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={styles.groupCard}>
          <View style={styles.infoSection}>
            <Text style={styles.infoDescription}>
              Thank you for helping keep our community safe. Your report will be
              reviewed by our moderators. The user will not be notified of this
              report.
            </Text>

            <Text style={styles.sectionTitle}>What is this report about?</Text>
          </View>

          <View style={styles.listContainer}>
            {reportReasons.map((reason, index) => (
              <TouchableOpacity
                key={reason.id}
                style={[
                  styles.itemContainer,
                  index !== reportReasons.length - 1 && styles.borderBottom,
                ]}
                onPress={() => {
                  // Navigate to detail with all necessary params
                  router.push({
                    pathname: `/room/${id}/reportDetail`,
                    params: { id, targetId, name, label: reason.label },
                  });
                }}
              >
                <Text style={styles.itemText}>{reason.label}</Text>
                <Entypo name="chevron-small-right" size={24} color="#CBD5E1" />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ReportScreen;

const styles = StyleSheet.create({
  headerTopBar: {
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  titleContainer: {
    flex: 1,
    alignItems: "center",
    marginRight: 24, // Offset for the cross icon to center the title
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0f172a",
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
    paddingVertical: 20,
  },
  infoSection: {
    marginBottom: 10,
  },
  infoDescription: {
    fontSize: 14,
    lineHeight: 20,
    color: "#64748b",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1e293b",
  },
  listContainer: {
    marginTop: 10,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    minHeight: 56,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  itemText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#334155",
  },
});
