import st from './movie-info.module.scss';
import Image from '@/components/Commons/Image';
import Link from 'next/link';
import { Play, Share2, Star, Clock, Calendar, ListPlus, Film } from 'lucide-react';
import { HeroSlideData, Movie, EpisodeServer, EpisodeData } from '@/types/type';
import { YouTubeEmbed } from '@next/third-parties/google';
import { getIdEmbedYoutube } from '@/utils/embed';
import { Suspense } from 'react';
import { getImageUrl } from '@/utils/mapperData';
import Episodes from '@/components/Features/Episodes';
import { Button } from '@/components/Commons/Button';
import Share from '@/components/Commons/Share';

export default function MovieInfo({ movie, transformData }: { movie: Movie, transformData: HeroSlideData }) {
    if (!movie) return null;

    const {
        title,
        originName,
        year,
        rating,
        duration,
        quality,
        lang,
        description,
        episodes = [],
        trailer_url,
        director = [],
        actor = [],
        country = [],
        category = [],
        episodeCurrent,
        images
    } = transformData;

    const hasEpisodes = episodes.length > 0 && episodes[0].server_data.length > 0;
    
    const firstEpisodeLink = hasEpisodes 
        ? `/phim/${movie.slug}/${episodes[0].server_data[0].slug}` 
        : '#';




    return (
        <article className={st.container}>
            {/* --- Header Section --- */}
            <header className={st.headerSection}>
                <figure className={st.posterWrapper}>
                    <div className={st.poster}>
                        <Image src={getImageUrl(images?.primaryPoster,'w500')} alt={title} width={342} height={513} placeholder='blur' />
                        <span className={st.badge}>{quality}</span>
                    </div>
                </figure>

                <div className={st.mainInfo}>
                    <hgroup className={st.titleArea}>
                        <span className={st.subTitle}>{originName} ({year})</span>
                        <h1>{title}</h1>
                    </hgroup>

                    <ul className={st.metaList}>
                        <li className={st.rating} aria-label="Đánh giá">
                            <Star size={16} fill="currentColor" /> {rating || 'N/A'}
                        </li>
                        <li className={st.metaItem}><Calendar size={16} /> {year}</li>
                        <li className={st.metaItem}><Clock size={16} /> {duration}</li>
                        <li className={st.metaItem}>{lang}</li>
                    </ul>

                    <ul className={st.genres} aria-label="Thể loại">
                        {category?.map((cat) => (
                            <li key={cat.id}>
                                <Link href={`/the-loai/${cat.slug}`} className={st.genreTag}>
                                    {cat.name}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    <nav className={st.actionGroup} aria-label="Hành động chính">
                        {hasEpisodes ? (
                            <Link href={firstEpisodeLink} className={st.btnPrimary}>
                                <Play size={20} fill="currentColor" /> Xem Ngay
                            </Link>
                        ) : (
                            <Link href="#trailer-section" className={`${st.btnPrimary} ${st.btnTrailerMode}`}>
                                <Film size={20} /> Xem Trailer
                            </Link>
                        )}
                        <Suspense fallback={<Button variant="accent" size="default" leftIcon={<Share2 size={20} />} />}>
                            <Share title={title} year={year} />
                        </Suspense>
                
                    </nav>
                </div>
            </header>

            <div className={st.contentGrid}>
                <div className={st.leftContent}>
                    <section className={st.section} aria-labelledby="content-heading">
                        <h3 id="content-heading">Nội dung phim</h3>
                        <div 
                            dangerouslySetInnerHTML={{ __html: description || 'Đang cập nhật...' }} 
                            className={`${st.description} prose prose-invert prose-lg md:prose-xl max-w-none`}
                        />
                    </section>
                     {hasEpisodes && (
                      <Episodes episodes={episodes} slug={movie.slug}/>
                        
                    )}
                  
                      {trailer_url && (
                <section id="trailer-section" className={`${st.section} ${st.fullWidthSection}`} aria-labelledby="trailer-heading">
                    <h3 id="trailer-heading">Trailer chính thức</h3>
                    <div className={st.videoContainer}>
                        <YouTubeEmbed 
                            videoid={getIdEmbedYoutube(trailer_url)} 
                            params="autoplay=1&mute=1&controls=1&modestbranding=1&rel=0&loop=1"
                            style="width: 100%; height: 100%; position: absolute; top: 0; left: 0;"
                        />
                    </div>
                </section>
            )}
                </div>

                {/* RIGHT COLUMN: Info & Cast */}
                <aside className={st.rightSidebar}>
                    <section className={st.infoBox} aria-labelledby="details-heading">
                        <h3 id="details-heading">Thông tin chi tiết</h3>
                        <dl className={st.detailList}>
                            <div className={st.detailItem}>
                                <dt className={st.label}>Đạo diễn</dt>
                                <dd className={st.value}>{Array.isArray(director) ? director.join(', ') : (director || 'N/A')}</dd>
                            </div>
                            <div className={st.detailItem}>
                                <dt className={st.label}>Quốc gia</dt>
                                <dd className={st.value}>{country?.map(c => c.name).join(', ')}</dd>
                            </div>
                            <div className={st.detailItem}>
                                <dt className={st.label}>Tình trạng</dt>
                                <dd className={st.value}>{episodeCurrent}</dd>
                            </div>
                            <div className={st.detailItem}>
                                <dt className={st.label}>Định dạng</dt>
                                <dd className={st.value}>{movie.type === 'series' ? 'Phim bộ' : 'Phim lẻ'}</dd>
                            </div>
                        </dl>
                    </section>

                    {actor && actor.length > 0 && (
                        <section className={st.infoBox} aria-labelledby="actors-heading">
                            <h3 id="actors-heading">Dàn diễn viên</h3>
                            <ul className={st.actorList}>
                                {actor.slice(0, 10).map((actorName, idx) => (
                                    <li key={idx} className={st.actorName}>{actorName}</li>
                                ))}
                            </ul>
                        </section>
                    )}
                </aside>
            </div>

          
        </article>
    );
}