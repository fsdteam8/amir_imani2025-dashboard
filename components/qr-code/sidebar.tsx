import { Button } from "@/components/ui/button";
import { LogOut, BookOpen, QrCode, Store } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { memo } from "react";

interface SidebarProps {
  onLogout?: () => void;
}

interface NavLinkProps {
  href: string;
  isActive: boolean;
  icon: React.ReactNode;
  label: string;
}

// Extracted NavLink component for reusability and better performance
const NavLink = memo(({ href, isActive, icon, label }: NavLinkProps) => (
  <Link
    href={href}
    className={cn(
      "px-3 py-2 rounded-sm flex items-center justify-between cursor-pointer transition-colors",
      isActive
        ? "bg-foreground backdrop-blur-sm text-white"
        : "text-primary-foreground hover:bg-white/10"
    )}
  >
    <div className="flex items-center gap-2">
      {icon}
      <p className="text-base font-medium font-heading">{label}</p>
    </div>
    {isActive && (
      <Image
        src="/assets/sidebar-sparkle.svg"
        alt=""
        width={16}
        height={16}
        className="w-4 h-4"
        aria-hidden="true"
      />
    )}
  </Link>
));

NavLink.displayName = "NavLink";

export const Sidebar = memo(({ onLogout }: SidebarProps) => {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex w-[312px] bg-[#f2e3c6] text-white flex-col h-screen">
      {/* Logo section */}
      <div className="p-6 flex items-center justify-center border-b border-[#D4A13D]/20">
        <Image
          src="/assets/amir_imani-logo.svg"
          alt="Ultra Prestigious Winner"
          width={278}
          height={115}
          priority
        />
      </div>

      <nav className="flex-1 px-6 py-6 space-y-2" aria-label="Main navigation">
        <NavLink
          href="/"
          isActive={pathname === "/"}
          icon={<QrCode className="w-5 h-5" aria-hidden="true" />}
          label="QR Codes"
        />

        <NavLink
          href="/products"
          isActive={pathname.startsWith("/products")}
          icon={<Store className="w-5 h-5" aria-hidden="true" />}
          label="Products"
        />
        <NavLink
          href="/blogs"
          isActive={pathname.startsWith("/blogs")}
          icon={<BookOpen className="w-5 h-5" aria-hidden="true" />}
          label="Blogs"
        />
      </nav>

      <div className="p-6 border-t border-[#D4A13D]/20">
        <Button
          variant="outline"
          size="sm"
          className="w-full text-[#eeeeee] bg-foreground border-none hover:bg-primary hover:text-white transition-colors duration-300"
          onClick={onLogout}
          aria-label="Log out"
        >
          <LogOut className="h-4 w-4 mr-2" aria-hidden="true" />
          Log Out
        </Button>
      </div>
    </aside>
  );
});

Sidebar.displayName = "Sidebar";
