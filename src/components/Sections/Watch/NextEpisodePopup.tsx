'use client';

import { useEffect, useState, useCallback } from 'react';
import { SkipForward, X } from 'lucide-react';
import st from './watch-page.module.scss';
import Link from 'next/link';

interface NextEpisodePopupProps {
  movieSlug: string;
  nextEpisode: { name: string; slug: string };
  show: boolean;
  countdown: number;
  onDismiss: () => void;
}

export default function NextEpisodePopup({ 
  movieSlug, 
  nextEpisode, 
  show, 
  countdown, 
  onDismiss 
}: NextEpisodePopupProps) {
  if (!show) return null;

  const episodeLabel = nextEpisode.name.includes('Tập') ? nextEpisode.name : `Tập ${nextEpisode.name}`;

  return (
    <div className={st.nextEpisodePopup}>
      <button className={st.nextPopupDismiss} onClick={onDismiss}>
        <X size={16} />
      </button>
      <div className={st.nextPopupContent}>
        <SkipForward size={20} />
        <div className={st.nextPopupText}>
          <span className={st.nextPopupLabel}>Tập tiếp theo</span>
          <span className={st.nextPopupEpisode}>{episodeLabel}</span>
        </div>
        <Link 
          href={`/phim/${movieSlug}/${nextEpisode.slug}`}
          className={st.nextPopupBtn}
        >
          Xem ngay ({countdown}s)
        </Link>
      </div>
    </div>
  );
}
