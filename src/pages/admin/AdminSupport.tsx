import React, { useState } from "react";
import { 
  MessageCircle, 
  Search, 
  Filter, 
  Plus, 
  Send, 
  User, 
  Clock, 
  CheckCircle2, 
  Circle, 
  AlertCircle,
  Paperclip,
  Smile,
  MoreHorizontal,
  Mail,
  Smartphone
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";

const AdminSupport = () => {
  const [selectedTicket, setSelectedTicket] = useState<number | null>(1);

  const tickets = [
    { id: 1, user: "Fares M.", subject: "Wholesale Inquiry", msg: "I'm looking for bulk prices for the new gold collection.", status: "Open", priority: "High", time: "2h ago", avatar: "FM" },
    { id: 2, user: "Sarah L.", subject: "Return Request", msg: "The item arrived with a small scratch on the surface.", status: "In Progress", priority: "Medium", time: "5h ago", avatar: "SL" },
    { id: 3, user: "Alex T.", subject: "Tracking ID", msg: "Can I get the tracking number for order #4521?", status: "Closed", priority: "Low", time: "1d ago", avatar: "AT" },
    { id: 4, user: "Marco K.", subject: "Partnership Option", msg: "We'd like to feature your products in our Dubai boutique.", status: "Open", priority: "High", time: "3d ago", avatar: "MK" },
  ];

  const currentTicket = tickets.find(t => t.id === selectedTicket);

  return (
    <div className="flex h-[calc(100vh-12rem)] gap-6 pb-6">
      {/* Sidebar: Ticket List */}
      <Card className="w-80 flex-shrink-0 bg-card border-border shadow-xl flex flex-col overflow-hidden">
        <CardHeader className="p-4 border-b border-border bg-secondary/10 shrink-0">
          <div className="flex items-center justify-between mb-4">
             <CardTitle className="text-lg font-serif">Messages</CardTitle>
             <Button variant="ghost" size="icon" className="h-8 w-8 text-primary">
                <Plus className="h-4 w-4" />
             </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search messages..." className="pl-9 bg-background h-10 text-xs border-border" />
          </div>
        </CardHeader>
        <div className="flex-1 overflow-y-auto space-y-1 p-2 custom-scrollbar">
          {tickets.map((t) => (
            <div
              key={t.id}
              onClick={() => setSelectedTicket(t.id)}
              className={`p-3 rounded-2xl cursor-pointer transition-all border ${
                selectedTicket === t.id 
                  ? "bg-primary/10 border-primary/30" 
                  : "bg-transparent border-transparent hover:bg-secondary/30"
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs ${
                  selectedTicket === t.id ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                }`}>
                  {t.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold truncate">{t.user}</p>
                    <span className="text-[10px] text-muted-foreground">{t.time}</span>
                  </div>
                  <p className="text-xs text-primary/80 font-medium truncate">{t.subject}</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-1">{t.msg}</p>
              <div className="flex items-center justify-between mt-2">
                 <Badge variant="outline" className={`text-[10px] px-2 py-0 h-4 border-none flex items-center gap-1 ${
                   t.priority === 'High' ? 'text-destructive' : t.priority === 'Medium' ? 'text-amber-400' : 'text-blue-400'
                 }`}>
                   <div className={`h-1.5 w-1.5 rounded-full ${
                     t.priority === 'High' ? 'bg-destructive' : t.priority === 'Medium' ? 'bg-amber-400' : 'bg-blue-400'
                   }`} />
                   {t.priority}
                 </Badge>
                 {t.status === 'Open' && <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Main: Active Conversation */}
      <Card className="flex-1 bg-card border-border shadow-2xl flex flex-col overflow-hidden relative">
        {!selectedTicket ? (
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground space-y-4">
             <MessageCircle className="h-16 w-16 opacity-10" />
             <p className="text-sm font-serif italic">Select a conversation to start messaging</p>
          </div>
        ) : (
          <>
            {/* Thread Header */}
            <CardHeader className="p-4 border-b border-border bg-secondary/5 shrink-0">
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                     <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary to-amber-600 flex items-center justify-center text-primary-foreground font-bold font-serif text-lg border border-primary/20">
                        {currentTicket?.avatar}
                     </div>
                     <div>
                        <h3 className="font-serif font-bold text-lg leading-tight">{currentTicket?.user}</h3>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                           <span className="flex items-center gap-1.5"><Mail className="h-3 w-3" /> fares@example.com</span>
                           <span className="flex items-center gap-1.5"><Smartphone className="h-3 w-3" /> Verified WhatsApp</span>
                        </div>
                     </div>
                  </div>
                  <div className="flex items-center gap-2">
                     <Button variant="outline" size="sm" className="hidden sm:flex border-border gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        Solve Ticket
                     </Button>
                     <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground">
                        <MoreHorizontal className="h-5 w-5" />
                     </Button>
                  </div>
               </div>
            </CardHeader>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-gradient-to-b from-transparent to-secondary/10 custom-scrollbar">
               {/* Client Message */}
               <div className="flex gap-4 max-w-2xl">
                  <div className="h-8 w-8 rounded-full bg-secondary flex-shrink-0 flex items-center justify-center text-[10px] font-bold">
                    {currentTicket?.avatar}
                  </div>
                  <div className="space-y-2">
                     <div className="bg-secondary/40 p-4 rounded-3xl rounded-tl-none border border-border/50 shadow-sm relative">
                        <p className="text-sm text-foreground leading-relaxed">{currentTicket?.msg}</p>
                        <span className="absolute -bottom-6 left-0 text-[10px] text-muted-foreground uppercase tracking-wider font-bold">{currentTicket?.time}</span>
                     </div>
                  </div>
               </div>

               {/* Admin Reply */}
               <div className="flex gap-4 max-w-2xl ml-auto flex-row-reverse">
                  <div className="h-8 w-8 rounded-full bg-primary flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-primary-foreground">
                    A
                  </div>
                  <div className="space-y-2 text-right">
                     <div className="bg-primary p-4 rounded-3xl rounded-tr-none shadow-lg shadow-primary/20 relative">
                        <p className="text-sm text-primary-foreground leading-relaxed">Hello {currentTicket?.user.split(' ')[0]}! Thank you for reaching out. Let me look that up for you right away. Our B2B pricing for the Gold collection is currently being updated but I can send you a preview sheet.</p>
                        <span className="absolute -bottom-6 right-0 text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Just Now</span>
                     </div>
                  </div>
               </div>
            </div>

            {/* Input Area */}
            <div className="p-4 bg-card border-t border-border shrink-0">
               <div className="relative bg-secondary/30 rounded-2xl p-2 border border-border group focus-within:border-primary/50 transition-all duration-300">
                  <textarea 
                    placeholder="Type your luxury response..." 
                    className="w-full h-24 bg-transparent border-none focus:ring-0 text-sm p-3 placeholder:italic placeholder:text-muted-foreground/60 resize-none outline-none"
                  />
                  <div className="flex items-center justify-between mt-2 px-2 pb-1">
                     <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary"><Paperclip className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary"><Smile className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary"><AlertCircle className="h-4 w-4" /></Button>
                     </div>
                     <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 h-9 rounded-xl gap-2 shadow-lg shadow-primary/20">
                        <span className="text-xs font-bold uppercase">Send Reply</span>
                        <Send className="h-4 w-4" />
                     </Button>
                  </div>
               </div>
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

export default AdminSupport;
