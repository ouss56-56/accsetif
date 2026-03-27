import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, MessageCircle, ShieldCheck, Truck, RotateCcw, Plus, Minus, ShoppingBag, Heart } from "lucide-react";
import Navbar from "@/components/storefront/Navbar";
import Footer from "@/components/storefront/Footer";
import WhatsAppButton from "@/components/storefront/WhatsAppButton";
import ProductCard from "@/components/storefront/ProductCard";
import RecentlyViewed from "@/components/storefront/RecentlyViewed";
import { useProduct, useProducts } from "@/hooks/useProducts";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useRecentlyViewed } from "@/context/RecentlyViewedContext";

const WHATSAPP_NUMBER = "15551234567";

const tabData = [
  { key: "description", label: "Description" },
  { key: "shipping", label: "Shipping & Returns" },
  { key: "reviews", label: "Reviews" },
];

const ProductDetail = () => {
  const { id } = useParams();
  const { data: product, isLoading } = useProduct(id || "");
  const { data: products } = useProducts(product?.categories?.name);
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { addToRecentlyViewed } = useRecentlyViewed();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");

  // Track recently viewed
  useEffect(() => {
    if (id) addToRecentlyViewed(id);
  }, [id, addToRecentlyViewed]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-2 border-primary/20 border-t-primary animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center px-4">
          <h2 className="text-2xl font-serif text-foreground mb-4">Product not found</h2>
          <Link to="/products">
            <Button variant="outline" className="rounded-full">Back to Shop</Button>
          </Link>
        </div>
      </div>
    );
  }

  const inWishlist = isInWishlist(product.id);

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Hi! I'm interested in the "${product.name}" ($${product.price.toFixed(2)}) from Boutique Chic.`
  )}`;

  const related = (products || []).filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-28 pb-24">
        <div className="container mx-auto px-4 md:px-8">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8 group"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span className="text-sm font-medium">Back to Shop</span>
          </Link>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Image Section */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="relative aspect-square rounded-3xl overflow-hidden border border-border bg-card shadow-2xl group"
            >
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              {product.original_price && (
                <div className="absolute top-6 left-6 bg-destructive text-destructive-foreground font-bold px-4 py-1.5 rounded-full shadow-lg">
                  SALE
                </div>
              )}
            </motion.div>

            {/* Info Section */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col justify-center"
            >
              <div className="space-y-6">
                <div>
                  <span className="text-primary tracking-[0.3em] uppercase text-xs font-bold bg-primary/10 px-3 py-1 rounded-full">
                    {product.categories?.name}
                  </span>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-foreground mt-4 leading-tight">
                    {product.name}
                  </h1>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-4xl font-bold text-primary">
                    ${product.price.toFixed(2)}
                  </span>
                  {product.original_price && (
                    <span className="text-2xl text-muted-foreground line-through decoration-primary/30">
                      ${product.original_price.toFixed(2)}
                    </span>
                  )}
                </div>

                <p className="text-muted-foreground text-lg leading-relaxed max-w-xl">
                  {product.description}
                </p>

                <div className="flex items-center gap-3 py-2">
                  <div className={`w-3 h-3 rounded-full animate-pulse ${
                    product.stock > 0 ? "bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.4)]" : "bg-destructive shadow-[0_0_12px_rgba(239,68,68,0.4)]"
                  }`} />
                  <span className="text-sm font-medium text-foreground/80">
                    {product.stock > 0 ? `In Stock (${product.stock} units available)` : "Out of Stock"}
                  </span>
                </div>

                {/* Buy Controls */}
                <div className="space-y-4 pt-6">
                  {product.stock > 0 && (
                    <div className="flex items-center gap-6">
                      <div className="flex items-center bg-secondary/50 rounded-2xl p-1 border border-border self-start">
                        <button
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-background transition-colors text-foreground"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-12 text-center text-lg font-bold text-foreground">{quantity}</span>
                        <button
                          onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                          className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-background transition-colors text-foreground"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Wishlist button */}
                      <button
                        onClick={() => inWishlist ? removeFromWishlist(product.id) : addToWishlist(product)}
                        className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-all ${
                          inWishlist
                            ? "bg-red-500/10 border-red-500/30 text-red-500"
                            : "border-border text-muted-foreground hover:text-red-500 hover:border-red-500/30"
                        }`}
                      >
                        <Heart className={`h-5 w-5 ${inWishlist ? "fill-current" : ""}`} />
                      </button>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      size="lg"
                      disabled={product.stock <= 0}
                      onClick={() => {
                        for (let i = 0; i < quantity; i++) {
                          addToCart(product);
                        }
                      }}
                      className="flex-1 h-14 rounded-full bg-primary text-primary-foreground font-bold text-lg gap-2 shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all hover:-translate-y-1"
                    >
                      <ShoppingBag className="h-5 w-5" />
                      Add to Cart
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => window.open(whatsappUrl, '_blank')}
                      className="flex-1 h-14 rounded-full border-border text-foreground font-bold text-lg gap-2 hover:bg-secondary/50 transition-all hover:-translate-y-1"
                    >
                      <MessageCircle className="h-5 w-5 text-[#25D366]" />
                      Inquire
                    </Button>
                  </div>
                </div>

                {/* Features */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-10 border-t border-border/50">
                  {[
                    { icon: ShieldCheck, title: "Authenticity", desc: "100% Genuine" },
                    { icon: Truck, title: "Free Shipping", desc: "Global Delivery" },
                    { icon: RotateCcw, title: "Easy Returns", desc: "30-Day Policy" },
                  ].map(({ icon: Icon, title, desc }) => (
                    <div key={title} className="flex flex-col items-center sm:items-start">
                      <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center border border-primary/10 mb-3">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <p className="font-bold text-foreground text-sm">{title}</p>
                      <p className="text-muted-foreground text-xs">{desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Product Tabs */}
          <div className="mt-20">
            <div className="flex border-b border-border gap-0">
              {tabData.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-6 py-4 text-sm font-medium transition-all relative ${
                    activeTab === tab.key
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.key && (
                    <motion.div
                      layoutId="product-tab-indicator"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary"
                    />
                  )}
                </button>
              ))}
            </div>

            <div className="py-8">
              {activeTab === "description" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="max-w-3xl space-y-4"
                >
                  <p className="text-foreground/80 leading-relaxed text-lg">
                    {product.description}
                  </p>
                  <div className="grid sm:grid-cols-2 gap-6 mt-8">
                    <div className="bg-gradient-card rounded-xl border border-border p-6">
                      <h4 className="font-serif font-bold text-foreground mb-2">Quality Materials</h4>
                      <p className="text-muted-foreground text-sm">
                        Crafted with premium materials selected for durability and timeless beauty. Each piece undergoes rigorous quality checks.
                      </p>
                    </div>
                    <div className="bg-gradient-card rounded-xl border border-border p-6">
                      <h4 className="font-serif font-bold text-foreground mb-2">Artisan Craftsmanship</h4>
                      <p className="text-muted-foreground text-sm">
                        Handcrafted by skilled artisans with decades of experience, ensuring every detail meets our exacting standards.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "shipping" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="max-w-3xl space-y-6"
                >
                  <div>
                    <h4 className="font-serif font-bold text-foreground text-lg mb-3">Shipping Policy</h4>
                    <ul className="space-y-2 text-foreground/80">
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        Free standard shipping on all orders worldwide
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        Standard delivery: 5–10 business days
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        Express delivery available (2–3 business days) at checkout
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        All orders are fully insured during transit
                      </li>
                    </ul>
                  </div>
                  <div className="border-t border-border pt-6">
                    <h4 className="font-serif font-bold text-foreground text-lg mb-3">Return Policy</h4>
                    <ul className="space-y-2 text-foreground/80">
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        30-day return policy for unused items in original packaging
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        Free return shipping within the United States
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        Full refund processed within 5–7 business days
                      </li>
                    </ul>
                  </div>
                </motion.div>
              )}

              {activeTab === "reviews" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="max-w-3xl"
                >
                  <div className="text-center py-12 space-y-4">
                    <div className="flex justify-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star} className="text-2xl text-primary">★</span>
                      ))}
                    </div>
                    <p className="text-foreground font-serif text-xl font-bold">Customer Reviews Coming Soon</p>
                    <p className="text-muted-foreground text-sm max-w-md mx-auto">
                      We're building our review system. In the meantime, reach out via WhatsApp for customer testimonials.
                    </p>
                    <Button
                      variant="outline"
                      className="rounded-full mt-4"
                      onClick={() => window.open(whatsappUrl, '_blank')}
                    >
                      <MessageCircle className="h-4 w-4 mr-2 text-[#25D366]" />
                      Ask About This Product
                    </Button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Related Products */}
          {related.length > 0 && (
            <div className="mt-24">
              <h2 className="text-3xl font-serif font-bold text-foreground mb-8">
                You May Also Like
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {related.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          )}

          {/* Recently Viewed */}
          <RecentlyViewed excludeId={product.id} />
        </div>
      </div>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default ProductDetail;
