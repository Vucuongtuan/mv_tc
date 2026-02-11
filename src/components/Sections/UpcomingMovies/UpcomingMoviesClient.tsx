"use client";

import React, { useState, useEffect } from 'react';
import { Movie } from '@/types/type';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import styles from './upcoming.module.scss';
import BannerItem from './BannerItem';
import { motion, AnimatePresence } from 'framer-motion';

interface UpcomingMoviesClientProps {
  movies: Movie[];
  cdnImage?: string;
  title?: string;
}

const UpcomingMoviesClient: React.FC<UpcomingMoviesClientProps> = ({ 
  movies, 
  cdnImage = '',
  title = 'Phim Sắp Chiếu'
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % movies.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + movies.length) % movies.length);
  };

  const handleDotClick = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  if (!movies || movies.length === 0) return null;

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 1.1,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.9,
    }),
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  return (
    <section className={styles.section}>
      <header className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
      </header>
      
      <div className={styles.carouselContainer}>
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.5 },
              scale: { duration: 0.5 }
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x);

              if (swipe < -swipeConfidenceThreshold) {
                handleNext();
              } else if (swipe > swipeConfidenceThreshold) {
                handlePrev();
              }
            }}
            className={styles.slideWrapper}
          >
            <BannerItem 
              movie={movies[currentIndex]} 
              cdnImage={cdnImage}
              isActive={true} 
            />
          </motion.div>
        </AnimatePresence>
        
        {/* Navigation Buttons */}
        <div className={styles.navButtons}>
          <button onClick={handlePrev} className={styles.navBtn}>
            <ChevronLeft />
          </button>
          <button onClick={handleNext} className={styles.navBtn}>
            <ChevronRight />
          </button>
        </div>

        {/* Pagination Dots */}
        <div className={styles.pagination}>
          {movies.slice(0, 5).map((_, idx) => (
            <div
              key={idx}
              className={`${styles.dot} ${idx === currentIndex ? styles.active : ''}`}
              onClick={() => handleDotClick(idx)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default UpcomingMoviesClient;
