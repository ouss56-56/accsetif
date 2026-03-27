import React from "react";
import { 
  Ticket, 
  Plus, 
  Trash2, 
  Copy, 
  CheckCircle2, 
  Clock, 
  Tag, 
  Percent, 
  DollarSign,
  TrendingUp,
  Search
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { toast } from "sonner";

const AdminDiscounts = () => {
  const coupons = [
    { id: 1, code: "WELCOME10", type: "Percentage", value: "10%", usage: "245/500", status: "Active", expiry: "2024-12-31" },
    { id: 2, code: "LUXURY50", type: "Fixed", value: "$50.00", usage: "12/50", status: "Active", expiry: "2024-11-15" },
    { id: 3, code: "SUMMER_SALE", type: "Percentage", value: "25%", usage: "0/1000", status: "Scheduled", expiry: "2024-10-30" },
    { id: 4, code: "EXPIRED_B2B", type: "Fixed", value: "$100.00", usage: "100/100", status: "Expired", expiry: "2024-09-01" },
  ];

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success("Code copied to clipboard!");
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Header & New Button */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Discounts & Coupons</h1>
          <p className="text-muted-foreground mt-1">Manage your promotional campaigns and B2B incentives</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 h-11 px-6 rounded-2xl shadow-lg shadow-primary/20">
          <Plus className="h-5 w-5" />
          Create Coupon
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-card border-border">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Active Campaigns</p>
              <h3 className="text-2xl font-bold">12</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-card border-border">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-green-400/10 flex items-center justify-center text-green-400">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Total Redeemed</p>
              <h3 className="text-2xl font-bold">1.4k</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-card border-border">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-blue-400/10 flex items-center justify-center text-blue-400">
              <DollarSign className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Revenue Saved</p>
              <h3 className="text-2xl font-bold">$12,450</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Coupon List */}
      <Card className="bg-card border-border shadow-xl overflow-hidden">
        <CardHeader className="border-b border-border p-6 bg-secondary/10">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center text-center sm:text-left">
            <CardTitle className="text-xl font-serif">Promo Campaigns</CardTitle>
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search codes..." className="pl-10 bg-background border-border" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border bg-secondary/5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  <th className="px-6 py-4">Coupon Info</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4 text-center">Usage</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Expires</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {coupons.map((c, i) => (
                  <motion.tr 
                    key={c.id} 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="hover:bg-secondary/20 transition-colors group"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-311">
                          <Ticket className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                             <p className="font-mono font-bold text-base tracking-tight">{c.code}</p>
                             <button onClick={() => copyToClipboard(c.code)} className="opacity-0 group-hover:opacity-100 transition-opacity">
                               <Copy className="h-3 w-3 text-muted-foreground hover:text-primary" />
                             </button>
                          </div>
                          <p className="text-[10px] text-muted-foreground">General Promotion</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        {c.type === "Percentage" ? <Percent className="h-3.5 w-3.5 text-blue-400" /> : <DollarSign className="h-3.5 w-3.5 text-green-400" />}
                        <span className="text-sm font-medium">{c.value}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <div className="space-y-1">
                        <p className="text-xs font-semibold">{c.usage}</p>
                        <div className="w-20 h-1 bg-secondary rounded-full overflow-hidden mx-auto">
                           <div 
                             className="h-full bg-primary" 
                             style={{ width: `${(parseInt(c.usage.split('/')[0]) / parseInt(c.usage.split('/')[1])) * 100}%` }} 
                           />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <Badge variant="outline" className={`
                        ${c.status === 'Active' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 
                          c.status === 'Scheduled' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 
                          'bg-destructive/10 text-destructive border-destructive/20'}
                      `}>
                        {c.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" />
                        <span className="text-xs">{c.expiry}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                       <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-secondary rounded-lg">
                            <Plus className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10 rounded-lg">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                       </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-8">
        <Card className="bg-secondary/10 border-dashed border-2 border-border p-6 flex flex-col items-center justify-center text-center group hover:bg-secondary/20 transition-all">
          <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
             <Tag className="h-7 w-7" />
          </div>
          <h3 className="font-serif text-lg font-bold">Seasonal Discount Rules</h3>
          <p className="text-xs text-muted-foreground max-w-xs mt-2">Set up automatic price reductions for specific dates or holiday events across the entire catalog.</p>
          <Button variant="link" className="text-primary mt-2">Configure Rules</Button>
        </Card>
        <Card className="bg-secondary/10 border-dashed border-2 border-border p-6 flex flex-col items-center justify-center text-center group hover:bg-secondary/20 transition-all">
          <div className="h-14 w-14 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 mb-4 group-hover:scale-110 transition-transform">
             <TrendingUp className="h-7 w-7" />
          </div>
          <h3 className="font-serif text-lg font-bold">VIP Tier Discounts</h3>
          <p className="text-xs text-muted-foreground max-w-xs mt-2">Automatically apply discounts based on the customer's lifetime value and VIP ranking.</p>
          <Button variant="link" className="text-primary mt-2">Manage Tiers</Button>
        </Card>
      </div>
    </div>
  );
};

export default AdminDiscounts;
