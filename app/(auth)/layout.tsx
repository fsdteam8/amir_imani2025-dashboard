import type { Metadata } from "next";
import "../globals.css";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Authentication Layout",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-[90vh] container flex flex-col items-center justify-center  p-4 md:p-0 my-20 md:my-0 min-w-screen">
      {/* Image */}
      <div className="w-full ">
        <Image
          src={"/assets/amir_imani-logo.svg"}
          width={200}
          height={200}
          alt="Admin Logo"
          className="w-40 h-40 object-contain mx-auto mb-10"
          priority
        />
      </div>

      {children}
    </div>
  );
}
