import { Link } from "react-router-dom";
import { Instagram, Facebook, Twitter, Mail, Phone, MapPin, Heart, ChevronUp, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-card/50">
      <div className="container mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-gradient-gold font-serif text-2xl font-bold">Boutique Chic</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Your destination for luxury watches, necklaces, and curated accessories.
              Timeless elegance for every occasion.
            </p>
            <div className="flex gap-3">
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 transition-all duration-300"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-serif text-lg font-semibold text-foreground">Quick Links</h4>
            <div className="flex flex-col gap-2">
              {[
                { name: "Home", path: "/" },
                { name: "Shop All", path: "/products" },
                { name: "Wishlist", path: "/wishlist" },
                { name: "Contact", path: "/contact" },
              ].map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="text-muted-foreground hover:text-primary transition-colors text-sm flex items-center gap-2 group"
                >
                  {link.name === "Wishlist" && <Heart className="h-3 w-3 text-primary/50 group-hover:text-primary transition-colors" />}
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h4 className="font-serif text-lg font-semibold text-foreground">Categories</h4>
            <div className="flex flex-col gap-2">
              {["Watches", "Necklaces", "Bracelets", "Sets"].map((cat) => (
                <Link
                  key={cat}
                  to={`/products?category=${cat}`}
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-serif text-lg font-semibold text-foreground">Contact Us</h4>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Phone className="h-4 w-4 text-primary" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Mail className="h-4 w-4 text-primary" />
                <span>info@boutiquechic.com</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <MapPin className="h-4 w-4 text-primary" />
                <span>123 Luxury Ave, Suite 100</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} Boutique Chic Accessory. Made with <Heart className="h-3 w-3 inline text-primary animate-pulse" /> for Elegance.
          </p>
          
          <div className="flex items-center gap-4 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg border border-border bg-card/50">
              <CreditCard className="h-4 w-4" />
              <span className="text-[10px] font-bold uppercase tracking-tight italic">VISA</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg border border-border bg-card/50">
              <span className="text-[10px] font-bold uppercase tracking-tight italic">Mastercard</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg border border-border bg-card/50">
              <span className="text-[10px] font-bold uppercase tracking-tight italic">PayPal</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg border border-border bg-card/50">
              <span className="text-[10px] font-bold uppercase tracking-tight italic">Apple Pay</span>
            </div>
          </div>

          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-muted-foreground hover:text-primary gap-2"
          >
            Back to Top
            <ChevronUp className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
