"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RichTextEditor } from "./rich-text-editor";
import { Loader2, UploadCloud, X } from "lucide-react";
import type { Blog, CreateBlogInput, UpdateBlogInput } from "@/lib/types/blog";

// Wrapper for both Create and Update inputs
// We only validate what we strictly need.
const blogFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  // img can be a File or a string (URL) or undefined/null
  img: z
    .union([z.instanceof(File), z.string(), z.null(), z.undefined()])
    .optional(),
});

type BlogFormValues = z.infer<typeof blogFormSchema>;

interface BlogFormProps {
  blog?: Blog | null;
  onSubmit: (data: any) => Promise<void>; // Relaxed type to handle internal transform
  isLoading: boolean;
  onCancel: () => void;
}

export function BlogForm({
  blog,
  onSubmit,
  isLoading,
  onCancel,
}: BlogFormProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const form = useForm<BlogFormValues>({
    resolver: zodResolver(blogFormSchema),
    defaultValues: {
      title: "",
      description: "",
      img: undefined,
    },
  });

  // Reset form when blog changes (for edit mode)
  useEffect(() => {
    if (blog) {
      form.reset({
        title: blog.title || "",
        description: blog.description || "",
        img: blog.img, // Store the URL as the initial value
      });
      setPreviewUrl(blog.img || null);
    } else {
      form.reset({
        title: "",
        description: "",
        img: undefined,
      });
      setPreviewUrl(null);
    }
  }, [blog, form]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("img", file, { shouldValidate: true });
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const clearImage = () => {
    form.setValue("img", undefined);
    setPreviewUrl(null);
  };

  const handleSubmit = async (values: BlogFormValues) => {
    // Pass values directly, service will handle FormData conversion if img is File
    await onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter blog title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="img"
              render={({ field: { value, onChange, ...field } }) => (
                <FormItem>
                  <FormLabel>Thumbnail Image</FormLabel>
                  <div className="border-2 border-dashed border-input rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-muted/50 transition-colors relative">
                    {previewUrl ? (
                      <div className="relative w-full aspect-video mb-2">
                        <Image
                          src={previewUrl}
                          alt="Thumbnail preview"
                          fill
                          className="object-cover rounded-md"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2 bg-background/80 hover:bg-destructive/10 hover:text-destructive"
                          onClick={(e) => {
                            e.preventDefault();
                            clearImage();
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <label className="cursor-pointer w-full flex flex-col items-center">
                        <div className="h-10 w-10 bg-muted rounded-full flex items-center justify-center mb-2">
                          <UploadCloud className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <p className="text-sm font-medium">
                          Click to upload image
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          PNG, JPG (max 5MB)
                        </p>
                        <Input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageChange}
                          {...field}
                        />
                      </label>
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Right Column - Description takes full space or column */}
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    {/* Use RichTextEditor for description as originally requested, or standard textarea if strictly text. 
                            Given "HTML content" was mentioned in original prompt, we keep RichTextEditor, 
                            but label it Description. 
                        */}
                    <RichTextEditor
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Write your blog content here..."
                      className="min-h-[300px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {blog ? "Update Blog" : "Create Blog"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
