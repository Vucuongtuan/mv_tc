// ==========================================
// Pagination Types
// ==========================================

export interface PaginationProps {
  limit: number;
  page: number;
}

export interface PaginationResponse {
  totalItems: number;
  totalItemsPerPage: number;
  currentPage: number;
  pageRanges: number;
}

// ==========================================
// Movie Types
// ==========================================

export interface TMDBInfo {
  type: 'tv' | 'movie';
  id: string;
  season: number | null;
  vote_average: number;
  vote_count: number;
}

export interface IMDBInfo {
  id: string | null;
  vote_average?: number;
  vote_count?: number;
}

export interface ModifiedInfo {
  time: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Country {
  id: string;
  name: string;
  slug: string;
}

export type MovieType = 'series' | 'single' | 'hoathinh' | 'tvshows';
export type MovieQuality = 'FHD' | 'HD' | 'SD' | 'CAM';

export interface Movie {
  _id: string;
  name: string;
  slug: string;
  origin_name: string;
  alternative_names?: string[];
  type: MovieType;
  poster_url?: string;
  thumb_url: string;
  sub_docquyen: boolean;
  time: string;
  episode_current: string;
  quality: MovieQuality;
  lang: string;
  year: number;
  tmdb: TMDBInfo;
  imdb: IMDBInfo;
  modified: ModifiedInfo;
  category: Category[];
  country: Country[];
  last_episodes?:LastEpisode[];
  trailer_url?: string;
  episodes?: EpisodeServer[];
}

export interface LastEpisode {
  server_name: string;
  is_ai: boolean;
  name: string;
}

// ==========================================
// Movie Detail Types
// ==========================================

export interface CreatedInfo {
  time: string;
}

export interface EpisodeData {
  name: string;
  slug: string;
  filename: string;
  link_embed: string;
  link_m3u8: string;
}

export interface EpisodeServer {
  server_name: string;
  is_ai: boolean;
  server_data: EpisodeData[];
}

export type MovieStatus = 'completed' | 'ongoing' | 'trailer';

export interface MovieDetail extends Omit<Movie, 'modified'> {
  // Thông tin thời gian
  created: CreatedInfo;
  modified: ModifiedInfo;
  
  // Thông tin chi tiết
  content: string;
  status: MovieStatus;
  
  // Flags
  is_copyright: boolean;
  chieurap: boolean;
  
  // Media
  poster_url: string;
  trailer_url: string;
  
  // Episode info
  episode_total: string;
  
  // Notifications
  notify: string;
  showtimes: string;
  
  // Stats
  view: number;
  
  // Cast & Crew
  actor: string[];
  director: string[];
}

// ==========================================
// SEO Types
// ==========================================

export interface SeoOnPage {
  titleHead: string;
  descriptionHead: string;
  og_type: string;
  og_image: string[];
}

// ==========================================
// API Response Types
// ==========================================

export interface MovieListParams {
  type_slug: string;
  filterCategory: string[];
  filterCountry: string[];
  filterYear: string;
  sortField: string;
  pagination: PaginationResponse;
  itemsUpdateInDay: number;
  totalSportsVideos: number;
  itemsSportsVideosUpdateInDay: number;
}

export interface MovieListData {
  seoOnPage: SeoOnPage;
  items: Movie[];
  itemsSportsVideos: unknown[];
  params: MovieListParams;
  type_list: string;
  APP_DOMAIN_FRONTEND: string;
  APP_DOMAIN_CDN_IMAGE: string;
}

export interface MovieListResponse<T> {
  status: string;
  message: string;
  data: T;
}
export interface DetailsResponse extends MovieListData {
item:Movie
} 

export interface MovieDetailResponse {
  status: boolean;
  msg: string;
  movie: MovieDetail;
  episodes: EpisodeServer[];
}

// ==========================================
// Hero Slide Types (for featured movies)
// ==========================================

export interface HeroSlideData {
  _id: string;
  slug: string;
  rank?: string;
  duration: string;
  year: number;
  rating: number;
  title: string;
  originName: string;
  genres: string[];
  description: string;
  backgroundImage: string;
  backgroundPoster: string;
  quality: MovieQuality;
  episodeCurrent: string;
  images?: ImageAssets;
  episodes?: EpisodeServer[];
  trailer_url?: string;
  actor?: string[];
  director?: string[];
  country?: Country[];
  lang?: string;
  type?: MovieType;
  category?: Category[];
  content?: string;
}


export type ImageType = 'poster' | 'backdrop';

export type ImageSize =
  | 'original'
  | 'w92'
  | 'w154'
  | 'w185'
  | 'w300'
  | 'w342'
  | 'w500'
  | 'w780'
  | 'w1280';

  export interface ResolvedImage {
  width: number;
  height: number;
  aspectRatio: number;
  filePath: string;

  urls: Partial<Record<ImageSize, string>>;
}
export interface ImageAssets {
  poster: ResolvedImage[];
  backdrop: ResolvedImage[];
  primaryPoster?: ResolvedImage;
  primaryBackdrop?: ResolvedImage;
}