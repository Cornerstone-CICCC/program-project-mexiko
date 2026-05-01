import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "react-native";
import { Colors } from "@/constants/Colors";

export default function MBTITestLayout() {
  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme];

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,

          contentStyle: {
            backgroundColor:
              theme?.background ?? (colorScheme === "dark" ? "#000" : "#fff"),
          },

          animation: "slide_from_right",
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="questions" />
        <Stack.Screen name="result" />
      </Stack>

      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
    </>
  );
}
