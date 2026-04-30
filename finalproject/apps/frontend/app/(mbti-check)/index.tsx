import API_BASE_URL from "../../config/api";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useFocusEffect } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Feather } from "@expo/vector-icons";
import { auth } from "../../config/firebase";
import { useCallback, useState } from "react";

const { width } = Dimensions.get("window");

export default function MBTIIndex() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const checkUser = async () => {
        try {
          const user = auth.currentUser;
          console.log("mbti index user:", user);
          if (!user) return;

          const res = await fetch(`${API_BASE_URL}/users/${user.uid}`);

          const data = await res.json();

          console.log("INDEX USER:", data);

          if (data?.mbtiTestchecked === true) {
            router.replace("/(dashboard)/");
            return;
          }

          setLoading(false);
        } catch (err) {
          console.log("MBTI INDEX ERROR:", err);
          setLoading(false);
        }
      };

      checkUser();
    }, []),
  );

  if (loading) {
    return (
      <View style={styles.fullScreen}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.fullScreen}>
      <StatusBar style="auto" />

      <View style={styles.centerContainer}>
        <View style={styles.iconWrapper}>
          <View style={[styles.iconBox, { transform: [{ rotate: "3deg" }] }]}>
            <Feather name="help-circle" size={40} color="#9333ea" />
          </View>
        </View>

        <View style={styles.textSection}>
          <Text className="text-3xl font-bold text-slate-900 mb-3 text-center">
            Your MBTI(Personality) Test
          </Text>
          <Text className="text-base text-slate-500 text-center leading-6">
            Discover your MBTI and{"\n"}
            relationship style through simple questions.
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => router.push("/(mbti-check)/questions")}
          style={styles.startButton}
        >
          <Text className="text-white text-xl font-bold">Start Test</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Text className="text-slate-400 font-semibold underline">
            Go Back
          </Text>
        </TouchableOpacity>
      </View>

      <SafeAreaView edges={["bottom"]} />
    </View>
  );
}

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    backgroundColor: "#fff",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  iconWrapper: {
    width: "100%",
    alignItems: "center",
    marginBottom: 40,
  },
  iconBox: {
    width: 96,
    height: 96,
    backgroundColor: "#F3E8FF",
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  textSection: {
    alignItems: "center",
    marginBottom: 60,
  },
  startButton: {
    width: width - 80,
    backgroundColor: "#9333ea",
    height: 64,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  backButton: {
    marginTop: 24,
    paddingVertical: 10,
  },
});
