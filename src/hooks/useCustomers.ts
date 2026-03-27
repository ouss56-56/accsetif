import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const MOCK_CUSTOMERS = [
  { id: "1", name: "Fares M.", email: "fares@example.com", phone: "+971 50 123 4567", totalSpent: "$14,500", orders: 12 },
  { id: "2", name: "Sarah J.", email: "sarah@luxury.com", phone: "+971 55 987 6543", totalSpent: "$8,900", orders: 8 },
  { id: "3", name: "Elena P.", email: "elena@milano.it", phone: "+39 02 123456", totalSpent: "$22,100", orders: 15 },
  { id: "4", name: "Marco K.", email: "marco@dubai.ae", phone: "+971 52 444 8888", totalSpent: "$4,200", orders: 4 },
];

export const useCustomers = () => {
  return useQuery({
    queryKey: ["customers"],
    queryFn: async () => {
      try {
        // Get all profiles with role 'customer'
        const { data: profiles, error: pError } = await supabase
          .from("profiles")
          .select("*")
          .eq("role", "customer");
        
        if (pError) throw pError;

        if (!profiles || profiles.length === 0) {
           return MOCK_CUSTOMERS;
        }

        // Get order stats for each customer
        const { data: orders, error: oError } = await supabase
          .from("orders")
          .select("customer_name, total_amount");
        
        if (oError) {
          console.warn("Could not fetch orders for customers, using basic mapping");
          return profiles.map(p => ({
            id: p.id,
            name: p.full_name || p.username || "Anonymous",
            email: p.email || "",
            phone: p.phone || "Not provided",
            totalSpent: "$0.00",
            orders: 0,
          }));
        }

        return profiles.map(profile => {
          const customerOrders = orders?.filter(o => o.customer_name === profile.full_name) || [];
          const totalSpent = customerOrders.reduce((sum, o) => sum + (o.total_amount || 0), 0);
          
          return {
            id: profile.id,
            name: profile.full_name || "Unknown",
            email: profile.email || profile.id,
            phone: profile.phone || "N/A",
            orders: customerOrders.length,
            totalSpent: `$${totalSpent.toLocaleString()}`
          };
        });
      } catch (error) {
        console.warn("Profiles fetch error, using mockup data", error);
        return MOCK_CUSTOMERS;
      }
    },
  });
};
