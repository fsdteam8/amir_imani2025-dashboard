import { useMutation, useQueryClient } from "@tanstack/react-query";
import { productService } from "../api/product-service";
import { queryKeys } from "../query-keys";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: productService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
      toast.success("Product created successfully");
      router.push("/products");
    },
    onError: (error) => {
      console.error("Create product error:", error);
      toast.error("Failed to create product");
    },
  });
};
