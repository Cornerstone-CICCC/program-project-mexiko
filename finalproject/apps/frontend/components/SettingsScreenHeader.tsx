import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

type SettingsScreenHeaderProps = {
  title: string;
};

export default function SettingsScreenHeader({
  title,
}: SettingsScreenHeaderProps) {
  return (
    <View style={styles.container}>
      <Pressable onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="chevron-back" size={22} color="#111827" />
      </Pressable>

      <Text style={styles.title}>{title}</Text>

      <View style={styles.spacer} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111827",
  },
  spacer: {
    width: 36,
    height: 36,
  },
});