"use client";

import { View, Text, Image, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";

export default function ResetConfirmation() {
  return (
    <View className="flex-1 items-center justify-center px-6 bg-white">

      <View className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-lg">

        <View className="flex items-center mb-4">
          <Image
            source={require("../../assets/images/logoConfirmation.svg")}
            className="w-28 h-28"
            resizeMode="contain"
          />
        </View>

        <Text className="text-gray-900 text-2xl font-bold text-center">
          Check Your Email
        </Text>

        <Text className="text-gray-500 mt-2 text-sm text-center leading-relaxed">
          We've sent a password reset link to your email address. Please check your inbox and follow the instructions.
        </Text>

        <View className="mt-6 text-center">
          <Text className="text-gray-600 text-sm">Email sent to</Text>
          <Text className="text-gray-900 font-semibold text-sm">
            your.email@example.com
          </Text>
        </View>

        <Text className="text-gray-500 text-xs mt-4 text-center leading-relaxed">
          Didn't receive the email? Check your spam folder or{" "}
          <Text className="text-purple-600 font-medium underline">
            try again
          </Text>.
        </Text>

        <View className="mt-6 flex flex-col gap-3">

          <TouchableOpacity
            onPress={() => router.push("/Login")}
            className="w-full py-3 bg-purple-600 rounded-xl flex-row items-center justify-center gap-2"
          >
            <Text className="text-white font-semibold">Back to Login</Text>
            <Feather name="arrow-right" size={18} color="white" />
          </TouchableOpacity>

          {/* Resend Email */}
          <TouchableOpacity className="w-full py-3 border border-purple-600 rounded-xl">
            <Text className="text-purple-600 font-semibold text-center">
              Resend Email
            </Text>
          </TouchableOpacity>

        </View>
      </View>
    </View>
  );
}
