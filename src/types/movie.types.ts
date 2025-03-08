export interface IMovieProps {
  type: string;
  country: string;
  year: String;
  page: string;
  category: string;
}
export interface IMovieData {
  modified: {
    time: string;
  };
  trailer_url: string;
  actor: string[];
  director: any;
  content: string;
  episodes: any;
  _id: string;
  name: string;
  slug: string;
  origin_name: string;
  type: string;
  thumb_url: string;
  poster_url: string;
  sub_docquyen: boolean;
  chieurap: boolean;
  time: string;
  episode_current: string;
  quality: string;
  lang: string;
  year: number;
  category: {
    id: string;
    name: string;
    slug: string;
  }[];
  country: {
    id: string;
    name: string;
    slug: string;
  }[];
}
export interface IMovieTap {
  name: string;
  slug: string;
  finename: string;
  link_embed: string;
  link_m3u8: string;
}
