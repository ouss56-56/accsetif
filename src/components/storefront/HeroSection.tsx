import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import product1 from "@/assets/products/product-1.jpeg";
import product2 from "@/assets/products/product-2.jpeg";
import product3 from "@/assets/products/product-3.jpeg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-secondary/30" />

      {/* Decorative circles */}
      <div className="absolute top-20 right-10 w-72 h-72 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute bottom-20 left-10 w-96 h-96 rounded-full bg-primary/3 blur-3xl" />

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span className="text-primary font-medium tracking-[0.3em] uppercase text-sm">
                Timeless Elegance
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold leading-[0.9] tracking-tight"
            >
              <span className="block text-foreground">Redefine</span>
              <span className="block text-gradient-gold mt-2">Your Style</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-muted-foreground text-lg md:text-xl max-w-lg leading-relaxed"
            >
              Discover our curated collection of luxury watches, necklaces, and accessories.
              Each piece tells a story of craftsmanship and elegance.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-wrap gap-4"
            >
              <Link to="/products">
                <Button
                  size="lg"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8 gap-2 group text-base"
                >
                  Explore Collection
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-full px-8 border-primary/30 text-foreground hover:bg-primary/10 text-base"
                >
                  Contact Us
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Right: Image collage */}
          <div className="relative hidden lg:block h-[600px]">
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
              animate={{ opacity: 1, scale: 1, rotate: -3 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="absolute top-0 right-0 w-72 h-80 rounded-2xl overflow-hidden shadow-2xl shadow-primary/10 border border-border"
            >
              <img src={product1} alt="Luxury Watch" className="w-full h-full object-cover" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
              animate={{ opacity: 1, scale: 1, rotate: 3 }}
              transition={{ duration: 1, delay: 0.7 }}
              className="absolute top-32 left-8 w-64 h-72 rounded-2xl overflow-hidden shadow-2xl shadow-primary/10 border border-border"
            >
              <img src={product2} alt="Elegant Necklace" className="w-full h-full object-cover" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.9 }}
              className="absolute bottom-0 right-16 w-56 h-64 rounded-2xl overflow-hidden shadow-2xl shadow-primary/10 border border-border"
            >
              <img src={product3} alt="Premium Accessory" className="w-full h-full object-cover" />
            </motion.div>

            {/* Floating badge */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-16 left-0 bg-card/80 backdrop-blur-sm border border-border rounded-xl px-4 py-3 shadow-lg"
            >
              <p className="text-primary font-serif font-semibold text-lg">New Arrivals</p>
              <p className="text-muted-foreground text-xs">Spring 2026 Collection</p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
