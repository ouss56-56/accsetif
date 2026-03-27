import { Outlet, Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Bell,
  Search,
  Activity,
  BarChart3,
  Tags,
  ExternalLink,
  ChevronRight as ChevronRightIcon,
  Archive,
  Ticket,
  Star as StarIcon,
  MessageSquare,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

const adminLinks = [
  { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
  { name: "Analytics", path: "/admin/analytics", icon: BarChart3 },
  { name: "Orders", path: "/admin/orders", icon: ShoppingCart },
  { name: "Products", path: "/admin/products", icon: Package },
  { name: "Inventory", path: "/admin/inventory", icon: Archive },
  { name: "Categories", path: "/admin/categories", icon: Tags },
  { name: "Discounts", path: "/admin/discounts", icon: Ticket },
  { name: "Customers", path: "/admin/customers", icon: Users },
  { name: "Reviews", path: "/admin/reviews", icon: StarIcon },
  { name: "Support", path: "/admin/support", icon: MessageSquare },
  { name: "Activity", path: "/admin/activity", icon: Activity },
  { name: "Settings", path: "/admin/settings", icon: Settings },
];

const Breadcrumbs = ({ path }: { path: string }) => {
  const parts = path.split("/").filter(Boolean);
  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      <Link to="/admin" className="hover:text-primary transition-colors">Admin</Link>
      {parts.length > 1 && parts.slice(1).map((part, i) => (
        <div key={part} className="flex items-center gap-2">
          <ChevronRightIcon className="h-3 w-3" />
          <span className="capitalize">{part.replace("-", " ")}</span>
        </div>
      ))}
    </div>
  );
};

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path: string) => {
    if (path === "/admin") return location.pathname === "/admin";
    return location.pathname.startsWith(path);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/admin/login");
  };

  return (
    <TooltipProvider delayDuration={0}>
      <div className="min-h-screen bg-background flex">
        {/* Sidebar overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed lg:sticky top-0 left-0 z-50 lg:z-auto h-screen bg-card border-r border-border flex flex-col transition-all duration-300 ease-in-out ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          } ${collapsed ? "w-20" : "w-64"}`}
        >
          {/* Logo */}
          <div className={`p-6 border-b border-border flex items-center ${collapsed ? "justify-center" : "justify-between"}`}>
            {!collapsed && (
              <Link to="/admin" className="text-gradient-gold font-serif text-xl font-bold whitespace-nowrap">
                Boutique Admin
              </Link>
            )}
            {collapsed && (
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-serif font-bold">
                B
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-muted-foreground"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Nav */}
          <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
            {adminLinks.map((link) => {
              const active = isActive(link.path);
              const content = (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative ${
                    active
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  } ${collapsed ? "justify-center" : ""}`}
                >
                  <link.icon className={`h-5 w-5 flex-shrink-0 ${active ? "text-primary-foreground" : "text-primary/60 group-hover:text-primary transition-colors"}`} />
                  {!collapsed && <span>{link.name}</span>}
                  {active && collapsed && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary-foreground rounded-r-full" />
                  )}
                </Link>
              );

              if (collapsed) {
                return (
                  <Tooltip key={link.path}>
                    <TooltipTrigger asChild>{content}</TooltipTrigger>
                    <TooltipContent side="right" className="bg-card border-border border shadow-xl">
                      {link.name}
                    </TooltipContent>
                  </Tooltip>
                );
              }
              return content;
            })}
          </nav>

          {/* Sidebar Toggle (Desktop) */}
          <div className="hidden lg:flex p-4 border-t border-border justify-center">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full border border-border bg-secondary/30 hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              onClick={() => setCollapsed(!collapsed)}
            >
              {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
          </div>

          {/* Footer */}
          <div className={`p-4 border-t border-border space-y-2 ${collapsed ? "items-center" : ""}`}>
            {!collapsed && (
              <Link to="/" className="block">
                <Button variant="outline" size="sm" className="w-full justify-start gap-2 text-muted-foreground hover:border-primary/50">
                  <ExternalLink className="h-3.5 w-3.5" />
                  View Store
                </Button>
              </Link>
            )}
            {collapsed && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link to="/" className="flex justify-center">
                    <Button variant="outline" size="icon" className="h-8 w-8">
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">View Store</TooltipContent>
              </Tooltip>
            )}
            
            <Button 
              variant="ghost" 
              size={collapsed ? "icon" : "sm"} 
              className={`w-full justify-start gap-2 text-muted-foreground hover:text-destructive ${collapsed ? "justify-center" : ""}`}
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4 text-destructive/70" />
              {!collapsed && <span>Sign Out</span>}
            </Button>
          </div>
        </aside>

        {/* Main */}
        <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
          {/* Top bar */}
          <header className={`sticky top-0 z-30 transition-all duration-300 border-b border-border h-16 flex items-center px-4 md:px-8 ${
            scrolled ? "bg-card/80 backdrop-blur-xl shadow-lg" : "bg-card/90"
          }`}>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-muted-foreground mr-3"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            
            <div className="flex-1 flex items-center justify-between">
              <div>
                <Breadcrumbs path={location.pathname} />
                <h2 className="font-serif text-lg font-semibold text-foreground mt-0.5">
                  {adminLinks.find((l) => isActive(l.path))?.name || "Admin"}
                </h2>
              </div>

              <div className="flex items-center gap-2 md:gap-4">
                {/* Notification Bell */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-primary">
                      <Bell className="h-5 w-5" />
                      <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center bg-destructive text-[10px] animate-pulse">
                        3
                      </Badge>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-80 bg-card border-border shadow-2xl p-0">
                    <DropdownMenuLabel className="p-4 bg-secondary/30 flex items-center justify-between">
                      Notifications
                      <Badge variant="outline" className="text-[10px]">3 New</Badge>
                    </DropdownMenuLabel>
                    <div className="max-h-[300px] overflow-y-auto">
                      {[
                        { title: "New Order #3421", time: "2m ago", desc: "Fares placed a new order of $250.00", icon: ShoppingCart, color: "text-blue-400" },
                        { title: "Low Stock Alert", time: "1h ago", desc: "Golden Watch is below 5 units", icon: Package, color: "text-amber-400" },
                        { title: "New Customer", time: "5h ago", desc: "Sarah joined the platform", icon: Users, color: "text-green-400" },
                      ].map((n, i) => (
                        <div key={i} className="p-4 border-b border-border/50 hover:bg-secondary/20 cursor-pointer transition-colors">
                          <div className="flex gap-3">
                            <div className={`mt-1 h-8 w-8 rounded-lg flex items-center justify-center bg-secondary/50 ${n.color}`}>
                              <n.icon className="h-4 w-4" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-semibold">{n.title}</p>
                                <span className="text-[10px] text-muted-foreground">{n.time}</span>
                              </div>
                              <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{n.desc}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-3 text-center border-t border-border">
                      <Button variant="ghost" size="sm" className="w-full text-xs text-primary">View All Notifications</Button>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Profile */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="hidden sm:flex items-center gap-2 px-2 hover:bg-secondary/50 rounded-full">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-amber-600 flex items-center justify-center text-primary-foreground font-serif font-bold text-xs">
                        {user?.email?.[0].toUpperCase() || "A"}
                      </div>
                      <span className="text-sm font-medium mr-1">{user?.email?.split('@')[0] || "Admin"}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-card border-border shadow-2xl">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-border" />
                    <DropdownMenuItem className="cursor-pointer">Profile Settings</DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">Security</DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-border" />
                    <DropdownMenuItem onClick={handleSignOut} className="text-destructive cursor-pointer">
                      Log Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>

          {/* Content */}
          <main className="flex-1 p-4 md:p-8 overflow-y-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default AdminLayout;
