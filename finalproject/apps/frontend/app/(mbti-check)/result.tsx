import { StyleSheet, Text, View, ScrollView, Dimensions } from "react-native";
import { useSearchParams } from "expo-router/build/hooks";
import { SafeAreaView } from "react-native-safe-area-context";
import { MBTI_DETAILS, getTop5Matches, MBTI_SCORES } from "@/utils/mbti";
import { TouchableOpacity } from "react-native";
import { useRouter, Link } from "expo-router";
import { auth } from "../../config/firebase";
import { useEffect, useState } from "react";
import { Alert } from "react-native";
const { width } = Dimensions.get("window");

const result = () => {
  const params = useSearchParams();
  const mbti = params.get("mbti") || "INFJ";
  const details = MBTI_DETAILS[mbti];
  const router = useRouter();
  const [isSyncing, setIsSyncing] = useState(false);
  const [dbUser, setDbUser] = useState<any>(null);

  const allPossibleMbtis = Object.keys(MBTI_SCORES).map((type) => ({
    userId: type,
    mbti: type,
  }));

  const topMatches = getTop5Matches(mbti, allPossibleMbtis);

  const fetchCurrentUserInfo = async (userId: string) => {
    try {
      const response = await fetch(`http://localhost:3500/users/${userId}`);
      const data = await response.json();
      if (response.ok) {
        setDbUser(data);
        if (data.mbtiTestchecked === true) {
          router.replace("/(dashboard)/");
        }
      }
    } catch (error) {
      console.error("Not found user Infomation:", error);
    }
  };

  // connect db
  const syncMbtiToBackend = async (userId: string, selectedMbti: string) => {
    try {
      setIsSyncing(true);
      const response = await fetch(`http://localhost:3500/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userInfo: {
            mbtiType: selectedMbti,
            mbtiTestchecked: true,
          },
        }),
      });
      //console.log("response", response);
      if (!response.ok) {
        throw new Error("Failed to update MBTI on server");
      }
      console.log("✅ DB Update Success");
    } catch (error) {
      console.error("❌ DB Update Error:", error);
      Alert.alert("Error", "Failed to save your MBTI result to the server.");
    } finally {
      //console.log("finally");
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      syncMbtiToBackend(user.uid, mbti);
      fetchCurrentUserInfo(user.uid);
    }
  }, [mbti]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <ScrollView>
        <View className="bg-purple-600 p-10 items-center rounded-b-[40px]">
          <Text className="text-white opacity-80">Your MBTI Type</Text>
          <Text className="text-white text-6xl font-bold my-2">{mbti}</Text>
          <Text className="text-white text-xl">{details.title}</Text>
        </View>

        <View className="p-6">
          <View className="mb-8">
            <Text className="text-xl font-bold mb-2">About You</Text>
            <Text className="text-slate-500 leading-6">{details.about}</Text>
          </View>

          <View className="mb-8">
            <Text className="text-xl font-bold mb-4">Key Traits</Text>
            <View className="flex-row flex-wrap gap-2">
              {details.traits.map((trait) => (
                <View
                  key={trait}
                  className="bg-purple-100 px-4 py-2 rounded-full"
                >
                  <Text className="text-purple-600 font-medium">{trait}</Text>
                </View>
              ))}
            </View>
          </View>

          <View className="items-center w-full">
            <Text className="text-xl font-bold mb-4">Best Matches</Text>
            <View className="flex-row flex-wrap gap-3">
              {topMatches.map((match, index) => (
                <View
                  key={index}
                  className="bg-slate-50 border border-slate-100 p-4 rounded-2xl items-center w-[30%]"
                >
                  <View className="bg-purple-500 px-2 py-0.5 rounded-md mb-2">
                    <Text className="text-white text-[10px] font-bold">
                      {match.score} %
                    </Text>
                  </View>
                  <Text className="text-purple-600 font-bold text-lg">
                    {match.userId}
                  </Text>
                </View>
              ))}
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => router.push("/")}
              style={styles.startButton}
            >
              <Text className="text-white text-xl font-bold">
                Continue to Matches
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  startButton: {
    width: width - 80,
    backgroundColor: "#9333ea",
    height: 64,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#9333ea",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
    marginTop: 30,
  },
});

export default result;
