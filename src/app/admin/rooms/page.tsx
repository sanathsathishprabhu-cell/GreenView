"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Room } from "@/types";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";
import toast from "react-hot-toast";
import { Plus, Pencil, Trash2, Eye, ToggleLeft, ToggleRight } from "lucide-react";

export default function AdminRoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, "rooms"));
      setRooms(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Room)));
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchRooms(); }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setDeleting(id);
    try {
      await deleteDoc(doc(db, "rooms", id));
      setRooms((prev) => prev.filter((r) => r.id !== id));
      toast.success("Room deleted");
    } catch { toast.error("Delete failed"); }
    finally { setDeleting(null); }
  };

  const toggleAvailability = async (room: Room) => {
    try {
      await updateDoc(doc(db, "rooms", room.id), { available: !room.available });
      setRooms((prev) => prev.map((r) => r.id === room.id ? { ...r, available: !r.available } : r));
      toast.success(`Room marked as ${!room.available ? "available" : "unavailable"}`);
    } catch { toast.error("Update failed"); }
  };

  return (
    <div className="pt-16 lg:pt-0 p-6 lg:p-10 min-h-screen">
      <div className="flex items-center justify-between mb-8 pt-4">
        <div>
          <p className="font-sans text-xs tracking-[0.2em] uppercase text-charcoal-light/50 mb-1">Manage</p>
          <h1 className="font-serif text-3xl text-charcoal-dark">Rooms</h1>
        </div>
        <Link href="/admin/rooms/new" className="btn-solid gap-2">
          <Plus className="w-4 h-4" /> Add Room
        </Link>
      </div>

      <div className="border border-charcoal-light/10 overflow-hidden overflow-x-auto">
        {loading ? (
          <div className="p-8 space-y-4">
            {Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton h-16" />)}
          </div>
        ) : rooms.length === 0 ? (
          <div className="p-16 text-center">
            <p className="font-sans text-sm text-charcoal-light/50 mb-4">No rooms added yet</p>
            <Link href="/admin/rooms/new" className="btn-primary">Add Your First Room</Link>
          </div>
        ) : (
          <table className="w-full min-w-[700px]">
            <thead className="bg-charcoal-light/5 border-b border-charcoal-light/10">
              <tr>
                {["Room", "Category", "Price/Night", "Capacity", "Status", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left font-sans text-[10px] tracking-[0.2em] uppercase text-charcoal-light/50">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal-light/5">
              {rooms.map((room) => (
                <tr key={room.id} className="hover:bg-charcoal-light/5 transition-colors">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-10 overflow-hidden shrink-0 bg-charcoal-light/10">
                        {room.images?.[0] && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={room.images[0]} alt={room.name} className="w-full h-full object-cover" />
                        )}
                      </div>
                      <span className="font-sans text-sm text-charcoal font-medium">{room.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="font-sans text-xs tracking-widest uppercase text-gold">{room.category}</span>
                  </td>
                  <td className="px-4 py-4 font-sans text-sm text-charcoal">{formatCurrency(room.price)}</td>
                  <td className="px-4 py-4 font-sans text-sm text-charcoal-light/70">{room.capacity} guests</td>
                  <td className="px-4 py-4">
                    <button onClick={() => toggleAvailability(room)} className="flex items-center gap-1.5 font-sans text-xs tracking-wider transition-colors">
                      {room.available
                        ? <><ToggleRight className="w-5 h-5 text-green-500" /><span className="text-green-600">Available</span></>
                        : <><ToggleLeft className="w-5 h-5 text-charcoal-light/40" /><span className="text-charcoal-light/40">Unavailable</span></>
                      }
                    </button>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <Link href={`/rooms/${room.id}`} className="p-1.5 text-charcoal-light/40 hover:text-charcoal transition-colors" title="View">
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link href={`/admin/rooms/${room.id}/edit`} className="p-1.5 text-charcoal-light/40 hover:text-gold transition-colors" title="Edit">
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(room.id, room.name)}
                        disabled={deleting === room.id}
                        className="p-1.5 text-charcoal-light/40 hover:text-red-500 transition-colors disabled:opacity-40"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
