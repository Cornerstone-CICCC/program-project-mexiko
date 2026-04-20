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
  Modal,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, Stack, Link } from "expo-router";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Entypo } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Audio, Video } from "expo-av";
import axios from "axios";
import { getSocket } from "../../../utils/socket";
import * as FileSystem from "expo-file-system/legacy";
import { calculateSynergy } from "@/utils/mbti";

const SERVER_URL = "http://localhost:3500";

axios.defaults.baseURL = SERVER_URL;
axios.defaults.withCredentials = true;

interface Message {
  id: string;
  text: string;
  images?: string[] | null;
  video?: string | null;
  audio?: string | null;
  time: string;
  isMe: boolean;
  isRead: boolean;
  isDelivered: boolean;
  createdAt: string;
}

const ChatRoom = () => {
  const { id: roomId } = useLocalSearchParams();
  const [inputText, setInputText] = useState("");
  const [myId, setMyId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const [selectedFullImage, setSelectedFullImage] = useState<string | null>(
    null,
  );

  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  const isFetchingRef = React.useRef(false);
  const [targetInfo, setTargetInfo] = useState<{
    mbti: string;
    score: number;
  } | null>(null);

  const fetchMessages = async (isMore = false) => {
    if (!roomId || isFetchingRef.current) return;
    if (isMore && !hasMore) return;

    isFetchingRef.current = true;

    try {
      if (isMore) setIsLoadingMore(true);
      const currentPage = isMore ? page + 1 : 1;

      const response = await axios.get(
        `/chatroom/${roomId}?page=${currentPage}`,
      );

      console.log("Room API Response:", response.data);

      const {
        room,
        messages: dbMessages = [],
        myId: currentUserId,
      } = response.data;

      setMyId(currentUserId);

      if (
        room &&
        room.participants &&
        Array.isArray(room.participants) &&
        room.participants.length > 0
      ) {
        const me = room.participants.find(
          (p: any) => p.firebaseUid === currentUserId,
        );
        const other = room.participants.find(
          (p: any) => p.firebaseUid !== currentUserId,
        );

        const myMbti = me?.mbtiType || me?.mbti || "ENFP";
        const otherMbti = other?.mbtiType || other?.mbti || "ENFP";

        console.log("MBTI Check:", { myMbti, otherMbti });

        const score = calculateSynergy(myMbti, otherMbti);

        if (other) {
          setTargetInfo({
            mbti: otherMbti,
            score: score,
          });
        }
      } else {
        console.log("⚠️ No participants data found in room object");
        setTargetInfo({ mbti: "---", score: 0 });
      }

      if (dbMessages.length < 50) setHasMore(false);

      const formatted = dbMessages.map((msg: any) => ({
        id: msg._id,
        text: msg.content,
        images:
          msg.messageType === "image"
            ? (Array.isArray(msg.content)
                ? msg.content
                : msg.content.split(",")
              ).map((img: string) => `${SERVER_URL}/uploads/${img}`)
            : [],
        video:
          msg.messageType === "video"
            ? `${SERVER_URL}/uploads/${msg.content}`
            : null,
        audio:
          msg.messageType === "voice"
            ? `${SERVER_URL}/uploads/${msg.content}`
            : null,
        createdAt: msg.createdAt,
        time: new Date(msg.createdAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        isMe: msg.senderId === currentUserId,
        isRead: msg.isRead,
      }));
      console.log("formatted", formatted);
      setMessages((prev) => {
        const combined = [...formatted, ...prev];
        const uniqueMessages = Array.from(
          new Map(combined.map((m) => [m.id, m])).values(),
        );
        return uniqueMessages.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        );
      });

      if (isMore) setPage(currentPage);
    } catch (error: any) {
      console.error("Fetch error:", error.message);
    } finally {
      setIsLoadingMore(false);
      setTimeout(() => {
        isFetchingRef.current = false;
      }, 2000);
    }
  };
  //Modal
  const renderImageModal = () => (
    <Modal
      visible={!!selectedFullImage}
      transparent={true}
      onRequestClose={() => setSelectedFullImage(null)}
    >
      <TouchableOpacity
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.9)",
          justifyContent: "center",
          alignItems: "center",
        }}
        onPress={() => setSelectedFullImage(null)}
      >
        {selectedFullImage && (
          <Image
            source={{ uri: selectedFullImage }}
            style={{ width: "100%", height: "80%" }}
            resizeMode="contain"
          />
        )}
      </TouchableOpacity>
    </Modal>
  );

  const renderVideoModal = () => (
    <Modal
      visible={!!selectedVideo}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setSelectedVideo(null)}
    >
      <View
        style={{ flex: 1, backgroundColor: "black", justifyContent: "center" }}
      >
        {selectedVideo && (
          <Video
            source={{ uri: selectedVideo }}
            style={{ width: "100%", height: "100%" }}
            useNativeControls
            resizeMode="contain"
            shouldPlay
          />
        )}

        <TouchableOpacity
          style={{ position: "absolute", top: 50, right: 20, zIndex: 10 }}
          onPress={() => setSelectedVideo(null)}
        >
          <Entypo name="cross" size={30} color="white" />
        </TouchableOpacity>
      </View>
    </Modal>
  );

  useEffect(() => {
    if (roomId) fetchMessages();
  }, [roomId]);

  const scrollRef = React.useRef<ScrollView>(null);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  useEffect(() => {
    if (messages.length > 0 && page === 1 && !isLoadingMore) {
      scrollRef.current?.scrollToEnd({ animated: true });
    }
  }, [messages]);

  useEffect(() => {
    if (!roomId || !myId) return;
    const socket = getSocket();
    socket.emit("join_room", roomId);

    socket.on("messages_read", ({ roomId: readRoomId, userId: readerId }) => {
      if (readRoomId !== roomId) return;
      if (readerId !== myId) {
        setMessages((prev) =>
          prev.map((msg) => (msg.isMe ? { ...msg, isRead: true } : msg)),
        );
      }
    });

    socket.on("receive_message", (newMessage) => {
      if (newMessage.senderId === myId) return;
      const formatted = {
        id: newMessage._id,
        text: newMessage.content,
        image:
          newMessage.messageType === "image"
            ? `${SERVER_URL}/uploads/${newMessage.content}`
            : null,
        video:
          newMessage.messageType === "video"
            ? `${SERVER_URL}/uploads/${newMessage.content}`
            : null,
        audio:
          newMessage.messageType === "voice"
            ? `${SERVER_URL}/uploads/${newMessage.content}`
            : null,
        createdAt: newMessage.createdAt,
        time: new Date(newMessage.createdAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        isMe: false,
        isRead: true,
      };
      setMessages((prev) => [...prev, formatted]);
      socket.emit("mark_as_read", { roomId, userId: myId });
    });

    return () => {
      socket.off("receive_message");
      socket.off("messages_read");
    };
  }, [roomId, myId]);

  const sendMessage = async () => {
    if (inputText.trim().length > 0) {
      const messageContent = inputText;
      setInputText("");
      try {
        const response = await axios.post(`/chatroom/${roomId}/messages`, {
          content: messageContent,
          messageType: "text",
          roomId: roomId,
        });
        if (response.data) {
          const newMsg = response.data.data;
          const formattedNewMsg = {
            id: newMsg._id,
            text: newMsg.content,
            createdAt: new Date().toISOString(),
            time: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            isMe: true,
            isRead: false,
            isDelivered: false,
          };
          setMessages((prev) => [...prev, formattedNewMsg]);
          getSocket().emit("send_message", { roomId, message: newMsg });
        }
      } catch (error) {
        console.error("Failed to send message:", error);
        setInputText(messageContent);
      }
    }
  };

  const editImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") return;

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsMultipleSelection: true,
      selectionLimit: 5,
      quality: 0.7,
    });

    if (!result.canceled && result.assets) {
      const formData = new FormData();
      const hasVideo = result.assets.some((asset) => asset.type === "video");

      result.assets.forEach((asset) => {
        const isVideo = asset.type === "video";

        formData.append(isVideo ? "file" : "files", {
          uri:
            Platform.OS === "ios"
              ? asset.uri.replace("file://", "")
              : asset.uri,
          type: isVideo ? "video/mp4" : "image/jpeg",
          name: isVideo ? `video-${Date.now()}.mp4` : `photo-${Date.now()}.jpg`,
        } as any);
      });

      formData.append("messageType", hasVideo ? "video" : "image");
      formData.append("roomId", roomId as string);
      try {
        const response = await axios.post(
          `/chatroom/${roomId}/messages`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          },
        );
        if (response.data) {
          fetchMessages();
          getSocket().emit("send_message", {
            roomId,
            message: response.data.data,
          });
        }
      } catch (error) {
        console.error("Media upload failed:", error);
      }
    }
  };

  const [recording, setRecording] = useState<Audio.Recording | null>(null);

  const startRecording = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();

      if (status !== "granted") return;

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      const { recording: newRecording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY,
      );
      setRecording(newRecording);
    } catch (err) {
      console.error(err);
    }
  };

  const stopRecording = async () => {
    if (!recording) return;
    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecording(null);
      if (uri) {
        const formData = new FormData();
        formData.append("file", {
          uri: Platform.OS === "ios" ? uri.replace("file://", "") : uri,
          type: "audio/m4a",
          name: `voice.m4a`,
        } as any);
        formData.append("messageType", "voice");
        formData.append("roomId", roomId as string);
        const response = await axios.post(
          `/chatroom/${roomId}/messages`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } },
        );
        if (response.data) {
          fetchMessages();
          getSocket().emit("send_message", {
            roomId,
            message: response.data.data,
          });
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const AudioPlayer = ({ uri, isMe }: { uri: string; isMe: boolean }) => {
    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
      return sound
        ? () => {
            sound.unloadAsync();
          }
        : undefined;
    }, [sound]);

    async function playSound() {
      try {
        if (sound) {
          const status = await sound.getStatusAsync();
          if (status.isLoaded) {
            if (isPlaying) {
              await sound.stopAsync();
              setIsPlaying(false);
            } else {
              await sound.replayAsync();
              setIsPlaying(true);
            }
          }
        } else {
          const { sound: newSound } = await Audio.Sound.createAsync(
            { uri },
            { shouldPlay: true },
          );
          setSound(newSound);
          setIsPlaying(true);

          newSound.setOnPlaybackStatusUpdate((status) => {
            if (status.isLoaded) {
              if (status.didJustFinish) {
                setIsPlaying(false);
              }
            } else if (status.error) {
              console.error(`Playback Error: ${status.error}`);
            }
          });
        }
      } catch (error) {
        console.error("Error playing sound:", error);
      }
    }

    return (
      <TouchableOpacity
        onPress={playSound}
        style={{ flexDirection: "row", alignItems: "center", padding: 5 }}
      >
        <Entypo
          name={isPlaying ? "controller-stop" : "controller-play"}
          size={24}
          color={isMe ? "white" : "#4F46E5"}
        />
        <Text style={{ color: isMe ? "white" : "#334155", marginLeft: 8 }}>
          Voice Message
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.headerTopBar}>
        <View className="flex-row items-center justify-between px-5 py-4 bg-white ">
          <Link href="../" push asChild>
            <Entypo name="chevron-thin-left" size={24} color="#1e293b" />
          </Link>
          <View className="flex-1 ml-4">
            <View className="flex-row items-center">
              <Text className="text-xl font-bold text-slate-900 mr-2">
                {targetInfo?.mbti || "---"}
              </Text>
              <View className="bg-green-100 px-2 py-0.5 rounded-full">
                <Text className="text-green-600 text-[10px] font-bold">
                  {targetInfo
                    ? `${targetInfo.score}% Match`
                    : "Calculating..."}{" "}
                </Text>
              </View>
            </View>
          </View>
          <Link href={`/room/${roomId}/settings`} asChild>
            <TouchableOpacity>
              <Entypo name="dots-three-vertical" size={20} color="#1e293b" />
            </TouchableOpacity>
          </Link>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        ref={scrollRef}
        onScrollBeginDrag={() => setIsUserScrolling(true)}
        onScrollEndDrag={() => setIsUserScrolling(false)}
        onScroll={({ nativeEvent }) => {
          const { contentOffset } = nativeEvent;
          if (
            contentOffset.y <= 10 &&
            isUserScrolling &&
            !isLoadingMore &&
            hasMore &&
            !isFetchingRef.current
          ) {
            console.log("dragging");
            fetchMessages(true);
          }
        }}
        scrollEventThrottle={16}
        maintainVisibleContentPosition={{
          minIndexForVisible: 0,
          autoscrollToTopThreshold: 10,
        }}
      >
        {isLoadingMore && (
          <ActivityIndicator
            size="small"
            color="#4F46E5"
            style={{ marginVertical: 10 }}
          />
        )}
        {messages.map((msg, index) => {
          const showDateHeader =
            index === 0 ||
            new Date(messages[index - 1].createdAt).toDateString() !==
              new Date(msg.createdAt).toDateString();
          return (
            <React.Fragment key={msg.id}>
              {showDateHeader && (
                <View style={styles.dateHeaderContainer}>
                  <Text style={styles.dateHeaderText}>
                    {new Date(msg.createdAt).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </Text>
                </View>
              )}
              <View
                style={[
                  styles.messageWrapper,
                  { justifyContent: msg.isMe ? "flex-end" : "flex-start" },
                ]}
              >
                <View style={{ maxWidth: "80%" }}>
                  <View
                    style={[
                      styles.bubble,
                      {
                        backgroundColor: msg.isMe ? "#4F46E5" : "#FFFFFF",
                        borderBottomRightRadius: msg.isMe ? 2 : 18,
                        borderBottomLeftRadius: msg.isMe ? 18 : 2,
                      },
                    ]}
                  >
                    {msg.images && msg.images.length > 0 ? (
                      <View
                        style={{
                          flexDirection: "row",
                          flexWrap: "wrap",
                          gap: 5,
                          width: 200,
                        }}
                      >
                        {msg.images.map((imgUri, i) => (
                          <TouchableOpacity
                            key={i}
                            onPress={() => setSelectedFullImage(imgUri)}
                          >
                            <Image
                              source={{ uri: imgUri }}
                              style={{
                                width: msg.images!.length > 1 ? 95 : 180,
                                height: msg.images!.length > 1 ? 95 : 180,
                                borderRadius: 8,
                              }}
                            />
                          </TouchableOpacity>
                        ))}
                      </View>
                    ) : msg.video ? (
                      <TouchableOpacity
                        onPress={() => setSelectedVideo(msg.video)}
                      >
                        <View pointerEvents="none">
                          <Video
                            source={{ uri: msg.video }}
                            style={{
                              width: 200,
                              height: 150,
                              borderRadius: 12,
                            }}
                            resizeMode="cover"
                            shouldPlay={false}
                          />

                          <View
                            style={{
                              position: "absolute",
                              top: "40%",
                              left: "42%",
                            }}
                          >
                            <Entypo
                              name="controller-play"
                              size={40}
                              color="white"
                              style={{ opacity: 0.8 }}
                            />
                          </View>
                        </View>
                      </TouchableOpacity>
                    ) : msg.audio ? (
                      <AudioPlayer uri={msg.audio} isMe={msg.isMe} />
                    ) : (
                      <Text style={{ color: msg.isMe ? "white" : "#334155" }}>
                        {msg.text}
                      </Text>
                    )}
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "flex-end",
                      alignItems: "center",
                      marginTop: 4,
                    }}
                  >
                    {msg.isMe && !msg.isRead && (
                      <Text
                        style={{
                          color: "#4F46E5",
                          fontSize: 10,
                          marginRight: 4,
                        }}
                      >
                        1
                      </Text>
                    )}
                    <Text style={styles.timeText}>{msg.time}</Text>
                  </View>
                </View>
              </View>
            </React.Fragment>
          );
        })}
      </ScrollView>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View className="px-5 py-4 bg-white border-t border-gray-100 flex-row items-center">
          <TextInput
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type a message"
            className="flex-1 bg-gray-100 rounded-full px-4 py-6"
          />
          <TouchableOpacity onPress={editImage} className="ml-2">
            <Entypo name="image" size={24} color="#94a3b8" />
          </TouchableOpacity>
          <TouchableOpacity
            onLongPress={startRecording}
            onPressOut={stopRecording}
            className="ml-2"
          >
            <Entypo
              name="mic"
              size={24}
              color={recording ? "red" : "#94a3b8"}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={sendMessage}
            className="ml-2 bg-purple-500 p-2 rounded-full"
          >
            <Entypo name="paper-plane" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
      {renderImageModal()}
      {renderVideoModal()}
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
  dateHeaderContainer: { alignItems: "center", marginVertical: 20 },
  dateHeaderText: { fontSize: 12, color: "#94a3b8", fontWeight: "600" },
  messageWrapper: {
    flexDirection: "row",
    marginVertical: 5,
    paddingHorizontal: 15,
  },
  bubble: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
    elevation: 1,
  },
  timeText: { fontSize: 10, color: "#94a3b8", marginTop: 4 },
});
