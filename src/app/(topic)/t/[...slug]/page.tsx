import FilterOptions from "@/components/Features/Filter";
import { FilterCategory } from "@/components/Features/Filter/FilterClient";
import MovieGallery from "@/components/Features/Gallery";
import GallerySkeleton from "@/components/Features/Gallery/Skeleton";
import { getFilterList } from "@/services/movie";
import { initDataList } from "@/services/actions";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cacheLife } from "next/cache";
import { Suspense } from "react";

const TOPIC_LIST = [
  "phim-moi", "phim-bo", "phim-le", "tv-shows", "hoat-hinh", 
  "phim-vietsub", "phim-thuyet-minh", "phim-long-tien", 
  "phim-bo-dang-chieu", "phim-bo-hoan-thanh", "phim-sap-chieu", 
  "subteam", "phim-chieu-rap"
];

const TOPIC_NAMES: Record<string, string> = {
  "phim-moi": "Phim Mới",
  "phim-bo": "Phim Bộ",
  "phim-le": "Phim Lẻ",
  "tv-shows": "TV Shows",
  "hoat-hinh": "Hoạt Hình",
  "phim-vietsub": "Phim Vietsub",
  "phim-thuyet-minh": "Phim Thuyết Minh",
  "phim-long-tien": "Phim Lồng Tiếng",
  "phim-bo-dang-chieu": "Phim Bộ Đang Chiếu",
  "phim-bo-hoan-thanh": "Phim Bộ Hoàn Thành",
  "phim-sap-chieu": "Phim Sắp Chiếu",
  "subteam": "Subteam",
  "phim-chieu-rap": "Phim Chiếu Rạp",
};

type CategoryType = 'quoc-gia' | 'the-loai';

const CATEGORY_CONFIG: Record<CategoryType, {
  title: string;
  filterCategory: FilterCategory;
}> = {
  'quoc-gia': { title: 'Quốc Gia', filterCategory: 'country' },
  'the-loai': { title: 'Thể Loại', filterCategory: 'genre' },
};

type RouteType = 'topic' | 'country' | 'genre' | 'invalid';

interface ParsedRoute {
  type: RouteType;
  category?: FilterCategory;
  slug: string;
  title?: string;
  categoryTitle?: string;
}

async function parseRoute(slugArray: string[]): Promise<ParsedRoute> {
  if (slugArray.length === 1) {
    const slug = slugArray[0];
    if (TOPIC_LIST.includes(slug)) {
      return {
        type: 'topic',
        category: 'topic',
        slug,
        title: TOPIC_NAMES[slug] || slug,
      };
    }
    return { type: 'invalid', slug };
  }

  if (slugArray.length === 2) {
    const [categorySlug, itemSlug] = slugArray;
    const categoryConfig = CATEGORY_CONFIG[categorySlug as CategoryType];
    
    if (!categoryConfig) {
      return { type: 'invalid', slug: itemSlug };
    }

    const res = await getFilterList({ slug: categorySlug });
    const item = res?.data?.items?.find(i => i.slug === itemSlug);
    
    if (!item) {
      return { type: 'invalid', slug: itemSlug };
    }

    return {
      type: categorySlug === 'quoc-gia' ? 'country' : 'genre',
      category: categoryConfig.filterCategory,
      slug: itemSlug,
      title: item.name,
      categoryTitle: categoryConfig.title,
    };
  }

  return { type: 'invalid', slug: slugArray.join('/') };
}

export async function generateStaticParams() {
  const [countriesRes, genresRes] = await Promise.all([
    getFilterList({ slug: 'quoc-gia' }),
    getFilterList({ slug: 'the-loai' }),
  ]);

  const topicParams = TOPIC_LIST.map(slug => ({ slug: [slug] }));

  const countryParams = countriesRes?.data?.items?.map(item => ({
    slug: ['quoc-gia', item.slug],
  })) || [];

  const genreParams = genresRes?.data?.items?.map(item => ({
    slug: ['the-loai', item.slug],
  })) || [];

  return [...topicParams, ...countryParams, ...genreParams];
}

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ slug: string[] }> 
}): Promise<Metadata> {
  const { slug: slugArray } = await params;
  const parsed = await parseRoute(slugArray);

  if (parsed.type === 'invalid') {
    return { title: 'Không tìm thấy | TC Phim' };
  }

  if (parsed.type === 'topic') {
    return { title: `${parsed.title}` };
  }

  return { 
    title: `Phim ${parsed.title} - ${parsed.categoryTitle}` 
  };
}

const findIntidata = async (slug: string, type: 'genre' | 'country' | 'topic', queryParams: Record<string, string>) => {
  'use cache'
  cacheLife('minutes');
  const initData = await initDataList(slug, type, queryParams);
  return initData;
}


async function MovieGallerySection({
  slug, type, queryParams,
}: {
  slug: string;
  type: 'genre' | 'country' | 'topic';
  queryParams: Record<string, string>;
}) {
  const initData = await findIntidata(slug, type as 'genre' | 'country' | 'topic', {
    ...queryParams,
    page: '1',
    limit: '24',
    sort_field: queryParams.sort_field || 'modified.time',
    sort_type: queryParams.sort_type || 'desc',
  });

  return (
    <Suspense fallback={<GallerySkeleton />}>
      <MovieGallery slug={slug} type={type} initData={initData} />
    </Suspense>
  );
}

export default async function CategoryPage({ 
  params,
  searchParams,
}: { 
  params: Promise<{ slug: string[] }>,
  searchParams: Promise<Record<string, string | string[] | undefined>>,
}) {
  const { slug: slugArray } = await params;
  const parsed = await parseRoute(slugArray);
  if (parsed.type === 'invalid') {
    return notFound();
  }

  const rawSearchParams = await searchParams;
  const queryParams: Record<string, string> = {};
  
  const filterKeys = ['country', 'category', 'year', 'sort_field', 'sort_type'];
  for (const key of filterKeys) {
    const value = rawSearchParams[key];
    if (value && typeof value === 'string') {
      queryParams[key] = value;
    }
  }

  return (
    <main className="pt-24 px-4 md:px-8 lg:px-16">
      <section className="max-w-screen-2xl mx-auto">
        <header className="mb-8 space-y-4">
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            {parsed.categoryTitle && (
              <span className="text-gray-400 text-lg font-normal">
                {parsed.categoryTitle}:{' '}
              </span>
            )}
            {parsed.title}
          </h1>
          <FilterOptions 
            category={parsed.category} 
            currentSlug={parsed.slug} 
          />
        </header>
        
          <MovieGallerySection slug={parsed.slug} type={parsed.type} queryParams={queryParams} />
      </section>
    </main>
  );
}

