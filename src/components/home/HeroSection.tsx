"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown, CalendarDays, Users } from "lucide-react";
import { format, addDays } from "date-fns";
import { useRouter } from "next/navigation";

const slides = [
  {
    image:
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1920&q=85",
    label: "Forest Retreat",
    title: "Surrender to Silence",
  },
  {
    image:
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1920&q=85",
    label: "Mountain Sanctuary",
    title: "Above the Clouds",
  },
  {
    image:
      "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=1920&q=85",
    label: "Lakeside Villa",
    title: "Stillness & Splendour",
  },
];

export default function HeroSection() {
  const router = useRouter();
  const today = new Date();
  const [checkIn, setCheckIn] = useState(format(today, "yyyy-MM-dd"));
  const [checkOut, setCheckOut] = useState(
    format(addDays(today, 2), "yyyy-MM-dd")
  );
  const [guests, setGuests] = useState(2);
  const [activeSlide, setActiveSlide] = useState(0);

  const handleSearch = () => {
    const params = new URLSearchParams({
      checkIn,
      checkOut,
      guests: guests.toString(),
    });
    router.push(`/rooms?${params.toString()}`);
  };

  return (
    <section className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
      {/* Background Images */}
      {slides.map((slide, i) => (
        <div
          key={i}
          className="absolute inset-0 transition-opacity duration-1000"
          style={{ opacity: activeSlide === i ? 1 : 0 }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={slide.image}
            alt={slide.label}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-charcoal-dark/60 via-charcoal-dark/30 to-charcoal-dark/70" />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        <p className="eyebrow text-gold/80 mb-6 tracking-[0.35em]">
          {slides[activeSlide].label}
        </p>
        <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-light text-white tracking-tight mb-8 text-balance">
          {slides[activeSlide].title}
        </h1>
        <p className="font-sans text-lg text-white/70 font-light max-w-xl mx-auto mb-12 tracking-wide">
          A retreat where extraordinary luxury meets the timeless beauty of the
          natural world.
        </p>

        {/* Search Bar */}
        <div className="bg-cream/10 backdrop-blur-md border border-white/20 p-1 flex flex-col md:flex-row items-stretch gap-px max-w-3xl mx-auto">
          {/* Check-in */}
          <div className="flex-1 flex items-center gap-3 bg-cream/95 px-5 py-4">
            <CalendarDays className="w-4 h-4 text-gold shrink-0" />
            <div className="flex-1">
              <label className="block font-sans text-[10px] tracking-[0.2em] uppercase text-charcoal-light/60 mb-0.5">
                Check In
              </label>
              <input
                type="date"
                id="hero-checkin"
                value={checkIn}
                min={format(today, "yyyy-MM-dd")}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full bg-transparent font-sans text-sm text-charcoal font-medium focus:outline-none"
              />
            </div>
          </div>

          {/* Check-out */}
          <div className="flex-1 flex items-center gap-3 bg-cream/95 px-5 py-4">
            <CalendarDays className="w-4 h-4 text-gold shrink-0" />
            <div className="flex-1">
              <label className="block font-sans text-[10px] tracking-[0.2em] uppercase text-charcoal-light/60 mb-0.5">
                Check Out
              </label>
              <input
                type="date"
                id="hero-checkout"
                value={checkOut}
                min={checkIn || format(addDays(today, 1), "yyyy-MM-dd")}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full bg-transparent font-sans text-sm text-charcoal font-medium focus:outline-none"
              />
            </div>
          </div>

          {/* Guests */}
          <div className="flex items-center gap-3 bg-cream/95 px-5 py-4">
            <Users className="w-4 h-4 text-gold shrink-0" />
            <div>
              <label className="block font-sans text-[10px] tracking-[0.2em] uppercase text-charcoal-light/60 mb-0.5">
                Guests
              </label>
              <select
                id="hero-guests"
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                className="bg-transparent font-sans text-sm text-charcoal font-medium focus:outline-none cursor-pointer pr-4"
              >
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <option key={n} value={n}>
                    {n} {n === 1 ? "Guest" : "Guests"}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={handleSearch}
            className="bg-gold hover:bg-gold-dark transition-colors duration-300 px-8 py-4 font-sans text-xs font-medium tracking-[0.2em] uppercase text-white whitespace-nowrap"
          >
            Search
          </button>
        </div>

        {/* Slide indicators */}
        <div className="flex items-center justify-center gap-3 mt-10">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveSlide(i)}
              className={`transition-all duration-300 rounded-full ${
                activeSlide === i
                  ? "w-8 h-1.5 bg-gold"
                  : "w-1.5 h-1.5 bg-white/40 hover:bg-white/70"
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
        <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-white/50">
          Discover
        </span>
        <ChevronDown className="w-4 h-4 text-white/50 animate-bounce" />
      </div>
    </section>
  );
}
