"use client";

import { Table, Tag, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { Report } from "@/app/types/dashboard";

const { Title, Link } = Typography;

type ReportsTableProps = {
  data: Report[];
};

export default function ReportsTable({ data }: ReportsTableProps) {
  const columns: ColumnsType<Report> = [
    {
      title: "REPORTER",
      dataIndex: "reporter",
      key: "reporter",
      render: (value: string) => (
        <span style={{ color: "#374151" }}>{value}</span>
      ),
    },
    {
      title: "TYPE",
      dataIndex: "type",
      key: "type",
      render: (value: string) => (
        <span style={{ color: "#4b5563" }}>{value}</span>
      ),
    },
    {
      title: "STATUS",
      dataIndex: "status",
      key: "status",
      render: (value: Report["status"]) => {
        const styles =
          value === "Pending"
            ? {
                color: "#a16207",
                background: "#fef3c7",
              }
            : value === "Reviewing"
              ? {
                  color: "#2563eb",
                  background: "#dbeafe",
                }
              : {
                  color: "#15803d",
                  background: "#dcfce7",
                };

        return (
          <Tag
            style={{
              borderRadius: 999,
              paddingInline: 10,
              fontWeight: 600,
              border: "none",
              ...styles,
            }}
          >
            {value}
          </Tag>
        );
      },
    },
    {
      title: "ACTION",
      key: "action",
      render: () => (
        <Link style={{ color: "#4f46e5", fontWeight: 500 }}>Review</Link>
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
          Report Management
        </Title>
      </div>

      <Table
        rowKey={(record) => `${record.reporter}-${record.type}`}
        columns={columns}
        dataSource={data}
        pagination={false}
      />
    </div>
  );
}