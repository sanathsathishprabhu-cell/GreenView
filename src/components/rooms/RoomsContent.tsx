"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Room, RoomCategory } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { ArrowRight, SlidersHorizontal, Users, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";

const FALLBACK_ROOMS: Room[] = [
  {
    id: "1", name: "Forest Deluxe Room", category: "Deluxe", price: 18000,
    shortDescription: "An intimate retreat enveloped in ancient forest.", description: "Full description",
    capacity: 2, size: 45, beds: "1 King", amenities: ["Wi-Fi", "Mini Bar", "Balcony", "Forest View"],
    images: ["https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&q=80"],
    available: true, featured: true, view: "Forest",
  },
  {
    id: "2", name: "Mountain Suite", category: "Suite", price: 38000,
    shortDescription: "Panoramic views of snow-capped peaks.", description: "Full description",
    capacity: 2, size: 90, beds: "1 King", amenities: ["Plunge Pool", "Fireplace", "Butler", "Panoramic View"],
    images: ["https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80"],
    available: true, featured: true, view: "Mountain",
  },
  {
    id: "3", name: "Lakeside Villa", category: "Villa", price: 75000,
    shortDescription: "Private villa at the water's edge.", description: "Full description",
    capacity: 4, size: 180, beds: "2 Beds", amenities: ["Private Pool", "Butler", "Lake Access", "Kitchen"],
    images: ["https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80"],
    available: true, featured: false, view: "Lake",
  },
  {
    id: "4", name: "Penthouse Retreat", category: "Penthouse", price: 120000,
    shortDescription: "The pinnacle of luxury high above the valley.", description: "Full description",
    capacity: 4, size: 280, beds: "2 Kings", amenities: ["Rooftop Pool", "Private Chef", "360° View", "Jacuzzi"],
    images: ["https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80"],
    available: true, featured: false, view: "Valley",
  },
  {
    id: "5", name: "Garden Deluxe", category: "Deluxe", price: 15000,
    shortDescription: "Peaceful garden views with private terrace.", description: "Full description",
    capacity: 2, size: 40, beds: "1 Queen", amenities: ["Garden View", "Terrace", "Wi-Fi", "Mini Bar"],
    images: ["https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&q=80"],
    available: true, featured: false, view: "Garden",
  },
  {
    id: "6", name: "Forest Suite", category: "Suite", price: 45000,
    shortDescription: "Expansive suite with private forest plunge pool.", description: "Full description",
    capacity: 2, size: 110, beds: "1 King", amenities: ["Plunge Pool", "Outdoor Bath", "Forest View", "Butler"],
    images: ["https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80"],
    available: true, featured: false, view: "Forest",
  },
];

const CATEGORIES: (RoomCategory | "All")[] = ["All", "Deluxe", "Suite", "Villa", "Penthouse"];

export default function RoomsContent() {
  const searchParams = useSearchParams();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<RoomCategory | "All">(
    (searchParams.get("category") as RoomCategory) || "All"
  );
  const [sortBy, setSortBy] = useState<"price-asc" | "price-desc" | "default">("default");

  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      try {
        let q = query(collection(db, "rooms"), where("available", "==", true));
        if (activeCategory !== "All") {
          q = query(q, where("category", "==", activeCategory));
        }
        const snap = await getDocs(q);
        if (snap.empty) {
          setRooms(FALLBACK_ROOMS.filter(r => activeCategory === "All" || r.category === activeCategory));
        } else {
          setRooms(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Room)));
        }
      } catch {
        setRooms(FALLBACK_ROOMS.filter(r => activeCategory === "All" || r.category === activeCategory));
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, [activeCategory]);

  const sorted = [...rooms].sort((a, b) => {
    if (sortBy === "price-asc") return a.price - b.price;
    if (sortBy === "price-desc") return b.price - a.price;
    return 0;
  });

  return (
    <section className="section-padding py-16 lg:py-24 bg-cream min-h-screen">
      {/* Filters */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12">
        {/* Category filters */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-5 py-2 font-sans text-xs tracking-widest uppercase border transition-all duration-200",
                activeCategory === cat
                  ? "bg-charcoal-dark text-cream border-charcoal-dark"
                  : "bg-transparent text-charcoal border-charcoal-light/30 hover:border-charcoal-dark"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className="flex items-center gap-3">
          <SlidersHorizontal className="w-4 h-4 text-charcoal-light/50" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="font-sans text-xs tracking-wider uppercase bg-transparent border-b border-charcoal-light/30 focus:border-gold focus:outline-none py-1 pr-6 text-charcoal cursor-pointer"
          >
            <option value="default">Sort: Default</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-4">
              <div className="skeleton aspect-[4/3]" />
              <div className="skeleton h-4 w-1/3" />
              <div className="skeleton h-6 w-2/3" />
              <div className="skeleton h-4 w-full" />
            </div>
          ))}
        </div>
      ) : sorted.length === 0 ? (
        <div className="text-center py-20">
          <p className="font-serif text-2xl text-charcoal-light">No rooms available</p>
          <p className="body-base mt-2">Try a different category</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {sorted.map((room) => (
            <Link key={room.id} href={`/rooms/${room.id}`} className="room-card group">
              {/* Image */}
              <div className="room-card-image">
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
              <div className="pt-5">
                <h3 className="heading-sm mb-1.5 group-hover:text-gold transition-colors duration-300">
                  {room.name}
                </h3>
                {/* Quick specs */}
                <div className="flex items-center gap-4 mb-3">
                  <span className="flex items-center gap-1.5 font-sans text-xs text-charcoal-light/60">
                    <Users className="w-3.5 h-3.5" /> {room.capacity} guests
                  </span>
                  <span className="flex items-center gap-1.5 font-sans text-xs text-charcoal-light/60">
                    <Maximize2 className="w-3.5 h-3.5" /> {room.size} m²
                  </span>
                </div>
                <p className="body-base text-sm line-clamp-2 mb-4">
                  {room.shortDescription}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-charcoal-light/10">
                  <div>
                    <span className="font-sans text-xs text-charcoal-light/50 tracking-wider">From</span>
                    <p className="font-serif text-lg text-charcoal-dark">
                      {formatCurrency(room.price)}
                      <span className="font-sans text-xs text-charcoal-light/50 font-normal ml-1">/ night</span>
                    </p>
                  </div>
                  <span className="flex items-center gap-1 font-sans text-xs tracking-widest uppercase text-gold group-hover:gap-2 transition-all duration-300">
                    View <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
