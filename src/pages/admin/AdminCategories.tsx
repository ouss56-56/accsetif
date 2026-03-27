import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit2, Trash2, FolderOpen, Save, X, Package } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCategories, useProducts } from "@/hooks/useProducts";
import { useAdminCategories } from "@/hooks/useAdminCategories";

const CATEGORY_COLORS = [
  "bg-blue-500/10 border-blue-500/30 text-blue-400",
  "bg-purple-500/10 border-purple-500/30 text-purple-400",
  "bg-green-500/10 border-green-500/30 text-green-400",
  "bg-amber-500/10 border-amber-500/30 text-amber-400",
  "bg-pink-500/10 border-pink-500/30 text-pink-400",
  "bg-cyan-500/10 border-cyan-500/30 text-cyan-400",
];

const AdminCategories = () => {
  const { data: categories, isLoading } = useCategories();
  const { data: products } = useProducts();
  const { addCategory, updateCategory, deleteCategory } = useAdminCategories();

  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [showAdd, setShowAdd] = useState(false);

  const getProductCount = (categoryId: string) => {
    return (products || []).filter((p) => p.category_id === categoryId).length;
  };

  const handleAdd = async () => {
    if (!newName.trim()) return;
    await addCategory.mutateAsync({ name: newName.trim() });
    setNewName("");
    setShowAdd(false);
  };

  const handleUpdate = async (id: string) => {
    if (!editName.trim()) return;
    await updateCategory.mutateAsync({ id, name: editName.trim() });
    setEditingId(null);
  };

  const handleDelete = async (id: string, name: string) => {
    const count = getProductCount(id);
    if (count > 0) {
      if (!window.confirm(`"${name}" has ${count} products. Deleting may orphan them. Continue?`)) return;
    } else {
      if (!window.confirm(`Delete category "${name}"?`)) return;
    }
    await deleteCategory.mutateAsync(id);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-serif font-bold text-foreground">Categories</h2>
          <p className="text-muted-foreground text-sm mt-1">Manage product categories</p>
        </div>
        <Button
          onClick={() => setShowAdd(!showAdd)}
          className="bg-primary text-primary-foreground gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Category
        </Button>
      </div>

      {/* Add Form */}
      <AnimatePresence>
        {showAdd && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <Card className="bg-gradient-card border-primary/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <FolderOpen className="h-5 w-5 text-primary flex-shrink-0" />
                  <Input
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="New category name..."
                    className="bg-secondary/30 border-border flex-1"
                    onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                    autoFocus
                  />
                  <Button size="sm" onClick={handleAdd} disabled={addCategory.isPending} className="bg-primary text-primary-foreground gap-1">
                    <Save className="h-3.5 w-3.5" />
                    Save
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setShowAdd(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Category List */}
      <div className="grid gap-3">
        {(categories || []).map((category, i) => {
          const colorClass = CATEGORY_COLORS[i % CATEGORY_COLORS.length];
          const count = getProductCount(category.id);
          const isEditing = editingId === category.id;

          return (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            >
              <Card className="bg-gradient-card border-border hover:border-primary/20 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl border flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                      <FolderOpen className="h-5 w-5" />
                    </div>

                    {isEditing ? (
                      <div className="flex-1 flex items-center gap-2">
                        <Input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="bg-secondary/30 border-border"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleUpdate(category.id);
                            if (e.key === "Escape") setEditingId(null);
                          }}
                          autoFocus
                        />
                        <Button size="sm" onClick={() => handleUpdate(category.id)} className="bg-primary text-primary-foreground gap-1">
                          <Save className="h-3.5 w-3.5" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <>
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground">{category.name}</h3>
                          <div className="flex items-center gap-1.5 text-muted-foreground text-sm mt-0.5">
                            <Package className="h-3 w-3" />
                            <span>{count} {count === 1 ? "product" : "products"}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setEditingId(category.id);
                              setEditName(category.name);
                            }}
                            className="text-muted-foreground hover:text-primary"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(category.id, category.name)}
                            className="text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {(!categories || categories.length === 0) && (
        <div className="text-center py-12 text-muted-foreground">
          <FolderOpen className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p>No categories yet. Add your first category above.</p>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;
