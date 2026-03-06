"use client";

import { Button, Table, Tag } from "antd";

const columns = [
  {
    title: "Reporter",
    dataIndex: "reporter",
  },
  {
    title: "Type",
    dataIndex: "type",
  },
  {
    title: "Status",
    dataIndex: "status",
    render: (status: string) => {
      if (status === "Pending") return <Tag color="gold">Pending</Tag>;
      if (status === "Reviewing") return <Tag color="blue">Reviewing</Tag>;
      return <Tag color="green">Resolved</Tag>;
    },
  },
  {
    title: "Action",
    render: () => <Button type="link">Review</Button>,
  },
];

const data = [
  {
    key: 1,
    reporter: "User #2847",
    type: "Inappropriate Content",
    status: "Pending",
  },
  {
    key: 2,
    reporter: "User #1932",
    type: "Harassment",
    status: "Reviewing",
  },
  {
    key: 3,
    reporter: "User #5621",
    type: "Fake Profile",
    status: "Resolved",
  },
];

export default function ReportsPage() {
  return (
    <div>
      <h1 style={{ fontSize: 28, marginBottom: 24 }}>Reports Management</h1>
      <Table columns={columns} dataSource={data} pagination={false} />
    </div>
  );
}