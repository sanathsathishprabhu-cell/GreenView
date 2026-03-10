export const dynamic = 'force-dynamic';
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import FeaturedRooms from "@/components/home/FeaturedRooms";
import AboutSection from "@/components/home/AboutSection";
import ExperiencesSection from "@/components/home/ExperiencesSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import CtaBanner from "@/components/home/CtaBanner";

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <FeaturedRooms />
      <AboutSection />
      <ExperiencesSection />
      <TestimonialsSection />
      <CtaBanner />
      <Footer />
    </main>
  );
}
