import React from 'react';
import styles from './movie-carousel.module.scss';

interface MovieCarouselSkeletonProps {
  itemWidth?: number;
  gap?: number;
  count?: number;
}

const MovieCarouselSkeleton: React.FC<MovieCarouselSkeletonProps> = ({
  itemWidth = 180,
  gap = 16,
  count = 10,
}) => {
  
  return (
    <div className={styles.carouselWrapper} aria-hidden="true">
      <div className={styles.carouselContainer}>
        <div 
          className={styles.carouselTrack} 
          style={{ gap: `${gap}px` }}
        >
          {Array.from({ length: count }).map((_, i) => (
            <div
              key={i}
              className={styles.carouselItem}
              style={{ minWidth: itemWidth, maxWidth: itemWidth }}
            >
              {/* Thumbnail Skeleton */}
              <div className="aspect-[2/3] w-full bg-secondary rounded-lg animate-pulse" />
              
              {/* Title Skeleton */}
              <div className="mt-3 space-y-2">
                <div className="h-4 w-5/6 bg-secondary rounded animate-pulse" />
                <div className="h-3 w-1/2 bg-secondary rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MovieCarouselSkeleton;
