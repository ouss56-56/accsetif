import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const MOCK_ORDERS: Order[] = [
  { id: "ORD-001", customer_name: "Fares M.", customer_email: "fares@example.com", customer_phone: "+971 50 123 4567", total_amount: 1540.00, status: 'delivered', created_at: new Date(Date.now() - 86400000).toISOString(), notes: "Wholesale priority" },
  { id: "ORD-002", customer_name: "Sarah L.", customer_email: "sarah@luxury.com", customer_phone: "+971 55 987 6543", total_amount: 890.00, status: 'processing', created_at: new Date(Date.now() - 172800000).toISOString() },
  { id: "ORD-003", customer_name: "John D.", customer_email: "john@intl.com", customer_phone: "+1 202 555 0123", total_amount: 2100.00, status: 'shipped', created_at: new Date(Date.now() - 259200000).toISOString() },
  { id: "ORD-004", customer_name: "Elena P.", customer_email: "elena@milano.it", customer_phone: "+39 02 123456", total_amount: 450.00, status: 'new', created_at: new Date().toISOString() },
];

export interface Order {
  id: string;
  customer_name: string;
  customer_email?: string;
  customer_phone: string;
  total_amount: number;
  status: 'new' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  notes?: string;
  created_at: string;
  order_items?: any[];
}

export const useOrders = () => {
  return useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*, order_items(*, products(*))")
        .order("created_at", { ascending: false });
      if (error) throw error;
      
      // Demo Fallback
      if (!data || data.length === 0) return MOCK_ORDERS;
      
      return data as Order[];
    },
  });
};

export const useUpdateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Order> & { id: string }) => {
      const { data, error } = await supabase
        .from("orders")
        .update(updates)
        .eq("id", id)
        .select();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Order updated");
    },
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newOrder: any) => {
      const { items, ...orderData } = newOrder;
      
      // 1. Insert order
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert([orderData])
        .select()
        .single();
      
      if (orderError) throw orderError;

      // 2. Insert order items
      const orderItems = items.map((item: any) => ({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);
      
      if (itemsError) throw itemsError;

      return order;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};
