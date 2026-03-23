import { Link } from "react-router-dom";
import { Eye, ShoppingBag, Plus } from "lucide-react";
import { motion } from "framer-motion";
import type { Product } from "@/hooks/useProducts";
import { useCart } from "@/context/CartContext";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();

  return (
    <div className="group relative bg-gradient-card rounded-2xl border border-border overflow-hidden hover:border-primary/30 transition-all duration-500 hover:shadow-xl hover:shadow-primary/5">
      {/* Image */}
      <Link to={`/product/${product.id}`}>
        <div className="relative aspect-square overflow-hidden">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-background/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              className="bg-primary text-primary-foreground rounded-full p-3 shadow-lg shadow-primary/20"
            >
              <Eye className="h-5 w-5" />
            </motion.div>
          </div>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.original_price && (
              <span className="bg-destructive text-destructive-foreground text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
                SALE
              </span>
            )}
            {product.stock === 0 && (
              <span className="bg-muted text-muted-foreground text-xs font-medium px-2.5 py-1 rounded-full shadow-sm">
                Sold Out
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Info */}
      <div className="p-5">
        <p className="text-muted-foreground text-xs tracking-wider uppercase mb-1">
          {product.categories?.name}
        </p>
        <Link to={`/product/${product.id}`}>
          <h3 className="font-serif text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2">
            <span className="text-primary font-bold text-lg">${product.price.toFixed(2)}</span>
            {product.original_price && (
              <span className="text-muted-foreground line-through text-sm">
                ${product.original_price.toFixed(2)}
              </span>
            )}
          </div>

          {product.stock > 0 ? (
            <button
              onClick={() => addToCart(product)}
              className="flex items-center gap-1.5 bg-primary/10 hover:bg-primary hover:text-primary-foreground text-primary text-xs font-semibold px-3 py-1.5 rounded-full transition-all duration-200 border border-primary/20 hover:border-primary hover:shadow-md hover:shadow-primary/20"
            >
              <Plus className="h-3.5 w-3.5" />
              Add
            </button>
          ) : (
            <span className="text-xs text-muted-foreground">Out of Stock</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
