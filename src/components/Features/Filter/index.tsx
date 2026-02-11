import { getFilterList } from '@/services/movie';
import FilterClient, { FilterItem, FilterCategory } from './FilterClient';
import { Suspense } from 'react';

interface FilterOptionsProps {
  category?: FilterCategory;
  currentSlug?: string;
}

export default async function FilterOptions({ 
  category = 'topic',
  currentSlug = '',
}: FilterOptionsProps) {
  const [countriesRes, genresRes] = await Promise.all([
    getFilterList({ slug: 'quoc-gia' }),
    getFilterList({ slug: 'the-loai' }),
  ]);

  const countries: FilterItem[] = countriesRes?.data?.items?.map(item => ({
    _id: item._id,
    name: item.name,
    slug: item.slug,
  })) || [];

  const genres: FilterItem[] = genresRes?.data?.items?.map(item => ({
    _id: item._id,
    name: item.name,
    slug: item.slug,
  })) || [];

  return (
    <Suspense fallback={<div className='w-full h-10 bg-gray-800 rounded-lg animate-pulse'></div>}>
    <FilterClient 
      countries={countries}
      genres={genres}
      category={category}
      currentSlug={currentSlug}
      />
      </Suspense>
  );
}