import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Stack, Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Entypo } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import * as ImagePicker from "expo-image-picker";
import { auth } from "@/config/firebase";

const profileEdit = () => {
  const [minAge, setMinAge] = useState(25);
  const [maxAge, setMaxAge] = useState(35);
  const [distance, setDistance] = useState(25);
  const [image, setImage] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  const [allInterests] = useState([
    "Reading",
    "Hiking",
    "Photography",
    "Art",
    "Cooking",
    "Yoga",
    "Music",
    "Travel",
    "Running",
    "Swimming",
    "Coding",
    "Gaming",
  ]);

  const [selectedInterests, setSelectedInterests] = useState([
    "Reading",
    "Hiking",
  ]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredResults, setFilteredResults] = useState<string[]>([]);
  const [bio, setBio] = useState("");

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (text.trim().length > 0) {
      const filtered = allInterests.filter(
        (item) =>
          item.toLowerCase().includes(text.toLowerCase()) &&
          !selectedInterests.includes(item),
      );
      setFilteredResults(filtered);
    } else {
      setFilteredResults([]);
    }
  };

  const addInterest = (item: string) => {
    setSelectedInterests([...selectedInterests, item]);
    setSearchQuery("");
    setFilteredResults([]);
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
      //console.log("response", response);
      if (response.ok) {
        setUser(data);
        if (data.profileImage) {
          console.log("data.profileImage", data.profileImage);
          setImage(data.profileImage);
          console.log("interests", data.Interests);
          setSelectedInterests(data.Interests);
        }
        if (data.preferredAgeRange) {
          setMinAge(data.preferredAgeRange.min);
          setMaxAge(data.preferredAgeRange.max);
        }
        if (data.preferredDistance) setDistance(data.preferredDistance);
        if (data.bio) setBio(data.bio);
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

  const saveAllChanges = async () => {
    const userId = user?.firebaseUid || auth.currentUser?.uid;
    if (!userId) return;

    try {
      setIsSyncing(true);
      const response = await fetch(`http://localhost:3500/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userInfo: {
            profileImage: image,
            bio: bio,
            preferredAgeRange: { min: minAge, max: maxAge },
            preferredDistance: distance,
            Interests: selectedInterests,
          },
        }),
      });
      console.log("response", response);
      if (response.ok) {
        const updatedData = await response.json();
        setUser(updatedData);
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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
      {/* header */}
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.headerTopBar}>
        <View className="flex-row items-center justify-between px-5 py-8 bg-white ">
          <Link href="../" push asChild>
            <TouchableOpacity>
              <Entypo name="chevron-thin-left" size={24} color="#1e293b" />
            </TouchableOpacity>
          </Link>
          <View className="flex-1">
            <View className="flex-row items-center">
              <Text className="text-3xl font-bold text-slate-900 mr-2 ml-4">
                Edit Profile
              </Text>
            </View>
          </View>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Profile */}
        <View style={styles.contentContainer}>
          <View style={styles.photoSection}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={editImage}
              style={styles.imageContainer}
            >
              {image ? (
                <Image
                  source={
                    image
                      ? { uri: image }
                      : require("@/assets/images/man-profile-gray.png")
                  }
                  style={{ width: "100%", height: "100%", borderRadius: 100 }}
                  resizeMode="cover"
                />
              ) : (
                <Entypo name="camera" size={50} color="#8F9BFF" />
              )}

              <View style={styles.smallCameraButton}>
                <Entypo name="camera" size={18} color="white" />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              style={{ marginTop: 15 }}
              onPress={editImage}
            >
              <Text style={styles.changePhotoText}>Change Photo</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* About */}
        <View style={styles.formContainer}>
          <View
            style={[
              styles.cardContainer,
              { marginTop: 20, marginHorizontal: 20 },
            ]}
          >
            <Text style={styles.sectionTitle}>Basic Information</Text>
            {/* <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Name</Text>
              <TextInput
                style={[styles.textArea, { minHeight: 50 }]}
                placeholder="Write your name"
                placeholderTextColor="#94a3b8"
              />
            </View> */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Bio</Text>
              <TextInput
                style={styles.textArea}
                placeholder="Tell us about yourself..."
                placeholderTextColor="#94a3b8"
                multiline={true}
                numberOfLines={4}
                textAlignVertical="top"
                //placeholderClassName="Lorem ipsum dolor, sit amet consectetur adipisicing elit..."
                onChangeText={(text) => setBio(text)}
                value={bio}
              />
              <Text style={styles.charCount}>0 / 300</Text>
            </View>
          </View>
        </View>

        {/* Selected List */}
        <View style={styles.formContainer}>
          <View
            style={[
              styles.cardContainer,
              { marginTop: 20, marginHorizontal: 20 },
            ]}
          >
            <Text style={styles.sectionTitle}>Interests</Text>
            <View
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

            <View style={styles.addInterestContainer}>
              <TextInput
                style={styles.addInterestInput}
                placeholder="Search interests..."
                placeholderTextColor="#94a3b8"
                value={searchQuery}
                onChangeText={handleSearch}
              />
            </View>

            {filteredResults.length > 0 && (
              <View style={styles.dropdown}>
                {filteredResults.map((item) => (
                  <TouchableOpacity
                    key={item}
                    style={styles.dropdownItem}
                    onPress={() => addInterest(item)}
                  >
                    <Text style={styles.dropdownText}>{item}</Text>
                    <Entypo name="plus" size={18} color="#7C3AED" />
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>

        {/* Preferences */}
        <View style={styles.formContainer}>
          <View
            style={[
              styles.cardContainer,
              { marginTop: 20, marginHorizontal: 20 },
            ]}
          >
            <Text style={styles.sectionTitle}>Preferences</Text>

            <View style={{ marginBottom: 25 }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginBottom: 10,
                }}
              >
                <Text style={styles.preferenceLabel}>Age Range</Text>
                <Text style={styles.preferenceValue}>
                  {minAge} - {maxAge}
                </Text>
              </View>

              <Text style={{ fontSize: 12, color: "#94a3b8", marginBottom: 5 }}>
                Min Age
              </Text>
              <Slider
                style={{ width: "100%", height: 30 }}
                minimumValue={18}
                maximumValue={60}
                step={1}
                value={minAge}
                onValueChange={(val) => {
                  if (val <= maxAge) {
                    setMinAge(val);
                  }
                }}
                minimumTrackTintColor="#7C3AED"
                maximumTrackTintColor="#E2E8F0"
                thumbTintColor="#7C3AED"
              />

              <Text
                style={{
                  fontSize: 12,
                  color: "#94a3b8",
                  marginTop: 10,
                  marginBottom: 5,
                }}
              >
                Max Age
              </Text>
              <Slider
                style={{ width: "100%", height: 30 }}
                minimumValue={18}
                maximumValue={60}
                step={1}
                value={maxAge}
                onValueChange={(val) => {
                  if (val >= minAge) {
                    setMaxAge(val);
                  }
                }}
                minimumTrackTintColor="#7C3AED"
                maximumTrackTintColor="#E2E8F0"
                thumbTintColor="#7C3AED"
              />
            </View>

            <View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginBottom: 10,
                }}
              >
                <Text style={styles.preferenceLabel}>Distance</Text>
                <Text style={styles.preferenceValue}>{distance} miles</Text>
              </View>

              <Slider
                style={{ width: "100%", height: 40 }}
                minimumValue={1}
                maximumValue={100}
                step={1}
                value={distance}
                onValueChange={(val) => setDistance(val)}
                minimumTrackTintColor="#7C3AED"
                maximumTrackTintColor="#E2E8F0"
                thumbTintColor="#7C3AED"
              />
            </View>
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.buttonContainer}
          onPress={saveAllChanges}
          disabled={isSyncing}
        >
          <View style={[styles.gradient, { backgroundColor: "#7C3AED" }]}>
            <View className="flex-row items-center justify-center">
              <Text className="text-white text-xl mr-2">
                <Entypo name="pencil" size={24} color="white" />
              </Text>
              <Text className="text-white text-xl font-bold">Save Changes</Text>
            </View>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default profileEdit;

const styles = StyleSheet.create({
  headerTopBar: {
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  contentContainer: { paddingHorizontal: 20, marginTop: 20 },
  photoSection: { alignItems: "center", marginVertical: 30 },
  imageContainer: {
    position: "relative",
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: "#EEF0FF",
    justifyContent: "center",
    alignItems: "center",
  },
  smallCameraButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#7C3AED",
    padding: 10,
    borderRadius: 100,
    elevation: 8,
  },
  changePhotoText: { color: "#312E81", fontSize: 18, fontWeight: "600" },
  formContainer: { paddingHorizontal: 20, marginTop: 10 },
  cardContainer: {
    backgroundColor: "white",
    borderRadius: 24,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 20,
  },
  inputGroup: { marginBottom: 20 },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#64748b",
    marginBottom: 8,
  },
  textArea: {
    backgroundColor: "#f8fafc",
    borderRadius: 16,
    padding: 15,
    fontSize: 16,
    color: "#334155",
    borderWidth: 1,
    borderColor: "#f1f5f9",
    minHeight: 120,
  },
  charCount: {
    textAlign: "right",
    fontSize: 12,
    color: "#94a3b8",
    marginTop: 5,
  },
  interestBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: "#E0E7FF",
  },
  interestText: { color: "#4338CA", fontSize: 15, fontWeight: "600" },
  addInterestContainer: { flexDirection: "row", alignItems: "center" },
  addInterestInput: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    padding: 15,
    fontSize: 16,
    color: "#334155",
    borderWidth: 1,
    borderColor: "#F1F5F9",
    height: 56,
  },
  dropdown: {
    marginTop: 10,
    backgroundColor: "#FFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    overflow: "hidden",
  },
  dropdownItem: {
    flexDirection: "row",
    justifySelf: "space-between",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#2772bd",
  },
  dropdownText: { fontSize: 16, color: "#334155" },
  preferenceLabel: { fontSize: 18, color: "#475569", fontWeight: "500" },
  preferenceValue: { fontSize: 18, color: "#4338CA", fontWeight: "700" },
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
});
