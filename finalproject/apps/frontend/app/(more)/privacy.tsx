import { router } from "expo-router";
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import SettingsScreenHeader from "@/components/SettingsScreenHeader";

export default function PrivacyScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <SettingsScreenHeader title="Privacy" />

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Privacy tools</Text>
          <Text style={styles.infoText}>
            Manage your safety-related settings, view reporting-related UI, and
            review blocked users. Backend connectivity will be added later.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Safety</Text>

        <View style={styles.card}>
          <Pressable
            style={styles.row}
            onPress={() => router.push("/(more)/reports")}
          >
            <Ionicons name="flag-outline" size={26} color="#98A1B3" />
            <Text style={styles.rowLabel}>Reports</Text>
          </Pressable>

          <View style={styles.divider} />

          <Pressable
            style={styles.row}
            onPress={() => router.push("/(more)/blacklist")}
          >
            <Ionicons name="ban-outline" size={26} color="#98A1B3" />
            <Text style={styles.rowLabel}>Blacklist</Text>
          </Pressable>
        </View>
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
  infoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 18,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 6,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 21,
    color: "#6B7280",
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.4,
    color: "#6B7280",
    marginBottom: 10,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    overflow: "hidden",
  },
  row: {
    minHeight: 76,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    gap: 18,
  },
  rowLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginLeft: 62,
  },
});