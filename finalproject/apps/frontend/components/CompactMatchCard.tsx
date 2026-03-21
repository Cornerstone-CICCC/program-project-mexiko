import { View, Text, StyleSheet } from "react-native";

type CompactMatchCardProps = {
  mbti: string;
  score: number;
  tags: string[];
};

export default function CompactMatchCard({
  mbti,
  score,
  tags,
}: CompactMatchCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.avatar} />
        <View style={styles.mainInfo}>
          <Text style={styles.mbti}>{mbti}</Text>
          <Text style={styles.subtext}>Start conversation</Text>
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
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#EFF1F5",
    marginRight: 12,
  },
  mainInfo: {
    flex: 1,
  },
  mbti: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 2,
  },
  subtext: {
    fontSize: 14,
    color: "#6B7280",
  },
  scoreBlock: {
    alignItems: "flex-end",
  },
  score: {
    fontSize: 18,
    fontWeight: "800",
    color: "#4F46E5",
  },
  matchLabel: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 2,
  },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tag: {
    backgroundColor: "#F3F4F6",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  tagText: {
    color: "#374151",
    fontSize: 12,
    fontWeight: "500",
  },
});