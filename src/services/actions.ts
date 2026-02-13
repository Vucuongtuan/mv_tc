"use server"
import { tryC } from "@/lib/tryCache"
import { HomeMoviesResponse } from "./movie"
import { Movie, MovieListData, MovieListResponse } from "@/types/type"
import { filterMovies } from "@/utils/movie"
import { deepMergeImage, mapperData } from "@/utils/mapperData"


export const initDataList = async (
  slug: string, 
  type: 'genre' | 'country' | 'topic', 
  queryParams?: Record<string, string>
): Promise<HomeMoviesResponse | null> => {
  return await tryC(async () => {
    let path = ''
    if (type === "genre") path = `the-loai/${slug}`
    if (type === "country") path = `quoc-gia/${slug}`
    if (type === "topic") path = `danh-sach/${slug}`

    const params = new URLSearchParams();
    
    if (queryParams) {
      Object.entries(queryParams).forEach(([key, value]) => {
        if (value) params.set(key, value);
      });
    }

    if (!params.has('page')) params.set('page', '1');
    if (!params.has('limit')) params.set('limit', '24');
    if (!params.has('sort_field')) params.set('sort_field', 'modified.time');
    if (!params.has('sort_type')) params.set('sort_type', 'desc');

    const queryString = params.toString();
    const url = `${process.env.BASE_URL_API}/v1/api/${path}${queryString ? `?${queryString}` : ''}`;

    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!res.ok) {
      throw new Error(`Failed to fetch ${type} list: ${res.status}`);
    }

    const response: MovieListResponse<MovieListData> = await res.json();
    const { data } = response;
    
    if (!data || !data.items) {
      return {
        status: response.status || 'error',
        message: response.message || 'No data found',
        items: [],
        pagination: data?.params?.pagination,
        APP_DOMAIN_CDN_IMAGE: data?.APP_DOMAIN_CDN_IMAGE,
      };
    }
     const finalItems = await filterMovies(data.items, {
                    limit: 24,
                    exclude18Plus: true,
                    prioritizeNonCartoon: slug === 'hoat-hinh' ? false : true
                });
    
        return {
          status: response.status,
          message: response.message,
          items: finalItems,
          pagination: data?.params?.pagination,
          APP_DOMAIN_CDN_IMAGE: data?.APP_DOMAIN_CDN_IMAGE,
        };
      })
    }
    
    /**
    
     * Server Action tìm kiếm phim
    
     */
    
    export const searchMovies = async (keyword: string, limit: number = 10): Promise<HomeMoviesResponse | null> => {
    
        return await tryC(async () => {
    
            const url = `${process.env.BASE_URL_API}/v1/api/tim-kiem?keyword=${encodeURIComponent(keyword)}&limit=${limit + 5}`;
    
            const res = await fetch(url, {
    
                method: 'GET',
    
                headers: {
    
                    'Content-Type': 'application/json',
    
                },
    
            });
            if (!res.ok) return null;
            const response: MovieListResponse<MovieListData> = await res.json();
    
            const { data } = response;
    
            const filterItems = await filterMovies(data.items, {
              limit: limit,
              exclude18Plus: true,
              prioritizeNonCartoon: false
            })

            return {
    
                status: response.status,
    
                message: response.message,
    
                items: filterItems,
    
                pagination: data?.params?.pagination,
    
                APP_DOMAIN_CDN_IMAGE: data?.APP_DOMAIN_CDN_IMAGE,
    
            };
    
        })
    
    }
    
    