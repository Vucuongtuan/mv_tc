'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import styles from './hero.module.scss';
import { HeroSlideData } from '@/types/type';

interface HeroPaginationProps {
  slides: HeroSlideData[];
  current: number;
  onSelect: (index: number) => void;
}

export default function HeroPagination({ slides, current, onSelect }: HeroPaginationProps) {
  return (
    <div className={styles.pagination}>
      {slides.map((slide, index) => (
        <button
          key={slide._id}
          className={`${styles.paginationItem} ${index === current ? styles.active : ''}`}
          onClick={() => onSelect(index)}
          aria-label={`Go to ${slide.title}`}
        >
          <div className={styles.thumbnailWrapper}>
            <Image
              src={slide.backgroundImage}
              alt={slide.title}
              fill
              className={styles.thumbnail}
              sizes="120px"
            />
            <div className={styles.thumbnailOverlay} />
          </div>
          
          {index === current && (
            <motion.div
              className={styles.paginationProgress}
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 8, ease: 'linear' }}
            />
          )}
          
          {/* Slide number badge */}
          <span className={styles.slideNumber}>{index + 1}</span>
        </button>
      ))}
    </div>
  );
}
