import { tryC, tryCache } from "@/lib/tryCache";
import { Movie, MovieListResponse, PaginationResponse, MovieDetailResponse, MovieListData, DetailsResponse } from "@/types/type";
import { filterMovies } from "@/utils/movie";
import { getTimeNow } from "@/utils/time";
import { cacheLife, cacheTag } from "next/cache";


/*
* static params
*/

export const getTopicParams = async () => {
    return await tryC(async () => {
        const res = await fetch(`${process.env.BASE_URL_API}/v1/api/danh-sach`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!res.ok) {
            throw new Error('Failed to fetch topic params');
        }
        const response: MovieListResponse<MovieListData> = await res.json();
        const { data } = response;
        return data.items;
    })
}



// --- static params



export interface Details {
    [x: string]: any;
    trailer_url: string;
    
}

export const syncDataTMDB = async (type: string, id: string): Promise<Details | null> => {
    'use cache'
    cacheLife('weeks')
    return await tryC(async () => {
        try {
            const url = `${process.env.SERVER2}tmdb/${type}/${id}`;
            const res = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            
            if (!res.ok) {
                console.warn(`Error fetching TMDB data: ${res.status} ${res.statusText} at ${url}`);
                return null;
            }
            const data: Details = await res.json();

            return {
                trailer_url: data?.movie?.trailer_url || '',
            }
        } catch (error) {
            console.error("Error syncDataTMDB:", error);
            return null;
        }
    })
} 

export interface HomeMoviesResponse {
    status: string;
    message: string;
    items: Movie[];
    pagination: PaginationResponse;
    APP_DOMAIN_CDN_IMAGE: string;
}



export const getHomeMovies = async (limit: number = 6): Promise<HomeMoviesResponse | null> => {
    'use cache'
    cacheLife('weeks')
    return await tryC(async () => {
        const res = await fetch(`${process.env.BASE_URL_API}/v1/api/home`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!res.ok) {
            throw new Error('Failed to fetch home movies');
        }
        const response: MovieListResponse<MovieListData> = await res.json();
        const { data } = response;
        
        const finalItems = await filterMovies(data.items, {
            limit: limit,
            exclude18Plus: true,
            prioritizeNonCartoon: true
        });

        return {
            status: response.status,
            message: response.message,
            items: finalItems,
            pagination: data.params.pagination,
            APP_DOMAIN_CDN_IMAGE: data.APP_DOMAIN_CDN_IMAGE,
        };
    })
}

export const getMoviesBySLug = async (slug: string, limit: number = 24,type: 'country' | 'topic' | 'category' = 'country'): Promise<HomeMoviesResponse | null> => {
    "use cache"
    cacheLife("minutes")
    return await tryC(async () => {
        const pth = type === 'country' ? 'quoc-gia' : type === 'topic' ? 'danh-sach' : 'the-loai'
            const url = `${process.env.BASE_URL_API}/v1/api/${pth}/${slug}?limit=${limit}`;
            const res = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!res.ok) {
                console.warn(`Error fetching movies by country: ${res.status} ${res.statusText} at ${url}`);
                return null;
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
                limit: 16,
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
interface TopicFetch {
    data:{
        items:{_id:string,name:string,slug:string}[]
    }
}
export const getFilterList = async ({slug}: {slug: string}): Promise<TopicFetch | null> => {
    "use cache";
    cacheLife("max")
    return await tryC(async () => {
        const res = await fetch(`${process.env.BASE_URL_API}/v1/api/${slug}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!res.ok) {
            throw new Error('Failed to fetch country list');
        }
        const response: TopicFetch = await res.json();
        return response;
    })
}

// Danh sách thể loại ưu tiên hiển thị trên trang chủ
const PRIORITY_GENRES = ['hanh-dong', 'tinh-cam', 'kinh-di', 'vien-tuong', 'hoat-hinh', 'hai-huoc', 'co-trang', 'tam-ly'];

export interface GenrePreview {
    _id: string;
    name: string;
    slug: string;
    thumbnail?: string;
    movieCount?: number;
}

export const getGenreWithPreview = async (): Promise<GenrePreview[] | null> => {
    'use cache'
    cacheLife('weeks')
    return await tryC(async () => {
        // 1. Lấy danh sách thể loại
        const genreData = await getFilterList({ slug: 'the-loai' });
        if (!genreData?.data?.items) return null;

        const allGenres = genreData.data.items;
        
        const selectedGenres: typeof allGenres = [];
        for (const slug of PRIORITY_GENRES) {
            const found = allGenres.find(g => g.slug === slug);
            if (found && selectedGenres.length < 6) {
                selectedGenres.push(found);
            }
        }
        if (selectedGenres.length < 6) {
            for (const genre of allGenres) {
                if (!selectedGenres.find(g => g.slug === genre.slug) && selectedGenres.length < 6) {
                    selectedGenres.push(genre);
                }
            }
        }

        const previews = await Promise.all(
            selectedGenres.map(async (genre) => {
                const movies = await getMoviesBySLug(genre.slug, 1, 'category');
                const thumb = movies?.items?.[0]?.poster_url;
                const cdnImage = movies?.APP_DOMAIN_CDN_IMAGE 
                    ? `${movies.APP_DOMAIN_CDN_IMAGE}/uploads/movies` 
                    : '';
                
                return {
                    _id: genre._id,
                    name: genre.name,
                    slug: genre.slug,
                    thumbnail: thumb ? `${cdnImage}/${thumb}` : undefined,
                    movieCount: movies?.pagination?.totalItems,
                };
            })
        );

        return previews;
    })
}



const LIMIT_DETAILS = process.env.LIMIT_DETAILS || 50

export const getSlugGenerateStaticParams = async (time:Date) => {
    return await tryC(async () => {
        const res = await fetch(`${process.env.BASE_URL_API}/v1/api/danh-sach/phim-moi?page=1&country=han-quoc%2Ctrung-quoc%2Cnhat-ban%2Cau-my&sort_field=modified.time&sort_type=desc&year=${getTimeNow(time,{year:true})}&limit=${LIMIT_DETAILS || 50}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!res.ok) {
            throw new Error('Failed to fetch topic params');
        }
        const response: MovieListResponse<MovieListData> = await res.json();
        const { data } = response;

        const slugs = data.items.map((item: Movie) => ({
            slug: item.slug,
        })) || [];
        return slugs;
    })
}

export const getDetailsMovie = async (slug: string):Promise<[DetailsResponse | null, Error | null]> => {
    'use cache'
    cacheLife('hours')
    cacheTag(`details:${slug}`)
    return await tryCache(async () => {
        const cleanSlug = slug.replace(/^(\/)?phim\//, '');
        const url = `${process.env.BASE_URL_API}/v1/api/phim/${cleanSlug}`;
        const res = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',  
            },
        });
        if (!res.ok) {
            const errorText = await res.text();
            console.error(`Failed to fetch movie details. URL: ${url}, Status: ${res.status} ${res.statusText}, Response: ${errorText}`);
            throw new Error(`Failed to fetch movie details: ${res.status} ${res.statusText}`);
        }
                        const response: MovieListResponse<DetailsResponse> = await res.json();
                        const { data } = response;
                        return data;
                    })
                }

export const getDetailsMovie2 = async (slug: string):Promise<[any | null, Error | null]> => {
    'use cache'
    cacheLife('minutes')
    cacheTag(`details-2:${slug}`)
    return await tryCache(async () => {
         const cleanSlug = slug.replace(/^(\/)?phim\//, '');
        const url = `${process.env.SERVER2}/phim/${cleanSlug}`;
        const res = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',  
            },
        });
        if (!res.ok) {
            const errorText = await res.text();
            console.error(`Failed to fetch movie details. URL: ${url}, Status: ${res.status} ${res.statusText}, Response: ${errorText}`);
            throw new Error(`Failed to fetch movie details: ${res.status} ${res.statusText}`);
        }
                        const response: MovieListResponse<any> = await res.json();
                        return response;
                    })
                }