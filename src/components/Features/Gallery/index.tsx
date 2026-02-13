"use client"
import { Movie } from "@/types/type";
import { useQuery } from "@tanstack/react-query";
import MovieCard from "../MovieCard";
import GallerySkeleton from "./Skeleton";
import { useMemo, useState, ViewTransition } from "react";
import { Pagination } from "./Paginations";
import { initDataList } from "@/services/actions";
import { useSearchParams } from "next/navigation";
import { HomeMoviesResponse } from "@/services/movie";

interface MovieGalleryProps {
  slug: string;
  type: 'genre' | 'country' | 'topic';
  initData?: HomeMoviesResponse | null;
}

export default function MovieGallery({ slug, type, initData }: MovieGalleryProps) {
  const searchParams = useSearchParams();
  const [page, setPage] = useState(1);
  const limit = 24;

  const queryParams = useMemo(() => {
    const params: Record<string, string> = {};
    
    const country = searchParams.get('country');
    const category = searchParams.get('category');
    const year = searchParams.get('year');
    const sortField = searchParams.get('sort_field');
    const sortType = searchParams.get('sort_type');

    if (country) params.country = country;
    if (category) params.category = category;
    if (year) params.year = year;
    if (sortField) params.sort_field = sortField;
    if (sortType) params.sort_type = sortType;

    return params;
  }, [searchParams]);

  const finalParams = useMemo(() => ({
    ...queryParams,
    page: page.toString(),
    limit: limit.toString(),
    sort_field: queryParams.sort_field || 'modified.time',
    sort_type: queryParams.sort_type || 'desc',
  }), [queryParams, page, limit]);

  const isInitialPage = page === 1 && Object.keys(queryParams).length === 0;

  const { data, isFetching, error, isLoading } = useQuery({
    queryKey: ['movies', slug, type, JSON.stringify(finalParams)],
    queryFn: () => initDataList(slug, type, finalParams),
    staleTime: 1000 * 60 * 5,
    ...(isInitialPage && initData ? { initialData: initData } : {}),
  });

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const items = data?.items ?? [];
  const totalPages = data?.pagination?.pageRanges ?? 1;
  const cdnImage = data?.APP_DOMAIN_CDN_IMAGE;

  if (isLoading || (isFetching && !data)) {
    return (
      <>
        <GallerySkeleton />
        <div className="mt-8">
          <Pagination
            page={page}
            totalPages={totalPages}
            onChange={handlePageChange}
          />
        </div>
      </>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-400">
        Có lỗi xảy ra khi tải dữ liệu
      </div>
    );
  }

  return (
    <>
      <div className="relative">
        {/* Subtle loading overlay for page transitions */}
        {isFetching && (
          <div className="absolute inset-0 z-10 bg-background/50 backdrop-blur-[1px] rounded-lg transition-opacity duration-300" />
        )}

        <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {items.map((item: Movie) => (
            <li key={item._id}>
              <ViewTransition name={`poster-pt-${item.slug}`} share="poster-shared">
                <MovieCard 
                  movie={{
                      ...item, 
                      thumb_url: cdnImage ? `${cdnImage}/uploads/movies/${item.thumb_url}` : item.thumb_url, 
                      poster_url: cdnImage ? `${cdnImage}/uploads/movies/${item.poster_url}` : item.poster_url
                  }} 
                  activeHover={true} 
                  />
                  </ViewTransition>
            </li>
          ))}

          {items.length === 0 && (
            <li className="col-span-full text-center text-gray-500 py-8">
              Không tìm thấy phim phù hợp
            </li>
          )}
        </ul>
      </div>

      <Pagination
        page={page}
        totalPages={totalPages}
        onChange={handlePageChange}
      />
    </>
  );
}