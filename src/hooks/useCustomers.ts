import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useCustomers = () => {
  return useQuery({
    queryKey: ["customers"],
    queryFn: async () => {
      // Get all profiles with role 'customer'
      const { data: profiles, error: pError } = await supabase
        .from("profiles")
        .select("*")
        .eq("role", "customer");
      
      if (pError) throw pError;

      // Get order stats for each customer
      const { data: orders, error: oError } = await supabase
        .from("orders")
        .select("customer_name, total_amount");
      
      if (oError) throw oError;

      return profiles.map(profile => {
        const customerOrders = orders?.filter(o => o.customer_name === profile.full_name) || [];
        const totalSpent = customerOrders.reduce((sum, o) => sum + (o.total_amount || 0), 0);
        
        return {
          id: profile.id,
          name: profile.full_name || "Unknown",
          email: profile.id, // Auth email is not in profiles by default unless we join, but for demo id is fine or just ommit
          phone: profile.phone || "N/A",
          orders: customerOrders.length,
          totalSpent: `$${totalSpent.toFixed(2)}`
        };
      });
    },
  });
};
