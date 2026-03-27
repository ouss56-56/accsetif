import { motion } from "framer-motion";
import { Shield, Truck, Gem, Headphones } from "lucide-react";

const badges = [
  {
    icon: Shield,
    title: "Secure Checkout",
    description: "256-bit SSL encryption",
  },
  {
    icon: Truck,
    title: "Free Shipping",
    description: "Worldwide delivery",
  },
  {
    icon: Gem,
    title: "100% Authentic",
    description: "Certified genuine products",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Always here to help",
  },
];

const TrustBadges = () => {
  return (
    <section className="py-16 border-t border-border/50">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {badges.map((badge, i) => (
            <motion.div
              key={badge.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex flex-col items-center text-center group"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/10 group-hover:border-primary/25 group-hover:scale-110 transition-all duration-500">
                <badge.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground text-sm">{badge.title}</h3>
              <p className="text-muted-foreground text-xs mt-1">{badge.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBadges;
