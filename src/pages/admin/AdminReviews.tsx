import React, { useState } from "react";
import { 
  Star, 
  MessageSquare, 
  CheckCircle2, 
  XCircle, 
  Trash2, 
  User, 
  Filter, 
  Search,
  Check,
  MoreVertical,
  ThumbsUp,
  AlertCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

const AdminReviews = () => {
  const [activeTab, setActiveTab] = useState<"pending" | "approved" | "all">("pending");

  const reviews = [
    { id: 1, user: "Sarah J.", product: "Silk Gold Bracelet", rating: 5, comment: "Absolutely stunning piece, the quality is exceptional. B2B shipping was very fast.", status: "Pending", date: "2024-03-26" },
    { id: 2, user: "Michael R.", product: "Vintage Watch", rating: 4, comment: "Great watch but the box was slightly dented during transit. Product is 10/10.", status: "Pending", date: "2024-03-25" },
    { id: 3, user: "Elena P.", product: "Silver Necklace", rating: 5, comment: "Perfect for our retail showroom. Customers love the design.", status: "Approved", date: "2024-03-10" },
    { id: 4, user: "John D.", product: "Leather Wallet", rating: 2, comment: "The color didn't match the photo on the website. A bit disappointed.", status: "Flagged", date: "2024-03-15" },
  ];

  const handleAction = (action: string, id: number) => {
    toast.success(`Review ${id} ${action} erfolgreich!`);
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold">Review Moderation</h1>
          <p className="text-muted-foreground mt-1">Manage and approve client feedback</p>
        </div>
        <div className="flex bg-secondary/30 p-1 rounded-2xl border border-border">
          {["pending", "approved", "all"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-6 py-2 rounded-xl text-sm font-medium capitalize transition-all ${
                activeTab === tab 
                  ? "bg-primary text-primary-foreground shadow-md" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Review Grid */}
      <div className="grid gap-6">
        <AnimatePresence mode="popLayout">
          {reviews
            .filter(r => activeTab === "all" || r.status.toLowerCase() === activeTab)
            .map((review, i) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="bg-gradient-card border-border overflow-hidden group hover:border-primary/30 transition-all duration-300">
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row">
                      {/* Left: Review Content */}
                      <div className="flex-1 p-6 space-y-4 border-r border-border/50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center text-primary font-bold border border-border">
                              {review.user.charAt(0)}
                            </div>
                            <div>
                              <p className="font-bold text-sm tracking-tight">{review.user}</p>
                              <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                                <User className="h-3 w-3" /> Verified Buyer
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-0.5">
                            {[...Array(5)].map((_, starI) => (
                              <Star key={starI} className={`h-4 w-4 ${starI < review.rating ? "text-amber-500 fill-amber-500" : "text-secondary fill-secondary"}`} />
                            ))}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <p className="text-xs font-bold text-primary/80 uppercase tracking-widest">{review.product}</p>
                          <p className="text-sm leading-relaxed text-foreground italic">"{review.comment}"</p>
                        </div>

                        <div className="flex items-center gap-6 pt-2">
                          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                            <ThumbsUp className="h-3 w-3" /> Helpful (4)
                          </div>
                          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                            <MessageSquare className="h-3 w-3" /> No Replies
                          </div>
                          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                            <Check className="h-3 w-3 text-green-500" /> Auto-Verified
                          </div>
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="w-full md:w-56 p-6 md:p-8 bg-secondary/10 flex flex-col justify-center items-center gap-3">
                        <Badge className={`
                          ${review.status === "Approved" ? "bg-green-500/10 text-green-400 border-green-500/20" : 
                            review.status === "Pending" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" : 
                            "bg-destructive/10 text-destructive border-destructive/20"}
                        `}>
                          {review.status}
                        </Badge>
                        <p className="text-[10px] text-muted-foreground">{review.date}</p>
                        
                        <div className="flex flex-col gap-2 w-full mt-2">
                          {review.status === "Pending" && (
                            <Button onClick={() => handleAction("approved", review.id)} className="w-full bg-green-500 hover:bg-green-600 text-white h-9 rounded-xl gap-2 font-bold text-xs">
                              <CheckCircle2 className="h-4 w-4" /> Approve
                            </Button>
                          )}
                          <div className="flex gap-2">
                             <Button onClick={() => handleAction("rejected", review.id)} variant="outline" className="flex-1 border-border bg-card/50 h-9 rounded-xl hover:text-destructive">
                               <XCircle className="h-4 w-4" />
                             </Button>
                             <Button variant="outline" className="flex-1 border-border bg-card/50 h-9 rounded-xl">
                               <MessageSquare className="h-4 w-4" />
                             </Button>
                             <DropdownMenu>
                               <DropdownMenuTrigger asChild>
                                 <Button variant="outline" size="icon" className="h-9 w-9 border-border bg-card/50 rounded-xl">
                                   <MoreVertical className="h-4 w-4 text-muted-foreground" />
                                 </Button>
                               </DropdownMenuTrigger>
                               <DropdownMenuContent align="end" className="bg-card border-border">
                                 <DropdownMenuItem className="text-destructive gap-2 cursor-pointer">
                                   <Trash2 className="h-4 w-4" /> Delete Review
                                 </DropdownMenuItem>
                                 <DropdownMenuItem className="gap-2 cursor-pointer">
                                   <AlertCircle className="h-4 w-4" /> Flag for Fraud
                                 </DropdownMenuItem>
                               </DropdownMenuContent>
                             </DropdownMenu>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
        </AnimatePresence>
      </div>

      {/* Moderation Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Reviews", value: "842", sub: "+12.5%", color: "text-primary" },
          { label: "Avg. Rating", value: "4.8", sub: "Global", color: "text-amber-500" },
          { label: "Approval Rate", value: "98%", sub: "Admin", color: "text-green-500" },
          { label: "Review Rate", value: "14%", sub: "per Order", color: "text-blue-500" },
        ].map((stat, i) => (
          <Card key={i} className="bg-card border-border">
            <CardContent className="p-4 py-6 text-center">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">{stat.label}</p>
              <h4 className={`text-2xl font-serif font-bold ${stat.color}`}>{stat.value}</h4>
              <p className="text-[10px] text-muted-foreground mt-1">{stat.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminReviews;
