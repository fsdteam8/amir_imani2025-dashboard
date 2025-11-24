import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import Image from "next/image";

interface SidebarProps {
  onLogout?: () => void;
}

export function Sidebar({ onLogout }: SidebarProps) {
  return (
    <aside className="hidden md:flex w-[312px] bg-[#F2E3C6] text-white flex-col h-screen border-r border-[#D4A13D]/20">
      {/* Logo section with brand logo */}
      <div className="p-6 flex items-center justify-center gap-3 border-b border-[#D4A13D]/20 w-full">
        <Image
          src="/assets/amir_imani-logo.svg"
          alt="Ultra Prestigious Winner Logo"
          width={158}
          height={100}
          className="w-[258px] h-[100px]"
        />
        {/* <span className="font-semibold text-sm">QR Codes</span> */}
      </div>

      <nav className="flex-1 px-3 py-6 space-y-2">
        <div className="px-3 py-2 rounded-sm gradient-primary backdrop-blur-sm flex items-center justify-between cursor-pointer">
          {/* Nav item  */}
          <div className="flex items-center gap-2 ">
            <Image
              src="/assets/qrcode-icon.svg"
              alt="QR Code Icon"
              width={24}
              height={24}
              className="w-6 h-6"
            />
            <p className="text-sm font-medium font-heading">QR Codes</p>
          </div>

          <Image
            src="/assets/sidebar-sparkle.svg"
            alt="Sparkle"
            width={24}
            height={24}
            className="w-6 h-6"
          />
        </div>
      </nav>

      <div className="p-6 border-t border-[#D4A13D]/20">
        <Button
          variant="outline"
          size="sm"
          className="w-full text-red-500 border-red-500/30 hover:bg-red-100 hover:text-red-600 cursor-pointer"
          onClick={onLogout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Log Out
        </Button>
      </div>
    </aside>
  );
}
