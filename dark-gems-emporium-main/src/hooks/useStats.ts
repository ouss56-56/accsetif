import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useStats = () => {
  return useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [
        { count: productsCount },
        { count: ordersCount },
        { data: ordersData },
        { data: lowStockData }
      ] = await Promise.all([
        supabase.from("products").select("*", { count: 'exact', head: true }),
        supabase.from("orders").select("*", { count: 'exact', head: true }),
        supabase.from("orders").select("total_amount, status, created_at, customer_name, id"),
        supabase.from("products").select("name, stock").lt("stock", 5).limit(5)
      ]);

      const totalRevenue = ordersData?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0;
      
      // Mock changes (in real app, compare with previous period)
      return {
        products: productsCount || 0,
        orders: ordersCount || 0,
        revenue: totalRevenue,
        recentOrders: ordersData?.slice(0, 5) || [],
        lowStock: lowStockData || []
      };
    },
  });
};
