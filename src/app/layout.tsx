import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

import Header from "@/components/Layouts/Header";
import Footer from "@/components/Layouts/Footer";
import BottomNav from "@/components/Layouts/BottomNav";
import SecurityGuard from "@/components/Commons/SecurityGuard";
import { ReactQueryClientProvider } from "./provider-tanstack";
import { WebSiteJsonLd } from "@/components/Commons/JsonLd";
import { Suspense } from "react";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});
export const metadata: Metadata = {
  metadataBase: new URL(process.env.URL || 'http://localhost:3000'),
  title: {
    default: 'TC Phim',
    template: '%s | TC Phim'
  },
  description: 'Watch movies online',
  other: {
    'viewport-fit': 'cover',
  },
  alternates: {
    canonical: '/',
  }
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
          fontSans.variable
        )}
        suppressHydrationWarning
      >
        <SecurityGuard />
        <WebSiteJsonLd />
          <ReactQueryClientProvider>
              <Header/>
              {children}
              <Suspense>
              <Footer/>
              </Suspense>
              <BottomNav />
          </ReactQueryClientProvider>

      </body>
    </html>
  );
}
