import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Trash2, Plus, Minus, MessageCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useCreateOrder } from "@/hooks/useOrders";
import { toast } from "sonner";

const WHATSAPP_NUMBER = "15551234567";

const CartDrawer = () => {
  const { items, isOpen, setIsOpen, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice } = useCart();
  const createOrder = useCreateOrder();

  const handleConfirmOrder = async () => {
    if (items.length === 0) return;

    try {
      const itemsText = items
        .map((i) => `- ${i.product.name} x${i.quantity} ($${(i.product.price * i.quantity).toFixed(2)})`)
        .join("\n");
      const message = `Hi! I'd like to order:\n${itemsText}\n\nTotal: $${totalPrice.toFixed(2)}`;
      const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

      await createOrder.mutateAsync({
        customer_name: "Store Customer",
        customer_phone: WHATSAPP_NUMBER,
        total_amount: totalPrice,
        status: "new",
        items: items.map((i) => ({
          product_id: i.product.id,
          quantity: i.quantity,
          unit_price: i.product.price,
        })),
      });

      clearCart();
      setIsOpen(false);
      window.open(whatsappUrl, "_blank");
      toast.success("Order placed! Redirecting to WhatsApp...");
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-background border-l border-border shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center gap-3">
                <ShoppingBag className="h-5 w-5 text-primary" />
                <h2 className="font-serif text-xl font-bold text-foreground">
                  Your Cart
                  {totalItems > 0 && (
                    <span className="ml-2 text-sm font-normal text-muted-foreground">
                      ({totalItems} {totalItems === 1 ? "item" : "items"})
                    </span>
                  )}
                </h2>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <AnimatePresence>
                {items.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center h-full gap-4 text-muted-foreground"
                  >
                    <ShoppingBag className="h-14 w-14 opacity-30" />
                    <p className="text-lg font-medium">Your cart is empty</p>
                    <p className="text-sm text-center">Browse our collection and add something beautiful</p>
                    <Button
                      variant="outline"
                      className="rounded-full mt-2"
                      onClick={() => setIsOpen(false)}
                    >
                      Continue Shopping
                    </Button>
                  </motion.div>
                ) : (
                  items.map((item) => (
                    <motion.div
                      key={item.product.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 50 }}
                      transition={{ duration: 0.2 }}
                      className="flex gap-4 bg-card rounded-xl p-4 border border-border"
                    >
                      <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border border-border">
                        <img
                          src={item.product.image_url}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-primary tracking-wider uppercase mb-1">
                          {item.product.categories?.name}
                        </p>
                        <h3 className="font-semibold text-foreground text-sm leading-tight line-clamp-2">
                          {item.product.name}
                        </h3>
                        <p className="text-primary font-bold mt-1">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </p>

                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-1 bg-secondary/50 rounded-full p-1">
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-background transition-colors"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-background transition-colors"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-muted-foreground hover:text-destructive transition-colors p-1"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-border p-6 space-y-4 bg-card/50 backdrop-blur-sm">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Subtotal ({totalItems} items)</span>
                  <span className="text-foreground font-medium">${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between font-bold text-lg">
                  <span className="text-foreground">Total</span>
                  <span className="text-primary">${totalPrice.toFixed(2)}</span>
                </div>
                <Button
                  className="w-full bg-[#25D366] hover:bg-[#20BD5A] text-white rounded-full gap-2 h-12 text-base font-semibold shadow-lg shadow-green-500/20"
                  onClick={handleConfirmOrder}
                  disabled={createOrder.isPending}
                >
                  {createOrder.isPending ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <MessageCircle className="h-5 w-5" />
                  )}
                  Confirm Order via WhatsApp
                </Button>
                <button
                  onClick={clearCart}
                  className="w-full text-center text-xs text-muted-foreground hover:text-destructive transition-colors"
                >
                  Clear cart
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
