import type { Metadata } from "next";
import { Suspense } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import RoomsContent from "@/components/rooms/RoomsContent";

export const metadata: Metadata = {
  title: "Rooms & Suites — GreenView",
  description:
    "Explore our curated collection of rooms, suites and villas. Each space thoughtfully designed for the discerning traveller.",
};

export default function RoomsPage() {
  return (
    <main>
      <Navbar />
      {/* Page Header */}
      <div className="relative h-[50vh] min-h-[380px] flex items-end section-padding pb-16 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1920&q=85"
          alt="Rooms header"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-dark/80 via-charcoal-dark/30 to-transparent" />
        <div className="relative z-10">
          <p className="eyebrow text-gold/80 mb-3">Our Sanctuaries</p>
          <h1 className="font-serif text-5xl md:text-6xl font-light text-white">
            Rooms & Suites
          </h1>
        </div>
      </div>
      <Suspense fallback={
        <div className="section-padding py-20">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="skeleton h-96" />
            ))}
          </div>
        </div>
      }>
        <RoomsContent />
      </Suspense>
      <Footer />
    </main>
  );
}
