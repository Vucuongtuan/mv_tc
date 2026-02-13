'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './hero.module.scss';
import HeroSlide from './HeroSlide';
import HeroPagination from './HeroPagination';
import { HeroSlideData } from '@/types/type';

interface HeroClientProps {
  slides: HeroSlideData[];
}

export default function HeroClient({ slides }: HeroClientProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const goToSlide = useCallback((index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  }, [currentIndex]);



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
        <HeroPagination
        slides={slides}
        current={currentIndex}
        onSelect={goToSlide}
      />
    
    </section>
  );
}
