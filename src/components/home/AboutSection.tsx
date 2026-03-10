export default function AboutSection() {
  return (
    <section id="about" className="bg-charcoal-dark overflow-hidden">
      <div className="grid lg:grid-cols-2">
        {/* Image side */}
        <div className="relative h-[60vw] max-h-[600px] lg:h-auto overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=85"
            alt="About GreenView"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-charcoal-dark/30" />
        </div>

        {/* Text side */}
        <div className="flex items-center section-padding py-20 lg:py-28">
          <div className="max-w-lg">
            <p className="eyebrow mb-6">Our Philosophy</p>
            <h2 className="heading-lg text-cream mb-8">
              Where Silence Becomes a Luxury
            </h2>
            <div className="w-12 h-px bg-gold mb-8" />
            <p className="font-sans text-base text-cream/60 leading-loose mb-6">
              GreenView was born from a simple belief — that true luxury is
              found not in excess, but in the profound beauty of a single perfect
              moment. We chose this valley for its extraordinary stillness. You
              can hear the trees. You can feel the air.
            </p>
            <p className="font-sans text-base text-cream/60 leading-loose mb-10">
              Our architecture responds to the landscape — every window is a
              considered frame. Every material is local, sustainable, alive. We
              invite you not to visit, but to arrive.
            </p>
            <div className="grid grid-cols-3 gap-8 mt-12 pt-12 border-t border-cream/10">
              {[
                { number: "24", label: "Private Rooms" },
                { number: "8", label: "Acres of Forest" },
                { number: "∞", label: "Moments of Calm" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="font-serif text-3xl text-gold mb-1">{stat.number}</p>
                  <p className="font-sans text-xs tracking-wider text-cream/40 uppercase">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
