import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import ProductCard from "./ProductCard";

const FeaturedProducts = () => {
  const { data: products, isLoading } = useProducts();
  const featured = products?.filter((p) => p.featured) || [];

  if (isLoading) return null; // Or a skeleton

  return (
    <section className="py-24">
      <div className="container mx-auto px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-16"
        >
          <div>
            <span className="text-primary tracking-[0.3em] uppercase text-sm font-medium">
              Curated
            </span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold mt-3 text-foreground">
              Featured Pieces
            </h2>
            <div className="w-20 h-[2px] bg-primary mt-6" />
          </div>
          <Link
            to="/products"
            className="mt-6 md:mt-0 flex items-center gap-2 text-primary hover:text-gold-light transition-colors group text-sm font-medium"
          >
            View All
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
