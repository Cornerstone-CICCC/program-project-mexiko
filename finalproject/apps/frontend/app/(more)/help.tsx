import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import SettingsScreenHeader from "@/components/SettingsScreenHeader";

export default function HelpScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <SettingsScreenHeader title="Help Center" />

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Need help?</Text>
          <Text style={styles.cardText}>
            Find answers to common questions about matching, chats, profile setup,
            notifications, and account settings.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Common Topics</Text>
          <View style={styles.item}>
            <Text style={styles.itemTitle}>How do daily matches work?</Text>
            <Text style={styles.itemText}>
              You receive a curated set of matches every 24 hours based on your
              profile, preferences, and compatibility signals.
            </Text>
          </View>

          <View style={styles.item}>
            <Text style={styles.itemTitle}>Why can’t I message everyone?</Text>
            <Text style={styles.itemText}>
              Conversations are unlocked through the app’s curated matching flow
              to reduce swipe fatigue and improve quality.
            </Text>
          </View>

          <View style={styles.item}>
            <Text style={styles.itemTitle}>How do I report a user?</Text>
            <Text style={styles.itemText}>
              You can report users from profile-related flows. A dedicated Reports
              area will also be connected later.
            </Text>
          </View>
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
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 18,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    lineHeight: 22,
    color: "#6B7280",
  },
  section: {
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.4,
    color: "#6B7280",
    marginBottom: 10,
  },
  item: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 10,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 6,
  },
  itemText: {
    fontSize: 14,
    lineHeight: 21,
    color: "#6B7280",
  },
});