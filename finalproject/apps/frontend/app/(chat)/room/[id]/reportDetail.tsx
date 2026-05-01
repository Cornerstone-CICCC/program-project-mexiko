import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { Stack, useRouter, useLocalSearchParams } from "expo-router";
import { Entypo, Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";

const reportDetail = () => {
  const router = useRouter();

  const { id, label, targetId, name } = useLocalSearchParams();
  console.log("id", id, "label:", label, "targetId: ", targetId, "name:", name);
  const [selectedSubReason, setSelectedSubReason] = useState<string | null>(
    null,
  );
  const [text, setText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subReasons = [
    "Attempted/committed fraud",
    "Fraud and misinformation",
    "Pornography",
    "Dating",
    "Foul language and racism",
    "Social media marketing or advertising",
    "Religion, politics, and other controversial topics",
    "Other",
  ];

  // Mapping frontend labels to backend Enum: Abuse | Harassment | FakeProfile | Spam | Other
  const getCategory = (frontendLabel: string): string => {
    switch (frontendLabel) {
      case "User profile":
        return "FakeProfile";
      case "Chat":
        return "Harassment";
      case "Moments":
        return "Abuse";
      default:
        return "Other";
    }
  };

  const handleReportSubmit = async () => {
    if (!selectedSubReason) return;

    try {
      setIsSubmitting(true);

      // Backend expects an array named 'reportItems'
      const reportData = {
        reportItems: [
          {
            targetId: String(targetId).trim(),
            chatRoomId: String(id).trim(),
            category: getCategory(label as string),
            description: `[Sub-reason: ${selectedSubReason}] Details: ${text}`,
            evidenceImages: [],
          },
        ],
      };

      const response = await axios.post("/reports", reportData);

      if (response.status === 201 || response.data.success) {
        Alert.alert(
          "Report Submitted",
          "Thank you for helping us keep the community safe. This user has been reported.",
          [
            {
              text: "OK",
              onPress: () => router.dismissAll(), // Close report flow and go back
            },
          ],
        );
      }
    } catch (error: any) {
      console.error(
        "Submit Report Error:",
        error.response?.data || error.message,
      );
      Alert.alert("Error", "Failed to submit report. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View style={styles.headerTopBar}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            onPress={() => router.back()}
            disabled={isSubmitting}
          >
            <Entypo name="chevron-left" size={24} color="#1e293b" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Report {name || "User"}</Text>
          <TouchableOpacity
            onPress={handleReportSubmit}
            disabled={!selectedSubReason || isSubmitting}
            style={[
              styles.nextButton,
              (!selectedSubReason || isSubmitting) && { opacity: 0.5 },
            ]}
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text style={styles.nextButtonText}>Submit</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View style={styles.groupCard}>
          <Text style={styles.sectionTitle}>
            Select a specific reason for "{label}"
          </Text>

          {subReasons.map((reason, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.itemContainer,
                index !== subReasons.length - 1 && {
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

          <View
            style={{
              marginTop: 20,
              borderTopWidth: 1,
              borderTopColor: "#F1F5F9",
              paddingTop: 20,
            }}
          >
            <Text style={styles.sectionTitle}>
              Additional Details (Optional)
            </Text>
            <TextInput
              style={styles.textInput}
              placeholder="Provide more context for the moderators..."
              multiline
              value={text}
              onChangeText={setText}
              placeholderTextColor="#94a3b8"
            />
          </View>
        </View>
      </ScrollView>
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
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontBold: "700",
    color: "#0f172a",
  },
  nextButton: {
    backgroundColor: "#6366F1",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 70,
    alignItems: "center",
  },
  nextButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  groupCard: {
    backgroundColor: "white",
    borderRadius: 16,
    marginHorizontal: 20,
    marginTop: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 10,
    fontWeight: "600",
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
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
});
