'use client';

import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import styles from './hero.module.scss';
import HeroSlide from './HeroSlide';
import { HeroSlideData } from '@/types/type';

interface HeroClientProps {
  slides: HeroSlideData[];
}

const AUTO_PLAY_INTERVAL = 15000; // 15 seconds

export default function HeroClient({ slides }: HeroClientProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, AUTO_PLAY_INTERVAL);

    return () => clearInterval(timer);
  }, [slides.length]);

  if (!slides || slides.length === 0) return null;
  return (
    <section className={styles.hero}>
      <AnimatePresence mode="wait" custom={direction}>
        <HeroSlide
          key={slides[currentIndex]._id}
          slide={slides[currentIndex]}
          direction={direction}
          priority={currentIndex === 0}
        />
      </AnimatePresence>
    </section>
  );
}
