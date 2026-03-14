import { Tabs } from "expo-router";
import React from "react";

import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Ionicons } from "@expo/vector-icons";

export default function TabLayout() {
  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme];
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
