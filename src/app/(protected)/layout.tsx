import AdminLayout from "@/app/components/layout/AdminLayout";

type ProtectedLayoutProps = {
  children: React.ReactNode;
};

export default function ProtectedLayout({
  children,
}: ProtectedLayoutProps) {
  return <AdminLayout>{children}</AdminLayout>;
}