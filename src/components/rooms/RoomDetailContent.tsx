"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Room } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Users, Maximize2, Check, ChevronLeft, ChevronRight, Bed, Eye } from "lucide-react";
import Link from "next/link";
import { format, addDays } from "date-fns";

const FALLBACK: Record<string, Room> = {
  "1": {
    id: "1", name: "Forest Deluxe Room", category: "Deluxe", price: 18000,
    shortDescription: "An intimate retreat enveloped in ancient forest.",
    description: "Nestled within a canopy of ancient deodar trees, the Forest Deluxe Room offers a profound sense of immersion in nature. Floor-to-ceiling glass walls dissolve the boundary between inside and out, while the hand-crafted interiors — local stone, warm timber, hand-woven textiles — create a space that feels at once elemental and deeply refined. A private balcony overlooks the forest floor, where morning mist rises through the branches at dawn.",
    capacity: 2, size: 45, beds: "1 King Bed", amenities: ["High-Speed Wi-Fi", "Mini Bar", "Private Balcony", "Forest View", "Rainfall Shower", "Air Conditioning", "Room Service", "Safe"],
    images: [
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1200&q=85",
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&q=85",
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=1200&q=85",
    ],
    available: true, featured: true, view: "Forest",
  },
  "2": {
    id: "2", name: "Mountain Suite", category: "Suite", price: 38000,
    shortDescription: "Panoramic views of snow-capped peaks.",
    description: "The Mountain Suite commands the property's most extraordinary views: an uninterrupted panorama of the high Himalayan peaks. A private plunge pool sits at the room's edge, seemingly suspended above the valley. Inside, a wood-burning fireplace anchors the living space, while the bespoke bedroom is a sanctuary of natural silence. Service here is entirely bespoke — your personal butler anticipates every requirement.",
    capacity: 2, size: 90, beds: "1 King Bed",
    amenities: ["Private Plunge Pool", "Fireplace", "Personal Butler", "Panoramic Mountain View", "Outdoor Deck", "Soaking Tub", "Walk-in Closet", "Premium Minibar"],
    images: [
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&q=85",
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1200&q=85",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200&q=85",
    ],
    available: true, featured: true, view: "Mountain",
  },
  "3": {
    id: "3", name: "Lakeside Villa", category: "Villa", price: 75000,
    shortDescription: "Private villa at the water's edge.",
    description: "The Lakeside Villa occupies a private promontory at the lake's edge — a world entirely unto itself. A personal butler and private chef are at your disposal from morning until night. The infinity pool flows visually into the lake beyond, while the master bedroom opens to the water through floor-length glass. A second bedroom, a fully equipped kitchen, and a private path to the lake's edge complete this extraordinary retreat.",
    capacity: 4, size: 180, beds: "1 King + 1 Twin",
    amenities: ["Private Infinity Pool", "Personal Butler", "Private Chef", "Lake Access", "Full Kitchen", "Two Bedrooms", "Outdoor Dining", "Boat Access"],
    images: [
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&q=85",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&q=85",
      "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=1200&q=85",
    ],
    available: true, featured: false, view: "Lake",
  },
};

export default function RoomDetailContent({ roomId }: { roomId: string }) {
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [checkIn, setCheckIn] = useState(format(new Date(), "yyyy-MM-dd"));
  const [checkOut, setCheckOut] = useState(format(addDays(new Date(), 2), "yyyy-MM-dd"));
  const [guests, setGuests] = useState(2);
  const [blockedDates, setBlockedDates] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const snap = await getDoc(doc(db, "rooms", roomId));
        if (snap.exists()) {
          setRoom({ id: snap.id, ...snap.data() } as Room);
        } else {
          setRoom(FALLBACK[roomId] || FALLBACK["1"]);
        }
      } catch {
        setRoom(FALLBACK[roomId] || FALLBACK["1"]);
      } finally {
        setLoading(false);
      }
    };

    const fetchBlockedDates = async () => {
      try {
        const q = query(
          collection(db, "bookings"),
          where("roomId", "==", roomId),
          where("status", "in", ["confirmed", "pending"])
        );
        const snap = await getDocs(q);
        const dates: string[] = [];
        snap.docs.forEach((d) => {
          const data = d.data();
          const ci = data.checkIn?.toDate ? data.checkIn.toDate() : new Date(data.checkIn);
          const co = data.checkOut?.toDate ? data.checkOut.toDate() : new Date(data.checkOut);
          let cur = ci;
          while (cur < co) {
            dates.push(format(cur, "yyyy-MM-dd"));
            cur = addDays(cur, 1);
          }
        });
        setBlockedDates(dates);
      } catch { /* silent */ }
    };

    fetchRoom();
    fetchBlockedDates();
  }, [roomId]);

  const handleBookNow = () => {
    const params = new URLSearchParams({ checkIn, checkOut, guests: guests.toString() });
    router.push(`/book/${roomId}?${params.toString()}`);
  };

  if (loading) {
    return (
      <div className="pt-24 section-padding section-gap">
        <div className="skeleton w-full aspect-[16/7] mb-8" />
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <div className="skeleton h-10 w-2/3 mb-4" />
            <div className="skeleton h-4 w-full mb-3" />
            <div className="skeleton h-4 w-4/5" />
          </div>
        </div>
      </div>
    );
  }

  if (!room) return null;

  const nights = Math.max(1, Math.floor((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000));
  const total = room.price * nights;

  return (
    <article>
      {/* Gallery */}
      <div className="relative pt-20 bg-charcoal-dark">
        <div className="relative h-[55vh] min-h-[400px] overflow-hidden">
          {/*eslint-disable-next-line @next/next/no-img-element*/}
          <img
            src={room.images[activeImage]}
            alt={room.name}
            className="w-full h-full object-cover transition-opacity duration-500"
          />
          {/* Controls */}
          {room.images.length > 1 && (
            <>
              <button
                onClick={() => setActiveImage((p) => (p === 0 ? room.images.length - 1 : p - 1))}
                className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 border border-white/40 text-white hover:bg-white/20 transition-colors flex items-center justify-center"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setActiveImage((p) => (p === room.images.length - 1 ? 0 : p + 1))}
                className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 border border-white/40 text-white hover:bg-white/20 transition-colors flex items-center justify-center"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              {/* Thumbnails */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                {room.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`w-16 h-10 overflow-hidden border-2 transition-all ${activeImage === i ? "border-gold opacity-100" : "border-transparent opacity-50 hover:opacity-75"}`}
                  >
                    {/*eslint-disable-next-line @next/next/no-img-element*/}
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="section-padding py-16 lg:py-24 bg-cream">
        <div className="grid lg:grid-cols-3 gap-12 lg:gap-16">
          {/* Left: Details */}
          <div className="lg:col-span-2">
            <div className="mb-2">
              <span className="eyebrow">{room.category}</span>
            </div>
            <h1 className="heading-xl mb-6">{room.name}</h1>

            {/* Quick specs */}
            <div className="flex flex-wrap gap-6 mb-8 pb-8 border-b border-charcoal-light/10">
              {[
                { Icon: Users, label: `Up to ${room.capacity} guests` },
                { Icon: Maximize2, label: `${room.size} m²` },
                { Icon: Bed, label: room.beds },
                { Icon: Eye, label: `${room.view} View` },
              ].map(({ Icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-charcoal-light">
                  <Icon className="w-4 h-4 text-gold" />
                  <span className="font-sans text-sm">{label}</span>
                </div>
              ))}
            </div>

            {/* Description */}
            <div className="mb-12">
              <h2 className="heading-sm mb-4">About This Space</h2>
              <p className="body-lg leading-loose">{room.description}</p>
            </div>

            {/* Amenities */}
            <div>
              <h2 className="heading-sm mb-6">Amenities & Inclusions</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {room.amenities.map((amenity) => (
                  <div key={amenity} className="flex items-center gap-3">
                    <div className="w-5 h-5 border border-gold flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-gold" />
                    </div>
                    <span className="font-sans text-sm text-charcoal-light">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Booking Widget */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 border border-charcoal-light/10 bg-cream-50 p-8">
              <div className="mb-6">
                <span className="font-sans text-xs text-charcoal-light/50 tracking-wider">From</span>
                <p className="font-serif text-3xl text-charcoal-dark">
                  {formatCurrency(room.price)}
                  <span className="font-sans text-sm text-charcoal-light/50 font-normal ml-1">/ night</span>
                </p>
              </div>

              {/* Date inputs */}
              <div className="mb-4">
                <label className="form-label">Check In</label>
                <input
                  type="date"
                  id="detail-checkin"
                  value={checkIn}
                  min={format(new Date(), "yyyy-MM-dd")}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="form-input"
                />
              </div>
              <div className="mb-4">
                <label className="form-label">Check Out</label>
                <input
                  type="date"
                  id="detail-checkout"
                  value={checkOut}
                  min={checkIn}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="form-input"
                />
              </div>
              <div className="mb-6">
                <label className="form-label">Guests</label>
                <select
                  id="detail-guests"
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                  className="form-input"
                >
                  {Array.from({ length: room.capacity }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={n}>{n} {n === 1 ? "Guest" : "Guests"}</option>
                  ))}
                </select>
              </div>

              {/* Summary */}
              <div className="border-t border-charcoal-light/10 py-4 mb-6">
                <div className="flex justify-between font-sans text-sm text-charcoal-light mb-2">
                  <span>{formatCurrency(room.price)} × {nights} {nights === 1 ? "night" : "nights"}</span>
                  <span>{formatCurrency(total)}</span>
                </div>
                <div className="flex justify-between font-sans text-sm text-charcoal-light mb-2">
                  <span>Taxes & Fees (18% GST)</span>
                  <span>{formatCurrency(Math.round(total * 0.18))}</span>
                </div>
                <div className="flex justify-between font-serif text-lg text-charcoal-dark mt-3 pt-3 border-t border-charcoal-light/10">
                  <span>Total</span>
                  <span>{formatCurrency(Math.round(total * 1.18))}</span>
                </div>
              </div>

              <button
                onClick={handleBookNow}
                className="btn-solid w-full justify-center"
              >
                Reserve Now
              </button>

              {blockedDates.length > 0 && (
                <p className="font-sans text-xs text-charcoal-light/50 text-center mt-4">
                  Some dates are unavailable. Please select different dates.
                </p>
              )}

              <p className="font-sans text-xs text-charcoal-light/40 text-center mt-3">
                Free cancellation up to 48 hours before check-in
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Breadcrumb back link */}
      <div className="section-padding pb-4">
        <Link href="/rooms" className="flex items-center gap-2 font-sans text-xs tracking-wider uppercase text-charcoal-light/50 hover:text-gold transition-colors">
          <ChevronLeft className="w-3 h-3" /> Back to All Rooms
        </Link>
      </div>
    </article>
  );
}
