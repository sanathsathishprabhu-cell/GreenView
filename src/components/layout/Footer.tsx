import Link from "next/link";
import { Instagram, Twitter, Facebook, Mail, Phone, MapPin } from "lucide-react";

const footerLinks = {
  explore: [
    { label: "All Rooms", href: "/rooms" },
    { label: "Suites", href: "/rooms?category=Suite" },
    { label: "Villas", href: "/rooms?category=Villa" },
    { label: "Experiences", href: "/#experiences" },
  ],
  info: [
    { label: "About Us", href: "/#about" },
    { label: "Sustainability", href: "/" },
    { label: "Press", href: "/" },
    { label: "Careers", href: "/" },
  ],
  services: [
    { label: "Restaurant", href: "/" },
    { label: "Spa & Wellness", href: "/" },
    { label: "Events", href: "/" },
    { label: "Concierge", href: "/" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-charcoal-dark text-cream/70">
      <div className="section-padding py-20 lg:py-28">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link
              href="/"
              className="font-serif text-2xl font-light tracking-[0.15em] uppercase text-cream mb-6 block"
            >
              Green<span className="text-gold">View</span>
            </Link>
            <p className="font-sans text-sm leading-loose text-cream/50 max-w-xs mb-8">
              A sanctuary of quiet luxury, where timeless design meets the
              extraordinary beauty of nature.
            </p>
            <div className="flex flex-col gap-3">
              <a
                href="tel:+911234567890"
                className="flex items-center gap-3 font-sans text-xs tracking-wider text-cream/50 hover:text-gold transition-colors"
              >
                <Phone className="w-4 h-4" />
                +91 12345 67890
              </a>
              <a
                href="mailto:reservations@greenview.com"
                className="flex items-center gap-3 font-sans text-xs tracking-wider text-cream/50 hover:text-gold transition-colors"
              >
                <Mail className="w-4 h-4" />
                reservations@greenview.com
              </a>
              <span className="flex items-center gap-3 font-sans text-xs tracking-wider text-cream/50">
                <MapPin className="w-4 h-4 shrink-0" />
                1 Greenview Drive, Uttarakhand, India
              </span>
            </div>
          </div>

          {/* Explore */}
          <div>
            <h4 className="font-sans text-xs font-medium tracking-[0.25em] uppercase text-gold mb-6">
              Explore
            </h4>
            <ul className="flex flex-col gap-3">
              {footerLinks.explore.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-sans text-sm text-cream/50 hover:text-cream transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="font-sans text-xs font-medium tracking-[0.25em] uppercase text-gold mb-6">
              Information
            </h4>
            <ul className="flex flex-col gap-3">
              {footerLinks.info.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-sans text-sm text-cream/50 hover:text-cream transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-sans text-xs font-medium tracking-[0.25em] uppercase text-gold mb-6">
              Services
            </h4>
            <ul className="flex flex-col gap-3">
              {footerLinks.services.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-sans text-sm text-cream/50 hover:text-cream transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-cream/5">
        <div className="section-padding py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-sans text-xs text-cream/30 tracking-wider">
            © {new Date().getFullYear()} GreenView Luxury Hotels. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {[
              { Icon: Instagram, href: "#" },
              { Icon: Twitter, href: "#" },
              { Icon: Facebook, href: "#" },
            ].map(({ Icon, href }, i) => (
              <a
                key={i}
                href={href}
                className="text-cream/30 hover:text-gold transition-colors"
                aria-label="Social"
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="font-sans text-xs text-cream/30 hover:text-cream/60 transition-colors"
            >
              Privacy Policy
            </Link>
            <span className="text-cream/20">·</span>
            <Link
              href="/"
              className="font-sans text-xs text-cream/30 hover:text-cream/60 transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
