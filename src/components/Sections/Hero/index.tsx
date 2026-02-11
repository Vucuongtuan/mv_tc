import { HeroSlideData, Movie } from '@/types/type';
import HeroClient from './HeroClient';
import { getHomeMovies } from '@/services/movie';
import { cacheLife } from 'next/cache';
import { mapperData } from '@/utils/mapperData';



export default async function Hero() {

  const docs = await getHomeMovies(6);
  if (!docs || docs.status !== 'success') return null;
  
  const { items: movies, APP_DOMAIN_CDN_IMAGE: cdnImageUrl } = docs;
  const heroSlides = movies.map((movie, index) => mapperData(movie, cdnImageUrl,index));

  return <HeroClient slides={heroSlides} />;
}
