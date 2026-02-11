'use client';

import { Movie, EpisodeServer, HeroSlideData, EpisodeData } from '@/types/type';
import st from './watch-page.module.scss';
import WatchHeader from './WatchHeader';
import VideoPlayer from './VideoPlayer';
import WatchActions from './WatchActions';
import WatchInfo from './WatchInfo';
import WatchSidebar from './WatchSidebar';
import { Suspense, useState, useMemo, ViewTransition } from 'react';
import { getImageUrl } from '@/utils/mapperData';
import Placeholder from './Plaholder';

interface WatchClientProps {
  movie: HeroSlideData;
  currentEpisode: EpisodeData;
  episodes: EpisodeServer[];
}

export default function WatchClient({ movie, currentEpisode, episodes }: WatchClientProps) {
  const [selectedServerIndex, setSelectedServerIndex] = useState(0);
  const [isEmbed, setIsEmbed] = useState(false);
  
  const episodeInSelectedServer = useMemo(() => {
    const server = episodes[selectedServerIndex];
    return server?.server_data.find(ep => ep.name === currentEpisode.name) || currentEpisode;
  }, [selectedServerIndex, episodes, currentEpisode]);

  return (
    <div className={st.watchContainer}>
      <WatchHeader 
        title={`Xem phim ${movie.title}`} 
        backUrl={`/phim/${movie.slug}`} 
      />

      <div className={st.playerSection}>
        <ViewTransition name={`movie-${movie.slug}`}>
        <Suspense fallback={<Placeholder/>}>
          <VideoPlayer 
            key={`${selectedServerIndex}-${episodeInSelectedServer.slug}-${isEmbed}`} 
            src={isEmbed ? "" : episodeInSelectedServer.link_m3u8} 
            embedUrl={episodeInSelectedServer.link_embed}
            poster={getImageUrl(movie.images?.primaryBackdrop,'w1280')} 
            servers={episodes}
            selectedServerIndex={selectedServerIndex}
            onServerChange={setSelectedServerIndex}
            />
        </Suspense>
            </ViewTransition>

        <WatchActions 
          servers={episodes} 
          selectedServerIndex={selectedServerIndex}
          onServerChange={setSelectedServerIndex}
          isEmbed={isEmbed}
          onToggleMode={() => setIsEmbed(!isEmbed)}
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
