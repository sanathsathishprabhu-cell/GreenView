"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Room } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import toast from "react-hot-toast";
import { Shield, Lock, Calendar, ChevronLeft } from "lucide-react";
import Link from "next/link";

// Razorpay types
interface RazorpayInstance {
  open(): void;
}
interface RazorpayConstructor {
  new (options: Record<string, unknown>): RazorpayInstance;
}
declare global {
  interface Window {
    Razorpay?: RazorpayConstructor;
  }
}

const FALLBACK_ROOMS: Record<string, Room> = {
  "1": {
    id: "1", name: "Forest Deluxe Room", category: "Deluxe", price: 18000,
    shortDescription: "Forest retreat", description: "", capacity: 2, size: 45, beds: "1 King",
    amenities: [], images: ["https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=500&q=80"],
    available: true, featured: true, view: "Forest",
  },
  "2": {
    id: "2", name: "Mountain Suite", category: "Suite", price: 38000,
    shortDescription: "Mountain views", description: "", capacity: 2, size: 90, beds: "1 King",
    amenities: [], images: ["https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=500&q=80"],
    available: true, featured: true, view: "Mountain",
  },
  "3": {
    id: "3", name: "Lakeside Villa", category: "Villa", price: 75000,
    shortDescription: "Private villa", description: "", capacity: 4, size: 180, beds: "2 Beds",
    amenities: [], images: ["https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=500&q=80"],
    available: true, featured: false, view: "Lake",
  },
};

export default function BookingFormContent({ roomId }: { roomId: string }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, userData, loading: authLoading } = useAuth();

  const checkInStr = searchParams.get("checkIn") || "";
  const checkOutStr = searchParams.get("checkOut") || "";
  const guestsStr = searchParams.get("guests") || "2";

  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      router.push(`/auth/signin?redirect=/book/${roomId}?${searchParams.toString()}`);
    }
  }, [user, authLoading, router, roomId, searchParams]);

  useEffect(() => {
    if (user) {
      setName(userData?.name || user.displayName || "");
      setEmail(user.email || "");
      setPhone(userData?.phone || "");
    }
  }, [user, userData]);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const snap = await getDoc(doc(db, "rooms", roomId));
        setRoom(snap.exists() ? { id: snap.id, ...snap.data() } as Room : FALLBACK_ROOMS[roomId] || FALLBACK_ROOMS["1"]);
      } catch {
        setRoom(FALLBACK_ROOMS[roomId] || FALLBACK_ROOMS["1"]);
      } finally {
        setLoading(false);
      }
    };
    fetchRoom();
  }, [roomId]);

  const checkIn = checkInStr ? new Date(checkInStr) : new Date();
  const checkOut = checkOutStr ? new Date(checkOutStr) : new Date(Date.now() + 2 * 86400000);
  const nights = Math.max(1, Math.floor((checkOut.getTime() - checkIn.getTime()) / 86400000));
  const guests = Number(guestsStr);
  const subtotal = room ? room.price * nights : 0;
  const gst = Math.round(subtotal * 0.18);
  const total = subtotal + gst;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!room || !user) return;
    if (!name || !email || !phone) {
      toast.error("Please fill all required fields");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/create-booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomId: room.id,
          roomName: room.name,
          roomImage: room.images[0],
          roomCategory: room.category,
          userId: user.uid,
          userEmail: email,
          userName: name,
          userPhone: phone,
          checkIn: checkInStr,
          checkOut: checkOutStr,
          guests,
          nights,
          pricePerNight: room.price,
          totalAmount: total,
          specialRequests,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Booking failed");

      // Open Razorpay
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        name: "GreenView Hotels",
        description: `${room.name} — ${nights} nights`,
        order_id: data.orderId,
        prefill: { name, email, contact: phone },
        theme: { color: "#C9A96E" },
        handler: async (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) => {
          const verifyRes = await fetch("/api/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              bookingId: data.bookingId,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });
          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            toast.success("Booking confirmed!");
            router.push(`/booking-confirmation/${data.bookingId}`);
          } else {
            toast.error("Payment verification failed");
          }
        },
        modal: {
          ondismiss: () => {
            toast.error("Payment cancelled");
            setSubmitting(false);
          },
        },
      };

      // Load Razorpay script
      if (!(window as Window & { Razorpay?: unknown }).Razorpay) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement("script");
          script.src = "https://checkout.razorpay.com/v1/checkout.js";
          script.onload = () => resolve();
          script.onerror = () => reject(new Error("Razorpay load failed"));
          document.head.appendChild(script);
        });
      }

      const RazorpayClass = window.Razorpay!;
      const rzp = new RazorpayClass(options as Record<string, unknown>);
      rzp.open();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      toast.error(msg);
      setSubmitting(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="pt-32 section-padding section-gap">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <div className="skeleton h-10 w-1/2 mb-8" />
            <div className="skeleton h-4 w-full mb-4" />
            <div className="skeleton h-4 w-4/5 mb-4" />
            <div className="skeleton h-4 w-3/4" />
          </div>
          <div className="skeleton h-80" />
        </div>
      </div>
    );
  }

  if (!room) return null;

  return (
    <div className="pt-28 pb-24 section-padding bg-cream min-h-screen">
      <div className="max-w-5xl mx-auto">
        {/* Breadcrumb */}
        <Link href={`/rooms/${roomId}`} className="flex items-center gap-2 font-sans text-xs tracking-wider uppercase text-charcoal-light/50 hover:text-gold transition-colors mb-10">
          <ChevronLeft className="w-3 h-3" /> Back to Room
        </Link>

        <div className="mb-10">
          <p className="eyebrow mb-3">Complete Your Reservation</p>
          <h1 className="heading-lg">Your Stay Details</h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-10">
              {/* Guest Info */}
              <div>
                <h2 className="heading-sm mb-6 pb-4 border-b border-charcoal-light/10">
                  Guest Information
                </h2>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="form-label">Full Name *</label>
                    <input
                      type="text"
                      id="booking-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your full name"
                      required
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="form-label">Email Address *</label>
                    <input
                      type="email"
                      id="booking-email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      required
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="form-label">Phone Number *</label>
                    <input
                      type="tel"
                      id="booking-phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      required
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="form-label">Number of Guests</label>
                    <select
                      id="booking-guests"
                      value={guests}
                      disabled
                      className="form-input opacity-70 cursor-not-allowed"
                    >
                      <option>{guests} {guests === 1 ? "Guest" : "Guests"}</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Stay Details */}
              <div>
                <h2 className="heading-sm mb-6 pb-4 border-b border-charcoal-light/10">
                  Stay Details
                </h2>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="flex items-center gap-3 bg-cream-100 border border-charcoal-light/10 px-4 py-3">
                    <Calendar className="w-4 h-4 text-gold" />
                    <div>
                      <p className="font-sans text-[10px] tracking-wider uppercase text-charcoal-light/50">Check In</p>
                      <p className="font-sans text-sm text-charcoal font-medium">{formatDate(checkIn)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-cream-100 border border-charcoal-light/10 px-4 py-3">
                    <Calendar className="w-4 h-4 text-gold" />
                    <div>
                      <p className="font-sans text-[10px] tracking-wider uppercase text-charcoal-light/50">Check Out</p>
                      <p className="font-sans text-sm text-charcoal font-medium">{formatDate(checkOut)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Special Requests */}
              <div>
                <h2 className="heading-sm mb-6 pb-4 border-b border-charcoal-light/10">
                  Special Requests
                </h2>
                <div>
                  <label className="form-label">Any preferences or requests? (Optional)</label>
                  <textarea
                    id="booking-requests"
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    placeholder="E.g. early check-in, dietary requirements, anniversary setup..."
                    rows={4}
                    className="form-input resize-none"
                  />
                </div>
              </div>

              {/* Security Note */}
              <div className="flex items-start gap-3 bg-forest/5 border border-forest/10 p-4">
                <Shield className="w-5 h-5 text-forest shrink-0 mt-0.5" />
                <div>
                  <p className="font-sans text-sm font-medium text-forest mb-1">Secure Booking</p>
                  <p className="font-sans text-xs text-charcoal-light/60 leading-loose">
                    Your payment is processed securely by Razorpay. We never store
                    your card details. Free cancellation up to 48 hours before check-in.
                  </p>
                </div>
              </div>

              <button
                type="submit"
                id="proceed-to-payment-btn"
                disabled={submitting}
                className="btn-solid w-full justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <Lock className="w-4 h-4" />
                {submitting ? "Processing..." : `Pay ${formatCurrency(total)} Securely`}
              </button>
            </form>
          </div>

          {/* Summary */}
          <div>
            <div className="border border-charcoal-light/10 overflow-hidden sticky top-28">
              {/* Room image */}
              <div className="aspect-[4/3] overflow-hidden">
                {/*eslint-disable-next-line @next/next/no-img-element*/}
                <img src={room.images[0]} alt={room.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-6">
                <p className="eyebrow mb-1">{room.category}</p>
                <h3 className="heading-sm mb-4 pb-4 border-b border-charcoal-light/10">{room.name}</h3>
                <div className="flex flex-col gap-2 mb-4 pb-4 border-b border-charcoal-light/10">
                  <div className="flex justify-between font-sans text-sm">
                    <span className="text-charcoal-light/60">Check-in</span>
                    <span className="text-charcoal">{formatDate(checkIn)}</span>
                  </div>
                  <div className="flex justify-between font-sans text-sm">
                    <span className="text-charcoal-light/60">Check-out</span>
                    <span className="text-charcoal">{formatDate(checkOut)}</span>
                  </div>
                  <div className="flex justify-between font-sans text-sm">
                    <span className="text-charcoal-light/60">Guests</span>
                    <span className="text-charcoal">{guests}</span>
                  </div>
                  <div className="flex justify-between font-sans text-sm">
                    <span className="text-charcoal-light/60">Duration</span>
                    <span className="text-charcoal">{nights} {nights === 1 ? "night" : "nights"}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2 mb-4 pb-4 border-b border-charcoal-light/10">
                  <div className="flex justify-between font-sans text-sm">
                    <span className="text-charcoal-light/60">Room rate</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between font-sans text-sm">
                    <span className="text-charcoal-light/60">GST (18%)</span>
                    <span>{formatCurrency(gst)}</span>
                  </div>
                </div>
                <div className="flex justify-between font-serif text-xl text-charcoal-dark">
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
