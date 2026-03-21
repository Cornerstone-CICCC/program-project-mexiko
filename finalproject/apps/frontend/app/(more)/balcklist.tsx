import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import SettingsScreenHeader from "@/components/SettingsScreenHeader";

const blockedUsers = [
  { id: "1", name: "User #302", reason: "Blocked manually" },
  { id: "2", name: "User #411", reason: "Hidden for safety" },
];

export default function BlacklistScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <SettingsScreenHeader title="Blacklist" />

        <Text style={styles.description}>
          This is a frontend-only preview of blocked users. Backend integration
          can later load real blacklist records and unblock actions.
        </Text>

        {blockedUsers.map((user) => (
          <View key={user.id} style={styles.card}>
            <Text style={styles.name}>{user.name}</Text>
            <Text style={styles.reason}>{user.reason}</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Blocked</Text>
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
    backgroundColor: "#FEF2F2",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#DC2626",
  },
});