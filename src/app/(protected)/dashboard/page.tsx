import { Col, Row } from "antd";
import StatCard from "@/app/components/dashboard/StatCard";
import ChartCard from "@/app/components/dashboard/ChartCard";
import RecentUsersTable from "@/app/components/dashboard/RecentUsersTable";
import ReportsTable from "@/app/components/dashboard/ReportsTable";
import {
  dashboardStats,
  recentUsers,
  reports,
  matchSuccessData,
  userGrowthData,
} from "@/app/api/lib/mock/dashboard";

export default function DashboardPage() {
  const maxMatchValue = Math.max(
    ...matchSuccessData.flatMap((item) => [item.matches, item.reveals])
  );

  const maxUserValue = Math.max(...userGrowthData.map((item) => item.users));

  return (
    <div>
      <Row gutter={[20, 20]}>
        {dashboardStats.map((stat) => (
          <Col key={stat.title} xs={24} sm={12} xl={6}>
            <StatCard stat={stat} />
          </Col>
        ))}
      </Row>

      <Row gutter={[20, 20]} style={{ marginTop: 12 }}>
        <Col xs={24} xl={12}>
          <ChartCard
            title="Match Success Rate"
            subtitle="Matches vs. Profile Reveals"
            type="matches"
          >
            <div
              style={{
                height: 260,
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "space-between",
                gap: 12,
                padding: "12px 8px 0",
              }}
            >
              {matchSuccessData.map((item) => {
                const matchesHeight = (item.matches / maxMatchValue) * 180;
                const revealsHeight = (item.reveals / maxMatchValue) * 180;

                return (
                  <div
                    key={item.month}
                    style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "flex-end",
                      height: "100%",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-end",
                        gap: 6,
                        height: 200,
                      }}
                    >
                      <div
                        style={{
                          width: 22,
                          height: matchesHeight,
                          borderRadius: 10,
                          background: "#6366f1",
                        }}
                      />
                      <div
                        style={{
                          width: 22,
                          height: revealsHeight,
                          borderRadius: 10,
                          background: "#a78bfa",
                        }}
                      />
                    </div>

                    <span
                      style={{
                        marginTop: 10,
                        fontSize: 14,
                        color: "#9ca3af",
                      }}
                    >
                      {item.month}
                    </span>
                  </div>
                );
              })}
            </div>
          </ChartCard>
        </Col>

        <Col xs={24} xl={12}>
          <ChartCard
            title="User Growth"
            subtitle="New registrations over time"
            type="users"
          >
            <div
              style={{
                height: 260,
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "space-between",
                gap: 10,
                padding: "24px 8px 0",
              }}
            >
              {userGrowthData.map((item) => {
                const pointHeight = (item.users / maxUserValue) * 170;

                return (
                  <div
                    key={item.month}
                    style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "flex-end",
                      height: "100%",
                      position: "relative",
                    }}
                  >
                    <div
                      style={{
                        width: 100,
                        maxWidth: "100%",
                        height: 2,
                        background: "#c7d2fe",
                        position: "absolute",
                        bottom: 42 + pointHeight,
                        left: "50%",
                        transform: "translateX(-50%)",
                        opacity: item.month === "Jan" ? 0 : 1,
                      }}
                    />

                    <div
                      style={{
                        height: 200,
                        display: "flex",
                        alignItems: "flex-end",
                      }}
                    >
                      <div
                        style={{
                          width: 12,
                          height: 12,
                          borderRadius: "50%",
                          background: "#6366f1",
                          marginBottom: pointHeight,
                          boxShadow: "0 0 0 4px rgba(99, 102, 241, 0.12)",
                        }}
                      />
                    </div>

                    <span
                      style={{
                        marginTop: 12,
                        fontSize: 14,
                        color: "#9ca3af",
                      }}
                    >
                      {item.month}
                    </span>
                  </div>
                );
              })}
            </div>
          </ChartCard>
        </Col>
      </Row>

      <Row gutter={[20, 20]} style={{ marginTop: 12 }}>
        <Col xs={24} xl={12}>
          <RecentUsersTable data={recentUsers} />
        </Col>

        <Col xs={24} xl={12}>
          <ReportsTable data={reports} />
        </Col>
      </Row>
    </div>
  );
}