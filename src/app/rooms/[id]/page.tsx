import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import RoomDetailContent from "@/components/rooms/RoomDetailContent";

export const metadata: Metadata = {
  title: "Room Detail — GreenView",
};

export default function RoomDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <main>
      <Navbar />
      <RoomDetailContent roomId={params.id} />
      <Footer />
    </main>
  );
}
