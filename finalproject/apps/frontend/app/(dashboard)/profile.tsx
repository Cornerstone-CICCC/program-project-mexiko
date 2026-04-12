import {
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  Alert,
  Linking,
  Platform,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Entypo } from "@expo/vector-icons";
import { Link } from "expo-router";
import * as ImagePicker from "expo-image-picker";

import { auth } from "@/config/firebase";
import { MBTI_DETAILS } from "@/utils/mbti";
import * as Location from "expo-location";

const Profile = () => {
  const [image, setImage] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState([]);

  const getLocation = async () => {
    try {
      setLoadingLocation(true);

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;

      await new Promise((r) => setTimeout(r, 1200));

      const locationData = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.BestForNavigation,
      });

      const { latitude, longitude } = locationData.coords;

      const geo = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      const address = geo?.[0];

      const city =
        address?.city || address?.district || address?.subregion || "";

      const region = address?.region || "";

      const locationString =
        city && region
          ? `${city}, ${region}`
          : `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;

      await updateLocation(user.uid, locationString);
    } catch (e) {
      console.log(e);
    } finally {
      setLoadingLocation(false);
    }
  };

  const editImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

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

    if (result.canceled) return;

    const uri = result.assets[0].uri;
    setImage(uri);
    //console.log("uri", uri);
    //const currentUser = auth.currentUser;

    await updateProfile(user.uid, uri);
  };

  // connect db
  const getUserInfo = async (userId: string, selectedMbti: string) => {
    try {
      const response = await fetch(`http://localhost:3500/users/${userId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();

      //setUser(response);
      console.log("response", response);
      if (response.ok) {
        setUser(data);
        if (data.profileImage) {
          console.log("data.profileImage", data.profileImage);
          setImage(data.profileImage);
          setSelectedInterests(data.Interests);
        }

        console.log("✅ User Info Loaded:", data);
      } else {
        console.error("❌ User not found");
      }
    } catch (error) {
      console.error("❌ DB Update Error:", error);
      Alert.alert("Error", "Failed to save your MBTI result to the server.");
    } finally {
      console.log("finally");
    }
  };

  const [isSyncing, setIsSyncing] = useState(false);

  const updateProfile = async (
    userId: string,
    selectedprofileImage: string,
  ) => {
    try {
      setIsSyncing(true);
      const response = await fetch(`http://localhost:3500/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userInfo: {
            profileImage: selectedprofileImage,
          },
        }),
      });
      console.log("response", response);
      if (response.ok) {
        setUser((prev: any) => ({
          ...prev,
          profileImage: selectedprofileImage,
        }));
        console.log("✅ DB Update Success");
      }
    } catch (error) {
      console.error("❌ DB Update Error:", error);
      Alert.alert("Error", "Failed to save your MBTI result to the server.");
    } finally {
      //console.log("finally");
      setIsSyncing(false);
    }
  };

  const updateLocation = async (userId: string, location: string) => {
    try {
      setIsSyncing(true);
      const response = await fetch(`http://localhost:3500/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userInfo: {
            location: location,
          },
        }),
      });
      console.log("response", response);
      if (response.ok) {
        setUser((prev: any) => ({
          ...prev,
          location: location,
        }));
        console.log("✅ DB Update Success");
      }
    } catch (error) {
      console.error("❌ DB Update Error:", error);
      Alert.alert("Error", "Failed to save your MBTI result to the server.");
    } finally {
      //console.log("finally");
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      getUserInfo(currentUser.uid);
    }
  }, []);

  const fullName = user?.fullName
    ? `${user.fullName.first} ${user.fullName.last}`
    : "Loading...";
  const mbti = user?.mbtiType || "NOT_SPECIFIED";

  const rawDetails = MBTI_DETAILS[mbti];

  const details = {
    title: rawDetails?.title ?? "Loading...",
    traits: rawDetails?.traits ?? [],
    about: (() => {
      if (!rawDetails?.about) return [];
      if (Array.isArray(rawDetails.about)) return rawDetails.about;

      return rawDetails.about
        .split(". ")
        .map((s) => s.trim())
        .filter(Boolean);
    })(),
  };

  const bio = user?.bio || "Write Your Introduction";
  const locationText = user?.location;

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
            {fullName}
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 16,
            }}
          >
            <TouchableOpacity onPress={getLocation} style={{ marginRight: 6 }}>
              <Entypo name="map" size={20} color="white" />
            </TouchableOpacity>
            <Text className="text-white opacity-80 text-lg">
              {loadingLocation ? "Fetching..." : locationText || "Set Location"}
            </Text>
          </View>
          <View className="flex-row items-center mb-6" style={styles.mbtiBadge}>
            <Text style={styles.mbtiText}>
              {mbti} • {details?.title || "Loading..."}
            </Text>
          </View>
        </View>

        {/* Introduction */}
        <View
          style={[
            styles.cardContainer,
            { marginTop: -40, marginHorizontal: 20 },
          ]}
        >
          <View className="flex-row justify-between items-center mb-5">
            <Text className="text-2xl font-bold text-slate-900">
              Introduction
            </Text>
            <Link href="/1/edit" asChild>
              <TouchableOpacity>
                <Entypo name="pencil" size={24} color="#6366f1" />
              </TouchableOpacity>
            </Link>
          </View>
          <Text className="text-slate-600 leading-6 text-[16px]">{bio}</Text>
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
            <Text className="text-2xl font-bold text-slate-900 ml-3">
              MBTI About
            </Text>
          </View>

          <View style={{ alignItems: "flex-start", marginTop: 10 }}>
            {details?.about?.map((line, index) => (
              <View
                key={index}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  marginBottom: 8,
                  width: "100%",
                }}
              >
                <View
                  style={{
                    width: 24,
                    height: 24,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Entypo name="dot-single" size={24} color="#6366f1" />
                </View>

                <Text
                  style={{
                    color: "#475569",
                    fontSize: 16,
                    marginLeft: 4,
                    flex: 1,
                  }}
                >
                  {line}
                </Text>
              </View>
            ))}
          </View>

          <View className="flex-row  items-center mt-5">
            <Text className="text-purple-600 text-2xl">
              <Entypo name="heart" size={24} color="#6366f1" />
            </Text>
            <Text className="text-2xl font-bold text-slate-900 ml-3">
              Relationship Values
            </Text>
          </View>

          <View style={{ alignItems: "flex-start", marginTop: 10 }}>
            {details?.traits?.map((line, index) => (
              <View
                key={index}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  marginBottom: 8,
                  width: "100%",
                }}
              >
                <View
                  style={{
                    width: 24,
                    height: 24,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Entypo name="dot-single" size={24} color="#6366f1" />
                </View>

                {/* text */}
                <Text
                  style={{
                    color: "#475569",
                    fontSize: 16,
                    marginLeft: 4,
                    flex: 1,
                  }}
                >
                  {line}
                </Text>
              </View>
            ))}
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
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 8,
              marginBottom: 15,
            }}
          >
            {selectedInterests && selectedInterests.length > 0 ? (
              selectedInterests.map((item) => (
                <View key={item} style={styles.interestBadge}>
                  <Text style={styles.interestText}>{item}</Text>
                  <TouchableOpacity
                    style={{ marginLeft: 6 }}
                    onPress={() =>
                      setSelectedInterests(
                        selectedInterests.filter((i) => i !== item),
                      )
                    }
                  >
                    <Entypo
                      name="cross"
                      size={16}
                      color="rgba(67, 56, 202, 0.6)"
                    />
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              <Text style={{ color: "#94a3b8", marginLeft: 5 }}>
                No interests selected
              </Text>
            )}
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
    flexDirection: "row",
    alignItems: "center",
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
