import type { Metadata } from "next";
import AdminSidebar from "@/components/admin/AdminSidebar";

export const metadata: Metadata = { title: "Admin — GreenView" };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-charcoal-dark flex">
      <AdminSidebar />
      <main className="flex-1 ml-0 lg:ml-64 min-h-screen bg-cream-50">
        {children}
      </main>
    </div>
  );
}
