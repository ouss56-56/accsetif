import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, ShoppingBag } from "lucide-react";
import Navbar from "@/components/storefront/Navbar";
import Footer from "@/components/storefront/Footer";
import WhatsAppButton from "@/components/storefront/WhatsAppButton";
import ProductCard from "@/components/storefront/ProductCard";
import { useWishlist } from "@/context/WishlistContext";
import { Button } from "@/components/ui/button";

const Wishlist = () => {
  const { items, clearWishlist } = useWishlist();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-28 pb-24">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-foreground">
              Your <span className="text-gradient-gold">Wishlist</span>
            </h1>
            <p className="text-muted-foreground mt-4 text-lg">
              {items.length > 0
                ? `You have ${items.length} ${items.length === 1 ? "item" : "items"} saved`
                : "Save items you love for later"}
            </p>
          </motion.div>

          {items.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col items-center justify-center py-20 gap-6"
            >
              <div className="w-24 h-24 rounded-full bg-primary/5 flex items-center justify-center">
                <Heart className="h-12 w-12 text-primary/30" />
              </div>
              <div className="text-center space-y-2">
                <p className="text-muted-foreground text-lg">Your wishlist is empty</p>
                <p className="text-muted-foreground/60 text-sm">
                  Browse our collection and tap the heart icon to save items you love
                </p>
              </div>
              <Link to="/products">
                <Button className="bg-primary text-primary-foreground rounded-full px-8 gap-2">
                  <ShoppingBag className="h-4 w-4" />
                  Start Shopping
                </Button>
              </Link>
            </motion.div>
          ) : (
            <>
              <div className="flex justify-end mb-6">
                <button
                  onClick={clearWishlist}
                  className="text-sm text-muted-foreground hover:text-destructive transition-colors"
                >
                  Clear all
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {items.map((product, i) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Wishlist;
