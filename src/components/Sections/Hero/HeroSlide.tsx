'use client';

import { motion } from 'framer-motion';
import { Star, Play, Heart, Info } from 'lucide-react';
import styles from './hero.module.scss';
import { HeroSlideData } from '@/types/type';
import Image from '@/components/Commons/Image';
import Link from 'next/link';

interface HeroSlideProps {
  slide: HeroSlideData;
  direction: number;
  priority?: boolean;
}

const slideVariants = {
  enter: {
    opacity: 0,
  },
  center: {
    opacity: 1,
  },
  exit: {
    opacity: 0,
  },
};

const contentVariants = {
  enter: {
    opacity: 0,
    y: 30,
  },
  center: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: 0.3,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
    },
  },
};

export default function HeroSlide({ slide, direction, priority }: HeroSlideProps) {
  return (
    <motion.div
      className={styles.slide}
      variants={slideVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.5, ease: 'easeInOut' }}
    >
      <div className={styles.posterWrapper}>
        <Image 
          src={slide.backgroundImage} 
          alt={slide.title} 
          fill 
          className={styles.posterImage}
          priority={priority}
          sizes="100vw"
          {...(priority ? { fetchPriority: "high" } : {})}
        />
      </div>
      <div className={styles.overlay} />

      {/* Content */}
      <motion.div
        className={styles.content}
        variants={contentVariants}
        initial="enter"
        animate="center"
        exit="exit"
      >
        {/* Title */}
        <h1 className={styles.title}>
          {slide.title}
        </h1>

        {/* Origin Name */}
        <p className={styles.subtitle}>{slide.originName}</p>

        {/* Meta Info Compact */}
        <div className={styles.metaCompact}>
            {slide.rating > 0 && (
                <>
                    <span className={styles.ratingBox}>
                        <Star size={14} fill="currentColor" stroke="none" />
                        {slide.rating.toFixed(1)}
                    </span>
                    <span className={styles.dot} />
                </>
            )}
            <span className={styles.metaText}>{slide.year}</span>
            <span className={styles.dot} />
            <span className={styles.qualityBox}>{slide.quality}</span>
            <span className={styles.dot} />
            <span className={styles.metaText}>{slide.duration}</span>
            {slide.episodeCurrent && (
                <>
                    <span className={styles.dot} />
                    <span className={styles.metaText}>{slide.episodeCurrent}</span>
                </>
            )}
        </div>

        {/* Genres */}
        <div className={styles.genres}>
          {slide.genres.slice(0, 3).map((genre) => (
            <span key={genre} className={styles.genre}>
              {genre}
            </span>
          ))}
        </div>

        {/* Description */}
        <p className={styles.description}>
          {slide.description}
        </p>

        {/* Actions */}
        <div className={styles.actions}>
          <Link href={`/phim/${slide.slug}`} className={styles.primaryBtn}>
            <Play size={20} fill="currentColor" />
            Xem Ngay
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}
