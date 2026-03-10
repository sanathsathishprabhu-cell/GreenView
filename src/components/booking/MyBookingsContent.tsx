"use client";

import { useEffect, useState } from "react";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Booking } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { formatCurrency, formatDate } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Calendar, Users, ArrowRight } from "lucide-react";

export default function MyBookingsContent() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/signin?redirect=/my-bookings");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;
    const fetchBookings = async () => {
      try {
        const q = query(
          collection(db, "bookings"),
          where("userId", "==", user.uid),
          orderBy("createdAt", "desc")
        );
        const snap = await getDocs(q);
        setBookings(
          snap.docs.map((d) => {
            const data = d.data();
            return {
              ...data,
              id: d.id,
              checkIn: data.checkIn?.toDate ? data.checkIn.toDate() : new Date(data.checkIn),
              checkOut: data.checkOut?.toDate ? data.checkOut.toDate() : new Date(data.checkOut),
            } as Booking;
          })
        );
      } catch { /* silent */ }
      finally { setLoading(false); }
    };
    fetchBookings();
  }, [user]);

  const statusBadge = (status: Booking["status"]) => {
    if (status === "confirmed") return <span className="badge-confirmed">{status}</span>;
    if (status === "pending") return <span className="badge-pending">{status}</span>;
    return <span className="badge-cancelled">{status}</span>;
  };

  if (authLoading || loading) {
    return (
      <div className="pt-32 section-padding section-gap min-h-screen">
        <div className="skeleton h-10 w-1/3 mb-8" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="skeleton h-36 mb-4" />
        ))}
      </div>
    );
  }

  return (
    <div className="pt-28 pb-24 section-padding bg-cream min-h-screen">
      <div className="max-w-4xl mx-auto">
        <p className="eyebrow mb-3">Your Account</p>
        <h1 className="heading-lg mb-12">My Bookings</h1>

        {bookings.length === 0 ? (
          <div className="text-center py-24 border border-charcoal-light/10">
            <p className="font-serif text-2xl text-charcoal-light mb-3">No bookings yet</p>
            <p className="body-base mb-8">Your reservations will appear here once you book a room.</p>
            <Link href="/rooms" className="btn-primary">Explore Rooms</Link>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {bookings.map((booking) => (
              <div key={booking.id} className="border border-charcoal-light/10 overflow-hidden group hover:border-gold/30 transition-colors duration-300">
                <div className="grid sm:grid-cols-4">
                  {/* Image */}
                  {booking.roomImage && (
                    <div className="sm:col-span-1 aspect-[4/3] sm:aspect-auto overflow-hidden">
                      {/*eslint-disable-next-line @next/next/no-img-element*/}
                      <img src={booking.roomImage} alt={booking.roomName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  )}

                  {/* Info */}
                  <div className="sm:col-span-3 p-6 flex flex-col justify-between">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div>
                        <p className="eyebrow mb-1">{booking.roomCategory}</p>
                        <h3 className="heading-sm">{booking.roomName}</h3>
                      </div>
                      {statusBadge(booking.status)}
                    </div>

                    <div className="flex flex-wrap gap-4 mb-4">
                      <div className="flex items-center gap-2 text-charcoal-light/60">
                        <Calendar className="w-3.5 h-3.5 text-gold" />
                        <span className="font-sans text-sm">{formatDate(booking.checkIn)} → {formatDate(booking.checkOut)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-charcoal-light/60">
                        <Users className="w-3.5 h-3.5 text-gold" />
                        <span className="font-sans text-sm">{booking.guests} {booking.guests === 1 ? "Guest" : "Guests"} · {booking.nights} {booking.nights === 1 ? "night" : "nights"}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-charcoal-light/10">
                      <div>
                        <p className="font-sans text-xs text-charcoal-light/50">Total Paid</p>
                        <p className="font-serif text-xl text-charcoal-dark">{formatCurrency(booking.totalAmount)}</p>
                      </div>
                      <Link
                        href={`/booking-confirmation/${booking.id}`}
                        className="flex items-center gap-1.5 font-sans text-xs tracking-widest uppercase text-gold hover:gap-3 transition-all duration-300"
                      >
                        View Details <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
