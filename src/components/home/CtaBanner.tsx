import Link from "next/link";

export default function CtaBanner() {
  return (
    <section className="relative overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="https://images.unsplash.com/photo-1540541338287-41700207dee6?w=1920&q=85"
        alt="Reserve your stay"
        className="w-full h-[50vh] min-h-[400px] object-cover"
      />
      <div className="absolute inset-0 bg-charcoal-dark/60 flex items-center justify-center">
        <div className="text-center px-6">
          <p className="eyebrow text-gold/80 mb-4">Begin Your Journey</p>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-white mb-8">
            Reserve Your Sanctuary
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/rooms" className="btn-white">
              Explore Rooms
            </Link>
            <Link href="/#contact" className="btn-gold">
              Speak to Us
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
