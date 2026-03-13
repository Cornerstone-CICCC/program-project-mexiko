import { Layout } from "antd";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const { Sider, Content } = Layout;

export default function AppLayout({ children }: any) {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider width={250} theme="light">
        <Sidebar />
      </Sider>

      <Layout>
        <Topbar />
        <Content style={{ padding: 32 }}>{children}</Content>
      </Layout>
    </Layout>
  );
}