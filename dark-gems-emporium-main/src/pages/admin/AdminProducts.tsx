import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit, Trash2, Search, Eye, EyeOff } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useProducts, useCategories } from "@/hooks/useProducts";
import { useAdminProducts } from "@/hooks/useAdminProducts";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2, Image as ImageIcon } from "lucide-react";

const AdminProducts = () => {
  const { data: products, isLoading: prodLoading } = useProducts();
  const { data: categories } = useCategories();
  const { addProduct, updateProduct, deleteProduct, uploadImage } = useAdminProducts();

  const [search, setSearch] = useState("");
  const [editProduct, setEditProduct] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const filtered = (products || []).filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      await deleteProduct.mutateAsync(id);
    }
  };

  const handleToggleStock = async (product: any) => {
    await updateProduct.mutateAsync({
      id: product.id,
      stock: product.stock > 0 ? 0 : 10,
      status: product.stock > 0 ? "out_of_stock" : "active",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-card border-border"
          />
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground gap-2">
              <Plus className="h-4 w-4" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border max-w-lg">
            <DialogHeader>
              <DialogTitle className="font-serif">
                {editProduct ? "Edit Product" : "Add New Product"}
              </DialogTitle>
            </DialogHeader>
            <form
              className="space-y-4"
              onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const productData = {
                  name: formData.get("name") as string,
                  description: formData.get("description") as string,
                  price: parseFloat(formData.get("price") as string),
                  stock: parseInt(formData.get("stock") as string),
                  category_id: formData.get("category_id") as string,
                  image_url: editProduct?.image_url || "/placeholder.png",
                  status: (parseInt(formData.get("stock") as string) > 0 ? "active" : "out_of_stock") as any,
                  featured: editProduct?.featured || false,
                };

                if (editProduct) {
                  await updateProduct.mutateAsync({ ...productData, id: editProduct.id });
                } else {
                  await addProduct.mutateAsync(productData);
                }
                
                setIsDialogOpen(false);
                setEditProduct(null);
              }}
            >
              <div className="space-y-4">
                <div className="flex justify-center">
                  <div className="relative w-32 h-32 rounded-xl overflow-hidden border-2 border-dashed border-border hover:border-primary/50 transition-colors group">
                    {editProduct?.image_url ? (
                      <img src={editProduct.image_url} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                        <ImageIcon className="h-8 w-8 mb-2" />
                        <span className="text-xs text-center px-2">Click to upload</span>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setIsUploading(true);
                          try {
                            const url = await uploadImage(file);
                            setEditProduct({ ...(editProduct || {}), image_url: url });
                            toast.success("Image uploaded");
                          } catch (err) {
                            toast.error("Upload failed");
                          } finally {
                            setIsUploading(false);
                          }
                        }
                      }}
                    />
                    {isUploading && (
                      <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
                        <Loader2 className="h-6 w-6 animate-spin" />
                      </div>
                    )}
                  </div>
                </div>
                
                <Input name="name" placeholder="Product name" defaultValue={editProduct?.name} required className="bg-secondary/30 border-border" />
                <Textarea name="description" placeholder="Description" defaultValue={editProduct?.description} className="bg-secondary/30 border-border" />
                <div className="grid grid-cols-2 gap-3">
                  <Input name="price" placeholder="Price" type="number" step="0.01" defaultValue={editProduct?.price} required className="bg-secondary/30 border-border" />
                  <Input name="stock" placeholder="Stock quantity" type="number" defaultValue={editProduct?.stock ?? 10} required className="bg-secondary/30 border-border" />
                </div>
                <select name="category_id" defaultValue={editProduct?.category_id} className="w-full bg-secondary/30 border border-border rounded-md px-3 py-2 text-sm text-foreground">
                  {categories?.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <Button type="submit" className="w-full bg-primary text-primary-foreground" disabled={addProduct.isPending || updateProduct.isPending || isUploading}>
                {(addProduct.isPending || updateProduct.isPending) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editProduct ? "Update Product" : "Add Product"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Product list */}
      <div className="grid gap-3">
        {filtered.map((product, i) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
          >
            <Card className="bg-gradient-card border-border hover:border-primary/20 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-16 h-16 rounded-lg object-cover border border-border"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground truncate">{product.name}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-primary font-bold">${product.price.toFixed(2)}</span>
                      <span className="text-muted-foreground text-xs">{product.categories?.name}</span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          product.stock > 0
                            ? "bg-green-500/20 text-green-400"
                            : "bg-destructive/20 text-destructive"
                        }`}
                      >
                        {product.stock > 0 ? "In Stock" : "Out of Stock"}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleToggleStock(product)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      {product.stock > 0 ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setEditProduct(product);
                        setIsDialogOpen(true);
                      }}
                      className="text-muted-foreground hover:text-primary"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(product.id)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AdminProducts;
