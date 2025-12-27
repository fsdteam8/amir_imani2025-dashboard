import { useMutation, useQueryClient } from "@tanstack/react-query";
import { productService } from "../api/product-service";
import { queryKeys } from "../query-keys";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { CreateProductInput } from "../types/product";

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<CreateProductInput>;
    }) => productService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
      toast.success("Product updated successfully");
      router.push("/products");
    },
    onError: (error) => {
      console.error("Update product error:", error);
      toast.error("Failed to update product");
    },
  });
};
