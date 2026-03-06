"use client";

import { Layout, Button, Typography, Space } from "antd";
import { usePathname, useRouter } from "next/navigation";

const { Header } = Layout;
const { Title, Text } = Typography;

function getPageTitle(pathname: string) {
  if (pathname === "/dashboard") {
    return {
      title: "Dashboard Overview",
      subtitle: "Welcome back! Here's what's happening today.",
    };
  }

  if (pathname === "/users") {
    return {
      title: "Users",
      subtitle: "Manage platform users and account status.",
    };
  }

  if (pathname === "/reports") {
    return {
      title: "Reports",
      subtitle: "Review and manage reported accounts and content.",
    };
  }

  if (pathname === "/analytics") {
    return {
      title: "Analytics",
      subtitle: "Track platform growth, activity, and performance.",
    };
  }

  if (pathname === "/matches") {
    return {
      title: "Matches",
      subtitle: "Monitor match activity across the platform.",
    };
  }

  if (pathname === "/settings") {
    return {
      title: "Settings",
      subtitle: "Manage dashboard and platform configuration.",
    };
  }

  return {
    title: "Admin Panel",
    subtitle: "Manage your platform from one place.",
  };
}

export default function Topbar() {
  const pathname = usePathname();
  const router = useRouter();
  const pageInfo = getPageTitle(pathname);

  return (
    <Header
      style={{
        height: "auto",
        lineHeight: "normal",
        background: "#f5f7fb",
        padding: "28px 32px 0",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        borderBottom: "none",
      }}
    >
      <div>
        <Title
          level={1}
          style={{
            margin: 0,
            color: "#0f172a",
            fontSize: 28,
            fontWeight: 700,
          }}
        >
          {pageInfo.title}
        </Title>

        <Text
          style={{
            display: "inline-block",
            marginTop: 8,
            color: "#6b7280",
            fontSize: 16,
          }}
        >
          {pageInfo.subtitle}
        </Text>
      </div>

      <Space>
        <Button onClick={() => router.push("/logout")}>Logout</Button>
      </Space>
    </Header>
  );
}