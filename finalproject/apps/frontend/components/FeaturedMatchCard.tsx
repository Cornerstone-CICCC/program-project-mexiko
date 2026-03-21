import { View, Text, StyleSheet } from "react-native";

type FeaturedMatchCardProps = {
  mbti: string;
  score: number;
  tags: string[];
};

export default function FeaturedMatchCard({
  mbti,
  score,
  tags,
}: FeaturedMatchCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.avatar} />
        <View style={styles.mainInfo}>
          <Text style={styles.mbti}>{mbti}</Text>
          <Text style={styles.subtext}>Tap to chat</Text>
        </View>

        <View style={styles.scoreBlock}>
          <Text style={styles.score}>{score}%</Text>
          <Text style={styles.matchLabel}>Match</Text>
        </View>
      </View>

      <View style={styles.tagsRow}>
        {tags.map((tag, index) => (
          <View key={index} style={styles.tag}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#7C4DFF",
    borderRadius: 24,
    padding: 16,
    marginBottom: 12,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.18)",
    marginRight: 12,
  },
  mainInfo: {
    flex: 1,
  },
  mbti: {
    fontSize: 20,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 2,
  },
  subtext: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    fontWeight: "500",
  },
  scoreBlock: {
    alignItems: "flex-end",
  },
  score: {
    fontSize: 18,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  matchLabel: {
    fontSize: 13,
    color: "rgba(255,255,255,0.8)",
    marginTop: 2,
  },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tag: {
    backgroundColor: "rgba(255,255,255,0.16)",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  tagText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "500",
  },
});