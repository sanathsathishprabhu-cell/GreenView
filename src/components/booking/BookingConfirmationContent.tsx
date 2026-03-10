"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Booking } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import Link from "next/link";
import { CheckCircle2, Calendar, Users, Download, ArrowRight } from "lucide-react";

export default function BookingConfirmationContent({ bookingId }: { bookingId: string }) {
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const snap = await getDoc(doc(db, "bookings", bookingId));
        if (snap.exists()) {
          const data = snap.data();
          setBooking({
            ...data,
            id: snap.id,
            checkIn: data.checkIn?.toDate ? data.checkIn.toDate() : new Date(data.checkIn),
            checkOut: data.checkOut?.toDate ? data.checkOut.toDate() : new Date(data.checkOut),
          } as Booking);
        }
      } catch { /* silent */ }
      finally { setLoading(false); }
    };
    fetchBooking();
  }, [bookingId]);

  if (loading) {
    return (
      <div className="pt-32 pb-24 section-padding max-w-2xl mx-auto">
        <div className="skeleton h-20 w-20 rounded-full mx-auto mb-8" />
        <div className="skeleton h-10 w-1/2 mx-auto mb-4" />
        <div className="skeleton h-4 w-2/3 mx-auto mb-8" />
        <div className="skeleton h-64 w-full" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="pt-32 pb-24 section-padding text-center">
        <h1 className="heading-lg mb-4">Booking not found</h1>
        <Link href="/" className="btn-primary">Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-24 section-padding bg-cream min-h-screen">
      <div className="max-w-2xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 border-2 border-gold flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-gold" />
          </div>
          <p className="eyebrow mb-3">Reservation Confirmed</p>
          <h1 className="heading-xl mb-4">Your Stay Awaits</h1>
          <p className="body-lg max-w-md mx-auto">
            A confirmation has been sent to <strong>{booking.userEmail}</strong>.
            We look forward to welcoming you.
          </p>
        </div>

        {/* Booking Details Card */}
        <div className="border border-charcoal-light/10 bg-cream-50">
          {/* Room image */}
          {booking.roomImage && (
            <div className="aspect-[16/6] overflow-hidden">
              {/*eslint-disable-next-line @next/next/no-img-element*/}
              <img src={booking.roomImage} alt={booking.roomName} className="w-full h-full object-cover" />
            </div>
          )}

          <div className="p-8">
            {/* Booking ID */}
            <div className="flex items-center justify-between mb-6 pb-6 border-b border-charcoal-light/10">
              <div>
                <p className="font-sans text-xs tracking-wider uppercase text-charcoal-light/50 mb-1">Booking Reference</p>
                <p className="font-mono text-lg text-charcoal-dark font-medium tracking-wider">
                  {bookingId.slice(0, 8).toUpperCase()}
                </p>
              </div>
              <span className="badge-confirmed">Confirmed</span>
            </div>

            {/* Stay info */}
            <div className="mb-6 pb-6 border-b border-charcoal-light/10">
              <p className="eyebrow mb-2">{booking.roomCategory}</p>
              <h2 className="heading-sm mb-4">{booking.roomName}</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <Calendar className="w-4 h-4 text-gold mt-0.5 shrink-0" />
                  <div>
                    <p className="font-sans text-xs tracking-wider uppercase text-charcoal-light/50 mb-1">Check In</p>
                    <p className="font-sans text-sm text-charcoal font-medium">{formatDate(booking.checkIn)}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="w-4 h-4 text-gold mt-0.5 shrink-0" />
                  <div>
                    <p className="font-sans text-xs tracking-wider uppercase text-charcoal-light/50 mb-1">Check Out</p>
                    <p className="font-sans text-sm text-charcoal font-medium">{formatDate(booking.checkOut)}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="w-4 h-4 text-gold mt-0.5 shrink-0" />
                  <div>
                    <p className="font-sans text-xs tracking-wider uppercase text-charcoal-light/50 mb-1">Guests</p>
                    <p className="font-sans text-sm text-charcoal font-medium">{booking.guests} {booking.guests === 1 ? "Guest" : "Guests"}</p>
                  </div>
                </div>
                <div>
                  <p className="font-sans text-xs tracking-wider uppercase text-charcoal-light/50 mb-1">Duration</p>
                  <p className="font-sans text-sm text-charcoal font-medium">{booking.nights} {booking.nights === 1 ? "Night" : "Nights"}</p>
                </div>
              </div>
            </div>

            {/* Guest info */}
            <div className="mb-6 pb-6 border-b border-charcoal-light/10">
              <h3 className="font-sans text-xs tracking-[0.2em] uppercase text-charcoal-light/50 mb-4">Guest Details</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <p className="font-sans text-xs text-charcoal-light/50">Name</p>
                  <p className="font-sans text-sm text-charcoal">{booking.userName}</p>
                </div>
                <div>
                  <p className="font-sans text-xs text-charcoal-light/50">Email</p>
                  <p className="font-sans text-sm text-charcoal">{booking.userEmail}</p>
                </div>
                <div>
                  <p className="font-sans text-xs text-charcoal-light/50">Phone</p>
                  <p className="font-sans text-sm text-charcoal">{booking.userPhone}</p>
                </div>
              </div>
            </div>

            {/* Payment Summary */}
            <div className="mb-8">
              <h3 className="font-sans text-xs tracking-[0.2em] uppercase text-charcoal-light/50 mb-4">Payment Summary</h3>
              <div className="flex justify-between font-sans text-sm text-charcoal-light mb-2">
                <span>{formatCurrency(booking.pricePerNight)} × {booking.nights} nights</span>
                <span>{formatCurrency(booking.pricePerNight * booking.nights)}</span>
              </div>
              <div className="flex justify-between font-sans text-sm text-charcoal-light mb-3">
                <span>GST (18%)</span>
                <span>{formatCurrency(booking.totalAmount - booking.pricePerNight * booking.nights)}</span>
              </div>
              <div className="flex justify-between font-serif text-xl text-charcoal-dark border-t border-charcoal-light/10 pt-3">
                <span>Total Paid</span>
                <span className="text-gold">{formatCurrency(booking.totalAmount)}</span>
              </div>
              {booking.razorpayPaymentId && (
                <p className="font-sans text-xs text-charcoal-light/40 mt-2">
                  Payment ID: {booking.razorpayPaymentId}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/my-bookings" className="btn-primary flex-1 justify-center">
                View My Bookings <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/rooms" className="btn-gold flex-1 justify-center">
                Explore More Rooms
              </Link>
            </div>
          </div>
        </div>

        {/* Policy note */}
        <div className="mt-8 text-center">
          <p className="font-sans text-xs text-charcoal-light/40 leading-loose">
            Need to modify or cancel? Contact us at{" "}
            <a href="mailto:reservations@greenview.com" className="text-gold hover:underline">
              reservations@greenview.com
            </a>{" "}
            at least 48 hours before your check-in date.
          </p>
        </div>
      </div>
    </div>
  );
}
