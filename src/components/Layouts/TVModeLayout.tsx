'use client';

import useTVModeStore from '@/store/tvModeStore';
import { useSpatialNavigation } from '@/hooks/useSpatialNavigation';
import TVSidebar from './Sidebar';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import styles from './tv-layout.module.scss';

interface TVModeLayoutProps {
  children: React.ReactNode;
  header: React.ReactNode;
  footer: React.ReactNode;
  bottomNav: React.ReactNode;
}

export default function TVModeLayout({
  children,
  header,
  footer,
  bottomNav,
}: TVModeLayoutProps) {
  const isTVMode = useTVModeStore((state) => state.isTVMode);
  const [mounted, setMounted] = useState(false);

  // Initialize spatial navigation hook
  useSpatialNavigation();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Render default layout initially to match SSR
    return (
      <>
        {header}
        {children}
        {footer}
        {bottomNav}
      </>
    );
  }

  if (isTVMode) {
    return (
      <div className={cn("tv-mode-root", styles.tvLayout)}>
        <TVSidebar />
        <main className={styles.mainContent}>
          {children}
        </main>
        {/* Footer might be hidden or styled differently in TV mode if needed */}
      </div>
    );
  }

  return (
    <>
      {header}
      {children}
      {footer}
      {bottomNav}
    </>
  );
}
