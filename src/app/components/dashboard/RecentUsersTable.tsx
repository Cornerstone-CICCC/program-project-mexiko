"use client";

import { Table, Tag, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { RecentUser } from "@/app/types/dashboard";

const { Title } = Typography;

type RecentUsersTableProps = {
  data: RecentUser[];
};

export default function RecentUsersTable({ data }: RecentUsersTableProps) {
  const columns: ColumnsType<RecentUser> = [
    {
      title: "NAME",
      dataIndex: "name",
      key: "name",
      render: (value: string) => (
        <span style={{ fontWeight: 500, color: "#111827" }}>{value}</span>
      ),
    },
    {
      title: "MBTI",
      dataIndex: "mbti",
      key: "mbti",
      render: (value: string) => (
        <Tag
          style={{
            borderRadius: 999,
            paddingInline: 10,
            fontWeight: 600,
            color: "#4f46e5",
            background: "#eef2ff",
            border: "none",
          }}
        >
          {value}
        </Tag>
      ),
    },
    {
      title: "STATUS",
      dataIndex: "status",
      key: "status",
      render: (value: RecentUser["status"]) => {
        const isActive = value === "Active";

        return (
          <Tag
            style={{
              borderRadius: 999,
              paddingInline: 10,
              fontWeight: 600,
              border: "none",
              color: isActive ? "#15803d" : "#6b7280",
              background: isActive ? "#dcfce7" : "#e5e7eb",
            }}
          >
            {value}
          </Tag>
        );
      },
    },
    {
      title: "JOINED",
      dataIndex: "joined",
      key: "joined",
      render: (value: string) => (
        <span style={{ color: "#4b5563" }}>{value}</span>
      ),
    },
  ];

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 20,
        overflow: "hidden",
        boxShadow: "0 1px 2px rgba(16, 24, 40, 0.04)",
      }}
    >
      <div style={{ padding: "20px 24px 8px" }}>
        <Title
          level={3}
          style={{
            margin: 0,
            fontSize: 22,
            color: "#111827",
          }}
        >
          Recent Users
        </Title>
      </div>

      <Table
        rowKey={(record) => `${record.name}-${record.joined}`}
        columns={columns}
        dataSource={data}
        pagination={false}
      />
    </div>
  );
}