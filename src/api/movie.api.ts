import { IMovieProps } from "@/types/movie.types";
export const BASE_IMAGE_URL = "https://img.ophim.live/uploads/movies/";
export const getMovie = async ({
  type,
  country,
  year,
  category,
  page,
}: IMovieProps) => {
  const res = await fetch(
    `${process.env.BASE_URL_API}/v1/api/danh-sach/${type}?sort_field=modified.time&category=${category}&country=${country}&year=${year}&page=${page}`,
    {
      method: "GET",
      next: { revalidate: 10 },
    }
  );

  const data = await res.json();
  return data;
};
export const getDetailMovie = async (slug: string) => {
  const res = await fetch(`${process.env.BASE_URL_API}/v1/api/phim/${slug}`, {
    method: "GET",
  });
  const data = await res.json();
  return data;
};
export const getDetailMovieServer2 = async (slug: string) => {
  const res = await fetch(`${process.env.SERVER2}/phim/${slug}`, {
    method: "GET",
  });
  const data = await res.json();
  return data;
};
export const getMovieSearch = async (keyword: string, page: number) => {
  const res = await fetch(
    `https://ophim1.com/v1/api/tim-kiem?keyword=${keyword}&page=${page}`,
    { method: "GET" }
  );
  const data = await res.json();
  return data;
};

export const getMovieByOption = async (
  type: string,
  category: string,
  country: string,
  year: string,
  page: string
) => {
  const res = await fetch(
    `https://ophim1.com/v1/api/danh-sach/${type}?sort_field=modified.time&category=${category}&country=${country}&year=${year}&page=${page}`
  );
  const data = await res.json();
  return data;
};
export const getListOption = async (name: string) => {
  const res = await fetch(`https://ophim1.com/v1/api/${name}`, {
    method: "GET",
    next: { revalidate: 5 },
  });
  const data = await res.json();
  return data;
};
export const getMovieSapChieu = async (page: string) => {
  const res = await fetch(
    `${process.env.BASE_URL_API}/v1/api/danh-sach/phim-sap-chieu?page=${page}`,
    {
      method: "GET",
      next: { revalidate: 5 },
    }
  );
  const data = await res.json();
  return data;
};

export const getCategory = async () =>{
  const res = await fetch(`${process.env.BASE_URL_API}/v1/api/the-loai`, {
    method: "GET",
    next: { revalidate: 5 },
  });
  return await res.json()
}

export const getCountry = async() =>{
  const res = await fetch(`${process.env.BASE_URL_API}/v1/api/quoc-gia`, {
    method: "GET",
    next: { revalidate: 5 },
  })
  return await res.json()
}
// {
//   "status": "success",
//   "message": "",
//   "data": {
//     "seoOnPage": {
//       "og_type": "website",
//       "titleHead": "Phim Mới | Phim hay | Xem phim nhanh | Xem phim online | Phim mới vietsub hay nhất",
//       "descriptionHead": "Xem phim mới miễn phí nhanh chất lượng cao. Xem Phim online Việt Sub, Thuyết minh, lồng tiếng chất lượng HD. Xem phim nhanh online chất lượng cao",
//       "og_image": [
//         "/uploads/movies/luu-thuy-dieu-dieu-thumb.jpg",
//         "/uploads/movies/luu-quang-dan-thumb.jpg",
//         "/uploads/movies/cai-chet-cua-bach-tuyet-thumb.jpg",
//         "/uploads/movies/mac-sat-thumb.jpg",
//         "/uploads/movies/thanh-xuan-don-gio-thumb.jpg",
//         "/uploads/movies/emily-o-paris-phan-4-thumb.jpg",
//         "/uploads/movies/pin-pak-tram-cai-toc-hoang-gia-thumb.jpg",
//         "/uploads/movies/mong-manh-de-vo-thumb.jpg",
//         "/uploads/movies/hon-nhan-khong-thua-thiet-thumb.jpg",
//         "/uploads/movies/thien-nhuoc-huu-tinh-i-thumb.jpg",
//         "/uploads/movies/ke-don-duong-1986-thumb.jpg",
//         "/uploads/movies/friday-night-lights-thumb.jpg",
//         "/uploads/movies/lam-gai-tra-thu-thumb.jpg",
//         "/uploads/movies/ong-trum-vung-tulsa-phan-2-thumb.jpg",
//         "/uploads/movies/ong-trum-vung-tulsa-thumb.jpg",
//         "/uploads/movies/tet-o-lang-dia-nguc-thumb.jpg",
//         "/uploads/movies/highandamp-low-ban-dien-anh-2-tan-cung-bau-troi-thumb.jpg",
//         "/uploads/movies/tao-quay-thumb.jpg",
//         "/uploads/movies/than-an-vuong-toa-thumb.jpg",
//         "/uploads/movies/dau-la-dai-luc-2-tuyet-the-duong-mon-thumb.jpg",
//         "/uploads/movies/chuyen-nho-ma-thoi-thumb.jpg",
//         "/uploads/movies/thien-tu-tieu-hong-nuong-thumb.jpg",
//         "/uploads/movies/david-foster-dang-sau-nhung-ban-hit-thumb.jpg",
//         "/uploads/movies/doi-chong-tham-nhung-2-thumb.jpg"
//       ],
//       "og_url": "danh-sach/phim-moi-nhat"
//     },
//     "breadCrumb": [
//       {
//         "name": "Phim Mới",
//         "slug": "/danh-sach/phim-moi-nhat",
//         "isCurrent": false,
//         "position": 2
//       },
//       {
//         "name": "Trang 1",
//         "isCurrent": true,
//         "position": 3
//       }
//     ],
//     "titlePage": "Phim Mới",
//     "items": [
    
//       {
//         "tmdb": {
//           "type": "movie",
//           "id": "367195",
//           "season": null,
//           "vote_average": 5.786,
//           "vote_count": 21
//         },
//         "imdb": {
//           "id": "tt5998744"
//         },
//         "modified": {
//           "time": "2024-09-16T12:45:17.000Z"
//         },
//         "_id": "6228b0cfeb35da19972e26f2",
//         "name": "Đội chống tham nhũng 2",
//         "origin_name": "S Storm",
//         "type": "single",
//         "thumb_url": "doi-chong-tham-nhung-2-thumb.jpg",
//         "time": "1g 34ph",
//         "episode_current": "Full",
//         "quality": "HD",
//         "lang": "Vietsub",
//         "slug": "doi-chong-tham-nhung-2",
//         "year": 2016,
//         "category": [
//           {
//             "id": "620a21b2e0fc277084dfd0c5",
//             "name": "Hành Động",
//             "slug": "hanh-dong"
//           },
//           {
//             "id": "620a2293e0fc277084dfd489",
//             "name": "Phiêu Lưu",
//             "slug": "phieu-luu"
//           }
//         ],
//         "country": [
//           {
//             "id": "62093063196e9f4ab6b448b8",
//             "name": "Trung Quốc",
//             "slug": "trung-quoc"
//           }
//         ],
//         "chieurap": false,
//         "poster_url": "doi-chong-tham-nhung-2-poster.jpg",
//         "sub_docquyen": false
//       }
//     ],
//     "params": {
//       "type_slug": "danh-sach",
//       "filterCategory": [
//         ""
//       ],
//       "filterCountry": [
//         ""
//       ],
//       "filterYear": "",
//       "filterType": "",
//       "sortField": "modified.time",
//       "sortType": "desc",
//       "pagination": {
//         "totalItems": 27289,
//         "totalItemsPerPage": 24,
//         "currentPage": 1,
//         "pageRanges": 5
//       }
//     },
//     "type_list": "phim-moi-nhat",
//     "APP_DOMAIN_FRONTEND": "https://ophim17.cc",
//     "APP_DOMAIN_CDN_IMAGE": "https://img.ophim.live"
//   }
// }