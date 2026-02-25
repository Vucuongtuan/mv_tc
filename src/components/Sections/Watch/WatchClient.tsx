'use client';

import { Movie, EpisodeServer, HeroSlideData, EpisodeData } from '@/types/type';
import st from './watch-page.module.scss';
import WatchHeader from './WatchHeader';
import WatchActions from './WatchActions';
import WatchInfo from './WatchInfo';
import WatchSidebar from './WatchSidebar';
import NextEpisodePopup from './NextEpisodePopup';
import { Suspense, useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { getImageUrl } from '@/utils/mapperData';
import Placeholder from './Plaholder';
import VideoPlayer from '@/components/Features/VideoPlayer';
import { BreadcrumbJsonLd } from '@/components/Commons/JsonLd';
import { useRouter } from 'next/navigation';

interface WatchClientProps {
  movie: HeroSlideData;
  currentEpisode: EpisodeData;
  episodes: EpisodeServer[];
  sources: any[]; 
}

export default function WatchClient({ movie, currentEpisode, episodes, sources }: WatchClientProps) {
  const router = useRouter();
  const [selectedSourceIndex, setSelectedSourceIndex] = useState(0);
  const [isEmbed, setIsEmbed] = useState(false);
  const hasLoadedOnce = useRef(false);
  const [isAmbientMode, setIsAmbientMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('ambient-mode') === 'true';
    }
    return false;
  });

  // --- Next Episode Logic ---
  const [showNextPopup, setShowNextPopup] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const nextPopupDismissed = useRef(false);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);

  const nextEpisode = useMemo(() => {
    // Tìm tập hiện tại trong server_data rồi lấy tập kế
    const serverData = episodes[0]?.server_data || [];
    const currentIndex = serverData.findIndex(ep => ep.slug === currentEpisode.slug);
    if (currentIndex >= 0 && currentIndex < serverData.length - 1) {
      return serverData[currentIndex + 1];
    }
    return null;
  }, [episodes, currentEpisode.slug]);

  const nextEpisodeUrl = nextEpisode ? `/phim/${movie.slug}/${nextEpisode.slug}` : null;

  // Reset popup state khi chuyển tập
  useEffect(() => {
    setShowNextPopup(false);
    setCountdown(30);
    nextPopupDismissed.current = false;
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
  }, [currentEpisode.slug]);

  // Countdown timer khi popup hiện
  useEffect(() => {
    if (showNextPopup && nextEpisodeUrl) {
      countdownRef.current = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(countdownRef.current!);
            router.push(nextEpisodeUrl);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => {
        if (countdownRef.current) clearInterval(countdownRef.current);
      };
    }
  }, [showNextPopup, nextEpisodeUrl, router]);

  const handleDismissPopup = useCallback(() => {
    setShowNextPopup(false);
    nextPopupDismissed.current = true;
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
  }, []);

  // onTimeUpdate: detect khi còn 30s → hiện popup (chỉ HLS)
  const handleTimeUpdate = useCallback((currentTime: number, duration: number) => {
    if (!nextEpisode || nextPopupDismissed.current || isEmbed) return;
    const remaining = duration - currentTime;
    if (remaining <= 30 && remaining > 0 && !showNextPopup) {
      setShowNextPopup(true);
      setCountdown(Math.ceil(remaining));
    }
  }, [nextEpisode, isEmbed, showNextPopup]);

  useEffect(() => {
    setSelectedSourceIndex(0);
  }, [currentEpisode.slug]);

  const toggleAmbientMode = useCallback(() => {
    setIsAmbientMode(prev => {
      const next = !prev;
      localStorage.setItem('ambient-mode', String(next));
      return next;
    });
  }, []);
  
  const currentSource = useMemo(() => {
    return sources[selectedSourceIndex] || sources[0];
  }, [selectedSourceIndex, sources]);

  return (
    <div className={st.watchContainer}>
      <BreadcrumbJsonLd 
        items={[
          { name: 'Trang chủ', item: '/' },
          { name: movie.title || '', item: `/phim/${movie.slug}` },
          { name: `Xem phim ${movie.title} - Tập ${currentEpisode.name}`, item: `/phim/${movie.slug}/${currentEpisode.slug}` }
        ]} 
      />
      <WatchHeader 
        title={`Xem phim ${movie.title} - ${currentEpisode.name.includes('Tập') ? currentEpisode.name : 'Tập ' + currentEpisode.name}`} 
        backUrl={`/phim/${movie.slug}`} 
      />

      <div className={st.playerSection}>
        <Suspense fallback={<Placeholder/>}>
          <VideoPlayer 
            key={`${currentSource.server_name}-${currentEpisode.slug}-${isEmbed}`} 
            src={isEmbed ? "" : currentSource.link_m3u8} 
            embedUrl={currentSource.link_embed}
            poster={getImageUrl(movie.images?.primaryBackdrop,'w1280')} 
            servers={sources}
            selectedServerIndex={selectedSourceIndex}
            onServerChange={setSelectedSourceIndex}
            isAmbientMode={isAmbientMode}
            onToggleAmbientMode={toggleAmbientMode}
            isInitialLoad={!hasLoadedOnce.current}
            onReady={() => { hasLoadedOnce.current = true; }}
            onTimeUpdate={!isEmbed ? handleTimeUpdate : undefined}
            />
        </Suspense>

        {/* Next Episode Popup — chỉ hiện khi HLS + có tập tiếp */}
        {!isEmbed && nextEpisode && (
          <NextEpisodePopup
            movieSlug={movie.slug!}
            nextEpisode={nextEpisode}
            show={showNextPopup}
            countdown={countdown}
            onDismiss={handleDismissPopup}
          />
        )}

        <WatchActions 
          servers={sources} 
          selectedServerIndex={selectedSourceIndex}
          onServerChange={setSelectedSourceIndex}
          isEmbed={isEmbed}
          onToggleMode={() => setIsEmbed(!isEmbed)}
          isAmbientMode={isAmbientMode}
          onToggleAmbientMode={toggleAmbientMode}
          nextEpisodeUrl={nextEpisodeUrl}
        />

        <div className={st.infoGrid}>
          <WatchInfo 
            movie={movie as any} 
            currentEpisodeName={currentEpisode.name} 
          />
          
          <WatchSidebar 
            movie={movie as any} 
            episodes={episodes} 
            currentEpisodeSlug={currentEpisode.slug} 
          />
        </div>
      </div>
    </div>
  );
}

