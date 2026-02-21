
import Image from '@/components/Commons/Image';
import Link from 'next/link';
import { clsx } from 'clsx';
import st from './watch-page.module.scss';
import { Movie, EpisodeServer, HeroSlideData } from '@/types/type';
import Episodes from '@/components/Features/Episodes';

export default function WatchSidebar({ 
  movie, 
  episodes, 
  currentEpisodeSlug 
}: { 
  movie: HeroSlideData; 
  episodes: EpisodeServer[]; 
  currentEpisodeSlug: string;
}) {
  return (
    <aside className={st.sidebar}>
      {/* @ts-expect-error */}
      <Episodes episodes={movie.episodes} episodes2={movie.episodes2} slug={movie.slug}/>
      <div className={st.castSection}>
        <h3>Diễn viên</h3>
        <div className={st.castGrid}>
          {movie.actor?.slice(0, 4).map((actor, idx) => (
            <div key={idx} className={st.actor}>
              <div className={st.avatar}>
                <Image src={`https://ui-avatars.com/api/?name=${actor}&background=random`} alt={actor} fill className="object-cover" />
              </div>
              <span>{actor}</span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
