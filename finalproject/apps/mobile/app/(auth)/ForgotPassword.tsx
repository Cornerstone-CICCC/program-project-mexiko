"use client";

import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";

export default function ForgotPassword() {
  return (
    <View className="flex-1 items-center justify-center px-6 bg-white">

      <TouchableOpacity
        onPress={() => router.back()}
        className="absolute left-4 top-12"
      >
        <Feather name="arrow-left" size={28} color="#555" />
      </TouchableOpacity>

      <Text className="text-3xl font-bold text-gray-900 mt-10">
        Forgot Password
      </Text>

      <Text className="text-gray-500 text-sm mt-2 text-center">
        Enter your email and we’ll send you a reset link.
      </Text>

      {/* Form */}
      <View className="w-full mt-10 gap-5">

        <View>
          <Text className="text-gray-700 text-sm mb-1">Email</Text>

          <View className="relative">
            <Feather
              name="mail"
              size={20}
              color="#999"
              style={{ position: "absolute", left: 12, top: 14 }}
            />

            <TextInput
              placeholder="your.email@example.com"
              autoCapitalize="none"
              keyboardType="email-address"
              className="w-full bg-gray-100 rounded-xl py-3 pl-12 pr-4 text-gray-900"
            />
          </View>
        </View>

        <TouchableOpacity
          onPress={() => router.push("/ResetConfirmation")}
          className="bg-gradient-to-r from-[#6A11CB] to-[#2575FC] py-3 rounded-xl mt-2"
        >
          <Text className="text-center text-white font-semibold text-base">
            Send Reset Link
          </Text>
        </TouchableOpacity>

        <Text className="text-center text-gray-600 text-sm mt-4">
          Remember your password?{" "}
          <Text
            className="text-purple-600 font-semibold"
            onPress={() => router.push("/Login")}
          >
            Log In
          </Text>
        </Text>
      </View>
    </View>
  );
}
