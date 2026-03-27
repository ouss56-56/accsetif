import { useMemo } from "react";
import { motion } from "framer-motion";
import { BarChart3, TrendingUp, PieChart as PieChartIcon, ShoppingCart, DollarSign, Package } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
  BarChart, Bar,
} from "recharts";
import { useOrders } from "@/hooks/useOrders";
import { useProducts, useCategories } from "@/hooks/useProducts";

const STATUS_COLORS: Record<string, string> = {
  new: "#3b82f6",
  processing: "#eab308",
  shipped: "#a855f7",
  delivered: "#22c55e",
  cancelled: "#ef4444",
};

const CHART_COLORS = ["#C9A961", "#3b82f6", "#22c55e", "#a855f7", "#eab308", "#ef4444", "#06b6d4", "#f97316"];

const AdminAnalytics = () => {
  const { data: orders } = useOrders();
  const { data: products } = useProducts();
  const { data: categories } = useCategories();

  // Orders by status (pie chart)
  const statusData = useMemo(() => {
    if (!orders) return [];
    const counts: Record<string, number> = {};
    orders.forEach((o) => {
      counts[o.status] = (counts[o.status] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [orders]);

  // Order trends (line chart - 30 days)
  const trendData = useMemo(() => {
    if (!orders) return [];
    const now = new Date();
    const days: Record<string, { date: string; orders: number; revenue: number }> = {};
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split("T")[0];
      const label = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      days[key] = { date: label, orders: 0, revenue: 0 };
    }
    orders.forEach((order) => {
      const key = new Date(order.created_at).toISOString().split("T")[0];
      if (days[key]) {
        days[key].orders += 1;
        days[key].revenue += order.total_amount;
      }
    });
    return Object.values(days);
  }, [orders]);

  // Top selling products (bar chart)
  const topProducts = useMemo(() => {
    if (!orders) return [];
    const productCounts: Record<string, { name: string; sales: number; revenue: number }> = {};
    orders.forEach((order) => {
      order.order_items?.forEach((item: any) => {
        const name = item.products?.name || "Unknown";
        if (!productCounts[name]) productCounts[name] = { name, sales: 0, revenue: 0 };
        productCounts[name].sales += item.quantity;
        productCounts[name].revenue += item.price_at_time * item.quantity;
      });
    });
    return Object.values(productCounts)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 6);
  }, [orders]);

  // Revenue by category (bar chart)
  const categoryRevenue = useMemo(() => {
    if (!orders || !categories) return [];
    const catMap: Record<string, { name: string; revenue: number }> = {};
    categories.forEach((c) => {
      catMap[c.id] = { name: c.name, revenue: 0 };
    });
    orders.forEach((order) => {
      order.order_items?.forEach((item: any) => {
        const catId = item.products?.category_id;
        if (catId && catMap[catId]) {
          catMap[catId].revenue += item.price_at_time * item.quantity;
        }
      });
    });
    return Object.values(catMap).filter((c) => c.revenue > 0).sort((a, b) => b.revenue - a.revenue);
  }, [orders, categories]);

  // Summary stats
  const stats = useMemo(() => {
    if (!orders || !products) return { totalOrders: 0, totalRevenue: 0, avgOrderValue: 0, totalProducts: 0 };
    const totalRevenue = orders.reduce((sum, o) => sum + o.total_amount, 0);
    return {
      totalOrders: orders.length,
      totalRevenue,
      avgOrderValue: orders.length > 0 ? totalRevenue / orders.length : 0,
      totalProducts: products.length,
    };
  }, [orders, products]);

  const summaryCards = [
    { title: "Total Revenue", value: `$${stats.totalRevenue.toFixed(0)}`, icon: DollarSign, color: "text-green-400" },
    { title: "Total Orders", value: stats.totalOrders.toString(), icon: ShoppingCart, color: "text-blue-400" },
    { title: "Avg. Order Value", value: `$${stats.avgOrderValue.toFixed(2)}`, icon: TrendingUp, color: "text-primary" },
    { title: "Active Products", value: stats.totalProducts.toString(), icon: Package, color: "text-purple-400" },
  ];

  const tooltipStyle = {
    backgroundColor: "hsl(220, 35%, 12%)",
    border: "1px solid hsl(220, 20%, 20%)",
    borderRadius: "12px",
    color: "hsl(220, 20%, 90%)",
    fontSize: 12,
  };

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((stat, i) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
          >
            <Card className="bg-gradient-card border-border">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-xs uppercase tracking-wider">{stat.title}</p>
                    <p className="text-2xl font-serif font-bold text-foreground mt-1">{stat.value}</p>
                  </div>
                  <div className="bg-secondary/50 rounded-xl p-3">
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Order Trends */}
        <Card className="lg:col-span-2 bg-gradient-card border-border">
          <CardHeader>
            <CardTitle className="font-serif text-lg flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Order Trends (30 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#C9A961" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#C9A961" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 20%, 20%)" />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: "hsl(220, 15%, 55%)" }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
                  <YAxis tick={{ fontSize: 10, fill: "hsl(220, 15%, 55%)" }} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Area type="monotone" dataKey="orders" stroke="#C9A961" strokeWidth={2} fill="url(#trendGrad)" dot={false} name="Orders" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Orders by Status */}
        <Card className="bg-gradient-card border-border">
          <CardHeader>
            <CardTitle className="font-serif text-lg flex items-center gap-2">
              <PieChartIcon className="h-5 w-5 text-primary" />
              Orders by Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                    stroke="none"
                  >
                    {statusData.map((entry) => (
                      <Cell key={entry.name} fill={STATUS_COLORS[entry.name] || "#666"} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap gap-3 justify-center">
              {statusData.map((s) => (
                <div key={s.name} className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: STATUS_COLORS[s.name] || "#666" }} />
                  <span className="capitalize text-xs text-muted-foreground">{s.name} ({s.value})</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <Card className="bg-gradient-card border-border">
          <CardHeader>
            <CardTitle className="font-serif text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Top Products by Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topProducts} layout="vertical" margin={{ top: 0, right: 5, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 20%, 20%)" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 10, fill: "hsl(220, 15%, 55%)" }} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: "hsl(220, 15%, 55%)" }} tickLine={false} axisLine={false} width={100} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`$${v.toFixed(2)}`, "Revenue"]} />
                  <Bar dataKey="revenue" radius={[0, 6, 6, 0]}>
                    {topProducts.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Revenue by Category */}
        <Card className="bg-gradient-card border-border">
          <CardHeader>
            <CardTitle className="font-serif text-lg flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Revenue by Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryRevenue} margin={{ top: 0, right: 5, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 20%, 20%)" />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: "hsl(220, 15%, 55%)" }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "hsl(220, 15%, 55%)" }} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`$${v.toFixed(2)}`, "Revenue"]} />
                  <Bar dataKey="revenue" radius={[6, 6, 0, 0]}>
                    {categoryRevenue.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminAnalytics;
