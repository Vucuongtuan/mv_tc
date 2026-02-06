import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import LayoutProvider from "./layoutProvider";
import { ThemeProvider } from "@/components/theme-provider";
import { cookies } from "next/headers";
import Footer from "@/components/footer";
import { unstable_ViewTransition as ViewTransition } from 'react'
import Sidebar from "@/components/sideBar";
const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});
export const experimental_ppr = true
export const metadata: Metadata = {
  metadataBase: new URL(process.env.URL || 'http://localhost:3000'),
  title: {
    default: 'TC Phim',
    template: '%s | TC Phim'
  },
  description: 'Watch movies online',
}
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased min-h-screen w-full relative",
          fontSans.variable
        )}
      >
      
        <div
          className="absolute inset-0 z-0"
          style={{
            background: "radial-gradient(125% 125% at 50% 90%, #000000 40%, #0d1a36 100%)",
          }}
        />
  
        <ViewTransition>
        
            <Sidebar />
              <div className="w-full  max-w-[1920px] m-auto ">
                {/* {children} */}
                Demo Code
              </div>
        </ViewTransition>

      </body>
    </html>
  );
}
