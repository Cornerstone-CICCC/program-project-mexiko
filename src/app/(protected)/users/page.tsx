"use client";

import { Button, Table, Tag } from "antd";

const columns = [
  {
    title: "Name",
    dataIndex: "name",
  },
  {
    title: "MBTI",
    dataIndex: "mbti",
    render: (value: string) => <Tag color="purple">{value}</Tag>,
  },
  {
    title: "Status",
    dataIndex: "status",
    render: (value: string) =>
      value === "Active" ? <Tag color="green">Active</Tag> : <Tag>Inactive</Tag>,
  },
  {
    title: "Joined",
    dataIndex: "joined",
  },
  {
    title: "Action",
    render: () => <Button type="link">View</Button>,
  },
];

const data = [
  {
    key: 1,
    name: "Emma Wilson",
    mbti: "ENFP",
    status: "Active",
    joined: "2 hours ago",
  },
  {
    key: 2,
    name: "James Chen",
    mbti: "INTJ",
    status: "Active",
    joined: "5 hours ago",
  },
  {
    key: 3,
    name: "Sofia Rodriguez",
    mbti: "INFJ",
    status: "Inactive",
    joined: "1 day ago",
  },
];

export default function UsersPage() {
  return (
    <div>
      <h1 style={{ fontSize: 28, marginBottom: 24 }}>Users</h1>
      <Table columns={columns} dataSource={data} pagination={false} />
    </div>
  );
}