import { Card, Space, Typography } from "antd";
import {
  MessageOutlined,
  TeamOutlined,
  HeartOutlined,
  WarningOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from "@ant-design/icons";
import type { DashboardStat } from "@/app/types/dashboard";

const { Text, Title } = Typography;

type StatCardProps = {
  stat: DashboardStat;
};

function getIcon(title: string) {
  switch (title) {
    case "Total Users":
      return <TeamOutlined style={{ fontSize: 28, color: "#4f46e5" }} />;
    case "Active Matches":
      return <HeartOutlined style={{ fontSize: 28, color: "#4f46e5" }} />;
    case "Messages Today":
      return <MessageOutlined style={{ fontSize: 28, color: "#4f46e5" }} />;
    case "Reports Pending":
      return <WarningOutlined style={{ fontSize: 28, color: "#4f46e5" }} />;
    default:
      return <TeamOutlined style={{ fontSize: 28, color: "#4f46e5" }} />;
  }
}

export default function StatCard({ stat }: StatCardProps) {
  const isUp = stat.trend === "up";

  return (
    <Card
      bordered={false}
      style={{
        borderRadius: 20,
        boxShadow: "0 1px 2px rgba(16, 24, 40, 0.04)",
      }}
      styles={{
        body: {
          padding: 24,
        },
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <div>{getIcon(stat.title)}</div>

        <Space
          size={4}
          style={{
            color: isUp ? "#16a34a" : "#ef4444",
            fontWeight: 600,
            fontSize: 14,
          }}
        >
          {isUp ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
          <span>{stat.change}</span>
        </Space>
      </div>

      <Title
        level={2}
        style={{
          marginTop: 20,
          marginBottom: 4,
          fontSize: 28,
          fontWeight: 700,
          color: "#0f172a",
        }}
      >
        {stat.value.toLocaleString()}
      </Title>

      <Text
        style={{
          color: "#6b7280",
          fontSize: 16,
        }}
      >
        {stat.title}
      </Text>
    </Card>
  );
}