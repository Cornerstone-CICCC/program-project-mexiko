import { Tabs } from "expo-router";
import React, { useState, useEffect, useCallback } from "react";

import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Ionicons } from "@expo/vector-icons";

import { getSocket } from "../utils/socket";

import axios from "axios";
import { useRouter, useFocusEffect } from "expo-router";

axios.defaults.baseURL = "http://localhost:3500";
axios.defaults.withCredentials = true;

export default function TabLayout() {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme];

  const [loading, setLoading] = useState(true);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/chatroom");
      console.log("chat room response", response);
      if (response.data.currentUserId) {
        setCurrentUserId(response.data.currentUserId);
      }
    } catch (error) {
      console.error("Fetch rooms error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("currentUserId", currentUserId);
    if (!currentUserId) return;

    const socket = getSocket(currentUserId);
    if (!socket) return;

    const sendPing = () => {
      console.log("📡 [Global Socket] Sending ping_online...");
      socket.emit("ping_online");
    };

    if (socket.connected) sendPing();
    socket.on("connect", sendPing);

    const interval = setInterval(() => {
      if (socket.connected) sendPing();
    }, 30000);

    return () => {
      socket.off("connect", sendPing);
      clearInterval(interval);
    };
  }, [currentUserId]);

  useFocusEffect(
    useCallback(() => {
      console.log("fetch room");
      fetchRooms();
    }, []),
  );

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.navBackground,
          paddingTop: 10,
          height: 90,
        },
        tabBarActiveTintColor: theme.iconColorFocused,
        tabBarInactiveTintColor: theme.iconColor,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Matches",
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? "heart" : "heart-outline"}
              size={24}
              color={focused ? theme.iconColorFocused : theme.iconColor}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: "Chats",
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? "chatbox" : "chatbox-outline"}
              size={24}
              color={focused ? theme.iconColorFocused : theme.iconColor}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              size={24}
              color={focused ? theme.iconColorFocused : theme.iconColor}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: "More",
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={
                focused ? "ellipsis-horizontal" : "ellipsis-horizontal-outline"
              }
              size={24}
              color={focused ? theme.iconColorFocused : theme.iconColor}
            />
          ),
        }}
      />
    </Tabs>
  );
}
