import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { useColorScheme } from "@/hooks/use-color-scheme";
import "./global.css"
import { Toast } from "react-native-toast-message/lib/src/Toast";
export const unstable_settings = {
  anchor: "(auth)", //Set the default page when the app launches
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(dashboard)" options={{ headerShown: false }} />
        <Stack.Screen name="(mbti-check)" options={{ headerShown: false }} />
      </Stack>
      <Toast></Toast>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
