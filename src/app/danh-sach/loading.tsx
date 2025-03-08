import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

export default function Loading() {
  return (
    <main className="px-2 h-auto ">
      <section className="w-full h-full ">
        <Skeleton className="w-full h-[90vh]  rounded-md overflow-hidden relative min-[200px]:max-md:h-[280px]" />
      </section>
    </main>
  );
}
