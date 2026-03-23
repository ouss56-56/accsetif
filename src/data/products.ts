import product1 from "@/assets/products/product-1.jpeg";
import product2 from "@/assets/products/product-2.jpeg";
import product3 from "@/assets/products/product-3.jpeg";
import product4 from "@/assets/products/product-4.jpeg";

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  description: string;
  inStock: boolean;
  featured: boolean;
}

export const sampleProducts: Product[] = [
  {
    id: "1",
    name: "Éclat Gold Watch",
    price: 349.99,
    originalPrice: 429.99,
    image: product1,
    category: "Watches",
    description: "A stunning gold-tone timepiece with precision quartz movement and sapphire crystal face. The perfect statement of refined taste.",
    inStock: true,
    featured: true,
  },
  {
    id: "2",
    name: "Serpentine Necklace",
    price: 189.99,
    image: product2,
    category: "Necklaces",
    description: "Elegant serpentine chain necklace with a delicate pendant. Handcrafted with premium materials for lasting beauty.",
    inStock: true,
    featured: true,
  },
  {
    id: "3",
    name: "Royal Chronograph",
    price: 549.99,
    originalPrice: 699.99,
    image: product3,
    category: "Watches",
    description: "A masterpiece of horology featuring chronograph complications and a luxurious leather strap. For those who appreciate the art of time.",
    inStock: true,
    featured: true,
  },
  {
    id: "4",
    name: "Pearl Cascade Set",
    price: 279.99,
    image: product4,
    category: "Sets",
    description: "A breathtaking pearl cascade necklace and earring set. Each pearl is carefully selected for its luminous quality.",
    inStock: true,
    featured: true,
  },
];

export const categories = [
  { name: "Watches", icon: "⌚", description: "Precision timepieces for the discerning collector" },
  { name: "Necklaces", icon: "📿", description: "Elegant chains and pendants that captivate" },
  { name: "Bracelets", icon: "💎", description: "Wrist adornments that speak volumes" },
  { name: "Sets", icon: "✨", description: "Curated collections for a complete look" },
];
