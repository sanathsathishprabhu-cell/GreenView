import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BookingFormContent from "@/components/booking/BookingFormContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book Your Stay — GreenView",
};

export default function BookPage({ params }: { params: { roomId: string } }) {
  return (
    <main>
      <Navbar />
      <BookingFormContent roomId={params.roomId} />
      <Footer />
    </main>
  );
}
