import Image from "next/image";
import React from "react";
import LinkRouter from "./linkRouter";

export default function SideBar() {
  return (
    <aside className="w-[80px] h-screen fixed top-0 left-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-r border-border/40 shadow-sm hidden md:block">
      {/* Logo section */}
      <div className="h-20 flex items-center justify-center p-4">
        <Image
          src="/logo-512x512.png"
          alt="TC Phim"
          height={48}
          width={48}
          className="object-contain transition-all duration-200 hover:scale-110"
        />
      </div>

      {/* Navigation Links */}
      <LinkRouter />
    </aside>
  );
}