import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

export default function LoadingLoc() {
  const itemCount = 20;

  return (
    <div className="w-full min-h-[700px]">
      <section className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
        {Array(itemCount)
          .fill(0)
          .map((_, index) => (
            <div
              key={index}
              className="rounded-md overflow-hidden relative border shadow-sm"
            >
              <div className="relative pb-[140%]">
                <Skeleton className="absolute inset-0 w-full h-full" />
              </div>
              <div className="p-2 h-16 flex items-center">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3 mt-2" />
              </div>

              <div className="absolute top-2 left-0 right-0 flex justify-between px-2">
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
            </div>
          ))}
      </section>
    </div>
  );
}
