export const dynamic = 'force-dynamic';
import RoomForm from "@/components/admin/RoomForm";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "New Room — Admin — GreenView" };

export default function NewRoomPage() {
  return <RoomForm mode="create" />;
}
