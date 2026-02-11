"use client";

import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useAnimation, PanInfo } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './movie-carousel.module.scss';

interface MovieCarouselProps {
  children: React.ReactNode;
  itemWidth?: number;
  gap?: number;
}

const MovieCarousel: React.FC<MovieCarouselProps> = ({ 
  children, 
  itemWidth = 180, 
  gap = 16 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [constraints, setConstraints] = useState({ left: 0, right: 0 });
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  
  const x = useMotionValue(0);
  const controls = useAnimation();

  // Tính toán constraints dựa trên container và track width
  useEffect(() => {
    const updateConstraints = () => {
      if (containerRef.current && trackRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const trackWidth = trackRef.current.scrollWidth;
        const maxScroll = Math.max(0, trackWidth - containerWidth);
        
        setConstraints({
          left: -maxScroll,
          right: 0
        });
      }
    };

    updateConstraints();
    window.addEventListener('resize', updateConstraints);
    return () => window.removeEventListener('resize', updateConstraints);
  }, [children]);

  // Update scroll state để hiển thị/ẩn nút navigation
  const updateScrollState = (currentX: number) => {
    setCanScrollLeft(currentX < 0);
    setCanScrollRight(currentX > constraints.left);
  };

  // Xử lý kéo thả
  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const currentX = x.get();
    updateScrollState(currentX);
  };

  // Scroll sang trái
  const scrollLeft = () => {
    const containerWidth = containerRef.current?.offsetWidth || 0;
    const scrollAmount = containerWidth * 0.8; // Scroll 80% container width
    const currentX = x.get();
    const newX = Math.min(0, currentX + scrollAmount);
    
    controls.start({ x: newX, transition: { type: 'spring', stiffness: 300, damping: 30 } });
    updateScrollState(newX);
  };

  // Scroll sang phải
  const scrollRight = () => {
    const containerWidth = containerRef.current?.offsetWidth || 0;
    const scrollAmount = containerWidth * 0.8;
    const currentX = x.get();
    const newX = Math.max(constraints.left, currentX - scrollAmount);
    
    controls.start({ x: newX, transition: { type: 'spring', stiffness: 300, damping: 30 } });
    updateScrollState(newX);
  };

  // Sync x value với controls
  useEffect(() => {
    const unsubscribe = x.on('change', (latest) => {
      updateScrollState(latest);
    });
    return () => unsubscribe();
  }, [constraints]);

  return (
    <div className={styles.carouselWrapper}>
      {/* Navigation Button - Left */}
      {canScrollLeft && (
        <button 
          className={`${styles.navButton} ${styles.navLeft}`}
          onClick={scrollLeft}
          aria-label="Scroll left"
        >
          <ChevronLeft size={24} />
        </button>
      )}

      {/* Carousel Container */}
      <div className={styles.carouselContainer} ref={containerRef}>
        <motion.div
          ref={trackRef}
          className={styles.carouselTrack}
          style={{ x, gap: `${gap}px` }}
          drag="x"
          dragConstraints={constraints}
          dragElastic={0.1}
          dragMomentum={true}
          onDragEnd={handleDragEnd}
          animate={controls}
        >
          {React.Children.map(children, (child, index) => (
            <div 
              key={index}
              className={styles.carouselItem}
              style={{ minWidth: itemWidth, maxWidth: itemWidth }}
            >
              {child}
            </div>
          ))}
        </motion.div>
      </div>

      {/* Navigation Button - Right */}
      {canScrollRight && (
        <button 
          className={`${styles.navButton} ${styles.navRight}`}
          onClick={scrollRight}
          aria-label="Scroll right"
        >
          <ChevronRight size={24} />
        </button>
      )}
    </div>
  );
};

export default MovieCarousel;
