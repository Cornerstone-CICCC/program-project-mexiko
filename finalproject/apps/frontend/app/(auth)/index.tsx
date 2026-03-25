import { Button } from "@/components/Button";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Link } from "expo-router";

export default function Home() {
  return (
    <View className="flex-1 items-center justify-center px-6 bg-purple-700">
      <View className="items-center gap-2">
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

      <Link href="/(mbti-check)" push asChild>
        <Button title="mbti TEst" />
      </Link>

      <Link href="/(dashboard)" push asChild>
        <Button title="dashboard" />
      </Link>

      <Text className="text-white/80 mt-3 text-sm text-center">
        Find meaningful relationships based on MBTI compatibility. Because
        understanding each other starts with understanding yourself.
      </Text>

      <View className="gap-3 w-full mt-10">
        <Link href="/signUp" asChild>
          <TouchableOpacity className="w-full py-3 bg-white rounded-xl shadow-md active:bg-gray-100">
            <Text className="text-purple-700 font-semibold text-center">
              Get Started
            </Text>
          </TouchableOpacity>
        </Link>

        <Link href="/login" asChild>
          <TouchableOpacity className="w-full py-3 border border-white rounded-xl active:bg-white/10">
            <Text className="text-white font-semibold text-center">Log In</Text>
          </TouchableOpacity>
        </Link>
      </View>

      <View className="flex-row gap-6 mt-12">
        <TouchableOpacity className="active:opacity-70">
          <Text className="text-white/70 text-sm hover:text-white">
            Demo: MBTI Test
          </Text>
        </TouchableOpacity>

        <TouchableOpacity className="active:opacity-70">
          <Text className="text-white/70 text-sm hover:text-white">
            Tech Stack
          </Text>
        </TouchableOpacity>

        <TouchableOpacity className="active:opacity-70">
          <Text className="text-white/70 text-sm hover:text-white">Admin</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
