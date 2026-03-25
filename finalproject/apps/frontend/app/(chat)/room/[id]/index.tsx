import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import { useLocalSearchParams, Stack, Link } from "expo-router";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Entypo, MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Audio } from "expo-av";

interface Message {
  id: string;
  text: string;
  image?: string | null;
  audio?: string | null;
  time: string;
  isMe: boolean;
}

const ChatRoom = () => {
  const { id } = useLocalSearchParams();

  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "I'd love to hear more about your",
      time: "2m ago",
      isMe: false,
    },
    { id: "2", text: "Hi", time: "2m ago", isMe: true },
  ]);

  const sendMessage = () => {
    if (inputText.trim().length > 0) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: inputText,
        time: "Just now",
        isMe: true,
      };

      setMessages((prev) => [...prev, newMessage]);
      setInputText("");
    }
  };

  const [image, setImage] = useState<string | null>(null);

  const sendImageMessage = (uri: string) => {
    const newMessage = {
      id: Date.now().toString(),
      text: "",
      image: uri,
      time: "Just now",
      isMe: true,
    };
    console.log("uri", newMessage.image);
    setMessages((prev) => [...prev, newMessage]);
  };

  const editImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    //console.log("status", status);

    if (status !== "granted") {
      alert("Permission denied");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      //allowsEditing: true,
      aspect: [1, 1],
      allowsMultipleSelection: true,
      selectionLimit: 5,
      quality: 1,
    });

    if (!result.canceled && result.assets) {
      const now = Date.now();

      const newImageMessages: Message[] = result.assets.map((asset, index) => ({
        id: `${now}-${index}-${Math.random().toString(36).substring(2, 9)}`,
        text: "",
        image: asset.uri,
        time: "Just now",
        isMe: true,
      }));

      setMessages((prev) => [...prev, ...newImageMessages]);
    }
  };

  const scrollRef = React.useRef<ScrollView>(null);
  React.useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const [recording, setRecording] = useState<Audio.Recording | null>(null);

  const startRecording = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== "granted") return alert("Microphone permission denied");

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY,
      );
      setRecording(recording);
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    setRecording(null);
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();

    if (uri) {
      const newAudioMessage: Message = {
        id: `${Date.now()}-${Math.random()}`,
        text: "Audio Message",
        audio: uri,
        time: "Just now",
        isMe: true,
      };
      setMessages((prev) => [...prev, ...[newAudioMessage]]);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
      {/* header */}
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.headerTopBar}>
        <View className="flex-row items-center justify-between px-5 py-4 bg-white ">
          <Link href="../" push asChild>
            <Entypo name="chevron-thin-left" size={24} color="#1e293b" />
          </Link>
          <View className="flex-1">
            <View className="flex-row items-center">
              <Text className="text-xl font-bold text-slate-900 mr-2">
                ENFP
              </Text>
              <View className="bg-green-100 px-2 py-0.5 rounded-full">
                <Text className="text-green-600 text-[10px] font-bold">
                  94% Match
                </Text>
              </View>
            </View>
            <Text className="text-slate-400 text-[10px] mt-1 ">
              <MaterialCommunityIcons
                name="clock-outline"
                size={14}
                color="#94a3b8"
              />
              18h 23m until reveal decision
            </Text>
          </View>
          <Link href={`/room/${id}/settings`} asChild>
            <TouchableOpacity>
              <Entypo name="dots-three-vertical" size={20} color="#1e293b" />
            </TouchableOpacity>
          </Link>
        </View>
      </View>
      <View style={styles.unlockBanner}>
        <Text className="text-slate-500 text-xs">
          <Ionicons name="lock-closed-outline" size={14} color="#64748b" /> Full
          profiles unlock after mutual consent
        </Text>
      </View>

      {/* chat */}
      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 40 }}
        ref={scrollRef}
      >
        {messages.map((msg) => (
          <View
            key={msg.id}
            style={[
              styles.cardContainer,
              {
                alignSelf: msg.isMe ? "flex-end" : "flex-start",
                backgroundColor: msg.isMe ? "rgba(79, 70, 229, 1)" : "white",
                marginVertical: 5,
                marginRight: msg.isMe ? 5 : 0,
                marginLeft: msg.isMe ? 0 : 5,
                maxWidth: "75%",
                padding: msg.image ? 4 : 12,
              },
            ]}
          >
            <View className="justify-center">
              {msg.image ? (
                <Image
                  source={{ uri: msg.image }}
                  style={{ width: 200, height: 200, borderRadius: 12 }}
                  resizeMode="cover"
                />
              ) : msg.audio ? (
                <TouchableOpacity
                  onPress={async () => {
                    const { sound } = await Audio.Sound.createAsync({
                      uri: msg.audio!,
                    });
                    await sound.playAsync();
                  }}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: msg.isMe
                      ? "rgba(255,255,255,0.2)"
                      : "#F3F4F6",
                    padding: 10,
                    borderRadius: 15,
                  }}
                >
                  <Ionicons
                    name="play"
                    size={20}
                    color={msg.isMe ? "white" : "#4F46E5"}
                  />
                  <Text
                    style={{
                      color: msg.isMe ? "white" : "#4F46E5",
                      marginLeft: 8,
                      fontWeight: "600",
                    }}
                  >
                    Voice Message
                  </Text>
                </TouchableOpacity>
              ) : (
                <Text
                  style={{
                    color: msg.isMe ? "white" : "#475569",
                    fontSize: 14,
                  }}
                >
                  {msg.text}
                </Text>
              )}

              <Text
                style={{
                  color: msg.isMe ? "#c7d2fe" : "#94a3b8",
                  fontSize: 10,
                  marginTop: 4,
                  textAlign: "right",
                }}
              >
                {msg.time}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        <View className="px-5 py-4 bg-white border-t border-gray-100 ">
          <TouchableOpacity
            activeOpacity={0.8}
            className="bg-purple-600 py-4 rounded-2xl items-center mb-4 shadow-sm"
          >
            <Text className="text-white font-bold text-lg">
              Ready to Reveal Profiles?
            </Text>
          </TouchableOpacity>

          <View className="flex-row items-center">
            <View className="flex-1 bg-gray-100 rounded-full px-5 py-3 flex-row items-center">
              <TextInput
                placeholder="Type a message"
                className="flex-1"
                value={inputText}
                onChangeText={setInputText}
                onSubmitEditing={sendMessage}
              />
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={editImage}
                style={styles.smallCameraButton}
                className="ml-2"
              >
                <Entypo name="image" size={22} color="#94a3b8" />
              </TouchableOpacity>

              <TouchableOpacity
                onLongPress={startRecording}
                onPressOut={stopRecording}
                className="ml-2"
              >
                <Entypo
                  name="mic"
                  size={22}
                  color={recording ? "#ef4444" : "#94a3b8"}
                />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              className="bg-purple-200 w-12 h-12 rounded-full ml-3 items-center justify-center"
              onPress={sendMessage}
            >
              <TouchableOpacity onPress={sendMessage}>
                <Entypo name="paper-plane" size={20} color="#a17fdb" />
              </TouchableOpacity>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatRoom;

const styles = StyleSheet.create({
  headerTopBar: {
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  unlockBanner: {
    backgroundColor: "#F5F7FF",
    paddingVertical: 12,
    alignItems: "center",
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 12,
  },
  cardContainer: {
    borderRadius: 24,
    backgroundColor: "white",
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  smallCameraButton: {
    //backgroundColor: "#a17fdb",
    padding: 10,
    borderRadius: 100,
    elevation: 8,
  },
});
