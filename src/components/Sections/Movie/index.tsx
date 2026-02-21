import React, { Suspense } from 'react';
import Link from 'next/link';
import {  getMoviesBySLug } from '@/services/movie';
import styles from './country-stories.module.scss';
import { ChevronRight } from 'lucide-react';
import MovieSectionCarousel from './MovieSectionCarousel';
import MovieCarouselLoading from '@/components/Features/MovieCarousel/Loading';
import clsx from 'clsx';

interface MovieSectionProps {
    slug: string;
    title: string;
    limit?: number; 
    type: 'country' | 'category' | 'topic';
    excludeSlug?: string;
    heading?: 'h2' | 'h3';
}

const MovieSection: React.FC<MovieSectionProps> = async ({ slug, title, limit = 24, type, excludeSlug, heading = 'h2' }) => {
   
    const data = await getMoviesBySLug(slug, limit, type);
    let movies = data?.items || [];
    const cdnImage = `${data?.APP_DOMAIN_CDN_IMAGE}/uploads/movies` || '';

    if (excludeSlug) {
        movies = movies.filter(m => m.slug !== excludeSlug);
    }

    if (!movies || movies.length === 0) {
        return null;
    }
      const path = type === 'country' ? '/quoc-gia' : type === 'topic' ? '' : '/the-loai'
    const Heading = heading;
    return (
        <section className={clsx(styles.container)}>
            <header className={styles.header}>
                <Heading className={styles.title}>{title}</Heading>
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
