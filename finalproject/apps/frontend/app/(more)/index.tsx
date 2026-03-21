import { useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import SettingRow from "@/components/SettingRow";

export default function MoreScreen() {
  const [newMessageAlerts, setNewMessageAlerts] = useState(true);
  const [doNotDisturb, setDoNotDisturb] = useState(false);
  const [messagePreview, setMessagePreview] = useState(true);

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
          rightText="View"
          onPress={() => Alert.alert("Account ID", "Open account ID details")}
        />
        <SettingRow
          label="Email"
          icon="mail-outline"
          rightText="View"
          onPress={() => Alert.alert("Email", "Open email settings")}
        />
        <SettingRow
          label="Log Out"
          icon="log-out-outline"
          danger
          onPress={() => Alert.alert("Log Out", "Log out action goes here")}
        />
        <SettingRow
          label="Delete Account"
          icon="trash-outline"
          danger
          onPress={() =>
            Alert.alert("Delete Account", "Delete account action goes here")
          }
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
          label="Reports"
          icon="flag-outline"
          onPress={() => Alert.alert("Reports", "Open reports screen")}
        />
        <SettingRow
          label="Blacklist"
          icon="ban-outline"
          onPress={() => Alert.alert("Blacklist", "Open blacklist screen")}
        />

        <SectionTitle title="About" />
        <SettingRow
          label="Version"
          icon="information-circle-outline"
          rightText="v1.0.0"
          onPress={() => Alert.alert("About", "App version details")}
        />

        <SectionTitle title="Help" />
        <SettingRow
          label="Help Center"
          icon="help-circle-outline"
          onPress={() => Alert.alert("Help", "Open help center")}
        />

        <View style={styles.footer}>
          <Text style={styles.footerTitle}>MindMatch v1.0.0</Text>
          <Text style={styles.footerSubtitle}>
            Built with care for meaningful connections
          </Text>
        </View>
      </ScrollView>
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
});