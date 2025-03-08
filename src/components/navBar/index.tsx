import React from "react";
import { ModeToggle } from "../ModeToggle";
import Search from "./search";
import Dropdown from "./dropdown";
import NavMenu from "./navMenu";
export default function NavBar() {
  return (
    <header className="w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 fixed top-0 left-0 right-0 !z-50 border-b border-border/40 md:left-[80px]">
      <div className="h-auto md:h-16 flex flex-col md:flex-row items-center px-4 py-2 md:py-0">
        <div className="w-full md:w-1/2 order-2 md:order-1">
          <NavMenu />
        </div>
        <div className="w-full md:w-auto flex justify-between md:justify-end items-center gap-4 mb-2 md:mb-0 order-1 md:order-2 md:flex-grow">
          <div className="logo font-bold text-xl md:text-2xl text-red-600 md:hidden">
            TC <span className="dark:text-white">Phim</span>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <div className="w-[180px] md:w-[240px]">
              <Search />
            </div>
            <ModeToggle />
            <Dropdown />
          </div>
        </div>
      </div>
    </header>
  );
}