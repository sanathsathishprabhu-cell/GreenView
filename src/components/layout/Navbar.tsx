"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Menu, X, User, ChevronDown, LogOut, BookOpen, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Rooms", href: "/rooms" },
  { label: "Experiences", href: "/experiences" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, userData, isAdmin, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          scrolled
            ? "bg-cream/95 backdrop-blur-md border-b border-charcoal-light/10 py-4"
            : "bg-transparent py-6"
        )}
      >
        <div className="section-padding flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className={cn(
              "font-serif text-xl font-light tracking-[0.15em] uppercase transition-colors duration-300",
              scrolled ? "text-charcoal-dark" : "text-white"
            )}
          >
            Green<span className="text-gold">View</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "nav-link transition-colors duration-300",
                  scrolled ? "text-charcoal" : "text-white/90"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="hidden lg:flex items-center gap-6">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className={cn(
                    "flex items-center gap-2 font-sans text-xs tracking-widest uppercase transition-colors duration-300",
                    scrolled ? "text-charcoal" : "text-white/90"
                  )}
                >
                  <User className="w-4 h-4" />
                  <span className="max-w-[100px] truncate">{userData?.name || "Account"}</span>
                  <ChevronDown className="w-3 h-3" />
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-3 w-52 bg-cream border border-charcoal-light/10 shadow-lg py-2 z-50">
                    <Link
                      href="/my-bookings"
                      className="flex items-center gap-2 px-4 py-2.5 font-sans text-xs tracking-wider uppercase text-charcoal hover:bg-charcoal-light/5 transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <BookOpen className="w-4 h-4" /> My Bookings
                    </Link>
                    {isAdmin && (
                      <Link
                        href="/admin"
                        className="flex items-center gap-2 px-4 py-2.5 font-sans text-xs tracking-wider uppercase text-charcoal hover:bg-charcoal-light/5 transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <LayoutDashboard className="w-4 h-4" /> Admin
                      </Link>
                    )}
                    <hr className="my-1 border-charcoal-light/10" />
                    <button
                      onClick={() => { signOut(); setUserMenuOpen(false); }}
                      className="flex items-center gap-2 w-full px-4 py-2.5 font-sans text-xs tracking-wider uppercase text-charcoal hover:bg-charcoal-light/5 transition-colors"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/auth/signin"
                className={cn(
                  "nav-link transition-colors duration-300",
                  scrolled ? "text-charcoal" : "text-white/90"
                )}
              >
                Sign In
              </Link>
            )}
            <Link
              href="/rooms"
              className={cn(
                "px-6 py-2.5 border text-xs font-sans font-medium tracking-widest uppercase transition-all duration-300",
                scrolled
                  ? "border-charcoal-dark text-charcoal-dark hover:bg-charcoal-dark hover:text-cream"
                  : "border-white text-white hover:bg-white hover:text-charcoal-dark"
              )}
            >
              Reserve
            </Link>
          </div>

          {/* Hamburger */}
          <button
            className={cn(
              "lg:hidden transition-colors duration-300",
              scrolled ? "text-charcoal-dark" : "text-white"
            )}
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div
        className={cn(
          "fixed inset-0 z-[100] lg:hidden transition-opacity duration-300",
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      >
        <div
          className="absolute inset-0 bg-charcoal-dark/60"
          onClick={() => setMobileOpen(false)}
        />
        <div
          className={cn(
            "absolute top-0 right-0 h-full w-80 bg-cream flex flex-col transition-transform duration-400",
            mobileOpen ? "translate-x-0" : "translate-x-full"
          )}
        >
          <div className="flex items-center justify-between px-8 py-6 border-b border-charcoal-light/10">
            <span className="font-serif text-lg font-light tracking-[0.15em] uppercase text-charcoal-dark">
              Green<span className="text-gold">View</span>
            </span>
            <button onClick={() => setMobileOpen(false)}>
              <X className="w-5 h-5 text-charcoal" />
            </button>
          </div>
          <nav className="flex flex-col py-8 gap-1 flex-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-8 py-3.5 font-sans text-sm tracking-widest uppercase text-charcoal hover:text-gold hover:bg-charcoal-light/5 transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {user ? (
              <>
                <Link
                  href="/my-bookings"
                  className="px-8 py-3.5 font-sans text-sm tracking-widest uppercase text-charcoal hover:text-gold hover:bg-charcoal-light/5 transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  My Bookings
                </Link>
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="px-8 py-3.5 font-sans text-sm tracking-widest uppercase text-charcoal hover:text-gold hover:bg-charcoal-light/5 transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    Admin
                  </Link>
                )}
                <button
                  onClick={() => { signOut(); setMobileOpen(false); }}
                  className="px-8 py-3.5 font-sans text-sm tracking-widest uppercase text-charcoal hover:text-gold hover:bg-charcoal-light/5 transition-colors text-left"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                href="/auth/signin"
                className="px-8 py-3.5 font-sans text-sm tracking-widest uppercase text-charcoal hover:text-gold hover:bg-charcoal-light/5 transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                Sign In
              </Link>
            )}
          </nav>
          <div className="px-8 py-8 border-t border-charcoal-light/10">
            <Link
              href="/rooms"
              className="btn-solid w-full justify-center"
              onClick={() => setMobileOpen(false)}
            >
              Reserve a Room
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
