"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from '@/components/Commons/Image';
import { Movie } from '@/types/type';
import { Play, Calendar, Clock, Star, Disc } from 'lucide-react';
import styles from './upcoming.module.scss';
import { motion, AnimatePresence } from 'framer-motion';
import { deepMergeImage, mapperData } from '@/utils/mapperData';

interface BannerItemProps {
  movie: Movie;
  cdnImage?: string;
  isActive: boolean;
}

interface Countdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const CountdownBox: React.FC<{ targetDate: Date }> = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState<Countdown>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - new Date().getTime();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className={styles.countdownGrid}>
      <div className={styles.countdownBox}>
        <span className="value">{timeLeft.days}</span>
        <span className="label">Ngày</span>
      </div>
      <div className={styles.countdownBox}>
        <span className="value">{timeLeft.hours}</span>
        <span className="label">Giờ</span>
      </div>
      <div className={styles.countdownBox}>
        <span className="value">{timeLeft.minutes}</span>
        <span className="label">Phút</span>
      </div>
      <div className={styles.countdownBox}>
        <span className="value">{timeLeft.seconds}</span>
        <span className="label">Giây</span>
      </div>
    </div>
  );
};

// Motion Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  },
  exit: { opacity: 0 }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { type: "spring", stiffness: 50, damping: 20 }
  },
  exit: { y: -20, opacity: 0 }
};

const bgVariants = {
  initial: { scale: 1 },
  animate: { 
    scale: 1.1,
    transition: { duration: 10, ease: "linear" } 
  },
  exit: { opacity: 0 }
};

const BannerItem: React.FC<BannerItemProps> = ({ movie, cdnImage = '', isActive }) => {
  const releaseDate = new Date();
  releaseDate.setDate(releaseDate.getDate() + 7 + (movie.year % 5)); 
  
  const tranfromData = mapperData(movie, cdnImage)
  return (
    <div className={styles.bannerItem}>
      <motion.div 
        className={styles.bannerBackground}
        variants={bgVariants}
        initial="initial"
        animate={isActive ? "animate" : "initial"}
      >

        <Image
          src={tranfromData.backgroundPoster}
          alt={movie.name}
          width={1920}
          height={1080}
          priority
          className="object-cover"
        />
      </motion.div>

      {/* Content Layer */}
      <div className={styles.contentWrapper}>
        <AnimatePresence mode='wait'>
          {isActive && (
            <motion.div 
              className={styles.glassCard}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="flex gap-4">
                <figure className="relative w-1/4 ">
                  <Image
                    src={tranfromData.backgroundImage}
                    alt={movie.name}
                    priority
                    fill
                    className="object-cover rounded-sm"
                  />
                </figure>

              <div className="flex-1">
              {/* Badge */}
              <motion.div className={styles.badge} variants={itemVariants}>
                Coming Soon 
              </motion.div>

              {/* Title */}
              <motion.h2 className={styles.movieTitle} variants={itemVariants}>
                {movie.name}
              </motion.h2>
              <motion.p className={styles.movieSubtitle} variants={itemVariants}>
                {movie.origin_name}
              </motion.p>

              {/* Meta Info */}
              <motion.div className={styles.metaInfo} variants={itemVariants}>
                {movie.year && (
                  <div className={styles.metaItem}>
                    <Calendar /> {movie.year}
                  </div>
                )}
                {movie.time && (
                  <div className={styles.metaItem}>
                    <Clock /> {movie.time}
                  </div>
                )}
                {movie.tmdb?.vote_average && (
                  <div className={styles.metaItem}>
                    <Star /> {movie.tmdb.vote_average.toFixed(1)}
                  </div>
                )}
                {movie.quality && (
                  <div className={styles.metaItem}>
                    <Disc /> {movie.quality}
                  </div>
                )}
              </motion.div>

              {/* Actions & Countdown */}
              <motion.div className={styles.actions} variants={itemVariants}>
                <Link href={`/phim/${movie.slug}`} className={styles.playBtn}>
                  <Play fill="currentColor" size={24} />
                  <span>Xem Trailer Ngay</span>
                </Link>
                
                <div className={styles.countdownContainer}>
                  <span className={styles.countdownLabel}>Công chiếu sau</span>
                  <CountdownBox targetDate={releaseDate} />
                </div>
              </motion.div>
              </div></div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default BannerItem;
