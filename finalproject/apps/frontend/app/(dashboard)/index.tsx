import { View, Text, SafeAreaView, ScrollView, StyleSheet } from "react-native";
import FeaturedMatchCard from "@/components/FeaturedMatchCard";
import CompactMatchCard from "@/components/CompactMatchCard";

const featured = [
  {
    mbti: "ENFP",
    score: 94,
    tags: ["Creative", "Enthusiastic", "Spontaneous"],
  },
  {
    mbti: "ENTP",
    score: 91,
    tags: ["Innovative", "Curious", "Quick-witted"],
  },
  {
    mbti: "INFP",
    score: 88,
    tags: ["Idealistic", "Empathetic", "Authentic"],
  },
];

const others = [
  {
    mbti: "INTJ",
    score: 82,
    tags: ["Strategic", "Independent", "Analytical"],
  },
  {
    mbti: "ENFJ",
    score: 79,
    tags: ["Charismatic", "Warm", "Inspiring"],
  },
];

export default function MatchesScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Today's Matches</Text>

        <Text style={styles.subtitle}>
          5 carefully selected matches for you
        </Text>

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            New matches refresh every 24 hours
          </Text>
        </View>

        <Text style={styles.sectionLabel}>↗ TOP COMPATIBILITY</Text>

        {featured.map((item, index) => (
          <FeaturedMatchCard
            key={index}
            mbti={item.mbti}
            score={item.score}
            tags={item.tags}
          />
        ))}

        <Text style={[styles.sectionLabel, styles.moreSection]}>
          ✧ MORE MATCHES
        </Text>

        {others.map((item, index) => (
          <CompactMatchCard
            key={index}
            mbti={item.mbti}
            score={item.score}
            tags={item.tags}
          />
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
    paddingBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
    marginBottom: 18,
  },
  infoBox: {
    backgroundColor: "#E5E7EB",
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 22,
  },
  infoText: {
    textAlign: "center",
    color: "#6B7280",
    fontSize: 14,
    fontWeight: "500",
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#6B7280",
    letterSpacing: 0.6,
    marginBottom: 12,
  },
  moreSection: {
    marginTop: 10,
  },
});
