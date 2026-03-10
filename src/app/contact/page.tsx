export const dynamic = 'force-dynamic';
import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ContactContent from "@/components/contact/ContactContent";

export const metadata: Metadata = {
  title: "Contact — GreenView",
  description:
    "Reach out to GreenView for reservations, special requests, or simply to learn more. Our team responds within 4 hours.",
};

export default function ContactPage() {
  return (
    <main>
      <Navbar />
      <ContactContent />
      <Footer />
    </main>
  );
}
