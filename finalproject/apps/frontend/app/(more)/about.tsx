import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import SettingsScreenHeader from "@/components/SettingsScreenHeader";

export default function AboutScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <SettingsScreenHeader title="About" />

        <View style={styles.heroCard}>
          <Text style={styles.appName}>MindMatch</Text>
          <Text style={styles.version}>Version 1.0.0</Text>
          <Text style={styles.description}>
            A curated MBTI-based dating experience focused on quality connections,
            meaningful conversations, and less swipe fatigue.
          </Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>What makes it different?</Text>
          <Text style={styles.infoText}>
            Instead of endless swiping, MindMatch offers a limited set of daily
            curated matches and encourages more intentional interaction.
          </Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Built for meaningful connections</Text>
          <Text style={styles.infoText}>
            Personality compatibility, guided discovery, and cleaner interaction
            flows are the core ideas behind the app.
          </Text>
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
  heroCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 16,
  },
  appName: {
    fontSize: 26,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 6,
  },
  version: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    color: "#4B5563",
  },
  infoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 10,
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 6,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 21,
    color: "#6B7280",
  },
});