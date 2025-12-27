"use client";

import { useProducts } from "@/lib/hooks/use-products";
import { useDeleteProduct } from "@/lib/hooks/use-delete-product";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { Loader2, Plus, Trash2, Edit } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { DeleteConfirmModal } from "@/components/qr-code/delete-confirm-modal";
import { MobileSidebar } from "@/components/qr-code/mobile-sidebar";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { HtmlContent } from "@/components/ui/html-content";

// Minimal Tabs implementation using Radix UI primitives since components/ui/tabs.tsx is missing
const Tabs = TabsPrimitive.Root;
const TabsList = TabsPrimitive.List;
const TabsTrigger = TabsPrimitive.Trigger;

export default function ProductsPage() {
  const router = useRouter();
  const { data: products, isLoading, isError } = useProducts();
  const { mutate: deleteProduct, isPending: isDeleting } = useDeleteProduct();
  const [activeTab, setActiveTab] = useState("card");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  const handleDeleteClick = (id: string) => {
    setProductToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (productToDelete) {
      deleteProduct(productToDelete, {
        onSuccess: () => {
          setIsDeleteModalOpen(false);
          setProductToDelete(null);
        },
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-full min-h-[50vh] text-red-500">
        Failed to load products.
      </div>
    );
  }

  // Filter products based on active tab
  const filteredProducts = products?.filter((product) => {
    const type = product.productType?.toLowerCase() || "card";
    if (activeTab === "card") return type === "card";
    if (activeTab === "merchandise")
      return type === "marchandice" || type === "merchandise";
    return true;
  });

  return (
    <Tabs
      defaultValue="card"
      onValueChange={setActiveTab}
      className="flex flex-col h-full"
    >
      <header className="bg-[#eeeeee] p-4 md:p-6">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
            {/* Mobile Sidebar Trigger */}
            <div className="md:hidden">
              <MobileSidebar
                onLogout={() => {
                  localStorage.removeItem("authToken");
                  signOut({ callbackUrl: "/login" });
                }}
              />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-xl md:text-3xl font-bold bg-[#F04D2A] bg-clip-text text-transparent font-heading truncate">
                Products
              </h1>
              <p className="text-muted-foreground text-xs md:text-sm hidden sm:block">
                Manage your product inventory
              </p>
            </div>
          </div>

          {/* Tab Filter in Header */}
          <TabsList className="hidden sm:flex p-1 bg-muted rounded-lg">
            <TabsTrigger
              value="card"
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-md transition-all",
                "data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
                "text-muted-foreground hover:text-foreground"
              )}
            >
              Cards
            </TabsTrigger>
            <TabsTrigger
              value="merchandise"
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-md transition-all",
                "data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
                "text-muted-foreground hover:text-foreground"
              )}
            >
              Merchandise
            </TabsTrigger>
          </TabsList>

          <Button
            onClick={() => router.push("/products/new")}
            className="bg-foreground text-[#eeeeee] hover:bg-foreground/80 hover:text-white border-none cursor-pointer duration-300 font-heading whitespace-nowrap text-sm md:text-base px-3 md:px-4"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>

        {/* Mobile Tab Filter */}
        <TabsList className="flex sm:hidden w-full p-1 bg-muted rounded-lg mt-4">
          <TabsTrigger
            value="card"
            className={cn(
              "flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all",
              "data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
              "text-muted-foreground hover:text-foreground"
            )}
          >
            Cards
          </TabsTrigger>
          <TabsTrigger
            value="merchandise"
            className={cn(
              "flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all",
              "data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
              "text-muted-foreground hover:text-foreground"
            )}
          >
            Merchandise
          </TabsTrigger>
        </TabsList>
      </header>

      <div className="flex-1 overflow-auto md:p-6 pt-4 p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pb-10">
          {filteredProducts?.length === 0 ? (
            <div className="col-span-full text-center py-10 text-muted-foreground">
              No products found in this category.
            </div>
          ) : (
            filteredProducts?.map((product) => {
              const displayImage =
                product.img ||
                (product.imgs && product.imgs.length > 0
                  ? product.imgs[0]
                  : null);

              return (
                <Card
                  key={product._id}
                  className="overflow-hidden flex flex-col"
                >
                  <div className="aspect-square relative bg-muted/50">
                    {displayImage ? (
                      <Image
                        src={displayImage}
                        alt={product.productName}
                        fill
                        className="object-cover transition-transform hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full text-muted-foreground">
                        No Image
                      </div>
                    )}
                    {product.quantity === 0 && (
                      <div className="absolute top-2 right-2 bg-destructive/90 text-destructive-foreground px-2 py-1 text-xs font-bold rounded">
                        Out of Stock
                      </div>
                    )}
                  </div>
                  <CardHeader className="p-4">
                    <CardTitle
                      className="text-lg truncate"
                      title={product.productName}
                    >
                      {product.productName}
                    </CardTitle>
                    <div className="flex justify-between items-center mt-1">
                      <span className="font-semibold text-lg">
                        ${product.price}
                      </span>
                      <span className="text-xs text-muted-foreground capitalize bg-secondary px-2 py-0.5 rounded-full">
                        {product.productType}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 grow">
                    <HtmlContent
                      html={
                        product.description ||
                        product.feature ||
                        "No description available"
                      }
                      asPlainText
                      className="text-sm text-muted-foreground line-clamp-2"
                    />
                  </CardContent>
                  <CardFooter className="p-4 border-t flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => router.push(`/products/${product._id}`)}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      className="shrink-0"
                      onClick={() => handleDeleteClick(product._id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </CardFooter>
                </Card>
              );
            })
          )}
        </div>

        <DeleteConfirmModal
          isOpen={isDeleteModalOpen}
          isLoading={isDeleting}
          onConfirm={confirmDelete}
          onCancel={() => setIsDeleteModalOpen(false)}
          title="Delete Product"
          description="Are you sure you want to delete this product? This action cannot be undone."
        />
      </div>
    </Tabs>
  );
}
