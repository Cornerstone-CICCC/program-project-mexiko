import {
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Entypo } from "@expo/vector-icons";
import { Link } from "expo-router";
import * as ImagePicker from "expo-image-picker";

const Profile = () => {
  const [image, setImage] = useState<string | null>(null);

  const editImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    //console.log("status", status);

    if (status !== "granted") {
      alert("Permission denied");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Personal info */}
        <View className="bg-purple-600 p-10 items-center rounded-b-[40px]">
          <View className="w-32 h-32 bg-slate-200 rounded-full relative">
            <Image
              source={
                image
                  ? { uri: image }
                  : require("@/assets/images/man-profile-gray.png")
              }
              style={{ width: "100%", height: "100%", borderRadius: 100 }}
              resizeMode="cover"
            />
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={editImage}
              style={styles.smallCameraButton}
            >
              <Entypo name="camera" size={18} color="white" />
            </TouchableOpacity>
          </View>
          <Text className="text-white text-3xl font-bold my-2 mt-6">
            Dueon Han, 31
          </Text>
          <Text className="text-white opacity-80 mt-4">
            <Entypo name="map" size={24} color="white" /> Vancouver, BC
          </Text>
          <View className="flex-row items-center mb-6" style={styles.mbtiBadge}>
            <Text style={styles.mbtiText}>INFJ • The Advocate</Text>
          </View>
        </View>

        {/* About */}
        <View
          style={[
            styles.cardContainer,
            { marginTop: -40, marginHorizontal: 20 },
          ]}
        >
          <View className="flex-row justify-between items-center mb-5">
            <Text className="text-2xl font-bold text-slate-900">About</Text>
            <Link href="/1/edit" asChild>
              <TouchableOpacity>
                <Entypo name="pencil" size={24} color="#6366f1" />
              </TouchableOpacity>
            </Link>
          </View>
          <Text className="text-slate-600 leading-6 text-[16px]">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Magni
            nihil dolorum quis natus tempora laborum quaerat distinctio,
            repellat placeat ipsam vero laboriosam expedita facilis ratione
            adipisci doloribus provident in sint.
          </Text>
        </View>

        {/* communication style & relationship values */}
        <View
          style={[
            styles.cardContainer,
            { marginTop: 10, marginHorizontal: 20 },
          ]}
        >
          <View className="flex-row  items-center mb-5">
            <Text className="text-purple-600 text-2xl">
              <Entypo name="message" size={24} color="#6366f1" />
            </Text>
            <Text className="text-2xl font-bold text-slate-900">
              Communication Style
            </Text>
          </View>

          <View style={{ alignItems: "left", marginTop: 10 }}>
            <View className="flex-row items-center mb-2">
              <Entypo name="dot-single" size={24} color="#6366f1" />
              <Text className="text-slate-600 text-[16px] ml-1">
                Active listener
              </Text>
            </View>

            <View className="flex-row items-center mb-2">
              <Entypo name="dot-single" size={24} color="#6366f1" />
              <Text className="text-slate-600 text-[16px] ml-1">
                Empathetic communicator
              </Text>
            </View>

            <View className="flex-row items-center">
              <Entypo name="dot-single" size={24} color="#6366f1" />
              <Text className="text-slate-600 text-[16px] ml-1">
                Thoughtful responses
              </Text>
            </View>
          </View>

          <View className="flex-row  items-center mt-5">
            <Text className="text-purple-600 text-2xl">
              <Entypo name="heart" size={24} color="#6366f1" />
            </Text>
            <Text className="text-2xl font-bold text-slate-900">
              Relationship Values
            </Text>
          </View>
          <View style={{ alignItems: "left", marginTop: 10 }}>
            <View className="flex-row items-center mb-2">
              <Entypo name="dot-single" size={24} color="#6366f1" />
              <Text className="text-slate-600 text-[16px] ml-1">
                Emotional Depth
              </Text>
            </View>

            <View className="flex-row items-center mb-2">
              <Entypo name="dot-single" size={24} color="#6366f1" />
              <Text className="text-slate-600 text-[16px] ml-1">
                Mutual growth
              </Text>
            </View>

            <View className="flex-row items-center">
              <Entypo name="dot-single" size={24} color="#6366f1" />
              <Text className="text-slate-600 text-[16px] ml-1">
                Open communication
              </Text>
            </View>
          </View>
        </View>

        {/* communication style & relationship values */}
        <View
          style={[
            styles.cardContainer,
            { marginTop: 10, marginHorizontal: 20 },
          ]}
        >
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-2xl font-bold text-slate-900">Interests</Text>
            <Link href="/1/edit" asChild>
              <TouchableOpacity>
                <Entypo name="pencil" size={24} color="#6366f1" />
              </TouchableOpacity>
            </Link>
          </View>

          <View
            className="flex-row justify-start items-center mb-2"
            style={{ flexDirection: "row", flexWrap: "wrap", gap: 5 }}
          >
            <View
              className="flex-row items-center mb-6"
              style={styles.interestBadge}
            >
              <Text style={styles.interestText}>Reading</Text>
            </View>
            <View
              className="flex-row items-center mb-6"
              style={styles.interestBadge}
            >
              <Text style={styles.interestText}>Hiking</Text>
            </View>
            <View
              className="flex-row items-center mb-6"
              style={styles.interestBadge}
            >
              <Text style={styles.interestText}>Photography</Text>
            </View>
            <View
              className="flex-row items-center mb-6"
              style={styles.interestBadge}
            >
              <Text style={styles.interestText}>Art</Text>
            </View>
            <View
              className="flex-row items-center mb-6"
              style={styles.interestBadge}
            >
              <Text style={styles.interestText}>Cooking</Text>
            </View>
            <View
              className="flex-row items-center mb-6"
              style={styles.interestBadge}
            >
              <Text style={styles.interestText}>Yoga</Text>
            </View>
            <View
              className="flex-row items-center mb-6"
              style={styles.interestBadge}
            >
              <Text style={styles.interestText}>Music</Text>
            </View>
            <View
              className="flex-row items-center mb-6"
              style={styles.interestBadge}
            >
              <Text style={styles.interestText}>Travel</Text>
            </View>
          </View>
        </View>

        <View
          style={[
            styles.cardContainer,
            { marginTop: 10, marginHorizontal: 20 },
          ]}
        >
          <View className="flex-row justify-between items-center mb-5">
            <Text className="text-2xl font-bold text-slate-900">
              Preferences
            </Text>
            <Link href="/1/edit" asChild>
              <TouchableOpacity>
                <Entypo name="pencil" size={24} color="#6366f1" />
              </TouchableOpacity>
            </Link>
          </View>

          <View className="flex-row justify-between items-center mb-5">
            <Text className="text-2xl font-bold text-slate-900">Age Range</Text>
            <Text className="text-black-600 text-3l font-bold">24-32</Text>
          </View>

          <View className="flex-row justify-between items-center mb-5">
            <Text className="text-2xl  text-slate-900">Distance</Text>
            <Text className="text-black-600 text-3l font-bold">25 miles</Text>
          </View>
        </View>

        <TouchableOpacity activeOpacity={0.8} style={styles.buttonContainer}>
          <View style={[styles.gradient, { backgroundColor: "#7C3AED" }]}>
            <View className="flex-row items-center justify-center">
              <Text className="text-white text-xl mr-2">
                <Entypo name="pencil" size={24} color="white" />
              </Text>
              <Link href="/1/edit" asChild>
                <Text className="text-white text-xl font-bold">
                  Edit Profile
                </Text>
              </Link>
            </View>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  mbtiBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    marginTop: 30,
  },
  mbtiText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  interestBadge: {
    backgroundColor: "rgba(240, 243, 255, 1)",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: "rgba(224, 231, 255, 1)",
    marginTop: 10,
  },
  interestText: {
    color: "rgba(67, 56, 202, 1)",
    fontSize: 16,
    fontWeight: "600",
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
  buttonContainer: {
    marginHorizontal: 20,
    marginTop: 30,
    borderRadius: 100,
    shadowColor: "#7C3AED",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  gradient: {
    paddingVertical: 16,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  smallCameraButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#a17fdb",
    padding: 10,
    borderRadius: 100,
    elevation: 8,
  },
});
