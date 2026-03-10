"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Room } from "@/types";
import RoomForm from "@/components/admin/RoomForm";

export default function EditRoomPage({ params }: { params: { id: string } }) {
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const snap = await getDoc(doc(db, "rooms", params.id));
        if (snap.exists()) setRoom({ id: snap.id, ...snap.data() } as Room);
      } finally { setLoading(false); }
    };
    fetchRoom();
  }, [params.id]);

  if (loading) {
    return (
      <div className="pt-16 lg:pt-0 p-10 min-h-screen">
        <div className="skeleton h-10 w-1/3 mb-8" />
        <div className="skeleton h-96" />
      </div>
    );
  }

  if (!room) {
    return <div className="p-10"><p className="font-sans text-sm text-charcoal-light/50">Room not found</p></div>;
  }

  return <RoomForm mode="edit" roomId={params.id} initialData={room} />;
}
