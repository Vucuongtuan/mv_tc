"use client";

import React from 'react';
import { Tv } from 'lucide-react';
import { useTvMode } from '@/hooks/useTvMode';
import styles from './header.module.scss';
import { cn } from '@/lib/utils';

const TvModeToggle: React.FC = () => {
  const { isTvMode, toggleTvMode } = useTvMode();

  return (
    <button
      onClick={toggleTvMode}
      className={cn(
        styles.tvToggle,
        isTvMode && styles.active
      )}
      title={isTvMode ? "Disable TV Mode" : "Enable TV Mode"}
      aria-label="Toggle TV Mode"
    >
      <Tv size={20} />
      <span className="sr-only">TV Mode</span>
    </button>
  );
};

export default TvModeToggle;
