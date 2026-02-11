'use client';

import { useState, useEffect } from 'react';
import styles from './header.module.scss';
import clsx from 'clsx';

export default function HeaderBackground() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); 
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div 
      className={clsx(styles.headerBackground, { 
        [styles.headerBackground_scrolled]: isScrolled 
      })} 
    />
  );
}
