"use client";

import React from 'react';
import MovieCarousel from '@/components/Features/MovieCarousel';
import MovieCard from '@/components/Features/MovieCard';
import { Movie } from '@/types/type';
import { useMediaQuery } from '@/hooks/useQueryMedia';

interface MovieSectionCarouselProps {
  movies: Movie[];
  cdnImage: string;
}

const MovieSectionCarousel: React.FC<MovieSectionCarouselProps> = ({ movies, cdnImage }) => {
  const isMobile = useMediaQuery("only screen and (max-width: 639px)");
  const isTablet = useMediaQuery("only screen and (min-width: 640px) and (max-width: 1023px)");

  return (
      <MovieCarousel itemWidth={isMobile ? 160 : isTablet ? 240 : 320} gap={16}>
        {movies.map((movie, idx) => (
            <MovieCard
            key={movie._id + '-' + idx}
              activeHover={!isMobile && !isTablet}
              movie={{
                ...movie,
                thumb_url: `${cdnImage}/${movie.thumb_url}`,
                poster_url: `${cdnImage}/${movie.poster_url}`
              }}
            />
        ))}
      </MovieCarousel>
  );
};

export default MovieSectionCarousel;
