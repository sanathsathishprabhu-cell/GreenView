"use client";

import { Suspense } from "react";
import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Booking } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import toast from "react-hot-toast";
import { useSearchParams } from "next/navigation";

type StatusFilter = "all" | "pending" | "confirmed" | "cancelled" | "completed";

export default function AdminBookingsPage() {
  return (
    <Suspense fallback={
      <div className="pt-16 lg:pt-0 p-6 lg:p-10">
        <div className="skeleton h-10 w-1/3 mb-8" />
        <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="skeleton h-14" />)}</div>
      </div>
    }>
      <AdminBookingsInner />
    </Suspense>
  );
}

function AdminBookingsInner() {
  const searchParams = useSearchParams();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<StatusFilter>((searchParams.get("filter") as StatusFilter) || "all");
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "bookings"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      setBookings(
        snap.docs.map((d) => {
          const data = d.data();
          return {
            ...data, id: d.id,
            checkIn: data.checkIn?.toDate ? data.checkIn.toDate() : new Date(data.checkIn),
            checkOut: data.checkOut?.toDate ? data.checkOut.toDate() : new Date(data.checkOut),
          } as Booking;
        })
      );
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchBookings(); }, []);

  const updateStatus = async (id: string, status: Booking["status"]) => {
    setUpdating(id);
    try {
      await updateDoc(doc(db, "bookings", id), { status, updatedAt: new Date() });
      setBookings((prev) => prev.map((b) => b.id === id ? { ...b, status } : b));
      toast.success(`Booking ${status}`);
    } catch { toast.error("Update failed"); }
    finally { setUpdating(null); }
  };

  const filtered = filter === "all" ? bookings : bookings.filter((b) => b.status === filter);

  const statusBadge = (s: Booking["status"]) => {
    if (s === "confirmed") return <span className="badge-confirmed">{s}</span>;
    if (s === "pending") return <span className="badge-pending">{s}</span>;
    return <span className="badge-cancelled">{s}</span>;
  };

  const FILTERS: { label: string; value: StatusFilter }[] = [
    { label: "All", value: "all" },
    { label: "Pending", value: "pending" },
    { label: "Confirmed", value: "confirmed" },
    { label: "Cancelled", value: "cancelled" },
    { label: "Completed", value: "completed" },
  ];

  return (
    <div className="pt-16 lg:pt-0 p-6 lg:p-10 min-h-screen">
      <div className="mb-8 pt-4">
        <p className="font-sans text-xs tracking-[0.2em] uppercase text-charcoal-light/50 mb-1">Manage</p>
        <h1 className="font-serif text-3xl text-charcoal-dark">Bookings</h1>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {FILTERS.map(({ label, value }) => (
          <button key={value} onClick={() => setFilter(value)}
            className={`px-4 py-1.5 font-sans text-xs tracking-widest uppercase border transition-all ${filter === value ? "bg-charcoal-dark text-cream border-charcoal-dark" : "text-charcoal border-charcoal-light/20 hover:border-charcoal-dark"}`}>
            {label}
            {value !== "all" && ` (${bookings.filter((b) => b.status === value).length})`}
          </button>
        ))}
      </div>

      <div className="border border-charcoal-light/10 overflow-auto">
        {loading ? (
          <div className="p-8 space-y-4">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="skeleton h-14" />)}</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center"><p className="font-sans text-sm text-charcoal-light/50">No bookings found</p></div>
        ) : (
          <table className="w-full min-w-[900px]">
            <thead className="bg-charcoal-light/5 border-b border-charcoal-light/10">
              <tr>
                {["Guest", "Room", "Dates", "Guests", "Amount", "Status", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left font-sans text-[10px] tracking-[0.2em] uppercase text-charcoal-light/50">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal-light/5">
              {filtered.map((booking) => (
                <tr key={booking.id} className="hover:bg-charcoal-light/5 transition-colors">
                  <td className="px-4 py-4">
                    <p className="font-sans text-sm text-charcoal font-medium">{booking.userName}</p>
                    <p className="font-sans text-xs text-charcoal-light/50">{booking.userEmail}</p>
                  </td>
                  <td className="px-4 py-4">
                    <p className="font-sans text-sm text-charcoal">{booking.roomName}</p>
                    <p className="font-sans text-xs text-charcoal-light/50">{booking.roomCategory}</p>
                  </td>
                  <td className="px-4 py-4">
                    <p className="font-sans text-xs text-charcoal-light/70">{formatDate(booking.checkIn)}</p>
                    <p className="font-sans text-xs text-charcoal-light/70">{formatDate(booking.checkOut)}</p>
                  </td>
                  <td className="px-4 py-4 font-sans text-sm text-charcoal-light/70">{booking.guests}</td>
                  <td className="px-4 py-4 font-sans text-sm text-charcoal">{formatCurrency(booking.totalAmount)}</td>
                  <td className="px-4 py-4">{statusBadge(booking.status)}</td>
                  <td className="px-4 py-4">
                    <select
                      defaultValue={booking.status}
                      disabled={updating === booking.id}
                      onChange={(e) => updateStatus(booking.id, e.target.value as Booking["status"])}
                      className="font-sans text-xs bg-transparent border-b border-charcoal-light/20 focus:border-gold focus:outline-none cursor-pointer py-1 text-charcoal disabled:opacity-50"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="completed">Completed</option>
                    </select>
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
