import { motion } from "framer-motion";
import { MessageCircle, Phone, Mail, MapPin, Send } from "lucide-react";
import { useState } from "react";
import Navbar from "@/components/storefront/Navbar";
import Footer from "@/components/storefront/Footer";
import WhatsAppButton from "@/components/storefront/WhatsAppButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    toast.success("Message sent! We'll get back to you soon.");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-28 pb-24">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-foreground">
              Get in <span className="text-gradient-gold">Touch</span>
            </h1>
            <p className="text-muted-foreground mt-4 text-lg max-w-lg mx-auto">
              We'd love to hear from you. Reach out via any channel below.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Your Name</label>
                  <Input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="John Doe"
                    className="bg-card border-border focus:border-primary/50 rounded-lg"
                    maxLength={100}
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Email</label>
                  <Input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="john@example.com"
                    className="bg-card border-border focus:border-primary/50 rounded-lg"
                    maxLength={255}
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Message</label>
                  <Textarea
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell us what you're looking for..."
                    rows={5}
                    className="bg-card border-border focus:border-primary/50 rounded-lg"
                    maxLength={1000}
                  />
                </div>
                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-full gap-2"
                >
                  <Send className="h-4 w-4" />
                  Send Message
                </Button>
              </form>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="space-y-8"
            >
              {[
                {
                  icon: MessageCircle,
                  title: "WhatsApp",
                  detail: "+1 (555) 123-4567",
                  sub: "Available 9 AM – 9 PM",
                  link: "https://wa.me/15551234567",
                  color: "text-[#25D366]",
                },
                {
                  icon: Phone,
                  title: "Phone",
                  detail: "+1 (555) 123-4567",
                  sub: "Mon – Sat, 10 AM – 8 PM",
                  link: "tel:+15551234567",
                  color: "text-primary",
                },
                {
                  icon: Mail,
                  title: "Email",
                  detail: "info@boutiquechic.com",
                  sub: "We reply within 24 hours",
                  link: "mailto:info@boutiquechic.com",
                  color: "text-primary",
                },
                {
                  icon: MapPin,
                  title: "Visit Us",
                  detail: "123 Luxury Ave, Suite 100",
                  sub: "New York, NY 10001",
                  color: "text-primary",
                },
              ].map((item) => (
                <a
                  key={item.title}
                  href={item.link || "#"}
                  target={item.link ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 p-6 rounded-2xl bg-gradient-card border border-border hover:border-primary/30 transition-all duration-300 group"
                >
                  <div className={`${item.color} mt-1`}>
                    <item.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-foreground/80 mt-1">{item.detail}</p>
                    <p className="text-muted-foreground text-sm mt-0.5">{item.sub}</p>
                  </div>
                </a>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Contact;
