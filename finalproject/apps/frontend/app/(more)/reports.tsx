import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import SettingsScreenHeader from "@/components/SettingsScreenHeader";

const mockReports = [
  {
    id: "1",
    name: "User #204",
    reason: "Inappropriate behavior",
    status: "Under review",
  },
  {
    id: "2",
    name: "User #118",
    reason: "Spam",
    status: "Resolved",
  },
];

export default function ReportsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <SettingsScreenHeader title="Reports" />

        <Text style={styles.description}>
          This is a frontend preview of the reports section. Real user-generated
          report data will be connected next week.
        </Text>

        {mockReports.map((report) => (
          <View key={report.id} style={styles.card}>
            <Text style={styles.name}>{report.name}</Text>
            <Text style={styles.reason}>Reason: {report.reason}</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{report.status}</Text>
            </View>
          </View>
        ))}
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
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 10,
  },
  name: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 6,
  },
  reason: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 10,
  },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#4F46E5",
  },
});