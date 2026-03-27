import Navbar from "@/components/storefront/Navbar";
import HeroSection from "@/components/storefront/HeroSection";
import FeaturedProducts from "@/components/storefront/FeaturedProducts";
import TestimonialsSection from "@/components/storefront/TestimonialsSection";
import AboutSection from "@/components/storefront/AboutSection";
import NewsletterSection from "@/components/storefront/NewsletterSection";
import Footer from "@/components/storefront/Footer";
import WhatsAppButton from "@/components/storefront/WhatsAppButton";
import PromoBanner from "@/components/storefront/PromoBanner";
import TrustBadges from "@/components/storefront/TrustBadges";
import { motion } from "framer-motion";

const Index = () => {
  return (
    <div className="min-h-screen">
      <PromoBanner />
      <Navbar />
      <main>
        <HeroSection />
        <AboutSection />
        <FeaturedProducts />
        <TestimonialsSection />
        <NewsletterSection />
        <TrustBadges />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Index;
