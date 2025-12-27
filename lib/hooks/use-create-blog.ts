import { useMutation, useQueryClient } from "@tanstack/react-query";
import { blogService } from "@/lib/api/blog-service";
import { queryKeys } from "@/lib/query-keys";
import { toast } from "sonner";
import type { CreateBlogInput } from "@/lib/types/blog";

export function useCreateBlog() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: CreateBlogInput) => blogService.create(data),
    onSuccess: () => {
      toast.success("Blog created successfully!");
      // Invalidate list queries
      queryClient.invalidateQueries({
        queryKey: queryKeys.blogs.lists(),
      });
    },
    onError: (error: any) => {
      console.error("Failed to create blog:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to create blog. Please try again."
      );
    },
  });

  return {
    create: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error,
  };
}
