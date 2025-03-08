"use client";
import Link from "next/link";
import React from "react";
import { useSelector } from "react-redux";
import { usePathname } from "next/navigation";
export default function NavMenu() {
  const pathName = usePathname();

  const menuItems = [
    { href: "/phim-bo", label: "Phim bộ" },
    { href: "/phim-le", label: "Phim lẻ" },
    { href: "/hoat-hinh", label: "Hoạt hình" },
    { href: "/phim-sap-chieu", label: "Sắp chiếu" },
    { href: "/loc-phim", label: "Lọc phim" },
  ];

  return (
    <nav className="w-full overflow-x-auto">
      <ul className="flex items-center space-x-4 px-2 min-w-max">
        {menuItems.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className={`block py-2 transition-all ${pathName === item.href
                  ? "text-base md:text-lg font-medium border-b-2 border-red-600"
                  : "text-sm text-muted-foreground hover:text-foreground"
                }`}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
