import { useEffect } from "react";
import { router, useSegments, Stack } from "expo-router";
import * as Linking from "expo-linking";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { useColorScheme } from "@/hooks/use-color-scheme";
import "./global.css";
import Toast from "react-native-toast-message";
import { AuthProvider, useAuth } from "./context/AuthContext";

export const unstable_settings = {
  anchor: "(tabs)",
};

function LayoutWithAuth() {
  const { user, loading } = useAuth();
  const segments = useSegments();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!user && !inAuthGroup) {
      // Redirect to login if unauthenticated and not already in auth group
      router.replace('/(auth)/login');
    } else if (user && inAuthGroup) {
      // Redirect away from login if authenticated
      router.replace('/(mbti-check)');
    }
  }, [user, loading, segments]);

  // Don't render anything until we know the auth status to prevent flickering
  if (loading) {
    return null; 
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(dashboard)" />
        <Stack.Screen name="(mbti-check)" />
        <Stack.Screen name="(matches)/index" />
        <Stack.Screen name="(chat)/room/[id]/index" />
        <Stack.Screen name="(chat)/room/[id]/report" />
        <Stack.Screen name="(chat)/room/[id]/reportDetail" />
        <Stack.Screen name="(chat)/room/[id]/settings" />
        <Stack.Screen name="(more)" />
        <Stack.Screen name="(tabs)" />
      </Stack>
      <Toast />
      <StatusBar style="auto" />
    </>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    const handleDeepLink = (event: Linking.EventType) => {
      const url = event.url;
      console.log("Deep link received:", url);

      const { queryParams } = Linking.parse(url);
      const oobCode = queryParams?.oobCode;

      if (oobCode) {
        console.log("Reset code found:", oobCode);

        setTimeout(() => {
          router.push({
            pathname: "/(auth)/resetPassword",
            params: { oobCode: oobCode as string },
          });
        }, 100);
      }
    };

    const subscription = Linking.addEventListener("url", handleDeepLink);

    Linking.getInitialURL().then((url) => {
      if (url) {
        console.log("Initial URL:", url);
        handleDeepLink({ url });
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <AuthProvider>
      <LayoutWithAuth />
    </AuthProvider>
  );
}