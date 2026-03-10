"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { LayoutDashboard, BedDouble, BookOpen, CreditCard, LogOut, Menu, X, Home } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin", label: "Dashboard", Icon: LayoutDashboard, exact: true },
  { href: "/admin/rooms", label: "Rooms", Icon: BedDouble },
  { href: "/admin/bookings", label: "Bookings", Icon: BookOpen },
  { href: "/admin/payments", label: "Payments", Icon: CreditCard },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { user, isAdmin, signOut, loading } = useAuth();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      router.push("/");
    }
  }, [user, isAdmin, loading, router]);

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-cream/5 mb-4">
        <Link href="/" className="font-serif text-xl font-light tracking-[0.15em] uppercase text-cream">
          Green<span className="text-gold">View</span>
        </Link>
        <p className="font-sans text-xs text-cream/30 tracking-wider mt-1">Admin Panel</p>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {navItems.map(({ href, label, Icon, exact }) => (
          <Link
            key={href}
            href={href}
            onClick={() => setMobileOpen(false)}
            className={cn(
              "flex items-center gap-3 px-4 py-3 font-sans text-xs tracking-widest uppercase transition-colors duration-200",
              isActive(href, exact)
                ? "text-gold bg-cream/5 border-l-2 border-gold"
                : "text-cream/50 hover:text-cream hover:bg-cream/5 border-l-2 border-transparent"
            )}
          >
            <Icon className="w-4 h-4" />
            {label}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-cream/5 space-y-2">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 font-sans text-xs tracking-widest uppercase text-cream/40 hover:text-cream/70 transition-colors"
        >
          <Home className="w-4 h-4" /> Back to Site
        </Link>
        <button
          onClick={() => signOut()}
          className="flex items-center gap-3 w-full px-4 py-3 font-sans text-xs tracking-widest uppercase text-cream/40 hover:text-cream/70 transition-colors"
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex fixed top-0 left-0 h-full w-64 bg-charcoal-dark flex-col border-r border-cream/5 z-40">
        <SidebarContent />
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-charcoal-dark border-b border-cream/5 flex items-center justify-between px-6 py-4">
        <span className="font-serif text-lg font-light tracking-[0.15em] uppercase text-cream">
          Green<span className="text-gold">View</span>
          <span className="font-sans text-xs text-cream/30 ml-2 tracking-wider">Admin</span>
        </span>
        <button onClick={() => setMobileOpen(true)}>
          <Menu className="w-5 h-5 text-cream/70" />
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-[200]">
          <div className="absolute inset-0 bg-charcoal-dark/60" onClick={() => setMobileOpen(false)} />
          <div className="absolute top-0 left-0 h-full w-72 bg-charcoal-dark">
            <div className="flex justify-end p-4">
              <button onClick={() => setMobileOpen(false)}><X className="w-5 h-5 text-cream/50" /></button>
            </div>
            <SidebarContent />
          </div>
        </div>
      )}
    </>
  );
}
