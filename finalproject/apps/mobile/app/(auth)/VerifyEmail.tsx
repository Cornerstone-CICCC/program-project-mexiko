"use client";

import { View, Text, Image, TouchableOpacity } from "react-native";
import { router } from "expo-router";

export default function VerifyEmail() {
  return (
    <View className="flex-1 items-center justify-center px-6 bg-white">

      <View className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-lg">

        <View className="flex items-center mb-4">
          <Image
            source={require("../../assets/images/verifyEmail.svg")}
            className="w-28 h-28"
            resizeMode="contain"
          />
        </View>

        <Text className="text-gray-900 text-2xl font-bold text-center">
          Verify Your Email
        </Text>

        <Text className="text-gray-500 mt-2 text-sm text-center leading-relaxed">
          We've sent a verification link to your email address. Please verify your email to continue.
        </Text>

        <View className="mt-6 text-center">
          <Text className="text-gray-600 text-sm">Verification sent to</Text>
          <Text className="text-gray-900 font-semibold text-sm">
            your.email@example.com
          </Text>
        </View>

        <View className="mt-6">
          <Text className="text-gray-700 text-sm mb-1">1. Check your email inbox</Text>
          <Text className="text-gray-700 text-sm mb-1">2. Click the verification link</Text>
          <Text className="text-gray-700 text-sm">3. Return here to continue</Text>
        </View>

        <Text className="text-gray-500 text-xs mt-4 text-center leading-relaxed">
          Can't find the email? Check your spam folder or{" "}
          <Text className="text-purple-600 font-medium underline">
            resend it
          </Text>.
        </Text>

        <View className="mt-6 flex flex-col gap-3">

          <TouchableOpacity
            onPress={() => router.push("/Login")}
            className="w-full py-3 bg-purple-600 rounded-xl shadow-md"
          >
            <Text className="text-center text-white font-semibold">
              I've Verified My Email
            </Text>
          </TouchableOpacity>

          <TouchableOpacity className="w-full py-3 border border-purple-600 rounded-xl">
            <Text className="text-center text-purple-600 font-semibold">
              Resend Verification Email
            </Text>
          </TouchableOpacity>
        </View>

        <View className="mt-6 text-center">
          <Text
            className="text-purple-600 font-medium text-sm"
            onPress={() => router.push("/Login")}
          >
            Back to Login
          </Text>
        </View>
      </View>
    </View>
  );
}
