'use client';

import { Tv, Monitor } from 'lucide-react';
import useTVModeStore from '@/store/tvModeStore';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

export default function TVModeToggle({ className }: { className?: string }) {
  const { isTVMode, toggleTVMode } = useTVModeStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <button
      onClick={toggleTVMode}
      className={cn(
        "flex items-center gap-2 px-3 py-2 rounded-md transition-colors",
        isTVMode ? "bg-primary text-primary-foreground" : "hover:bg-accent hover:text-accent-foreground",
        className
      )}
      title={isTVMode ? "Exit TV Mode" : "Enter TV Mode"}
      aria-label={isTVMode ? "Exit TV Mode" : "Enter TV Mode"}
    >
      {isTVMode ? <Monitor size={20} /> : <Tv size={20} />}
      <span className="hidden sm:inline-block font-medium">
        {isTVMode ? "Web Mode" : "TV Mode"}
      </span>
    </button>
  );
}
