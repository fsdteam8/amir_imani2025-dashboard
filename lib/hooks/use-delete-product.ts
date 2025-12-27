import { useMutation, useQueryClient } from "@tanstack/react-query";
import { productService } from "../api/product-service";
import { queryKeys } from "../query-keys";
import { toast } from "sonner"; // Assuming sonner is used as seen in package.json

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productService.delete,
    onSuccess: () => {
      // Invalidate products list
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
      toast.success("Product deleted successfully");
    },
    onError: (error) => {
      console.error("Delete product error:", error);
      toast.error("Failed to delete product");
    },
  });
};
