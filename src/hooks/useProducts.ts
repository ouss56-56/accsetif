import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const MOCK_PRODUCTS: Product[] = [
  { id: "1", name: "Golden Chronograph", description: "Precision luxury timepiece.", price: 1250, image_url: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1487&auto=format&fit=crop", stock: 15, status: 'active', featured: true, category_id: "cat1" },
  { id: "2", name: "Diamond Silver Band", description: "Ethically sourced luxury ring.", price: 450, image_url: "https://images.unsplash.com/photo-1626285861696-9f0bf5a49c6d?q=80&w=1528&auto=format&fit=crop", stock: 8, status: 'active', featured: true, category_id: "cat2" },
  { id: "3", name: "Emerald Deco Ring", description: "Art-deco inspired emerald ring.", price: 750, image_url: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1470&auto=format&fit=crop", stock: 0, status: 'active', featured: false, category_id: "cat2" },
];

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  original_price?: number;
  image_url: string;
  category_id: string;
  stock: number;
  status: 'active' | 'draft' | 'out_of_stock';
  featured: boolean;
  categories?: {
    name: string;
    icon: string;
  };
}

export const useProducts = (category?: string) => {
  return useQuery({
    queryKey: ["products", category],
    queryFn: async () => {
      let query = supabase
        .from("products")
        .select("*, categories(name, icon)")
        .order("created_at", { ascending: false });

      if (category && category !== "All") {
        query = query.eq("categories.name", category);
      }

      const { data, error } = await query;
      if (error) {
        console.warn("Product fetch failed, using mock data");
        return MOCK_PRODUCTS;
      }
      
      if (!data || data.length === 0) return MOCK_PRODUCTS;
      
      return data as Product[];
    },
  });
};

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*, categories(name, icon)")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data as Product;
    },
    enabled: !!id,
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase.from("categories").select("*");
      if (error) throw error;
      return data;
    },
  });
};
