"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { collection, query, where, limit, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Room } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

const FALLBACK_ROOMS = [
  {
    id: "1",
    name: "Forest Deluxe Room",
    category: "Deluxe",
    price: 18000,
    shortDescription: "An intimate retreat enveloped in ancient forest, with floor-to-ceiling windows framing an ever-changing tableau of woodland.",
    images: ["https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&q=80"],
  },
  {
    id: "2",
    name: "Mountain Suite",
    category: "Suite",
    price: 38000,
    shortDescription: "A sweeping suite commanding panoramic views of the snow-capped peaks, featuring a private plunge pool and fireplace.",
    images: ["https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80"],
  },
  {
    id: "3",
    name: "Lakeside Villa",
    category: "Villa",
    price: 75000,
    shortDescription: "A private villa at the water's edge with a personal butler, infinity pool, and direct access to the serene lake.",
    images: ["https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80"],
  },
];

export default function FeaturedRooms() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const q = query(
          collection(db, "rooms"),
          where("featured", "==", true),
          where("available", "==", true),
          limit(3)
        );
        const snap = await getDocs(q);
        if (snap.empty) {
          setRooms(FALLBACK_ROOMS as unknown as Room[]);
        } else {
          setRooms(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Room)));
        }
      } catch {
        setRooms(FALLBACK_ROOMS as unknown as Room[]);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <section className="section-padding section-gap bg-cream" id="rooms">
      <div className="text-center mb-16">
        <p className="eyebrow mb-4">Our Sanctuaries</p>
        <h2 className="heading-xl mb-6">Rooms & Suites</h2>
        <div className="divider-gold" />
        <p className="body-lg max-w-xl mx-auto mt-6">
          Each space is a carefully considered refuge — a place of beauty, calm,
          and absolute privacy.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-4">
                <div className="skeleton aspect-[4/3] w-full" />
                <div className="skeleton h-4 w-1/3" />
                <div className="skeleton h-8 w-2/3" />
                <div className="skeleton h-4 w-full" />
              </div>
            ))
          : rooms.map((room) => (
              <Link
                key={room.id}
                href={`/rooms/${room.id}`}
                className="room-card group flex flex-col"
              >
                {/* Image */}
                <div className="room-card-image rounded-none">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={room.images?.[0] || "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80"}
                    alt={room.name}
                  />
                  <div className="absolute top-4 left-4 bg-cream/95 px-3 py-1">
                    <span className="font-sans text-[10px] tracking-[0.2em] uppercase text-gold">
                      {room.category}
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="pt-6 flex-1 flex flex-col">
                  <h3 className="heading-sm mb-2 group-hover:text-gold transition-colors duration-300">
                    {room.name}
                  </h3>
                  <p className="body-base text-sm flex-1 line-clamp-2 mb-4">
                    {room.shortDescription}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-charcoal-light/10">
                    <div>
                      <span className="font-sans text-xs text-charcoal-light/60 tracking-wider">
                        From
                      </span>
                      <p className="font-serif text-lg text-charcoal-dark">
                        {formatCurrency(room.price)}
                        <span className="font-sans text-xs text-charcoal-light/60 font-normal ml-1">
                          / night
                        </span>
                      </p>
                    </div>
                    <span className="flex items-center gap-1 font-sans text-xs tracking-widest uppercase text-gold group-hover:gap-2 transition-all duration-300">
                      Discover <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
      </div>

      <div className="text-center mt-16">
        <Link href="/rooms" className="btn-primary">
          View All Rooms
        </Link>
      </div>
    </section>
  );
}
