"use client";

import { Layout } from "antd";
import Sidebar from "@/app/components/layout/Sidebar";
import Topbar from "@/app/components/layout/Topbar";

const { Content } = Layout;

type AdminLayoutProps = {
  children: React.ReactNode;
};

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <Layout style={{ minHeight: "100vh", background: "#f5f7fb" }}>
      <Sidebar />

      <Layout style={{ background: "#f5f7fb" }}>
        <Topbar />

        <Content
          style={{
            padding: "32px",
            background: "#f5f7fb",
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}