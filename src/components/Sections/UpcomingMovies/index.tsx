import React, { Suspense } from 'react';
import { getHomeMovies } from '@/services/movie';
import UpcomingMoviesClient from './UpcomingMoviesClient';


const UpcomingMovies: React.FC<{
  limit?: number;
  title?: string;
}> = async ({ limit = 8, title = 'Phim Sắp Chiếu' }) => {
  const data = await getHomeMovies(limit);
  
  if (!data || !data.items || data.items.length === 0) {
    return null;
  }

  const cdnImage = `${data.APP_DOMAIN_CDN_IMAGE}`;

  return (
    <UpcomingMoviesClient 
      movies={data.items}
      cdnImage={cdnImage}
      title={title}
    />
  );
};

export default UpcomingMovies;
