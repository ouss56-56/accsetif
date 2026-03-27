import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingBag, Plus, Minus, Heart, ExternalLink } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Product } from "@/hooks/useProducts";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

interface QuickViewModalProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const QuickViewModal = ({ product, open, onOpenChange }: QuickViewModalProps) => {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();

  if (!product) return null;

  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    setQuantity(1);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border max-w-2xl p-0 overflow-hidden">
        <div className="grid sm:grid-cols-2 gap-0">
          {/* Image */}
          <div className="relative aspect-square sm:aspect-auto sm:h-full overflow-hidden bg-secondary/30">
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.original_price && (
              <span className="absolute top-4 left-4 bg-destructive text-destructive-foreground text-xs font-bold px-3 py-1 rounded-full">
                SALE
              </span>
            )}
          </div>

          {/* Info */}
          <div className="p-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <span className="text-primary tracking-[0.2em] uppercase text-xs font-bold">
                  {product.categories?.name}
                </span>
                <h3 className="text-2xl font-serif font-bold text-foreground mt-2 leading-tight">
                  {product.name}
                </h3>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-primary">
                  ${product.price.toFixed(2)}
                </span>
                {product.original_price && (
                  <span className="text-lg text-muted-foreground line-through">
                    ${product.original_price.toFixed(2)}
                  </span>
                )}
              </div>

              <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
                {product.description}
              </p>

              {/* Stock */}
              <div className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full ${product.stock > 0 ? "bg-green-500" : "bg-destructive"}`} />
                <span className="text-sm text-foreground/70">
                  {product.stock > 0 ? `In Stock (${product.stock})` : "Out of Stock"}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3 mt-6">
              {product.stock > 0 && (
                <div className="flex items-center gap-3">
                  <div className="flex items-center bg-secondary/50 rounded-xl p-1 border border-border">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-background transition-colors"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-10 text-center font-bold">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-background transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>

                  <button
                    onClick={() => inWishlist ? removeFromWishlist(product.id) : addToWishlist(product)}
                    className={`w-11 h-11 rounded-xl border flex items-center justify-center transition-all ${
                      inWishlist
                        ? "bg-red-500/10 border-red-500/30 text-red-500"
                        : "border-border text-muted-foreground hover:text-red-500 hover:border-red-500/30"
                    }`}
                  >
                    <Heart className={`h-5 w-5 ${inWishlist ? "fill-current" : ""}`} />
                  </button>
                </div>
              )}

              <Button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="w-full h-12 rounded-full bg-primary text-primary-foreground font-bold gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all"
              >
                <ShoppingBag className="h-5 w-5" />
                Add to Cart
              </Button>

              <Link
                to={`/product/${product.id}`}
                onClick={() => onOpenChange(false)}
                className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors py-2"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                View Full Details
              </Link>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuickViewModal;
