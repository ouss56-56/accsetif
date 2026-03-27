import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { Button } from "@/components/ui/button";

const testimonials = [
  {
    name: "Sophia Martinez",
    avatar: "S",
    rating: 5,
    text: "Absolutely stunning pieces! The craftsmanship is impeccable. I've received so many compliments on my necklace — it truly feels like wearing a work of art.",
    title: "Fashion Designer",
  },
  {
    name: "James Chen",
    avatar: "J",
    rating: 5,
    text: "The watch I ordered exceeded all expectations. The packaging was luxurious, delivery was swift, and the quality speaks for itself. A truly premium experience.",
    title: "Entrepreneur",
  },
  {
    name: "Amira Hassan",
    avatar: "A",
    rating: 5,
    text: "I've been a loyal customer for over a year and every piece I've purchased has been exceptional. Their customer service through WhatsApp is incredibly responsive.",
    title: "Interior Architect",
  },
  {
    name: "Daniel Kim",
    avatar: "D",
    rating: 5,
    text: "Bought a bracelet as an anniversary gift and my wife was overjoyed. The attention to detail and elegant presentation made it even more special.",
    title: "Marketing Director",
  },
  {
    name: "Elena Rossi",
    avatar: "E",
    rating: 5,
    text: "From browsing to checkout, the experience is seamless. The pieces are even more beautiful in person. This is my go-to for luxury accessories.",
    title: "Creative Director",
  },
];

const TestimonialsSection = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    slidesToScroll: 1,
  });
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    onSelect();
  }, [emblaApi, onSelect]);

  // Auto-play
  useEffect(() => {
    if (!emblaApi) return;
    const interval = setInterval(() => {
      emblaApi.scrollNext();
    }, 5000);
    return () => clearInterval(interval);
  }, [emblaApi]);

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/10 to-background" />
      <div className="absolute top-1/3 left-0 w-[400px] h-[400px] rounded-full bg-primary/3 blur-[120px]" />

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-primary tracking-[0.3em] uppercase text-sm font-medium">
            Testimonials
          </span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold mt-3 text-foreground">
            What Our Clients Say
          </h2>
          <div className="w-20 h-[2px] bg-primary mx-auto mt-6" />
        </motion.div>

        {/* Carousel */}
        <div className="relative">
          <div ref={emblaRef} className="overflow-hidden">
            <div className="flex gap-6">
              {testimonials.map((t, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="flex-[0_0_100%] sm:flex-[0_0_50%] lg:flex-[0_0_33.333%] min-w-0"
                >
                  <div className="bg-gradient-card rounded-2xl border border-border p-8 h-full flex flex-col hover:border-primary/30 transition-all duration-500 group">
                    <Quote className="h-8 w-8 text-primary/30 mb-4 group-hover:text-primary/50 transition-colors" />

                    {/* Stars */}
                    <div className="flex gap-1 mb-4">
                      {Array.from({ length: t.rating }).map((_, j) => (
                        <Star key={j} className="h-4 w-4 fill-primary text-primary" />
                      ))}
                    </div>

                    <p className="text-foreground/80 text-sm leading-relaxed flex-1 mb-6">
                      "{t.text}"
                    </p>

                    <div className="flex items-center gap-3 pt-4 border-t border-border/50">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-serif font-bold text-sm">
                        {t.avatar}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground text-sm">{t.name}</p>
                        <p className="text-muted-foreground text-xs">{t.title}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-3 mt-10">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full border-border hover:border-primary/50 hover:bg-primary/10 transition-all"
              onClick={() => emblaApi?.scrollPrev()}
              disabled={!canScrollPrev}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full border-border hover:border-primary/50 hover:bg-primary/10 transition-all"
              onClick={() => emblaApi?.scrollNext()}
              disabled={!canScrollNext}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
