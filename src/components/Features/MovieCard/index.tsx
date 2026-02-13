"use client";

import React, { useState, useRef, useCallback, ViewTransition } from 'react';
import Link from 'next/link';
import Image from '@/components/Commons/Image';
import styles from './movie-card.module.scss';
import { Movie } from '@/types/type';
import { motion, AnimatePresence } from 'framer-motion';
import { NotebookTabs, Play, Plus, ThumbsUp } from 'lucide-react';
import { YouTubeEmbed } from '@next/third-parties/google';
import { getIdEmbedYoutube } from '@/utils/embed';
import clsx from 'clsx';

interface MovieCardProps {
  movie: Movie;
  priority?: boolean;
  activeHover?: boolean;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, priority = false, activeHover = false }) => {
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  const handleMouseEnter = useCallback(() => {
    if (!activeHover) return;
    timerRef.current = setTimeout(() => {
      setIsHovered(true);
    }, 400);
  }, [activeHover]);

  const handleMouseLeave = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsHovered(false);
  }, []);
  const trailerVideoId = movie?.trailer_url ? getIdEmbedYoutube(movie?.trailer_url) : null;
  
  
  return (
    <article 
      className={styles.cardWrapper}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Base Card */}
      <figure className={styles.thumbnailSimple}>
        <Image
          src={movie.thumb_url}
          alt={movie.name}
          className={styles.thumbnail}
          fill
          sizes="(max-width: 480px) 45vw, (max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 220px"
          placeholder="blur"
          priority={priority}
          />
        <div className={styles.badges}>
          {movie.episode_current && (
            <span className={styles.episodeBadge}>{movie.episode_current}</span>
          )}
          {movie.quality && (
            <span className={styles.qualityBadge}>{movie.quality}</span>
          )}
        </div>
      </figure>
      
      <div className={styles.infoSimple}>
        <h3 className={styles.originalName}>{movie.name}</h3>
      </div>

      <div className={styles.hoverContainer}>
        <AnimatePresence>
        {isHovered && activeHover && (
          <motion.div
            className={styles.hoverOverlay}
            initial={{ opacity: 0, y: 0 }}
            animate={{ 
              opacity: 1, 
              y: -20,
              transition: { 
                type: "tween",
                duration: 0.2,
                ease: "easeOut"
              }
            }}
            exit={{ 
              opacity: 0, 
              y: 0,
              transition: { duration: 0.1 }
            }}
          >
            <div className={styles.hoverMedia}>
              {trailerVideoId ? (
                <YouTubeEmbed 
                  videoid={trailerVideoId} 
                  params="autoplay=1&mute=1&controls=1&modestbranding=1&rel=0&loop=1"
                  style="width: 100%; height: 100%; position: absolute; top: 0; left: 0;"
                  width={400}
                  height={225}
                  />
              ) : (
                <Image 
                  src={movie.poster_url || movie.thumb_url} 
                  alt={movie.name}
                  width={400}
                  height={225}
                  sizes="400px"
                  className="w-full h-full object-cover"
                  loading="lazy"
                  />
              )}
              
              {!trailerVideoId && (
                <>
                  <div className={styles.hoverGradient} />
                  <h3 className={styles.hoverMediaTitle}>{movie.name}</h3>
                </>
              )}
            </div>

            <motion.div 
              className={styles.hoverContent}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }}
            >
              <div className={styles.hoverActions}>
                <Link href={`/phim/${movie.slug}`} className={clsx(styles.btnPlay, 'w-1/3')}>
                  <Play className="w-4 h-4 fill-current" />
                  Xem chi tiết
                </Link>
           
              </div>

              <div className={styles.hoverMeta}>
                {movie.tmdb?.vote_average && (
                  <span className={styles.matchScore}>
                    {movie.tmdb.vote_average.toFixed(1)} ⭐
                  </span>
                )}
                
                <span>{movie.year}</span>
                
                {movie.time && <span className="text-white/60">{movie.time}</span>}
                
                {movie.quality && (
                  <span className={styles.badge}>{movie.quality}</span>
                )}
                
                {movie.lang && (
                  <span className={styles.badge}>{movie.lang}</span>
                )}
              </div>

              <div className={styles.hoverGenres}>
                {movie.category?.slice(0, 3).map((cat, idx) => (
                  <React.Fragment key={cat.slug}>
                    {idx > 0 && <span className="text-gray-500 text-[8px]">•</span>}
                    <span>{cat.name}</span>
                  </React.Fragment>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
      <Link href={`/phim/${movie.slug}`} title={movie.name} className="absolute inset-0 z-10"/>
    </article>
  );
};
      <Link href={`/phim/${movie.slug}`} title={movie.name} className="absolute inset-0 z-10"/>
    </article>
  );
};

export default MovieCard;
