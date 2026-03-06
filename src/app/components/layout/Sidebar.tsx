"use client";

import { Layout, Menu, Typography } from "antd";
import {
  BarChartOutlined,
  DashboardOutlined,
  HeartOutlined,
  SettingOutlined,
  TeamOutlined,
  WarningOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { usePathname, useRouter } from "next/navigation";

const { Sider } = Layout;
const { Title, Text } = Typography;

const menuItems = [
  {
    key: "/dashboard",
    icon: <DashboardOutlined />,
    label: "Dashboard",
  },
  {
    key: "/users",
    icon: <TeamOutlined />,
    label: "Users",
  },
  {
    key: "/matches",
    icon: <HeartOutlined />,
    label: "Matches",
  },
  {
    key: "/reports",
    icon: <WarningOutlined />,
    label: "Reports",
  },
  {
    key: "/settings",
    icon: <SettingOutlined />,
    label: "Settings",
  },
];

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const selectedKey = menuItems.some((item) => item.key === pathname)
    ? pathname
    : "/dashboard";

  return (
    <Sider
      width={250}
      theme="light"
      style={{
        background: "#ffffff",
        borderRight: "1px solid #edf0f5",
        minHeight: "100vh",
        position: "sticky",
        top: 0,
        left: 0,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          height: "100%",
          padding: "20px 16px 16px",
        }}
      >
        <div>
          <div style={{ marginBottom: 28, padding: "4px 8px" }}>
            <Title
              level={3}
              style={{
                margin: 0,
                color: "#111827",
                fontSize: 24,
                lineHeight: 1.2,
              }}
            >
              💜 MindMatch
            </Title>

            <Text
              style={{
                color: "#6b7280",
                fontSize: 14,
              }}
            >
              Admin Panel
            </Text>
          </div>

          <Menu
            mode="inline"
            selectedKeys={[selectedKey]}
            onClick={({ key }) => router.push(key)}
            style={{
              border: "none",
              background: "transparent",
              fontSize: 16,
            }}
            items={menuItems}
          />
        </div>

        <div style={{ padding: "8px 12px" }}>
          <div
            onClick={() => router.push("/")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              color: "#4b5563",
              fontSize: 16,
              cursor: "pointer",
              padding: "12px 8px",
              borderRadius: 10,
            }}
          >
            <HomeOutlined />
            <span>Back to App</span>
          </div>
        </div>
      </div>
    </Sider>
  );
}