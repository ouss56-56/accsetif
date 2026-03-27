import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useAdminCategories = () => {
  const queryClient = useQueryClient();

  const addCategory = useMutation({
    mutationFn: async (newCategory: { name: string; description?: string }) => {
      const { data, error } = await supabase.from("categories").insert([newCategory]).select();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Category added successfully");
    },
    onError: (error) => {
      toast.error(`Error adding category: ${error.message}`);
    },
  });

  const updateCategory = useMutation({
    mutationFn: async (category: { id: string; name: string; description?: string }) => {
      const { data, error } = await supabase
        .from("categories")
        .update({ name: category.name, description: category.description })
        .eq("id", category.id)
        .select();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Category updated successfully");
    },
    onError: (error) => {
      toast.error(`Error updating category: ${error.message}`);
    },
  });

  const deleteCategory = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("categories").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Category deleted successfully");
    },
    onError: (error) => {
      toast.error(`Error deleting category: ${error.message}`);
    },
  });

  return { addCategory, updateCategory, deleteCategory };
};
