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
} from "react-native";
import SettingRow from "@/components/SettingRow";
import { auth } from "../../config/firebase";
import { signOut } from "firebase/auth";
import Toast from "react-native-toast-message";
import authService from "@/services/auth.services";
import LogoutConfirmModal from "@/components/LogoutConfirmModal";
import DeleteAccountModal from "@/components/DeleteAccountModal";
import API_BASE_URL, { API_ENDPOINTS } from "@/config/api";
export default function MoreScreen() {
  const [newMessageAlerts, setNewMessageAlerts] = useState(true);
  const [doNotDisturb, setDoNotDisturb] = useState(false);
  const [messagePreview, setMessagePreview] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  // Get current user info
  const currentUser = auth.currentUser;
  const userEmail = currentUser?.email || "No email";
  const userId = currentUser?.uid;

  const handleLogout = async () => {
    setIsLoggingOut(true);
    
    try {
      // Firebase logout
      await signOut(auth);
      console.log('✅ Firebase logout successful');
      
      // Backend logout (opcional)
      try {
        await fetch(`${API_ENDPOINTS.LOGOUT}`, {
          method: 'POST',
          credentials: 'include',
        });
      } catch (error) {
        console.log('Backend error:', error);
      }
      
      Toast.show({
        type: 'success',
        text1: 'Logged Out',
        text2: 'You have been successfully logged out',
        position: 'top',
        visibilityTime: 2000,
      });
      
      router.replace('/(auth)/login');
      
    } catch (error: any) {
      console.error('Logout error:', error);
      Toast.show({
        type: 'error',
        text1: 'Logout Failed',
        text2: error.message || 'Please try again',
        position: 'top',
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
        type: 'error',
        text1: 'Error',
        text2: 'User not found',
        position: 'top',
      });
      return;
    }

    setIsDeleting(true);
    setDeleteModalVisible(false);
    
    try {
      // Delete account via authService (which calls the backend)
      await authService.deleteAccount();
      
      Toast.show({
        type: 'success',
        text1: 'Account Deleted',
        text2: 'Your account has been permanently deleted',
        position: 'top',
        visibilityTime: 3000,
      });
      
      // Redirigir al login
      setTimeout(() => {
        router.replace('/(auth)/login');
      }, 1500);
      
    } catch (error: any) {
      console.error('Delete account error:', error);
      Toast.show({
        type: 'error',
        text1: 'Delete Failed',
        text2: error.message || 'Please try again later',
        position: 'top',
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
            {isDeleting ? 'Deleting account...' : 'Logging out...'}
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
      >
        <Text style={styles.title}>More</Text>

        <SectionTitle title="Account" />
        <SettingRow
          label="ID"
          icon="card-outline"
          rightText={currentUser?.uid?.slice(0, 8) || "Not available"}
          onPress={() => Alert.alert("Account ID", currentUser?.uid || "No ID available")}
        />
        <SettingRow
          label="Email"
          icon="mail-outline"
          rightText={userEmail}
          onPress={() => Alert.alert("Email", userEmail)}
        />
        <SettingRow
          label="Log Out"
          icon="log-out-outline"
          danger
          onPress={() => setModalVisible(true)}
        />
        <SettingRow
          label="Delete Account"
          icon="trash-outline"
          danger
          onPress={() => setDeleteModalVisible(true)}
        />

        <SectionTitle title="Notifications" />
        <SettingRow
          label="New Message Alerts"
          icon="notifications-outline"
          hasSwitch
          switchValue={newMessageAlerts}
          onSwitchChange={setNewMessageAlerts}
        />
        <SettingRow
          label="Do Not Disturb"
          icon="moon-outline"
          hasSwitch
          switchValue={doNotDisturb}
          onSwitchChange={setDoNotDisturb}
        />
        <SettingRow
          label="Message Preview"
          icon="chatbubble-ellipses-outline"
          hasSwitch
          switchValue={messagePreview}
          onSwitchChange={setMessagePreview}
        />

        <SectionTitle title="Privacy" />
        <SettingRow
          label="Privacy Settings"
          icon="shield-outline"
          onPress={() => router.push("/(more)/privacy")}
        />

        <SectionTitle title="About" />
        <SettingRow
          label="About MindMatch"
          icon="information-circle-outline"
          rightText="v1.0.0"
          onPress={() => router.push("/(more)/about")}
        />

        <SectionTitle title="Help" />
        <SettingRow
          label="Help Center"
          icon="help-circle-outline"
          onPress={() => router.push("/(more)/help")}
        />

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
    paddingTop: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 22,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.4,
    color: "#6B7280",
    marginBottom: 10,
    marginTop: 10,
  },
  footer: {
    alignItems: "center",
    marginTop: 26,
    paddingBottom: 12,
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