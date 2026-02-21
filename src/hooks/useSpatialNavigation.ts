"use client";

import { useEffect } from 'react';
import { useTvMode } from './useTvMode';

export const useSpatialNavigation = () => {
  const { isTvMode } = useTvMode();

  useEffect(() => {
    if (!isTvMode) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const activeElement = document.activeElement as HTMLElement;
      
      // Basic navigation using standard focus
      // We can extend this to find the nearest element in a direction
      // if the default focus behavior isn't sufficient.
      
      switch (e.key) {
        case 'ArrowUp':
        case 'ArrowDown':
        case 'ArrowLeft':
        case 'ArrowRight':
          // We could implement custom logic here if needed,
          // but for now let's see if we can just improve the focus styles.
          break;
        case 'Enter':
          if (activeElement) {
            activeElement.click();
          }
          break;
        case 'Backspace':
        case 'Escape':
          // Handle back navigation on TV
          if (window.history.length > 1) {
            window.history.back();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isTvMode]);
};
