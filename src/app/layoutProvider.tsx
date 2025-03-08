"use client";
import SideBar from "@/components/sideBar";
import store, { AppStore, RootState } from "@/lib/redux";
import React, { useRef } from "react";
import { Provider, useSelector } from "react-redux";
import Transition from "./transition";

import { Toaster } from "@/components/ui/toaster";
import { SessionProvider, useSession } from "next-auth/react";
import NavBar from "@/components/navBar";
import Footer from "@/components/footer";

const ProviderLayout = ({ children }: { children: React.ReactNode }) => {
  const storeRef = useRef<AppStore>(store());
  return (
    <SessionProvider>
      <Provider store={storeRef.current}>{children}</Provider>
    </SessionProvider>
  );
};

export default function LayoutProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProviderLayout>
      <LayoutWithProvider>{children}</LayoutWithProvider>
    </ProviderLayout>
  );
}

const LayoutWithProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full min-h-screen bg-[#f8fafc] dark:bg-[#1c1c1e]">
      <SideBar />
      <div className="transition-all duration-500 w-full md:w-[calc(100%-80px)] md:ml-[80px]">
        <NavBar />
        <main className=" pt-28 md:pt-16">
          {children}
        </main>
        <Toaster />
      </div>
    </div>
  );
};
