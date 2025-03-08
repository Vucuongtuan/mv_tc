"use client";
import React, { useCallback, useMemo } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import { toast } from "../ui/use-toast";
import Cookies from "js-cookie";
function Dropdown() {
  const { data: session, status } = useSession();
  const cookies = Cookies.get("token");
  const local =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("profileUser") ?? "[]")
      : [];

  const drop = () => (
    <>
      {cookies ? (
        <div className=" w-[40px]  h-[40px] rounded-full overflow-hidden  cursor-pointer">
          <Image
            src={
              (session && session.user && session?.user.image) ?? "/user.jpg"
            }
            alt={"user"}
            width={150}
            height={150}
            className="w-full h-full "
          />
        </div>
      ) : null}
    </>
  );
  const handleLogOut = async () => {
    localStorage.removeItem("profileUser");
    Cookies.remove("token");
    await signOut();
    toast({
      title: "Đăng xuất thành công",
    });
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className=" outline-none">
        {drop()}
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>
          {(session && session.user && session.user.name) || local.name}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Team</DropdownMenuItem>
        <DropdownMenuItem onClick={handleLogOut}>Đăng xuất</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
export default Dropdown;
