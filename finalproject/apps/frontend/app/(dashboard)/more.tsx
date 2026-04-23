// app/(more)/index.tsx
import { useState } from "react";
import { router } from "expo-router";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Platform,
} from "react-native";
import SettingRow from "@/components/SettingRow";
import { auth } from "../../config/firebase";
import { signOut } from "firebase/auth";
import Toast from "react-native-toast-message";
import authService from "@/services/auth.services";
import LogoutConfirmModal from "@/components/LogoutConfirmModal";
import DeleteAccountModal from "@/components/DeleteAccountModal";
import { API_ENDPOINTS } from "@/config/api";

export default function MoreScreen() {
  const [newMessageAlerts, setNewMessageAlerts] = useState(true);
  const [doNotDisturb, setDoNotDisturb] = useState(false);
  const [messagePreview, setMessagePreview] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const currentUser = auth.currentUser;
  const userEmail = currentUser?.email || "No email";
  const userId = currentUser?.uid;

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      await signOut(auth);
      console.log("✅ Firebase logout successful");

      try {
        await fetch(API_ENDPOINTS.LOGOUT, {
          method: "POST",
          credentials: "include",
        });
      } catch (error) {
        console.log("Backend error:", error);
      }

      Toast.show({
        type: "success",
        text1: "Logged Out",
        text2: "You have been successfully logged out",
        position: "top",
        visibilityTime: 2000,
      });

      router.replace("/(auth)/login");
    } catch (error: any) {
      console.error("Logout error:", error);
      Toast.show({
        type: "error",
        text1: "Logout Failed",
        text2: error.message || "Please try again",
        position: "top",
        visibilityTime: 3000,
      });
    } finally {
      setIsLoggingOut(false);
      setModalVisible(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!userId) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "User not found",
        position: "top",
      });
      return;
    }

    setIsDeleting(true);
    setDeleteModalVisible(false);

    try {
      await authService.deleteAccount();

      Toast.show({
        type: "success",
        text1: "Account Deleted",
        text2: "Your account has been permanently deleted",
        position: "top",
        visibilityTime: 3000,
      });

      setTimeout(() => {
        router.replace("/(auth)/login");
      }, 1500);
    } catch (error: any) {
      console.error("Delete account error:", error);
      Toast.show({
        type: "error",
        text1: "Delete Failed",
        text2: error.message || "Please try again later",
        position: "top",
        visibilityTime: 3000,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoggingOut || isDeleting) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6A11CB" />
          <Text style={styles.loadingText}>
            {isDeleting ? "Deleting account..." : "Logging out..."}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <Text style={styles.title}>More</Text>

        <SectionTitle title="Account" />
        <View style={styles.card}>
          <SettingRow
            label="ID"
            icon="card-outline"
            rightText={currentUser?.uid?.slice(0, 8) || "Not available"}
            onPress={() =>
              Alert.alert("Account ID", currentUser?.uid || "No ID available")
            }
          />
          <View style={styles.divider} />

          <SettingRow
            label="Email"
            icon="mail-outline"
            rightText={userEmail}
            onPress={() => Alert.alert("Email", userEmail)}
          />
          <View style={styles.divider} />

          <SettingRow
            label="Log Out"
            icon="log-out-outline"
            danger
            onPress={() => setModalVisible(true)}
          />
          <View style={styles.divider} />

          <SettingRow
            label="Delete Account"
            icon="trash-outline"
            danger
            onPress={() => setDeleteModalVisible(true)}
          />
        </View>

        <SectionTitle title="Notifications" />
        <View style={styles.card}>
          <SettingRow
            label="New Message Alerts"
            icon="notifications-outline"
            hasSwitch
            switchValue={newMessageAlerts}
            onSwitchChange={setNewMessageAlerts}
          />
          <View style={styles.divider} />

          <SettingRow
            label="Do Not Disturb"
            icon="moon-outline"
            hasSwitch
            switchValue={doNotDisturb}
            onSwitchChange={setDoNotDisturb}
          />
          <View style={styles.divider} />

          <SettingRow
            label="Message Preview"
            icon="chatbubble-ellipses-outline"
            hasSwitch
            switchValue={messagePreview}
            onSwitchChange={setMessagePreview}
          />
        </View>

        <SectionTitle title="Privacy" />
        <View style={styles.card}>
          <SettingRow
            label="Privacy Settings"
            icon="shield-outline"
            onPress={() => router.push("/(more)/privacy")}
          />
        </View>

        <SectionTitle title="About" />
        <View style={styles.card}>
          <SettingRow
            label="About MindMatch"
            icon="information-circle-outline"
            rightText="v1.0.0"
            onPress={() => router.push("/(more)/about")}
          />
        </View>

        <SectionTitle title="Help" />
        <View style={styles.card}>
          <SettingRow
            label="Help Center"
            icon="help-circle-outline"
            onPress={() => router.push("/(more)/help")}
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerTitle}>MindMatch v1.0.0</Text>
          <Text style={styles.footerSubtitle}>
            Built with care for meaningful connections
          </Text>
        </View>
      </ScrollView>

      <LogoutConfirmModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onConfirm={handleLogout}
        isLoading={isLoggingOut}
      />

      <DeleteAccountModal
        visible={deleteModalVisible}
        onClose={() => setDeleteModalVisible(false)}
        onConfirm={handleDeleteAccount}
        isLoading={isDeleting}
      />

      <Toast />
    </SafeAreaView>
  );
}

function SectionTitle({ title }: { title: string }) {
  return <Text style={styles.sectionTitle}>{title}</Text>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F2F7",
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 18 : 20,
    paddingBottom: 120,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 28,
    marginTop: 6,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.4,
    color: "#6B7280",
    marginBottom: 12,
    marginTop: 8,
    paddingHorizontal: 2,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    overflow: "hidden",
    marginBottom: 28,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginLeft: 58,
  },
  footer: {
    alignItems: "center",
    marginTop: 12,
    paddingBottom: 12,
    paddingHorizontal: 16,
  },
  footerTitle: {
    fontSize: 13,
    color: "#9CA3AF",
    marginBottom: 4,
  },
  footerSubtitle: {
    fontSize: 12,
    color: "#B0B7C3",
    textAlign: "center",
    lineHeight: 18,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F3F2F7",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#6B7280",
  },
});