import { useMemo } from "react";
import { motion } from "framer-motion";
import { Package, ShoppingCart, Users, AlertTriangle, TrendingUp, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useStats } from "@/hooks/useStats";
import { useOrders } from "@/hooks/useOrders";

const statusColors: Record<string, string> = {
  new: "bg-blue-500/20 text-blue-400",
  processing: "bg-yellow-500/20 text-yellow-400",
  shipped: "bg-purple-500/20 text-purple-400",
  delivered: "bg-green-500/20 text-green-400",
};

const AdminDashboard = () => {
  const { data: stats, isLoading } = useStats();
  const { data: orders } = useOrders();

  // Build chart data from orders (last 30 days)
  const chartData = useMemo(() => {
    if (!orders) return [];
    const now = new Date();
    const days: Record<string, { date: string; revenue: number; orders: number }> = {};

    for (let i = 29; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split("T")[0];
      const label = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      days[key] = { date: label, revenue: 0, orders: 0 };
    }

    orders.forEach((order) => {
      const key = new Date(order.created_at).toISOString().split("T")[0];
      if (days[key]) {
        days[key].revenue += order.total_amount;
        days[key].orders += 1;
      }
    });

    return Object.values(days);
  }, [orders]);

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-[400px]">
      <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>;
  }

  const statCards = [
    { title: "Total Products", value: stats?.products.toString(), icon: Package, change: "Live from DB" },
    { title: "Total Orders", value: stats?.orders.toString(), icon: ShoppingCart, change: "Live from DB" },
    { title: "Revenue", value: `$${stats?.revenue.toFixed(2)}`, icon: DollarSign, change: "Total gross" },
    { title: "Customers", value: stats?.recentOrders.length.toString(), icon: Users, change: "Recent active" },
  ];
  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
          >
            <Card className="bg-gradient-card border-border hover:border-primary/20 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">{stat.title}</p>
                    <p className="text-3xl font-serif font-bold text-foreground mt-1">{stat.value}</p>
                    <div className="text-primary text-xs mt-1 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      {stat.change}
                    </div>
                  </div>
                  <div className="bg-primary/10 rounded-xl p-3">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Revenue Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card className="bg-gradient-card border-border">
          <CardHeader>
            <CardTitle className="font-serif text-xl flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Revenue Overview (30 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(40, 35%, 60%)" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="hsl(40, 35%, 60%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 20%, 20%)" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11, fill: "hsl(220, 15%, 55%)" }}
                    tickLine={false}
                    axisLine={false}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "hsl(220, 15%, 55%)" }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) => `$${v}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(220, 35%, 12%)",
                      border: "1px solid hsl(220, 20%, 20%)",
                      borderRadius: "12px",
                      color: "hsl(220, 20%, 90%)",
                      fontSize: 13,
                    }}
                    formatter={(value: number) => [`$${value.toFixed(2)}`, "Revenue"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="hsl(40, 35%, 60%)"
                    strokeWidth={2}
                    fill="url(#revenueGradient)"
                    dot={false}
                    activeDot={{ r: 5, fill: "hsl(40, 35%, 60%)", stroke: "hsl(220, 35%, 12%)", strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <Card className="lg:col-span-2 bg-gradient-card border-border">
          <CardHeader>
            <CardTitle className="font-serif text-xl">Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats?.recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-foreground">{order.id}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${statusColors[order.status]}`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-muted-foreground text-sm mt-1">
                      {order.customer_name}
                    </p>
                  </div>
                  <span className="text-primary font-semibold">${order.total_amount.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Low Stock Alerts */}
        <Card className="bg-gradient-card border-border">
          <CardHeader>
            <CardTitle className="font-serif text-xl flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              Low Stock
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats?.lowStock.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between p-3 rounded-lg bg-destructive/5 border border-destructive/20"
                >
                  <span className="text-sm text-foreground">{item.name}</span>
                  <span className="text-destructive font-bold text-sm">{item.stock} left</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
