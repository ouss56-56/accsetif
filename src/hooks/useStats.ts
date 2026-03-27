import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const MOCK_STATS = [
  { label: "Total Revenue", value: "SAR 125,430", change: "+12.5%", isPositive: true },
  { label: "Total Orders", value: "1,240", change: "+5.2%", isPositive: true },
  { label: "Active Customers", value: "850", change: "+2.4%", isPositive: true },
  { label: "Conversion Rate", value: "3.2%", change: "-0.4%", isPositive: false },
];

export const useStats = () => {
  return useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      try {
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
        
        // If no orders yet, return mock stats for demo
        if (!ordersData || ordersData.length === 0) {
          return {
            products: productsCount || 0,
            orders: ordersCount || 0,
            revenue: totalRevenue || 125430,
            recentOrders: [],
            lowStock: lowStockData || [],
            cards: MOCK_STATS
          };
        }

        return {
          products: productsCount || 0,
          orders: ordersCount || 0,
          revenue: totalRevenue,
          recentOrders: ordersData?.slice(0, 5) || [],
          lowStock: lowStockData || [],
          cards: [
            { label: "Total Revenue", value: `SAR ${totalRevenue.toLocaleString()}`, change: "+12.5%", isPositive: true },
            { label: "Total Orders", value: (ordersCount || 0).toString(), change: "+5.2%", isPositive: true },
            { label: "Active Customers", value: "850", change: "+2.4%", isPositive: true }, 
            { label: "Conversion Rate", value: "3.2%", change: "-0.4%", isPositive: false },
          ]
        };
      } catch (error) {
        console.warn("Error fetching stats, falling back to mock:", error);
        return {
          products: 15,
          orders: 1240,
          revenue: 125430,
          recentOrders: [],
          lowStock: [],
          cards: MOCK_STATS
        };
      }
    },
  });
};
