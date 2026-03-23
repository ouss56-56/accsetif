import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useCategories } from "@/hooks/useProducts";

const CategorySection = () => {
  const { data: categories, isLoading } = useCategories();

  if (isLoading) return null;

  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/10 to-background" />
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-primary tracking-[0.3em] uppercase text-sm font-medium">
            Browse
          </span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold mt-3 text-foreground">
            Shop by Category
          </h2>
          <div className="w-20 h-[2px] bg-primary mx-auto mt-6" />
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories?.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Link
                to={`/products?category=${cat.name}`}
                className="group block bg-gradient-card rounded-2xl border border-border p-8 text-center hover:border-primary/40 transition-all duration-500 hover:shadow-lg hover:shadow-primary/5"
              >
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {/* Default icons for initial categories */}
                  {cat.name === "Fine Jewelry" ? "💍" : 
                   cat.name === "Luxury Watches" ? "⌚" :
                   cat.name === "Rare Gems" ? "💎" :
                   cat.name === "Bespoke" ? "⚜️" : "✨"}
                </div>
                <h3 className="font-serif text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                  {cat.name}
                </h3>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
