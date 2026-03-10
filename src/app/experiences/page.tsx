export const dynamic = 'force-dynamic';
import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Experiences — GreenView",
  description:
    "Curated experiences at GreenView — from ancient spa rituals and guided forest trails to private dining and water adventures on the lake.",
};

const experiences = [
  {
    category: "Wellness",
    title: "Spa & Wellness",
    tagline: "Ancient Rituals. Modern Sanctuary.",
    description:
      "Our spa draws from centuries-old Ayurvedic wisdom, reinterpreted through contemporary therapies and the finest botanical ingredients. Treatments are personalised to your constitution and crafted for deep restoration. Silence is the first therapy here.",
    image:
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=1200&q=85",
    highlights: [
      "Full-body Abhyanga with warm herbal oils",
      "Himalayan stone therapies",
      "Forest-facing meditation pools",
      "Personalised wellness consultations",
    ],
  },
  {
    category: "Dining",
    title: "Fine Dining",
    tagline: "A Celebration of the Local & the Seasonal.",
    description:
      "Our kitchen is built around proximity — to the earth, to the seasons, to the farmers and foragers whose relationship with this land predates us by generations. Menus change with the light and the harvest. Our chef will come to your table not to present, but to share.",
    image:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=85",
    highlights: [
      "Farm-to-plate tasting menus",
      "Cellar of rare Indian and international wines",
      "Private dining in your villa by request",
      "Sunrise forest breakfast experiences",
    ],
  },
  {
    category: "Nature",
    title: "Forest Trails",
    tagline: "Silent, Profound, Unforgettable.",
    description:
      "Our naturalists have walked these trails for years. They know where the mist lingers longest, where the deer shelter at dusk, which roots hold centuries of history. Join them for an experience that defies description — or walk alone, and let the forest find you.",
    image:
      "https://images.unsplash.com/photo-1551632811-561732d1e306?w=1200&q=85",
    highlights: [
      "Guided dawn forest walks",
      "Birdwatching with resident ornithologist",
      "Night sky observation with telescope",
      "Solo contemplative trail maps",
    ],
  },
  {
    category: "Adventure",
    title: "Water & Lake",
    tagline: "Stillness on the Water.",
    description:
      "The lake at GreenView is fed by snowmelt and ringed by ancient deodar. In summer it is warm enough to swim in silence. In morning light it mirrors the peaks perfectly. We offer kayaks, paddleboards, guided rowing, and private anchored platforms for sunrise meditation.",
    image:
      "https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=1200&q=85",
    highlights: [
      "Kayaking and paddleboarding",
      "Guided swimming in the natural lake",
      "Anchored sunrise meditation platforms",
      "Evening boat rides with sundowners",
    ],
  },
  {
    category: "Culture",
    title: "Art & Craft",
    tagline: "Making Something by Hand.",
    description:
      "We invite local artisans — weavers, potters, wood carvers — to share their practice with guests. These sessions are intimate, unhurried, and profoundly rooted in place. Learn to make something real, something you can take home and remember.",
    image:
      "https://images.unsplash.com/photo-1620218688895-c2b5c5a1c945?w=1200&q=85",
    highlights: [
      "Tibetan thangka painting sessions",
      "Natural wool weaving workshops",
      "Clay pottery with local masters",
      "Botanical journaling in the gardens",
    ],
  },
  {
    category: "Events",
    title: "Celebrations & Retreats",
    tagline: "Occasions Made Extraordinary.",
    description:
      "Whether celebrating an anniversary, gathering a family, or hosting a private corporate retreat, GreenView offers a setting of unmatched beauty and seamless, invisible service. We close the property entirely for exclusive use requests.",
    image:
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1200&q=85",
    highlights: [
      "Exclusive whole-property buyout",
      "Bespoke celebration dinners under the stars",
      "Corporate wellness retreats",
      "Intimate destination weddings",
    ],
  },
];

export default function ExperiencesPage() {
  return (
    <main>
      <Navbar />

      {/* Hero */}
      <div className="relative h-[55vh] min-h-[420px] flex items-end overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1920&q=85"
          alt="Experiences header"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-dark/85 via-charcoal-dark/30 to-transparent" />
        <div className="relative z-10 section-padding pb-16">
          <p className="eyebrow text-gold/80 mb-3">Beyond the Room</p>
          <h1 className="font-serif text-5xl md:text-6xl font-light text-white">
            Curated Experiences
          </h1>
        </div>
      </div>

      {/* Intro */}
      <section className="section-padding py-20 bg-cream text-center">
        <div className="max-w-2xl mx-auto">
          <p className="eyebrow mb-4">A Full Life</p>
          <h2 className="heading-xl mb-6">Every Day, a New Discovery</h2>
          <div className="divider-gold mb-6" />
          <p className="body-lg">
            At GreenView, the experience extends far beyond the four walls of
            your room. We have curated a life here — activities for those who
            seek, and deep stillness for those who need to rest.
          </p>
        </div>
      </section>

      {/* Experiences — alternating layout */}
      <section className="bg-cream">
        {experiences.map((exp, i) => (
          <div
            key={exp.title}
            className={`grid lg:grid-cols-2 ${
              i % 2 === 0 ? "" : "lg:grid-flow-dense"
            }`}
          >
            {/* Image */}
            <div
              className={`relative overflow-hidden h-[55vw] max-h-[600px] lg:h-auto ${
                i % 2 !== 0 ? "lg:col-start-2" : ""
              }`}
            >
              <img
                src={exp.image}
                alt={exp.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-6 left-6">
                <span className="bg-cream/95 px-3 py-1 font-sans text-[10px] tracking-[0.2em] uppercase text-gold">
                  {exp.category}
                </span>
              </div>
            </div>

            {/* Text */}
            <div
              className={`flex items-center section-padding py-16 lg:py-20 ${
                i % 2 === 0 ? "" : "lg:col-start-1 lg:row-start-1"
              } ${i % 2 === 1 ? "bg-cream-100" : ""}`}
            >
              <div className="max-w-lg">
                <h2 className="heading-lg mb-3">{exp.title}</h2>
                <p className="eyebrow mb-6">{exp.tagline}</p>
                <div className="w-12 h-px bg-gold mb-6" />
                <p className="body-lg leading-loose mb-8">{exp.description}</p>
                <ul className="space-y-3">
                  {exp.highlights.map((h) => (
                    <li key={h} className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 bg-gold rounded-full shrink-0" />
                      <span className="font-sans text-sm text-charcoal-light">
                        {h}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1540541338287-41700207dee6?w=1920&q=85"
          alt="Book your experience"
          className="w-full h-[40vh] min-h-[320px] object-cover"
        />
        <div className="absolute inset-0 bg-charcoal-dark/65 flex items-center justify-center">
          <div className="text-center px-6">
            <p className="eyebrow text-gold/80 mb-4">Begin the Journey</p>
            <h2 className="font-serif text-4xl md:text-5xl font-light text-white mb-8">
              Reserve a Room, Unlock a World
            </h2>
            <Link href="/rooms" className="btn-white gap-2">
              Explore Rooms <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
