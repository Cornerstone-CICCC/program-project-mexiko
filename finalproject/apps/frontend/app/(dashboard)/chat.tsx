import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  Pressable,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

const chat = () => {
  const router = useRouter();

  // temporary code
  const [showRoom1, setShowRoom1] = useState(true);
  const [showRoom2, setShowRoom2] = useState(true);
  const [showRoom3, setShowRoom3] = useState(true);

  const handleLeaveChat = (roomId: number) => {
    Alert.alert(
      "Leave Chat",
      "Are you sure you want to leave this chat? All messages will be deleted.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Leave",
          style: "destructive",
          onPress: () => {
            if (roomId === 1) setShowRoom1(false);
            if (roomId === 2) setShowRoom2(false);
            if (roomId === 3) setShowRoom3(false);
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View className="p-6">
          <View className="mb-8">
            <Text className="text-2xl font-bold text-slate-800">Chats</Text>
            <Text className="text-slate-500">Your active conversations</Text>
          </View>
          {showRoom1 && (
            <Pressable
              onPress={() => router.push("/(chat)/room/1")}
              onLongPress={() => handleLeaveChat(1)}
              className="flex-row items-center mb-6"
              style={styles.cardContainer}
            >
              <View className="relative w-16 h-16">
                <View className="w-16 h-16 bg-slate-200 rounded-full">
                  <Image
                    source={require("@/assets/images/man-profile-gray.png")}
                    style={{ width: "100%", height: "100%", borderRadius: 100 }}
                    resizeMode="cover"
                  />
                </View>

                <View
                  className="absolute -bottom-1 -right-1 bg-indigo-600 rounded-full flex-row items-center border-2 border-white px-2 py-0.5"
                  style={{ alignSelf: "flex-start" }}
                >
                  <Text className="text-white text-[8px] mr-1">🕒</Text>
                  <Text className="text-white text-[10px] font-bold">18h</Text>
                </View>
              </View>

              <View className="flex-1 ml-4 justify-center">
                <View className="flex-row items-center mb-1">
                  <Text className="text-xl font-bold text-slate-800 mr-2">
                    ENFP
                  </Text>
                  <View className="bg-green-100 px-2 py-0.5 rounded-full">
                    <Text className="text-green-600 text-[10px] font-bold">
                      94%
                    </Text>
                  </View>
                </View>

                <Text className="text-slate-600 text-sm" numberOfLines={1}>
                  Exactly! So what are you
                </Text>

                <Text className="text-slate-400 text-[10px] mt-1">2m ago</Text>
              </View>
            </Pressable>
          )}

          <View
            className="flex-row items-center mb-6"
            style={styles.cardContainer}
          >
            <View className="relative w-16 h-16">
              <View className="w-16 h-16 bg-slate-200 rounded-full">
                <Image
                  source={require("@/assets/images/man-profile-gray.png")}
                  style={{ width: "100%", height: "100%", borderRadius: 100 }}
                  resizeMode="cover"
                />
              </View>

              <View
                className="absolute -bottom-1 -right-1 bg-indigo-600 rounded-full flex-row items-center border-2 border-white px-2 py-0.5"
                style={{ alignSelf: "flex-start" }}
              >
                <Text className="text-white text-[8px] mr-1">🕒</Text>
                <Text className="text-white text-[10px] font-bold">2m ago</Text>
              </View>
            </View>

            <View className="flex-1 ml-4 justify-center">
              <View className="flex-row items-center mb-1">
                <Text className="text-xl font-bold text-slate-800 mr-2">
                  ENTJ
                </Text>
                <View className="bg-green-100 px-2 py-0.5 rounded-full">
                  <Text className="text-green-600 text-[10px] font-bold">
                    75%
                  </Text>
                </View>
              </View>

              <Text className="text-slate-600 text-sm" numberOfLines={1}>
                I'd love to hear more about your
              </Text>

              <Text className="text-slate-400 text-[10px] mt-1">2m ago</Text>
            </View>
          </View>

          <View
            className="flex-row items-center mb-6"
            style={styles.cardContainer}
          >
            <View className="relative w-16 h-16">
              <View className="w-16 h-16 bg-slate-200 rounded-full">
                <Image
                  source={require("@/assets/images/girl-profile-pink.png")}
                  style={{ width: "100%", height: "100%", borderRadius: 100 }}
                  resizeMode="cover"
                />
              </View>

              <View
                className="absolute -bottom-1 -right-1 bg-indigo-600 rounded-full flex-row items-center border-2 border-white px-2 py-0.5"
                style={{ alignSelf: "flex-start" }}
              >
                <Text className="text-white text-[8px] mr-1">🕒</Text>
                <Text className="text-white text-[10px] font-bold">2m ago</Text>
              </View>
            </View>

            <View className="flex-1 ml-4 justify-center">
              <View className="flex-row items-center mb-1">
                <Text className="text-xl font-bold text-slate-800 mr-2">
                  INFJ
                </Text>
                <View className="bg-green-100 px-2 py-0.5 rounded-full">
                  <Text className="text-green-600 text-[10px] font-bold">
                    85%
                  </Text>
                </View>
              </View>

              <Text className="text-slate-600 text-sm" numberOfLines={1}>
                That sounds really interesting
              </Text>

              <Text className="text-slate-400 text-[10px] mt-1">3h ago</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default chat;

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 24,
    backgroundColor: "white",
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
});
