
import Image from '@/components/Commons/Image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import st from './watch-page.module.scss';
import { HeroSlideData, Movie } from '@/types/type';
import { getImageUrl } from '@/utils/mapperData';
import Episodes from '@/components/Features/Episodes';
import HtmlRender from '@/components/Features/HtmlRender';

export default function WatchInfo({ movie, currentEpisodeName }: { movie: HeroSlideData; currentEpisodeName: string }) {
  return (
    <div className={st.movieInfo}>
      <div className={st.headerGroup}>
        <figure className={st.poster}>
          <Image src={getImageUrl(movie.images?.primaryPoster)} alt={movie.title} fill className="object-cover" />
        </figure>
        <div className={st.meta}>
          <h2>{movie.title}</h2>
          <div className={st.tags}>
            {movie.category?.map((c, i) => <span key={i}>{c.name}</span>)}
          </div>
          <div className={st.badges}>
            <span className={st.badge}>{movie.rating === 0 ? 'N/A' : movie.rating}</span>
            <span className={`${st.badge} ${st.outline}`}>{movie.year}</span>
            <span className={`${st.badge} ${st.outline}`}>{movie.episodeCurrent}</span>
          </div>
          <Link href={`/phim/${movie.slug}`} className="text-sm text-primary hover:underline mt-2 flex items-center gap-1">
            Thông tin phim <ArrowRight size={14} />
          </Link>
        </div>
      </div>
      <HtmlRender html={movie.content || ''} className={st.description}/>
  
    </div>
  );
}
