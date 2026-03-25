import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { Stack, useRouter, useLocalSearchParams } from "expo-router";
import { Entypo, Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

const reportDetail = () => {
  const router = useRouter();
  const { label } = useLocalSearchParams();
  const [selectedSubReason, setSelectedSubReason] = useState<string | null>(
    null,
  );
  const [text, setText] = useState("");

  const subReason = [
    "Attempted/committed fraud",
    "Fraud and misinformation",
    "Pornography",
    "Dating",
    "Foul language and racism",
    "Social media marketing or advertising",
    "Religion, politics, and other controversial topics",
    "Other",
  ];
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View style={styles.headerTopBar}>
        <View className="flex-row items-center justify-between px-5 py-4 bg-white">
          <TouchableOpacity onPress={() => router.back()}>
            <Entypo name="chevron-left" size={24} color="#1e293b" />
          </TouchableOpacity>
          <Text className="text-lg font-bold text-slate-900">Report</Text>
          <TouchableOpacity
            disabled={!selectedSubReason}
            style={[styles.nextButton, !selectedSubReason && { opacity: 0.5 }]}
          >
            <Text style={styles.nextButtonText}>Next</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          <View style={styles.groupCard}>
            {subReason.map((reason, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.itemContainer,
                  index !== subReason.length - 1 && {
                    borderBottomWidth: 1,
                    borderBottomColor: "#F1F5F9",
                  },
                ]}
                onPress={() => setSelectedSubReason(reason)}
              >
                <Text style={styles.itemText}>{reason}</Text>
                <Ionicons
                  name={
                    selectedSubReason === reason
                      ? "checkmark-circle"
                      : "ellipse-outline"
                  }
                  size={24}
                  color={selectedSubReason === reason ? "#6366F1" : "#CBD5E1"}
                />
              </TouchableOpacity>
            ))}
            {selectedSubReason === "Other" && (
              <TextInput
                style={styles.textInput}
                placeholder="Please briefly describe your reasons for reporting."
                multiline
                value={text}
                onChangeText={setText}
                placeholderTextColor="#94a3b8"
              />
            )}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default reportDetail;

const styles = StyleSheet.create({
  headerTopBar: {
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  nextButton: {
    backgroundColor: "#6366F1",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  nextButtonText: { color: "white", fontWeight: "bold" },
  groupCard: {
    backgroundColor: "white",
    borderRadius: 16,
    marginHorizontal: 20,
    marginTop: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
  },
  itemText: { fontSize: 15, color: "#334155", flex: 1, marginRight: 10 },
  textInput: {
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    padding: 16,
    height: 120,
    textAlignVertical: "top",
    marginTop: 10,
    marginBottom: 10,
    fontSize: 14,
    color: "#334155",
  },
});
