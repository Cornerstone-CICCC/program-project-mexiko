"use client";

import { Card } from "antd";

export default function SettingsPage() {
  return (
    <div>
      <h1 style={{ fontSize: 28, marginBottom: 24 }}>
        Admin Settings
      </h1>

      <Card
        variant="borderless"
        style={{
          borderRadius: 16,
        }}
      >
        <p>Admin configuration settings will appear here.</p>
      </Card>
    </div>
  );
}