"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function CheckPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  localStorage.setItem(
    "profileUser",
    JSON.stringify({
      email: session && session.user && session.user.email,
      name: session && session.user && session.user.name,
    })
  );
  useEffect(() => {
    const time = setTimeout(() => {
      router.push("/");
    }, 2000);
    return () => clearTimeout(time);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div
      className="z-50 absolute top-0 left-0 bg-black w-full h-full"
      style={{
        position: "absolute",
        backgroundColor: "black",
        height: "100%",
        width: "100%",
        top: "0",
        left: "0",
        zIndex: "99",
      }}
    >
      <Skeleton className="w-full h-full" />
    </div>
  );
}
