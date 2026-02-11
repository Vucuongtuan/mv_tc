import { HeroSlideData, ImageAssets, ImageSize, ImageType, Movie, ResolvedImage } from "@/types/type";






export function mapperData(movie: any, cdnImageUrl: string, index?: number): HeroSlideData {
  const typeLabel = movie.type === 'series' ? 'PHIM BỘ' : 'PHIM LẺ';
  
  const getImageUrl = (url: string | undefined): string => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `${cdnImageUrl}/uploads/movies/${url}`;
  };

  const rating = movie.imdb?.vote_average || movie.tmdb?.vote_average || 0;
  
  return {
    _id: movie._id,
    slug: movie.slug,
    ...(index !== undefined && {
      rank: `TOP ${index + 1} ${typeLabel}`,
    }),
    duration: movie.time || 'N/A',
    year: movie.year,
    rating,
    content: movie.content,
    title: movie.name,
    originName: movie.origin_name || '',
    genres: movie.category?.map((cat: any) => cat.name) || [],
    description: movie.content || 'Đang cập nhật...',
    backgroundImage: getImageUrl(movie.thumb_url) || '',
    backgroundPoster: getImageUrl(movie.poster_url) || '',
    quality: movie.quality || 'HD',
    episodeCurrent: movie.episode_current || '',
    episodes: movie.episodes || [],
    trailer_url: movie.trailer_url || '',
    actor: movie.actor || [],
    director: movie.director || [],
    country: movie.country || [],
    lang: movie.lang || '',
    type: movie.type,
    category: movie.category || [],
  };
}

export async function deepMergeImage(hero: HeroSlideData,
  slug: string
): Promise<HeroSlideData> {
  const res = await fetch(
    `https://ophim1.com/v1/api/phim/${slug}/images`
  ).then(r => r.json());

  return {
    ...hero,
    images: mapImages(res.data.images, res.data.image_sizes) || [],
  };
}

export function mapImages(
  images: {
    width: number;
    height: number;
    aspect_ratio: number;
    type: ImageType;
    file_path: string;
  }[],
  imageSizes: {
    poster: Record<string, string>;
    backdrop: Record<string, string>;
  }
): ImageAssets {
  const result: ImageAssets = {
    poster: [],
    backdrop: [],
  };

  for (const img of images) {
    const baseUrls = imageSizes[img.type];
    if (!baseUrls) continue;

    const urls: ResolvedImage['urls'] = {};

    for (const size in baseUrls) {
      urls[size as ImageSize] = `${baseUrls[size]}${img.file_path}`;
    }

    const resolved: ResolvedImage = {
      width: img.width,
      height: img.height,
      aspectRatio: img.aspect_ratio,
      filePath: img.file_path,
      urls,
    };

    result[img.type].push(resolved);
  }

  result.primaryPoster = result.poster[0];
  result.primaryBackdrop = result.backdrop[0];

  return result;
}


const IMAGE_SIZE_PRIORITY: ImageSize[] = [
  'w1280',
  'w780',
  'w500',
  'w342',
  'w300',
  'w185',
  'w154',
  'w92',
  'original',
];
export function getImageUrl(
  image: ResolvedImage | undefined,
  preferredSize: ImageSize = 'w1280'
): string {
  if (!image?.urls) return '';

  const startIndex = IMAGE_SIZE_PRIORITY.indexOf(preferredSize);
  const sizesToTry =
    startIndex >= 0
      ? IMAGE_SIZE_PRIORITY.slice(startIndex)
      : IMAGE_SIZE_PRIORITY;

  for (const size of sizesToTry) {
    const url = image.urls[size];
    if (url) return url;
  }

  return '/public/logoFull.png';
}
