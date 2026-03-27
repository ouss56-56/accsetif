import { motion } from "framer-motion";

const ProductSkeleton = () => {
  return (
    <div className="bg-gradient-card rounded-2xl border border-border overflow-hidden animate-pulse">
      {/* Image skeleton */}
      <div className="aspect-square bg-secondary/50 relative overflow-hidden">
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      </div>

      {/* Info skeleton */}
      <div className="p-5 space-y-3">
        <div className="h-3 w-16 bg-secondary/60 rounded-full" />
        <div className="h-5 w-3/4 bg-secondary/60 rounded-full" />
        <div className="flex items-center justify-between mt-3">
          <div className="h-5 w-20 bg-secondary/60 rounded-full" />
          <div className="h-8 w-16 bg-secondary/60 rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default ProductSkeleton;
