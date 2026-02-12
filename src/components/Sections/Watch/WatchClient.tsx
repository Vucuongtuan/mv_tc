'use client';

import { Movie, EpisodeServer, HeroSlideData, EpisodeData } from '@/types/type';
import st from './watch-page.module.scss';
import WatchHeader from './WatchHeader';
import WatchActions from './WatchActions';
import WatchInfo from './WatchInfo';
import WatchSidebar from './WatchSidebar';
import { Suspense, useState, useMemo, ViewTransition, useCallback, useEffect } from 'react';
import { getImageUrl } from '@/utils/mapperData';
import Placeholder from './Plaholder';
import VideoPlayer from '@/components/Features/VideoPlayer';
import { BreadcrumbJsonLd } from '@/components/Commons/JsonLd';

interface WatchClientProps {
  movie: HeroSlideData;
  currentEpisode: EpisodeData;
  episodes: EpisodeServer[];
  sources: any[]; 
}

export default function WatchClient({ movie, currentEpisode, episodes, sources }: WatchClientProps) {
  const [selectedSourceIndex, setSelectedSourceIndex] = useState(0);
  const [isEmbed, setIsEmbed] = useState(false);
  const [isAmbientMode, setIsAmbientMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('ambient-mode') === 'true';
    }
    return false;
  });

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
 console.log({sources})
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
        <ViewTransition name={`movie-${movie.slug}`}>
        <Suspense fallback={<Placeholder/>}>
          <VideoPlayer 
            key={`${currentSource.server_name}-${currentEpisode.slug}-${isEmbed}`} 
            src={isEmbed ? "" : currentSource.link_m3u8} 
            embedUrl={currentSource.link_embed}
            poster={getImageUrl(movie.images?.primaryBackdrop,'w1280')} 
            servers={sources} // Truyền sources để hiển thị danh sách Server trong settings player nếu cần
            selectedServerIndex={selectedSourceIndex}
            onServerChange={setSelectedSourceIndex}
            isAmbientMode={isAmbientMode}
            onToggleAmbientMode={toggleAmbientMode}
            />
        </Suspense>
            </ViewTransition>

        <WatchActions 
          servers={sources} 
          selectedServerIndex={selectedSourceIndex}
          onServerChange={setSelectedSourceIndex}
          isEmbed={isEmbed}
          onToggleMode={() => setIsEmbed(!isEmbed)}
          isAmbientMode={isAmbientMode}
          onToggleAmbientMode={toggleAmbientMode}
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
