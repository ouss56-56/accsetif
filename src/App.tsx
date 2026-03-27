import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import Products from "./pages/Products.tsx";
import ProductDetail from "./pages/ProductDetail.tsx";
import Contact from "./pages/Contact.tsx";
import Wishlist from "./pages/Wishlist.tsx";
import AdminLayout from "./components/admin/AdminLayout.tsx";
import AdminDashboard from "./pages/admin/AdminDashboard.tsx";
import AdminAnalytics from "./pages/admin/AdminAnalytics.tsx";
import AdminCategories from "./pages/admin/AdminCategories.tsx";
import AdminProducts from "./pages/admin/AdminProducts.tsx";
import AdminOrders from "./pages/admin/AdminOrders.tsx";
import AdminCustomers from "./pages/admin/AdminCustomers.tsx";
import AdminActivityLog from "./pages/admin/AdminActivityLog.tsx";
import AdminInventory from "./pages/admin/AdminInventory.tsx";
import AdminDiscounts from "./pages/admin/AdminDiscounts.tsx";
import AdminReviews from "./pages/admin/AdminReviews.tsx";
import AdminSupport from "./pages/admin/AdminSupport.tsx";
import AdminSettings from "./pages/admin/AdminSettings.tsx";
import NotFound from "./pages/NotFound.tsx";

import { AuthProvider } from "./hooks/useAuth.tsx";
import ProtectedRoute from "./components/admin/ProtectedRoute.tsx";
import Login from "./pages/admin/Login.tsx";
import { CartProvider } from "./context/CartContext.tsx";
import { WishlistProvider } from "./context/WishlistContext.tsx";
import { RecentlyViewedProvider } from "./context/RecentlyViewedContext.tsx";
import CartDrawer from "./components/storefront/CartDrawer.tsx";
import ScrollToTop from "./components/storefront/ScrollToTop.tsx";
import MobileBottomNav from "./components/storefront/MobileBottomNav.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <RecentlyViewedProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <CartDrawer />
                <ScrollToTop />
                <MobileBottomNav />
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/wishlist" element={<Wishlist />} />
                  <Route path="/contact" element={<Contact />} />

                  {/* Admin Auth */}
                  <Route path="/admin/login" element={<Login />} />

                  {/* Admin Panel (Protected) */}
                  <Route element={<ProtectedRoute adminOnly />}>
                    <Route path="/admin" element={<AdminLayout />}>
                      <Route index element={<AdminDashboard />} />
                      <Route path="analytics" element={<AdminAnalytics />} />
                      <Route path="products" element={<AdminProducts />} />
                      <Route path="inventory" element={<AdminInventory />} />
                      <Route path="categories" element={<AdminCategories />} />
                      <Route path="discounts" element={<AdminDiscounts />} />
                      <Route path="orders" element={<AdminOrders />} />
                      <Route path="customers" element={<AdminCustomers />} />
                      <Route path="reviews" element={<AdminReviews />} />
                      <Route path="support" element={<AdminSupport />} />
                      <Route path="activity" element={<AdminActivityLog />} />
                      <Route path="settings" element={<AdminSettings />} />
                    </Route>
                  </Route>

                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </RecentlyViewedProvider>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
