const testimonials = [
  {
    quote:
      "GreenView is unlike any place I have ever stayed. The silence was the first gift. Then came the service — so intuitive, so present, so perfectly timed.",
    author: "Priya Kapoor",
    location: "Mumbai",
    stay: "Forest Suite, February 2025",
  },
  {
    quote:
      "Every detail felt considered. The food, the spaces, the views — it all felt like someone had designed the perfect dream and then built it.",
    author: "James Whitfield",
    location: "London",
    stay: "Lakeside Villa, January 2025",
  },
  {
    quote:
      "I came looking for rest and found something more — a reconnection with what matters. I've already planned my return.",
    author: "Aiko Tanaka",
    location: "Tokyo",
    stay: "Mountain Penthouse, March 2025",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="section-padding py-24 bg-forest text-cream">
      <div className="text-center mb-16">
        <p className="eyebrow text-gold/80 mb-4">Guest Stories</p>
        <h2 className="font-serif text-4xl md:text-5xl font-light text-cream mb-6">
          The GreenView Experience
        </h2>
        <div className="w-12 h-px bg-gold mx-auto" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
        {testimonials.map((t) => (
          <div
            key={t.author}
            className="flex flex-col border border-cream/10 p-8 hover:border-gold/30 transition-colors duration-300"
          >
            <p className="font-serif text-xl italic text-cream/80 leading-relaxed mb-8 flex-1">
              &ldquo;{t.quote}&rdquo;
            </p>
            <div className="border-t border-cream/10 pt-6">
              <p className="font-sans text-sm font-medium text-cream">{t.author}</p>
              <p className="font-sans text-xs text-cream/40 tracking-wider mt-1">
                {t.location} · {t.stay}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
