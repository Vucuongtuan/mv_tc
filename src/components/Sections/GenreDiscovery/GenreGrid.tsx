"use client";

import React from 'react';
import Link from 'next/link';
import Image from '@/components/Commons/Image';
import styles from './genre-discovery.module.scss';
import { GenrePreview } from '@/services/movie';
import { Film, ArrowRight } from 'lucide-react';

// Emoji icons cho mỗi thể loại dùng làm fallback
const GENRE_ICONS: Record<string, string> = {
  'hanh-dong': '💥',
  'tinh-cam': '💕',
  'kinh-di': '👻',
  'vien-tuong': '🚀',
  'hoat-hinh': '🎨',
  'hai-huoc': '😂',
  'co-trang': '⚔️',
  'tam-ly': '🧠',
};

interface GenreGridProps {
  genres: GenrePreview[];
}

const GenreGrid: React.FC<GenreGridProps> = ({ genres }) => {
  return (
    <div className={styles.grid}>
      {genres.map((genre) => (
        <Link
          key={genre._id}
          href={`/t/the-loai/${genre.slug}`}
          className={styles.card}
        >
          {/* Background Image */}
          {genre.thumbnail ? (
            <div className={styles.cardImage}>
              <Image
                src={genre.thumbnail}
                alt={genre.name}
                fill
                loading="lazy"
                sizes="(max-width: 480px) 50vw, (max-width: 1024px) 50vw, 33vw"
              />
            </div>
          ) : (
            <div className={styles.cardFallback}>
              {GENRE_ICONS[genre.slug] || <Film size={40} />}
            </div>
          )}

          {/* Gradient Overlay */}
          <div className={styles.overlay} />

          {/* Content */}
          <div className={styles.cardContent}>
            <span className={styles.genreName}>{genre.name}</span>
            <div className={styles.metaRow}>
              {genre.movieCount && (
                <span className={styles.movieCount}>
                  {genre.movieCount.toLocaleString()}+ phim
                </span>
              )}
              <span className={styles.exploreText}>
                Khám phá <ArrowRight size={12} />
              </span>
            </div>
          </div>

          {/* Accent bar on hover */}
          <div className={styles.accentBar} />
        </Link>
      ))}
    </div>
  );
};

export default GenreGrid;
