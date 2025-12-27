import { Button } from "@/components/ui/button";
import { LogOut, BookOpen } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface SidebarProps {
  onLogout?: () => void;
}

export function Sidebar({ onLogout }: SidebarProps) {
  const pathname = usePathname();
  return (
    <aside className="hidden md:flex w-[312px] bg-[#f2e3c6] text-white flex-col h-screen">
      {/* Logo section with brand logo */}
      <div className="p-6 flex items-center justify-center gap-3 border-b border-[#D4A13D]/20 w-full">
        <Image
          src="/assets/amir_imani-logo.svg"
          alt="Ultra Prestigious Winner Logo"
          width={158}
          height={100}
          className="w-[278px] h-[115px]"
        />
        {/* <span className="font-semibold text-sm">QR Codes</span> */}
      </div>

      <nav className="flex-1 px-6 py-6 space-y-2">
        <Link
          href="/"
          className={cn(
            "px-3 py-2 rounded-sm flex items-center justify-between cursor-pointer transition-colors",
            pathname === "/"
              ? "bg-foreground backdrop-blur-sm text-white"
              : "text-black  hover:bg-white/10"
          )}
        >
          <div className="flex items-center gap-2">
            <Image
              src="/assets/qrcode-icon.svg"
              alt="QR Code Icon"
              width={24}
              height={24}
              className="w-5 h-5"
            />
            <p className="text-base font-medium font-heading">QR Codes</p>
          </div>
          {pathname === "/" && (
            <Image
              src="/assets/sidebar-sparkle.svg"
              alt="Sparkle"
              width={24}
              height={24}
              className="w-4 h-4"
            />
          )}
        </Link>

        <Link
          href="/blogs"
          className={cn(
            "px-3 py-2 rounded-sm flex items-center justify-between cursor-pointer transition-colors",
            pathname.startsWith("/blogs")
              ? "bg-foreground backdrop-blur-sm text-white"
              : "text-black hover:bg-white/10"
          )}
        >
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            <p className="text-base font-medium font-heading">Blogs</p>
          </div>
          {pathname.startsWith("/blogs") && (
            <Image
              src="/assets/sidebar-sparkle.svg"
              alt="Sparkle"
              width={24}
              height={24}
              className="w-4 h-4"
            />
          )}
        </Link>
      </nav>

      <div className="p-6 border-t border-[#D4A13D]/20 ">
        <Button
          variant="outline"
          size="sm"
          className="w-full text-[#eeeeee] bg-foreground border-none hover:bg-primary hover:text-white cursor-pointer duration-300"
          onClick={onLogout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Log Out
        </Button>
      </div>
    </aside>
  );
}
