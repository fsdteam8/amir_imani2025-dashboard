"use client";

import { Button } from "@/components/ui/button";
import { LogOut, Menu, QrCode, Store, BookOpen } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Drawer } from "vaul";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface MobileSidebarProps {
  onLogout?: () => void;
}

export function MobileSidebar({ onLogout }: MobileSidebarProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <Drawer.Root open={open} onOpenChange={setOpen} direction="left">
      <Drawer.Trigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
        </Button>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 z-50" />
        <Drawer.Content className="h-full w-[300px] bg-[#e0e0e0] text-white flex flex-col border-r border-[#D4A13D]/20 fixed left-0 top-0 bottom-0 z-50 focus:outline-none">
          {/* Logo section with brand logo */}
          <div className="p-6 flex items-center justify-center gap-3 border-b border-[#D4A13D]/20 w-full">
            <Image
              src="/assets/amir_imani-logo.svg"
              alt="Ultra Prestigious Winner Logo"
              width={158}
              height={100}
              className="w-[158px] h-[100px]"
            />
          </div>

          <nav className="flex-1 px-3 py-6 space-y-2">
            {/* QR Codes */}
            <Link
              href="/"
              className={cn(
                "px-3 py-2 rounded-sm flex items-center justify-between cursor-pointer transition-colors",
                pathname === "/"
                  ? "bg-foreground backdrop-blur-sm text-white"
                  : "text-foreground hover:bg-white/10"
              )}
              onClick={() => setOpen(false)}
            >
              <div className="flex items-center gap-2">
                <QrCode className="w-5 h-5" aria-hidden="true" />
                <p className="text-sm font-medium font-heading">QR Codes</p>
              </div>
              {pathname === "/" && (
                <Image
                  src="/assets/sidebar-sparkle.svg"
                  alt=""
                  width={24}
                  height={24}
                  className="w-6 h-6"
                  aria-hidden="true"
                />
              )}
            </Link>

            {/* Products */}
            <Link
              href="/products"
              className={cn(
                "px-3 py-2 rounded-sm flex items-center justify-between cursor-pointer transition-colors",
                pathname.startsWith("/products")
                  ? "bg-foreground backdrop-blur-sm text-white"
                  : "text-foreground hover:bg-white/10"
              )}
              onClick={() => setOpen(false)}
            >
              <div className="flex items-center gap-2">
                <Store className="w-5 h-5" aria-hidden="true" />
                <p className="text-sm font-medium font-heading">Products</p>
              </div>
              {pathname.startsWith("/products") && (
                <Image
                  src="/assets/sidebar-sparkle.svg"
                  alt=""
                  width={24}
                  height={24}
                  className="w-6 h-6"
                  aria-hidden="true"
                />
              )}
            </Link>

            {/* Blogs */}
            <Link
              href="/blogs"
              className={cn(
                "px-3 py-2 rounded-sm flex items-center justify-between cursor-pointer transition-colors",
                pathname.startsWith("/blogs")
                  ? "bg-foreground backdrop-blur-sm text-white"
                  : "text-foreground hover:bg-white/10"
              )}
              onClick={() => setOpen(false)}
            >
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" aria-hidden="true" />
                <p className="text-sm font-medium font-heading">Blogs</p>
              </div>
              {pathname.startsWith("/blogs") && (
                <Image
                  src="/assets/sidebar-sparkle.svg"
                  alt=""
                  width={24}
                  height={24}
                  className="w-6 h-6"
                  aria-hidden="true"
                />
              )}
            </Link>
          </nav>

          <div className="p-6 border-t border-[#D4A13D]/20">
            <Button
              variant="outline"
              size="sm"
              className="w-full text-red-500 border-foreground border-none hover:bg-red-100 hover:text-red-600 cursor-pointer"
              onClick={() => {
                setOpen(false);
                onLogout?.();
              }}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Log Out
            </Button>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
