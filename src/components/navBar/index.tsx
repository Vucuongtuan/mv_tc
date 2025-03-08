import React from "react";
import { ModeToggle } from "../ModeToggle";
import Search from "./search";
import Dropdown from "./dropdown";
import NavMenu from "./navMenu";

export default function NavBar() {
  return (
    <header className="w-full h-full flex mb-2  pt-3 min-[200px]:max-md:flex-col-reverse min-[200px]:max-md:mb-3">
      <div className="w-1/2 h-full flex min-[200px]:max-md:w-full ">
        <NavMenu />
      </div>
      <div className=" h-full flex-grow  flex justify-end px-4 min-[200px]:max-md:w-full ">
        <div className="logo w-1/2 hidden  font-bold text-2xl text-red-600 min-[200px]:max-md:block ">
          TC <span className="dark:text-white">Phim</span>
        </div>
        <div className="w-1/2 mx-6">
          <Search />
        </div>
        <ModeToggle />
        <Dropdown />
      </div>
    </header>
  );
}
