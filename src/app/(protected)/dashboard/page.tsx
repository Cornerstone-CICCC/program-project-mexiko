import { Card, Col, Row, Statistic } from "antd";

export default function DashboardPage() {
  return (
    <div>
      <h1 style={{ marginTop: 0, marginBottom: 8, fontSize: 32, fontWeight: 700 }}>
        Dashboard Overview
      </h1>

      <p style={{ color: "#6b7280", fontSize: 16 }}>
        Welcome back! Here's what's happening today.
      </p>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ borderRadius: 16 }}>
            <Statistic title="Total Users" value={12847} />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ borderRadius: 16 }}>
            <Statistic title="Active Matches" value={3421} />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ borderRadius: 16 }}>
            <Statistic title="Messages Today" value={28459} />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ borderRadius: 16 }}>
            <Statistic title="Reports Pending" value={12} />
          </Card>
        </Col>
      </Row>
    </div>
  );
}