import { motion } from "framer-motion";

const AboutSection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/10 to-background" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-primary/3 blur-[120px]" />

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <span className="text-primary tracking-[0.3em] uppercase text-sm font-medium">
              Our Story
            </span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground leading-tight">
              Crafting Moments of{" "}
              <span className="text-gradient-gold">Timeless Beauty</span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              At Boutique Chic Accessory, we believe that every accessory is more than an adornment
              — it's an expression of individuality. Our carefully curated collection brings together
              artisan craftsmanship and contemporary design.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              From the precision of our watches to the grace of our necklaces, each piece is
              selected with an unwavering commitment to quality and elegance. We invite you to
              discover the accessory that speaks to your unique story.
            </p>

            <div className="grid grid-cols-3 gap-8 pt-6">
              {[
                { value: "500+", label: "Unique Pieces" },
                { value: "10K+", label: "Happy Clients" },
                { value: "5★", label: "Rated Service" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-3xl font-serif font-bold text-primary">{stat.value}</p>
                  <p className="text-muted-foreground text-sm mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="aspect-[4/5] rounded-2xl bg-gradient-card border border-border overflow-hidden">
              <div className="w-full h-full bg-gradient-to-br from-secondary/50 to-card flex items-center justify-center">
                <div className="text-center space-y-4 p-8">
                  <div className="text-6xl">💎</div>
                  <p className="text-gradient-gold font-serif text-3xl font-bold">
                    Boutique Chic
                  </p>
                  <p className="text-muted-foreground text-sm tracking-[0.2em] uppercase">
                    Accessory
                  </p>
                  <div className="w-12 h-[1px] bg-primary mx-auto" />
                  <p className="text-muted-foreground text-sm italic">Est. 2024</p>
                </div>
              </div>
            </div>
            {/* Decorative ring */}
            <div className="absolute -bottom-4 -right-4 w-32 h-32 rounded-full border-2 border-primary/20" />
            <div className="absolute -top-4 -left-4 w-24 h-24 rounded-full border border-primary/10" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
