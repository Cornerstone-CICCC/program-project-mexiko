"use client";

import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <View className="flex-1 items-center justify-center px-6 bg-white">

      <TouchableOpacity
        onPress={() => router.back()}
        className="absolute left-4 top-12"
      >
        <Feather name="arrow-left" size={28} color="#555" />
      </TouchableOpacity>

      <Text className="text-3xl font-bold text-gray-900 mt-10">
        Create Your Account
      </Text>

      <Text className="text-gray-500 text-sm mt-2 text-center">
        Find meaningful connections, intentionally.
      </Text>

      {/* Form */}
      <View className="w-full mt-10 gap-5">

        <View>
          <Text className="text-gray-700 text-sm mb-1">Name</Text>

          <View className="relative">
            <Feather
              name="user"
              size={20}
              color="#999"
              style={{ position: "absolute", left: 12, top: 14 }}
            />

            <TextInput
              placeholder="Your name"
              className="w-full bg-gray-100 rounded-xl py-3 pl-12 pr-4 text-gray-900"
            />
          </View>
        </View>

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

        <View>
          <Text className="text-gray-700 text-sm mb-1">Password</Text>

          <View className="relative">
            <Feather
              name="lock"
              size={20}
              color="#999"
              style={{ position: "absolute", left: 12, top: 14 }}
            />

            <TextInput
              placeholder="********"
              secureTextEntry={!showPassword}
              className="w-full bg-gray-100 rounded-xl py-3 pl-12 pr-12 text-gray-900"
            />

            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={{ position: "absolute", right: 12, top: 14 }}
            >
              <Feather
                name={showPassword ? "eye-off" : "eye"}
                size={20}
                color="#777"
              />
            </TouchableOpacity>
          </View>
        </View>

        <View>
          <Text className="text-gray-700 text-sm mb-1">Confirm Password</Text>

          <View className="relative">
            <Feather
              name="lock"
              size={20}
              color="#999"
              style={{ position: "absolute", left: 12, top: 14 }}
            />

            <TextInput
              placeholder="********"
              secureTextEntry={!showConfirm}
              className="w-full bg-gray-100 rounded-xl py-3 pl-12 pr-12 text-gray-900"
            />

            <TouchableOpacity
              onPress={() => setShowConfirm(!showConfirm)}
              style={{ position: "absolute", right: 12, top: 14 }}
            >
              <Feather
                name={showConfirm ? "eye-off" : "eye"}
                size={20}
                color="#777"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Terms */}
        <View className="flex-row items-start gap-3 mt-1">
          <TouchableOpacity className="mt-1">
            <View className="w-5 h-5 rounded border border-gray-400" />
          </TouchableOpacity>

          <Text className="text-gray-600 text-sm flex-1">
            I agree to the{" "}
            <Text className="text-purple-600 underline">Terms of Service</Text>{" "}
            and{" "}
            <Text className="text-purple-600 underline">Privacy Policy</Text>.
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => {}}
          className="bg-gradient-to-r from-[#6A11CB] to-[#2575FC] py-3 rounded-xl mt-2"
        >
          <Text className="text-center text-white font-semibold text-base">
            Create Account
          </Text>
        </TouchableOpacity>

        <Text className="text-center text-gray-600 text-sm mt-4">
          Already have an account?{" "}
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
