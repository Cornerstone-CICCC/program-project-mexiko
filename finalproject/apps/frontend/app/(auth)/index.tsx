import { Text, View } from "react-native";
import { Link } from "expo-router";
import { Button } from "@/components/Button";

export default function App() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-xl font-bold text-blue-500">
        Welcome to Nativewind!
      </Text>

      <Link href="/(mbti-check)" push asChild>
        <Button title="mbti TEst" />
      </Link>
    </View>
  );
}
