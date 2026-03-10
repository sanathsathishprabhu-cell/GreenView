export const dynamic = 'force-dynamic';
import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MyBookingsContent from "@/components/booking/MyBookingsContent";

export const metadata: Metadata = { title: "My Bookings — GreenView" };

export default function MyBookingsPage() {
  return (
    <main>
      <Navbar />
      <MyBookingsContent />
      <Footer />
    </main>
  );
}
