"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

interface TvModeContextType {
  isTvMode: boolean;
  toggleTvMode: () => void;
}

const TvModeContext = createContext<TvModeContextType | undefined>(undefined);

export const TvModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isTvMode, setIsTvMode] = useState(false);

  // Initialize from localStorage
  useEffect(() => {
    const savedMode = localStorage.getItem('tv-mode');
    if (savedMode === 'true') {
      setIsTvMode(true);
    }
  }, []);

  const toggleTvMode = () => {
    setIsTvMode((prev) => {
      const newMode = !prev;
      localStorage.setItem('tv-mode', String(newMode));
      return newMode;
    });
  };

  useEffect(() => {
    if (isTvMode) {
      document.body.classList.add('tv-mode');
      
      const handleKeyDown = (e: KeyboardEvent) => {
        const activeElement = document.activeElement as HTMLElement;
        
        // Navigation keys
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter', 'Escape', 'Backspace'].includes(e.key)) {
           // Basic browser spatial navigation usually works if elements are focusable
           // We can add more advanced logic here if needed.
           if (e.key === 'Enter' && activeElement) {
             // activeElement.click(); // Browser usually does this for buttons/links
           }
           
           if ((e.key === 'Backspace' || e.key === 'Escape') && !['INPUT', 'TEXTAREA'].includes(activeElement.tagName)) {
             e.preventDefault();
             window.history.back();
           }
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    } else {
      document.body.classList.remove('tv-mode');
    }
  }, [isTvMode]);

  return (
    <TvModeContext.Provider value={{ isTvMode, toggleTvMode }}>
      {children}
    </TvModeContext.Provider>
  );
};

export const useTvMode = () => {
  const context = useContext(TvModeContext);
  if (context === undefined) {
    throw new Error('useTvMode must be used within a TvModeProvider');
  }
  return context;
};
