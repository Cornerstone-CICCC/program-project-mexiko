// app/layout.tsx
import "./globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "MindMatch",
  description: "Connect Beyond the Surface",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-gradient-to-b from-[#6A11CB] to-[#2575FC] flex items-center justify-center">
        {children}
      </body>
    </html>
  );
}
