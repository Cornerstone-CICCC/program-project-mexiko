"use client";

import { View, Text, Image, TouchableOpacity } from "react-native";
import { router } from "expo-router";

export default function Home() {
  return (
    <View className="flex-1 items-center justify-center px-6 bg-[#1A1A1A]">

      <View className="flex flex-col items-center gap-2">
        <Image
          source={require("../../assets/images/logo.svg")}
          className="w-20 h-20"
          resizeMode="contain"
        />
        <Text className="text-white text-sm opacity-80">
          Connect Beyond the Surface
        </Text>
      </View>

      <Text className="text-white text-2xl font-bold mt-10 text-center">
        Discover Your Personality Connection
      </Text>

      <Text className="text-white/80 mt-3 text-sm text-center">
        Find meaningful relationships based on MBTI compatibility. Because
        understanding each other starts with understanding yourself.
      </Text>

      <View className="flex flex-col gap-3 w-full mt-10">

        <TouchableOpacity
          onPress={() => router.push("/SignUp")}
          className="w-full py-3 bg-white rounded-xl shadow-md"
        >
          <Text className="text-center text-purple-700 font-semibold">
            Get Started
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/Login")}
          className="w-full py-3 border border-white rounded-xl"
        >
          <Text className="text-center text-white font-semibold">
            Log In
          </Text>
        </TouchableOpacity>
      </View>

      <View className="flex-row gap-6 mt-12">
        <Text className="text-white/70 text-sm">Demo: MBTI Test</Text>
        <Text className="text-white/70 text-sm">Tech Stack</Text>
        <Text className="text-white/70 text-sm">Admin</Text>
      </View>
    </View>
  );
}
