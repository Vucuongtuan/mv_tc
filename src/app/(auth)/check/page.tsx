"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function CheckPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined' && session?.user) {
      localStorage.setItem(
        "profileUser",
        JSON.stringify({
          email: session.user.email,
          name: session.user.name,
        })
      );
    }

    const time = setTimeout(() => {
      router.push("/");
    }, 2000);

    return () => clearTimeout(time);
  }, [session, router]);

  return (
    <div className="fixed inset-0 bg-black z-50">
      <Skeleton className="w-full h-full" />
    </div>
  );
}
