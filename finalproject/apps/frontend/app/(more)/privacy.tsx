import { router } from "expo-router";
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import SettingsScreenHeader from "@/components/SettingsScreenHeader";
import SettingRow from "@/components/SettingRow";

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

        <SettingRow
          label="Reports"
          icon="flag-outline"
          onPress={() => router.push("/(more)/reports")}
        />

        <SettingRow
          label="Blacklist"
          icon="ban-outline"
          onPress={() => router.push("/(more)/blacklist")}
        />
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
});