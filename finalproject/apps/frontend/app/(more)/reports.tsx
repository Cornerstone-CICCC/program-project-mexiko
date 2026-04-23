import { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from "react-native";
import SettingsScreenHeader from "@/components/SettingsScreenHeader";
import reportService, { MobileReport } from "@/services/report.services";

function getReportedUserName(report: MobileReport) {
  const first = report.targetId?.fullName?.first || "";
  const last = report.targetId?.fullName?.last || "";
  const fullName = `${first} ${last}`.trim();

  if (fullName) return fullName;
  if (report.targetId?.email) return report.targetId.email;

  return "Unknown user";
}

function getStatusStyles(status: MobileReport["status"]) {
  switch (status) {
    case "Resolved":
      return {
        badge: styles.badgeResolved,
        text: styles.badgeTextResolved,
      };
    case "Dismissed":
      return {
        badge: styles.badgeDismissed,
        text: styles.badgeTextDismissed,
      };
    case "Pending":
    default:
      return {
        badge: styles.badgePending,
        text: styles.badgeTextPending,
      };
  }
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString();
}

export default function ReportsScreen() {
  const [reports, setReports] = useState<MobileReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadReports = async () => {
      try {
        setLoading(true);
        setError("");

        const myReports = await reportService.getMyReports();
        setReports(myReports);
      } catch (err: any) {
        setError(err.message || "Failed to load reports.");
      } finally {
        setLoading(false);
      }
    };

    loadReports();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <SettingsScreenHeader title="Reports" />

        <Text style={styles.description}>
          Review the reports you have submitted and their current moderation
          status.
        </Text>

        {loading ? (
          <View style={styles.centerState}>
            <ActivityIndicator size="large" color="#6A11CB" />
            <Text style={styles.stateText}>Loading your reports...</Text>
          </View>
        ) : error ? (
          <View style={styles.centerState}>
            <Text style={styles.errorTitle}>Something went wrong</Text>
            <Text style={styles.stateText}>{error}</Text>
          </View>
        ) : reports.length === 0 ? (
          <View style={styles.centerState}>
            <Text style={styles.emptyTitle}>No reports yet</Text>
            <Text style={styles.stateText}>
              When you report a user, your submissions will appear here.
            </Text>
          </View>
        ) : (
          reports.map((report) => {
            const statusStyles = getStatusStyles(report.status);

            return (
              <View key={report._id} style={styles.card}>
                <Text style={styles.name}>{getReportedUserName(report)}</Text>
                <Text style={styles.reason}>Category: {report.category}</Text>
                <Text style={styles.descriptionText} numberOfLines={3}>
                  {report.description}
                </Text>

                <View style={styles.footerRow}>
                  <View style={[styles.badge, statusStyles.badge]}>
                    <Text style={[styles.badgeText, statusStyles.text]}>
                      {report.status}
                    </Text>
                  </View>

                  <Text style={styles.dateText}>
                    {formatDate(report.createdAt)}
                  </Text>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
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
  description: {
    fontSize: 14,
    lineHeight: 21,
    color: "#6B7280",
    marginBottom: 16,
  },
  centerState: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 24,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 180,
  },
  stateText: {
    marginTop: 10,
    fontSize: 14,
    lineHeight: 21,
    color: "#6B7280",
    textAlign: "center",
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 10,
  },
  name: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 6,
  },
  reason: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 6,
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#374151",
    marginBottom: 12,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },
  dateText: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  badgePending: {
    backgroundColor: "#FEF3C7",
  },
  badgeTextPending: {
    color: "#D97706",
  },
  badgeResolved: {
    backgroundColor: "#DCFCE7",
  },
  badgeTextResolved: {
    color: "#16A34A",
  },
  badgeDismissed: {
    backgroundColor: "#F3F4F6",
  },
  badgeTextDismissed: {
    color: "#6B7280",
  },
});