import {
    View,
    Text,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    ActivityIndicator,
  } from "react-native";
  import { useEffect, useState } from "react";
  
  import FeaturedMatchCard from "@/components/FeaturedMatchCard";
  import CompactMatchCard from "@/components/CompactMatchCard";
  import { getMatches, MatchUiItem } from "@/services/matchService";
  
  export default function MatchesScreen() {
    const [matches, setMatches] = useState<MatchUiItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
  
    useEffect(() => {
      const fetchMatches = async () => {
        try {
          const data = await getMatches();
          setMatches(data);
        } catch (err: any) {
          setError(err.message || "Failed to load matches");
        } finally {
          setLoading(false);
        }
      };
  
      fetchMatches();
    }, []);
  
    const featured = matches.slice(0, 3);
    const others = matches.slice(3);
  
    if (loading) {
      return (
        <SafeAreaView style={styles.container}>
          <View style={styles.centerState}>
            <ActivityIndicator size="large" />
            <Text style={styles.stateText}>Loading matches...</Text>
          </View>
        </SafeAreaView>
      );
    }
  
    if (error) {
      return (
        <SafeAreaView style={styles.container}>
          <View style={styles.centerState}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        </SafeAreaView>
      );
    }
  
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>T</Text>
  
          <Text style={styles.subtitle}>{matches.length} matches for you</Text>
  
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>New matches refresh every 24 hours</Text>
          </View>
  
          {featured.length > 0 && (
            <>
              <Text style={styles.sectionLabel}>↗ TOP COMPATIBILITY</Text>
  
              {featured.map((item) => (
                <FeaturedMatchCard
                  key={item.id}
                  mbti={item.mbti}
                  score={item.score}
                  tags={item.tags}
                />
              ))}
            </>
          )}
  
          {others.length > 0 && (
            <>
              <Text style={[styles.sectionLabel, styles.moreSection]}>
                ✧ MORE MATCHES
              </Text>
  
              {others.map((item) => (
                <CompactMatchCard
                  key={item.id}
                  mbti={item.mbti}
                  score={item.score}
                  tags={item.tags}
                />
              ))}
            </>
          )}
  
          {!matches.length && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>No matches yet</Text>
              <Text style={styles.emptyText}>
                Your daily matches will appear here once they are generated.
              </Text>
            </View>
          )}
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
    centerState: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 24,
    },
    stateText: {
      marginTop: 12,
      fontSize: 15,
      color: "#6B7280",
    },
    errorText: {
      fontSize: 15,
      color: "#DC2626",
      textAlign: "center",
    },
    emptyState: {
      marginTop: 24,
      backgroundColor: "#FFFFFF",
      borderRadius: 18,
      paddingVertical: 24,
      paddingHorizontal: 18,
    },
    emptyTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: "#111827",
      marginBottom: 8,
      textAlign: "center",
    },
    emptyText: {
      fontSize: 14,
      color: "#6B7280",
      textAlign: "center",
      lineHeight: 20,
    },
  });