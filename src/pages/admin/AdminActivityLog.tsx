import { useMemo } from "react";
import { motion } from "framer-motion";
import { Clock, Package, ShoppingCart, Edit, Trash2, Plus, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useOrders } from "@/hooks/useOrders";
import { useProducts } from "@/hooks/useProducts";

interface ActivityItem {
  id: string;
  type: "order_new" | "order_status" | "product_added" | "product_removed" | "stock_alert";
  title: string;
  description: string;
  timestamp: string;
  icon: typeof Clock;
  color: string;
}

const AdminActivityLog = () => {
  const { data: orders } = useOrders();
  const { data: products } = useProducts();

  const activities: ActivityItem[] = useMemo(() => {
    const items: ActivityItem[] = [];

    // Build activities from orders
    (orders || []).forEach((order) => {
      items.push({
        id: `order-${order.id}`,
        type: "order_new",
        title: "New Order",
        description: `${order.customer_name} placed an order for $${order.total_amount.toFixed(2)}`,
        timestamp: order.created_at,
        icon: ShoppingCart,
        color: "text-blue-400 bg-blue-500/10",
      });

      if (order.status === "shipped") {
        items.push({
          id: `shipped-${order.id}`,
          type: "order_status",
          title: "Order Shipped",
          description: `Order from ${order.customer_name} was shipped`,
          timestamp: order.updated_at || order.created_at,
          icon: ArrowUpRight,
          color: "text-purple-400 bg-purple-500/10",
        });
      }

      if (order.status === "delivered") {
        items.push({
          id: `delivered-${order.id}`,
          type: "order_status",
          title: "Order Delivered",
          description: `Order from ${order.customer_name} was delivered`,
          timestamp: order.updated_at || order.created_at,
          icon: ArrowDownRight,
          color: "text-green-400 bg-green-500/10",
        });
      }
    });

    // Stock alerts
    (products || []).filter((p) => p.stock < 5 && p.stock > 0).forEach((p) => {
      items.push({
        id: `stock-${p.id}`,
        type: "stock_alert",
        title: "Low Stock Alert",
        description: `"${p.name}" has only ${p.stock} units remaining`,
        timestamp: p.updated_at || p.created_at,
        icon: Package,
        color: "text-amber-400 bg-amber-500/10",
      });
    });

    // Out of stock
    (products || []).filter((p) => p.stock === 0).forEach((p) => {
      items.push({
        id: `oos-${p.id}`,
        type: "stock_alert",
        title: "Out of Stock",
        description: `"${p.name}" is out of stock`,
        timestamp: p.updated_at || p.created_at,
        icon: Trash2,
        color: "text-red-400 bg-red-500/10",
      });
    });

    // Sort by timestamp, most recent first
    return items.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 50);
  }, [orders, products]);

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-2xl font-serif font-bold text-foreground">Activity Log</h2>
        <p className="text-muted-foreground text-sm mt-1">Recent actions and system events</p>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-5 top-0 bottom-0 w-px bg-border" />

        <div className="space-y-1">
          {activities.map((activity, i) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: i * 0.03 }}
              className="relative pl-14 py-3 group"
            >
              {/* Icon dot */}
              <div className={`absolute left-2 top-4 w-7 h-7 rounded-full flex items-center justify-center ${activity.color} ring-4 ring-background`}>
                <activity.icon className="h-3.5 w-3.5" />
              </div>

              <div className="bg-gradient-card border border-border rounded-xl p-4 hover:border-primary/20 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-foreground text-sm">{activity.title}</p>
                    <p className="text-muted-foreground text-sm mt-0.5">{activity.description}</p>
                  </div>
                  <span className="text-muted-foreground/60 text-xs whitespace-nowrap flex-shrink-0">
                    {formatTime(activity.timestamp)}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {activities.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <Clock className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p>No activity yet.</p>
        </div>
      )}
    </div>
  );
};

export default AdminActivityLog;
