import React from "react";
import { 
  Package, 
  AlertTriangle, 
  TrendingDown, 
  ArrowUpRight, 
  RefreshCw, 
  Search,
  Filter,
  BarChart2,
  Calendar,
  Truck
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { useProducts } from "@/hooks/useProducts";

const AdminInventory = () => {
  const { data: products, isLoading } = useProducts();

  const inventoryStats = [
    { label: "Total Items", value: products?.length || 0, icon: Package, color: "text-blue-400" },
    { label: "Low Stock", value: products?.filter(p => p.stock < 10).length || 0, icon: AlertTriangle, color: "text-amber-400" },
    { label: "Out of Stock", value: products?.filter(p => p.stock === 0).length || 0, icon: TrendingDown, color: "text-destructive" },
    { label: "Arrivals", value: "12", icon: Truck, color: "text-green-400" },
  ];

  if (isLoading) return <div className="h-40 flex items-center justify-center">Loading Inventory...</div>;

  return (
    <div className="space-y-8 pb-10">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {inventoryStats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="bg-gradient-card border-border hover:border-primary/30 transition-all duration-300 overflow-hidden group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                    <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                  </div>
                  <div className={`p-3 rounded-2xl bg-secondary/50 ${stat.color} group-hover:scale-110 transition-transform`}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-1.5 text-[10px] text-muted-foreground">
                  <ArrowUpRight className="h-3 w-3 text-green-400" />
                  <span className="text-green-400 font-medium">+4%</span> vs last week
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Inventory Control */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Inventory List */}
        <Card className="lg:col-span-2 bg-card border-border shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
            <div>
              <CardTitle className="text-xl font-serif">Stock Control</CardTitle>
              <p className="text-xs text-muted-foreground mt-1">Monitor and restock your luxury inventory</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" className="h-9 w-9">
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground h-9 px-4 rounded-xl">
                Bulk Update
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search SKU or Product..." className="pl-10 bg-secondary/30 border-border" />
              </div>
              <Button variant="outline" className="gap-2 border-border">
                <Filter className="h-4 w-4" /> Filter
              </Button>
            </div>

            <div className="border border-border/50 rounded-2xl overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-secondary/20 text-muted-foreground uppercase text-[10px] font-bold tracking-widest">
                  <tr>
                    <th className="px-6 py-4">Product</th>
                    <th className="px-6 py-4 text-center">Current Stock</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {products?.slice(0, 6).map((p) => (
                    <tr key={p.id} className="hover:bg-secondary/10 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={p.image_url} alt={p.name} className="h-10 w-10 rounded-lg object-cover bg-secondary/50 border border-border" />
                          <div>
                            <p className="font-semibold">{p.name}</p>
                            <p className="text-[10px] text-muted-foreground font-mono">SKU-BR-{p.id.slice(0, 4)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1.5 items-center">
                          <span className={`font-mono font-bold ${p.stock < 10 ? 'text-amber-500' : 'text-foreground'}`}>
                            {p.stock} units
                          </span>
                          <Progress value={Math.min((p.stock / 50) * 100, 100)} className="h-1 w-20" />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="outline" className={
                          p.stock === 0 ? "bg-destructive/10 text-destructive border-destructive/20" :
                          p.stock < 10 ? "bg-amber-400/10 text-amber-400 border-amber-400/20" :
                          "bg-green-400/10 text-green-400 border-green-400/20"
                        }>
                          {p.stock === 0 ? "Out of Stock" : p.stock < 10 ? "Low Stock" : "In Stock"}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button variant="ghost" size="sm" className="text-primary hover:text-primary hover:bg-primary/10">Restock</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-center p-2">
              <Button variant="ghost" className="text-muted-foreground text-xs">View Full Inventory Report</Button>
            </div>
          </CardContent>
        </Card>

        {/* Inventory Analytics */}
        <div className="space-y-6">
          <Card className="bg-card border-border overflow-hidden">
            <CardHeader className="pb-3 text-sm font-semibold uppercase tracking-widest text-primary/70">Demand Forecast</CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <BarChart2 className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-bold">Projected Out-of-Stock</p>
                  <p className="text-xs text-muted-foreground">3 items likely out by Sunday</p>
                </div>
              </div>
              <Progress value={75} className="h-2" />
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-card to-secondary/30 border-border">
            <CardHeader className="pb-4">
              <CardTitle className="text-base">Recent Stock Inflows</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { name: "Silk Gold Bracelet", qty: "+50", time: "2h ago" },
                { name: "Vintage Watch", qty: "+10", time: "5h ago" },
                { name: "Silver Necklace", qty: "+35", time: "Yesterday" }
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
                      <ArrowUpRight className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold">{item.name}</p>
                      <p className="text-[10px] text-muted-foreground">{item.time}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-green-500">{item.qty}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-primary/5 border-primary/20 p-6 text-center">
            <Calendar className="h-8 w-8 text-primary mx-auto mb-3" />
            <h4 className="font-bold text-sm">Next Supplier Scheduled</h4>
            <p className="text-xs text-muted-foreground mt-1">Monday, Oct 12, 10:00 AM</p>
            <Button size="sm" className="mt-4 w-full bg-primary text-primary-foreground font-semibold">View Schedule</Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminInventory;
