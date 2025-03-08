import SearchBox from "@/components/searchBox";
import Image from "next/image";
import React from "react";

export default function Search() {
  return (
    <main className="w-full h-[91vh]  px-2">
      <div className="border-2 h-full w-full rounded-md">
        <SearchBox />
      </div>
    </main>
  );
}
