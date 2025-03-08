import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

export default function Loading() {
  return (
    <main className="w-full h-[91vh] min-h-[500px] px-2">
      <Skeleton className="w-full h-full" />
    </main>
  );
}
