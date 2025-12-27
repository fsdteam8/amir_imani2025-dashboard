import { useMutation, useQueryClient } from "@tanstack/react-query";
import { blogService } from "@/lib/api/blog-service";
import { queryKeys } from "@/lib/query-keys";
import { toast } from "sonner";
import type { UpdateBlogInput } from "@/lib/types/blog";

export function useUpdateBlog() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (vars: { id: string; data: UpdateBlogInput }) =>
      blogService.update(vars.id, vars.data),
    onSuccess: (data) => {
      toast.success("Blog updated successfully!");
      // Invalidate list queries
      queryClient.invalidateQueries({
        queryKey: queryKeys.blogs.lists(),
      });
      // Invalidate specific blog detail
      queryClient.invalidateQueries({
        queryKey: queryKeys.blogs.detail(data._id),
      });
      if (data.slug) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.blogs.detail(data.slug),
        });
      }
    },
    onError: (error: any) => {
      console.error("Failed to update blog:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to update blog. Please try again."
      );
    },
  });

  return {
    update: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error,
  };
}
