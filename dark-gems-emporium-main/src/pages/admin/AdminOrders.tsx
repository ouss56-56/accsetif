import { useState } from "react";
import { motion } from "framer-motion";
import { Search, ChevronDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

import { useOrders, useUpdateOrder, Order } from "@/hooks/useOrders";

const statuses = ["new", "processing", "shipped", "delivered", "cancelled"];

const statusColors: Record<string, string> = {
  new: "bg-blue-500/20 text-blue-400",
  processing: "bg-yellow-500/20 text-yellow-400",
  shipped: "bg-purple-500/20 text-purple-400",
  delivered: "bg-green-500/20 text-green-400",
  cancelled: "bg-destructive/20 text-destructive",
};

const AdminOrders = () => {
  const { data: orders, isLoading } = useOrders();
  const updateOrder = useUpdateOrder();
  
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = (orders || []).filter((o) => {
    const matchSearch =
      o.customer_name.toLowerCase().includes(search.toLowerCase()) ||
      o.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "All" || o.status === filterStatus.toLowerCase();
    return matchSearch && matchStatus;
  });

  const updateStatus = async (id: string, newStatus: any) => {
    await updateOrder.mutateAsync({ id, status: newStatus });
  };

  const updateNotes = async (id: string, notes: string) => {
    await updateOrder.mutateAsync({ id, notes });
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search orders..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-card border-border"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {["All", ...statuses].map((s) => (
            <Button
              key={s}
              variant={filterStatus.toLowerCase() === s.toLowerCase() ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus(s)}
              className="capitalize"
            >
              {s}
            </Button>
          ))}
        </div>
      </div>

      {/* Orders */}
      <div className="space-y-3">
        {filtered.map((order, i) => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
          >
            <Card className="bg-gradient-card border-border hover:border-primary/20 transition-colors">
              <CardContent className="p-4">
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground">{order.id}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[order.status]}`}>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-muted-foreground text-sm mt-1">
                        {order.customer_name} — {order.order_items?.map(i => i.products?.name).join(", ")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-primary font-bold">${order.total_amount.toFixed(2)}</span>
                    <span className="text-muted-foreground text-sm hidden sm:block">
                      {new Date(order.created_at).toLocaleDateString()}
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 text-muted-foreground transition-transform ${
                        expandedId === order.id ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </div>

                {expandedId === order.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-4 pt-4 border-t border-border space-y-4"
                  >
                    <div className="grid sm:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Phone:</span>
                        <p className="text-foreground">{order.customer_phone}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Email:</span>
                        <p className="text-foreground">{order.customer_email || "N/A"}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Date:</span>
                        <p className="text-foreground">{new Date(order.created_at).toLocaleString()}</p>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm text-muted-foreground">Update Status</label>
                      <div className="flex gap-2 mt-1 flex-wrap">
                        {statuses.map((s) => (
                          <Button
                            key={s}
                            size="sm"
                            variant={order.status === s ? "default" : "outline"}
                            onClick={() => updateStatus(order.id, s)}
                            className={`text-xs ${
                              order.status === s ? "bg-primary text-primary-foreground" : "border-border"
                            }`}
                          >
                            {s}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm text-muted-foreground">Notes</label>
                      <Textarea
                        value={order.notes}
                        onChange={(e) => updateNotes(order.id, e.target.value)}
                        placeholder="Add notes..."
                        className="mt-1 bg-secondary/30 border-border"
                        rows={2}
                      />
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-muted-foreground py-12">No orders found.</p>
      )}
    </div>
  );
};

export default AdminOrders;
