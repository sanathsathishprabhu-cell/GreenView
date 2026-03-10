const experiences = [
  {
    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&q=80",
    title: "Spa & Wellness",
    description: "Ancient rituals and modern therapies in a sanctuary of pure tranquility.",
  },
  {
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80",
    title: "Fine Dining",
    description: "A celebration of local, seasonal ingredients in an extraordinary setting.",
  },
  {
    image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=600&q=80",
    title: "Forest Trails",
    description: "Guided explorations through ancient woodland — silent, profound, unforgettable.",
  },
  {
    image: "https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=600&q=80",
    title: "Water Sports",
    description: "Kayaking, paddleboarding and swimming in the pristine mountain lake.",
  },
];

export default function ExperiencesSection() {
  return (
    <section id="experiences" className="section-padding section-gap bg-cream-100">
      <div className="text-center mb-16">
        <p className="eyebrow mb-4">Beyond the Room</p>
        <h2 className="heading-xl mb-6">Curated Experiences</h2>
        <div className="divider-gold" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {experiences.map((exp) => (
          <div key={exp.title} className="group relative overflow-hidden cursor-pointer">
            {/* Image */}
            <div className="aspect-[3/4] overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={exp.image}
                alt={exp.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal-dark/80 via-charcoal-dark/10 to-transparent flex flex-col justify-end p-6">
              <h3 className="font-serif text-xl text-white mb-2">{exp.title}</h3>
              <p className="font-sans text-sm text-white/70 leading-relaxed opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-400">
                {exp.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
