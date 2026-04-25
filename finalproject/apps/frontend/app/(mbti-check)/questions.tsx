import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ProgressBar, MD3Colors } from "react-native-paper";
import { useState } from "react";
import { useRouter } from "expo-router";

type MBTIType = "E" | "I" | "S" | "N" | "T" | "F" | "J" | "P";

const questions = [
  // E / I
  {
    id: 1,
    question: "You recharge by:",
    answers: [
      { text: "Being around people", result: "E" },
      { text: "Spending time alone", result: "I" },
    ],
  },

  // S / N
  {
    id: 2,
    question: "You prefer:",
    answers: [
      { text: "Focus on concrete details", result: "S" },
      { text: "Explore possibilities and patterns", result: "N" },
    ],
  },

  // T / F
  {
    id: 3,
    question: "When making decisions, you rely more on:",
    answers: [
      { text: "Logic and facts", result: "T" },
      { text: "Feelings and values", result: "F" },
    ],
  },

  // J / P
  {
    id: 4,
    question: "You feel better when:",
    answers: [
      { text: "Plans are set and organized", result: "J" },
      { text: "Things are flexible and spontaneous", result: "P" },
    ],
  },
];

function Questions() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [scores, setScores] = useState({
    E: 0,
    I: 0,
    S: 0,
    N: 0,
    T: 0,
    F: 0,
    J: 0,
    P: 0,
  });
  const totalSteps = 4;
  const currentQuestion = questions[currentStep];

  const handleAnswer = (type: MBTIType) => {
    setScores((prev) => ({ ...prev, [type]: prev[type] + 1 }));

    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      const result =
        (scores.E > scores.I ? "E" : "I") +
        (scores.S > scores.N ? "S" : "N") +
        (scores.T > scores.F ? "T" : "F") +
        (scores.J > scores.P ? "J" : "P");

      router.push({
        pathname: "/(mbti-check)/result",
        params: { mbti: result },
      });
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <View
          style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
          className="h-full bg-purple-600"
        />
      </View>

      <View className="flex-1 justify-center px-6">
        <Text className="text-2xl font-bold text-center mb-10 text-slate-800">
          {currentQuestion.question}
        </Text>

        <View className="gap-y-4">
          {currentQuestion.answers.map((answer, index) => {
            return (
              <TouchableOpacity
                key={index}
                onPress={() => handleAnswer(answer.result as MBTIType)}
                activeOpacity={0.7}
                className="w-full bg-slate-50 border border-slate-200 p-6 rounded-2xl active:bg-purple-50"
              >
                <Text>{answer.text}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </SafeAreaView>
  );
}

export default Questions;

const styles = StyleSheet.create({});
