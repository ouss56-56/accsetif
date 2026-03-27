import { useProducts } from "@/hooks/useProducts";
import { useRecentlyViewed } from "@/context/RecentlyViewedContext";
import ProductCard from "@/components/storefront/ProductCard";
import { motion } from "framer-motion";

interface RecentlyViewedProps {
  excludeId?: string;
}

const RecentlyViewed = ({ excludeId }: RecentlyViewedProps) => {
  const { recentlyViewed } = useRecentlyViewed();
  const { data: allProducts } = useProducts();

  const items = (allProducts || [])
    .filter((p) => recentlyViewed.includes(p.id) && p.id !== excludeId)
    .sort((a, b) => recentlyViewed.indexOf(a.id) - recentlyViewed.indexOf(b.id))
    .slice(0, 4);

  if (items.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mt-24"
    >
      <h2 className="text-3xl font-serif font-bold text-foreground mb-8">
        Recently Viewed
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </motion.div>
  );
};

export default RecentlyViewed;
