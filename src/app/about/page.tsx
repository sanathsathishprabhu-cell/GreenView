export const dynamic = 'force-dynamic';
import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "About — GreenView",
  description:
    "The story behind GreenView Luxury Hotels — our philosophy, our people, and our commitment to quiet luxury in harmony with nature.",
};

const values = [
  {
    title: "Silence as Luxury",
    description:
      "In a world of noise, we offer the rarest thing: true quiet. Every design decision, from our architecture to our service model, is made in service of providing deep, genuine stillness.",
  },
  {
    title: "Nature First",
    description:
      "We did not impose ourselves on this landscape. We listened to it. Our structures follow the natural contours of the land, and every material is chosen with ecological consequence in mind.",
  },
  {
    title: "Invisible Excellence",
    description:
      "Service should be felt, not seen. Our team anticipates without intruding. The art of true hospitality is making a guest feel completely at ease — as if everything is simply happening for them.",
  },
  {
    title: "Local Rootedness",
    description:
      "Our food, our craft, our people — all come from within 50 kilometres of this valley. We believe that luxury is inseparable from authenticity, and authenticity demands deep local connection.",
  },
];

const team = [
  {
    name: "Arjun Mehta",
    role: "Founder & General Manager",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
    bio: "A decade spent at Aman resorts and Six Senses before returning to the Himalayas to build something of his own.",
  },
  {
    name: "Priya Krishnaswamy",
    role: "Head of Culinary",
    image:
      "https://images.unsplash.com/photo-1494790108755-2616b612b27c?w=400&q=80",
    bio: "Trained in Lyon, rooted in Kerala. Priya writes menus the way a poet writes — from memory, from instinct, from the season.",
  },
  {
    name: "Vikram Thapa",
    role: "Head of Experiences",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80",
    bio: "Born in Mussoorie, Vikram has guided thousands of guests into the forest. He says every walk reveals something new.",
  },
  {
    name: "Devika Rao",
    role: "Spa Director",
    image:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80",
    bio: "A trained Ayurvedic practitioner with 15 years of experience, Devika has brought together an extraordinary team of healers.",
  },
];

export default function AboutPage() {
  return (
    <main>
      <Navbar />

      {/* Hero */}
      <div className="relative h-[60vh] min-h-[480px] flex items-end overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=85"
          alt="About GreenView"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-dark/80 via-charcoal-dark/30 to-transparent" />
        <div className="relative z-10 section-padding pb-16">
          <p className="eyebrow text-gold/80 mb-3">Our Story</p>
          <h1 className="font-serif text-5xl md:text-6xl font-light text-white max-w-xl">
            Where Silence Becomes a Luxury
          </h1>
        </div>
      </div>

      {/* Origin story */}
      <section className="section-padding py-24 bg-cream">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 max-w-6xl mx-auto">
          <div>
            <p className="eyebrow mb-4">The Beginning</p>
            <h2 className="heading-lg mb-6">A Belief Became a Place</h2>
            <div className="w-12 h-px bg-gold mb-8" />
            <p className="body-lg leading-loose mb-6">
              GreenView was born from a simple belief: that true luxury is found
              not in excess, but in the profound beauty of a single perfect
              moment. In 2019, founder Arjun Mehta stood on this ridge in
              Uttarakhand and heard nothing but wind. He bought the land the
              following week.
            </p>
            <p className="body-lg leading-loose mb-8">
              It took four years to build. Every structure was designed in
              dialogue with the landscape — to follow the natural contours of
              the hillside, to preserve the trees, to invite the light and
              protect against the wind. We refused to rush. The result is a
              property that feels as though it has always been here.
            </p>
            <Link href="/rooms" className="btn-primary gap-2">
              Discover Our Rooms <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Stats */}
          <div className="flex flex-col justify-center">
            <div className="grid grid-cols-2 gap-8">
              {[
                { number: "2023", label: "Year Opened" },
                { number: "24", label: "Private Rooms" },
                { number: "8", label: "Acres of Forest" },
                { number: "50km", label: "Local Sourcing Radius" },
                { number: "100%", label: "Renewable Energy" },
                { number: "∞", label: "Moments of Calm" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="border border-charcoal-light/10 p-6 hover:border-gold/30 transition-colors duration-300"
                >
                  <p className="font-serif text-3xl text-gold mb-1">
                    {stat.number}
                  </p>
                  <p className="font-sans text-xs tracking-wider uppercase text-charcoal-light/50">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy / Values */}
      <section className="bg-charcoal-dark section-padding py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="eyebrow text-gold/80 mb-4">What We Stand For</p>
            <h2 className="font-serif text-4xl md:text-5xl font-light text-cream">
              Our Philosophy
            </h2>
            <div className="w-12 h-px bg-gold mx-auto mt-6" />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((v) => (
              <div
                key={v.title}
                className="border border-cream/10 p-8 hover:border-gold/30 transition-colors duration-300"
              >
                <h3 className="font-serif text-lg text-cream mb-4">
                  {v.title}
                </h3>
                <p className="font-sans text-sm text-cream/50 leading-loose">
                  {v.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sustainability */}
      <section className="bg-cream">
        <div className="grid lg:grid-cols-2">
          <div className="relative overflow-hidden h-[50vw] max-h-[560px] lg:h-auto">
            <img
              src="https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=1200&q=85"
              alt="Sustainability"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex items-center section-padding py-20">
            <div className="max-w-lg">
              <p className="eyebrow mb-4">The Earth</p>
              <h2 className="heading-lg mb-6">Sustainability</h2>
              <div className="w-12 h-px bg-gold mb-8" />
              <p className="body-lg leading-loose mb-6">
                We operate on 100% renewable solar and hydroelectric energy. Our
                water is sourced from natural springs and recycled through
                constructed wetlands. We grow over 60% of our produce on-site
                and compost every gram of kitchen waste.
              </p>
              <p className="body-lg leading-loose mb-8">
                We are proud members of the Global Sustainable Tourism Council
                and work with the Uttarakhand Forest Department to restore
                indigenous species to the surrounding hills.
              </p>
              <ul className="space-y-3">
                {[
                  "100% renewable energy",
                  "Zero single-use plastic",
                  "On-site organic farm",
                  "Local employment: 90% of staff from within 30km",
                  "Carbon-neutral operations since 2024",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 bg-gold rounded-full shrink-0" />
                    <span className="font-sans text-sm text-charcoal-light">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section-padding py-24 bg-cream-100">
        <div className="text-center mb-16">
          <p className="eyebrow mb-4">The People</p>
          <h2 className="heading-xl mb-6">Our Team</h2>
          <div className="divider-gold" />
          <p className="body-lg max-w-xl mx-auto mt-6">
            GreenView is its people. Each member of our team was chosen not for
            a role, but for a quality — a genuine love of hospitality and a
            profound connection to this place.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {team.map((member) => (
            <div key={member.name} className="group">
              <div className="aspect-square overflow-hidden mb-5">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                />
              </div>
              <h3 className="font-serif text-lg text-charcoal-dark mb-0.5">
                {member.name}
              </h3>
              <p className="font-sans text-xs tracking-widest uppercase text-gold mb-3">
                {member.role}
              </p>
              <p className="font-sans text-sm text-charcoal-light leading-loose">
                {member.bio}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Awards strip */}
      <section className="bg-charcoal-dark section-padding py-14 border-t border-cream/5">
        <div className="flex flex-wrap items-center justify-center gap-12 text-center">
          {[
            { award: "Best New Hotel", org: "Condé Nast Traveller India, 2024" },
            { award: "Sustainability Leader", org: "GSTC Certified, 2024" },
            { award: "Top Luxury Resort", org: "Travel + Leisure India, 2024" },
            { award: "Hidden Gem Award", org: "Vogue India, 2024" },
          ].map((a) => (
            <div key={a.award}>
              <p className="font-serif text-base text-gold mb-1">{a.award}</p>
              <p className="font-sans text-xs text-cream/30 tracking-wider">
                {a.org}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding py-24 bg-cream text-center">
        <p className="eyebrow mb-4">The Next Chapter</p>
        <h2 className="heading-xl mb-8">Come and Be Part of It</h2>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/rooms" className="btn-primary">
            Explore Rooms
          </Link>
          <Link href="/contact" className="btn-gold">
            Get in Touch
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
