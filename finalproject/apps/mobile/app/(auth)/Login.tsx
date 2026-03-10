"use client";

import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className="flex-1 items-center justify-center px-6 bg-white">

      <TouchableOpacity
        onPress={() => router.back()}
        className="absolute left-4 top-12"
      >
        <Feather name="arrow-left" size={28} color="#555" />
      </TouchableOpacity>

      <Text className="text-3xl font-bold text-gray-900 mt-10">
        Welcome Back
      </Text>

      <Text className="text-gray-500 text-sm mt-2 text-center">
        Continue your intentional connection journey.
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
              className="w-full bg-gray-100 rounded-xl py-3 pl-12 pr-4 text-gray-900"
              autoCapitalize="none"
              keyboardType="email-address"
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

        <TouchableOpacity
          onPress={() => router.push("/ForgotPassword")}
          className="self-end"
        >
          <Text className="text-purple-600 text-sm font-medium">
            Forgot Password?
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {}}
          className="bg-gradient-to-r from-[#6A11CB] to-[#2575FC] py-3 rounded-xl mt-2"
        >
          <Text className="text-center text-white font-semibold text-base">
            Log In
          </Text>
        </TouchableOpacity>

        <Text className="text-center text-gray-600 text-sm mt-4">
          Don’t have an account?{" "}
          <Text
            className="text-purple-600 font-semibold"
            onPress={() => router.push("/SignUp")}
          >
            Sign Up
          </Text>
        </Text>
      </View>
    </View>
  );
}
