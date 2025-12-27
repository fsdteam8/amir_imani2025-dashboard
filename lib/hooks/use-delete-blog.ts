import { useMutation, useQueryClient } from "@tanstack/react-query";
import { blogService } from "@/lib/api/blog-service";
import { queryKeys } from "@/lib/query-keys";
import { toast } from "sonner";

export function useDeleteBlog() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: string) => blogService.delete(id),
    onSuccess: () => {
      toast.success("Blog deleted successfully!");
      // Invalidate list queries
      queryClient.invalidateQueries({
        queryKey: queryKeys.blogs.lists(),
      });
    },
    onError: (error: any) => {
      console.error("Failed to delete blog:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to delete blog. Please try again."
      );
    },
  });

  return {
    delete: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error,
  };
}
