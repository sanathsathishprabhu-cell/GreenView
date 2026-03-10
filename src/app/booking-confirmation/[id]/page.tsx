export const dynamic = 'force-dynamic';
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BookingConfirmationContent from "@/components/booking/BookingConfirmationContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Booking Confirmed — GreenView",
};

export default function BookingConfirmationPage({ params }: { params: { id: string } }) {
  return (
    <main>
      <Navbar />
      <BookingConfirmationContent bookingId={params.id} />
      <Footer />
    </main>
  );
}
