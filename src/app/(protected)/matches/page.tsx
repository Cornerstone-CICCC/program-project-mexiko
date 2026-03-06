"use client";

import { Card } from "antd";

export default function MatchesPage() {
  return (
    <div>
      <h1 style={{ fontSize: 28, marginBottom: 24 }}>
        Matches Analytics
      </h1>

      <Card
        variant="borderless"
        style={{
          borderRadius: 16,
        }}
      >
        <p>Match performance and success rate metrics will appear here.</p>
      </Card>
    </div>
  );
}