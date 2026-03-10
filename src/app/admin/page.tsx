"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { formatCurrency } from "@/lib/utils";
import { BedDouble, BookOpen, CreditCard, TrendingUp } from "lucide-react";
import Link from "next/link";

interface Stats {
  totalRooms: number;
  totalBookings: number;
  confirmedBookings: number;
  pendingBookings: number;
  totalRevenue: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats>({
    totalRooms: 0, totalBookings: 0, confirmedBookings: 0,
    pendingBookings: 0, totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentBookings, setRecentBookings] = useState<Array<{
    id: string; roomName: string; userName: string; totalAmount: number; status: string;
  }>>([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [roomsSnap, bookingsSnap] = await Promise.all([
          getDocs(collection(db, "rooms")),
          getDocs(collection(db, "bookings")),
        ]);

        let totalRevenue = 0;
        let confirmedBookings = 0;
        let pendingBookings = 0;
        const recent: typeof recentBookings = [];

        bookingsSnap.docs.forEach((d, i) => {
          const data = d.data();
          if (data.status === "confirmed") { confirmedBookings++; totalRevenue += data.totalAmount || 0; }
          if (data.status === "pending") pendingBookings++;
          if (i < 5) recent.push({ id: d.id, roomName: data.roomName, userName: data.userName, totalAmount: data.totalAmount, status: data.status });
        });

        setStats({
          totalRooms: roomsSnap.size,
          totalBookings: bookingsSnap.size,
          confirmedBookings,
          pendingBookings,
          totalRevenue,
        });
        setRecentBookings(recent);
      } catch { /* silent */ }
      finally { setLoading(false); }
    };
    fetchStats();
  }, []);

  const statCards = [
    { label: "Total Rooms", value: stats.totalRooms, Icon: BedDouble, href: "/admin/rooms", color: "text-gold" },
    { label: "Total Bookings", value: stats.totalBookings, Icon: BookOpen, href: "/admin/bookings", color: "text-forest-light" },
    { label: "Confirmed Stays", value: stats.confirmedBookings, Icon: TrendingUp, href: "/admin/bookings", color: "text-green-500" },
    { label: "Revenue (Confirmed)", value: formatCurrency(stats.totalRevenue), Icon: CreditCard, href: "/admin/payments", color: "text-gold" },
  ];

  return (
    <div className="pt-16 lg:pt-0 p-6 lg:p-10 min-h-screen">
      <div className="mb-8 pt-4">
        <p className="font-sans text-xs tracking-[0.2em] uppercase text-charcoal-light/50 mb-1">Overview</p>
        <h1 className="font-serif text-3xl text-charcoal-dark">Dashboard</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {statCards.map(({ label, value, Icon, href, color }) => (
          <Link key={label} href={href} className="border border-charcoal-light/10 bg-cream p-6 hover:border-gold/30 transition-colors duration-200 group">
            <div className="flex items-start justify-between mb-4">
              <div className={`${color}`}><Icon className="w-5 h-5" /></div>
            </div>
            {loading ? (
              <div className="skeleton h-8 w-2/3 mb-2" />
            ) : (
              <p className="font-serif text-2xl text-charcoal-dark mb-1">{value}</p>
            )}
            <p className="font-sans text-xs tracking-wider text-charcoal-light/50 uppercase">{label}</p>
          </Link>
        ))}
      </div>

      {/* Pending alert */}
      {stats.pendingBookings > 0 && (
        <div className="bg-gold/10 border border-gold/20 px-6 py-4 mb-8 flex items-center justify-between">
          <p className="font-sans text-sm text-gold-dark">
            <strong>{stats.pendingBookings}</strong> booking{stats.pendingBookings > 1 ? "s" : ""} awaiting confirmation
          </p>
          <Link href="/admin/bookings?filter=pending" className="font-sans text-xs tracking-widest uppercase text-gold-dark hover:underline">
            Review
          </Link>
        </div>
      )}

      {/* Recent bookings */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-xl text-charcoal-dark">Recent Bookings</h2>
          <Link href="/admin/bookings" className="font-sans text-xs tracking-widest uppercase text-gold hover:underline">View All</Link>
        </div>
        <div className="border border-charcoal-light/10 overflow-hidden">
          {loading ? (
            <div className="p-8">
              {Array.from({ length: 3 }).map((_, i) => <div key={i} className="skeleton h-12 mb-3" />)}
            </div>
          ) : recentBookings.length === 0 ? (
            <div className="p-12 text-center">
              <p className="font-sans text-sm text-charcoal-light/50">No bookings yet</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-charcoal-light/5 border-b border-charcoal-light/10">
                <tr>
                  {["Room", "Guest", "Amount", "Status"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left font-sans text-[10px] tracking-[0.2em] uppercase text-charcoal-light/50">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal-light/5">
                {recentBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-charcoal-light/5 transition-colors">
                    <td className="px-4 py-3 font-sans text-sm text-charcoal">{b.roomName}</td>
                    <td className="px-4 py-3 font-sans text-sm text-charcoal-light/70">{b.userName}</td>
                    <td className="px-4 py-3 font-sans text-sm text-charcoal">{formatCurrency(b.totalAmount)}</td>
                    <td className="px-4 py-3">
                      <span className={b.status === "confirmed" ? "badge-confirmed" : b.status === "pending" ? "badge-pending" : "badge-cancelled"}>{b.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
