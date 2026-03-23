import Navbar from "@/components/storefront/Navbar";
import HeroSection from "@/components/storefront/HeroSection";
import CategorySection from "@/components/storefront/CategorySection";
import FeaturedProducts from "@/components/storefront/FeaturedProducts";
import AboutSection from "@/components/storefront/AboutSection";
import Footer from "@/components/storefront/Footer";
import WhatsAppButton from "@/components/storefront/WhatsAppButton";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <CategorySection />
      <FeaturedProducts />
      <AboutSection />
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Index;
