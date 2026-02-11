import React, { Suspense } from 'react';
import Link from 'next/link';
import {  getMoviesBySLug } from '@/services/movie';
import styles from './country-stories.module.scss';
import { ChevronRight } from 'lucide-react';
import MovieSectionCarousel from './MovieSectionCarousel';
import MovieCarouselLoading from '@/components/Features/MovieCarousel/Loading';

interface MovieSectionProps {
    slug: string;
    title: string;
    limit?: number; 
    type: 'country' | 'category' | 'topic';
}

const MovieSection: React.FC<MovieSectionProps> = async ({ slug, title, limit = 24, type }) => {
   
    const data = await getMoviesBySLug(slug, limit, type);
    const movies = data?.items || [];
    const cdnImage = `${data?.APP_DOMAIN_CDN_IMAGE}/uploads/movies` || '';

    if (!movies || movies.length === 0) {
        return null;
    }
      const path = type === 'country' ? '/quoc-gia' : type === 'topic' ? '' : '/the-loai'
    return (
        <section className={styles.container}>
            <header className={styles.header}>
                <h2 className={styles.title}>{title}</h2>
                <Link href={`/t${path}/${slug}`} className={styles.viewAll}>
                    Xem tất cả <ChevronRight size={16} />
                </Link>
            </header>
            <Suspense fallback={<MovieCarouselLoading />}>
                <MovieSectionCarousel movies={movies} cdnImage={cdnImage} />
            </Suspense>
        </section>
    );
};

export default MovieSection;
