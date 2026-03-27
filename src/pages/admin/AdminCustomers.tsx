import { motion, AnimatePresence } from "framer-motion";
import { Search, Mail, Phone, ChevronDown, ChevronUp, ShoppingBag, Calendar, DollarSign, TrendingUp } from "lucide-react";
import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { useCustomers } from "@/hooks/useCustomers";

const AdminCustomers = () => {
  const { data: customers, isLoading } = useCustomers();
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [sortBy, setBy] = useState<"name" | "spent">("name");

  const filtered = useMemo(() => {
    if (!customers) return [];
    return customers
      .filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.id.toLowerCase().includes(search.toLowerCase())
      )
      .sort((a, b) => {
        if (sortBy === "name") return a.name.localeCompare(b.name);
        const spentA = parseFloat(a.totalSpent.replace("$", ""));
        const spentB = parseFloat(b.totalSpent.replace("$", ""));
        return spentB - spentA;
      });
  }, [customers, search, sortBy]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search customers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-card border-border h-11"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={sortBy === "name" ? "default" : "outline"}
            size="sm"
            onClick={() => setBy("name")}
            className="rounded-full px-4"
          >
            Sort by Name
          </Button>
          <Button
            variant={sortBy === "spent" ? "default" : "outline"}
            size="sm"
            onClick={() => setBy("spent")}
            className="rounded-full px-4"
          >
            Sort by Spend
          </Button>
        </div>
      </div>

      {/* List */}
      <div className="grid gap-4">
        {filtered.map((customer, i) => (
          <motion.div
            key={customer.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
          >
            <Card className={`overflow-hidden border-border transition-all duration-300 ${expandedId === customer.id ? "bg-secondary/20 ring-1 ring-primary/20" : "bg-gradient-card hover:border-primary/20"}`}>
              <CardContent className="p-0">
                {/* Main Row */}
                <div 
                  className="p-4 flex items-center justify-between cursor-pointer"
                  onClick={() => setExpandedId(expandedId === customer.id ? null : customer.id)}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-serif font-bold text-lg border border-primary/20">
                      {customer.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground text-base">{customer.name}</h3>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-muted-foreground text-xs mt-1">
                        <span className="flex items-center gap-1">
                          <Phone className="h-3 w-3 text-primary/70" />
                          {customer.phone}
                        </span>
                        <span className="flex items-center gap-1">
                          <ShoppingBag className="h-3 w-3 text-primary/70" />
                          {customer.orders} orders
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right hidden sm:block">
                      <p className="text-primary font-bold text-lg">{customer.totalSpent}</p>
                      <p className="text-muted-foreground text-[10px] uppercase tracking-wider">Total Revenue</p>
                    </div>
                    {expandedId === customer.id ? <ChevronUp className="h-5 w-5 text-muted-foreground" /> : <ChevronDown className="h-5 w-5 text-muted-foreground" />}
                  </div>
                </div>

                {/* Expanded Section */}
                <AnimatePresence>
                  {expandedId === customer.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-border/50"
                    >
                      <div className="p-6 bg-secondary/10 grid md:grid-cols-3 gap-6">
                        {/* Stats Panel */}
                        <div className="space-y-4">
                          <h4 className="text-xs font-bold uppercase tracking-widest text-primary/70 mb-4">Customer Insight</h4>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-card/50 p-3 rounded-xl border border-border/50">
                              <DollarSign className="h-4 w-4 text-green-400 mb-2" />
                              <p className="text-xs text-muted-foreground">Avg. Spend</p>
                              <p className="font-bold text-sm">
                                ${(parseFloat(customer.totalSpent.replace("$", "")) / (customer.orders || 1)).toFixed(2)}
                              </p>
                            </div>
                            <div className="bg-card/50 p-3 rounded-xl border border-border/50">
                              <Calendar className="h-4 w-4 text-blue-400 mb-2" />
                              <p className="text-xs text-muted-foreground">Last Order</p>
                              <p className="font-bold text-sm">Recently</p>
                            </div>
                          </div>
                          <div className="bg-primary/5 p-4 rounded-xl border border-primary/10 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="bg-primary/20 p-2 rounded-lg text-primary">
                                <TrendingUp className="h-4 w-4" />
                              </div>
                              <span className="text-sm font-medium">VIP Tier</span>
                            </div>
                            <Badge variant="outline" className="bg-primary/20 border-primary/30 text-primary">Gold</Badge>
                          </div>
                        </div>

                        {/* Recent History (Mock representation within derived logic) */}
                        <div className="md:col-span-2">
                          <h4 className="text-xs font-bold uppercase tracking-widest text-primary/70 mb-4">Order History Summary</h4>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between p-3 rounded-lg hover:bg-card/50 transition-colors border border-transparent hover:border-border">
                              <div className="flex items-center gap-3">
                                <div className="text-xs font-mono text-muted-foreground">#ORD-001</div>
                                <span className="text-sm font-medium">Standard Purchase</span>
                              </div>
                              <div className="flex items-center gap-4">
                                <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">Delivered</span>
                                <span className="text-sm font-bold text-foreground">{customer.totalSpent}</span>
                              </div>
                            </div>
                            <p className="text-center text-[10px] text-muted-foreground mt-4 italic">Detailed history is available in the Orders section filtered by this customer.</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AdminCustomers;
