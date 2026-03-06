import { Card } from "antd";
import { RiseOutlined, TeamOutlined } from "@ant-design/icons";

type ChartCardProps = {
  title: string;
  subtitle: string;
  type?: "matches" | "users";
  children: React.ReactNode;
};

export default function ChartCard({
  title,
  subtitle,
  type = "matches",
  children,
}: ChartCardProps) {
  const icon =
    type === "users" ? (
      <TeamOutlined style={{ color: "#4f46e5", fontSize: 18 }} />
    ) : (
      <RiseOutlined style={{ color: "#16a34a", fontSize: 18 }} />
    );

  return (
    <Card
      variant="borderless"
      style={{
        borderRadius: 20,
        minHeight: 370,
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
          marginBottom: 20,
        }}
      >
        <div>
          <h3
            style={{
              margin: 0,
              fontSize: 22,
              color: "#111827",
            }}
          >
            {title}
          </h3>

          <p
            style={{
              margin: "6px 0 0",
              color: "#6b7280",
              fontSize: 16,
            }}
          >
            {subtitle}
          </p>
        </div>

        <div>{icon}</div>
      </div>

      {children}
    </Card>
  );
}