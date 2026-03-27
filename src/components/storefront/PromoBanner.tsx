import { useState } from "react";
import { motion } from "framer-motion";
import { X, Zap } from "lucide-react";

const PromoBanner = () => {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      className="relative bg-gradient-to-r from-primary/90 via-amber-600/90 to-primary/90 overflow-hidden"
    >
      {/* Animated background shimmer */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_3s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      <div className="container mx-auto px-4 md:px-8 py-2.5 relative z-10">
        <div className="flex items-center justify-center gap-3">
          <Zap className="h-4 w-4 text-primary-foreground/90 hidden sm:block" />
          <p className="text-primary-foreground text-sm font-medium text-center">
            <span className="font-bold">✨ Free Worldwide Shipping</span>
            <span className="mx-2 hidden sm:inline">—</span>
            <span className="hidden sm:inline">On all orders, no minimum purchase required</span>
          </p>
          <button
            onClick={() => setVisible(false)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-primary-foreground/60 hover:text-primary-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default PromoBanner;
