import { getDetailMovie, getDetailMovieServer2 } from "@/api/movie.api";
import ViewMovie from "@/app/component/viewMovie";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import React, { Suspense } from "react";

export default async function Phim({
  params,
}: {
  params: Promise<{ slug: string; tap: string }>;
}) {
  try {
    const { tap, slug } = await params;
    const [resServer1, resServer2] = await Promise.all([
      getDetailMovie(slug),
      getDetailMovieServer2(slug)
    ]);
    const server1Data = resServer1?.data?.item;
    const server2Data = resServer2?.movie;
    const episodes1 = server1Data?.episodes?.[0]?.server_data;
    const episodes2 = resServer2?.episodes?.[0]?.server_data;

    if (!episodes1) {
      throw new Error("No valid episode data found");
    }

    const tapMovie = episodes1 || [];
    const tapMovie2 = episodes2 || [];
    console.log(episodes2);

    const tapResult = () => {
      const episode = tapMovie.find((ep: any) => ep.slug === tap);
      const episode2 = tapMovie2.find((ep: any) => ep.slug === tap);
      return {
        link1: episode || [],
        link2: episode2 || [],
      }
      // if (tap === "full") {
      //   return {
      //     link1: tapMovie[0] || null,
      //     link2: tapMovie2[0] || null,
      //   };
      // } else {
      //   const episode = tapMovie.find((ep: any) => ep.slug === tap);
      //   const episode2 = tapMovie2.find((ep: any) => ep.slug === tap);
      //   return {
      //     link1: episode || null,
      //     link2: episode2 || null,
      //   };
      // }
    };
    console.log("asdasd");
    console.log(tapResult());

    return (
      <div className="w-3/4 h-full min-[200px]:max-lg:w-full">
        <div className="h-[500px] w-full min-[200px]:max-md:h-[400px] min-md:max-lg:h-[450px] xl:h-[550px]">
          <Suspense fallback={<Skeleton className="h-full w-full rounded-md" />}>
            <ViewMovie link={tapResult()} />
          </Suspense>
        </div>
        <div className="w-full h-auto mt-2">
          <h1 className="text-4xl py-3 font-semibold min-[200px]:max-md:text-3xl">
            {server1Data?.name || server2Data?.name} |
            {tap === "full" ? "Full" : `Tập ${tap}`}
          </h1>
          <p>
            <label
              className="text-lg dark:text-white font-semibold"
              htmlFor={resServer1.data.item.origin_name || resServer2.movie.origin_name}
            >
              {resServer1.data.item.origin_name || resServer2.movie.origin_name}
            </label>
          </p>
          <p className="dark:text-white font-semibold">
            <span className="">{resServer1.data.item.episode_current || resServer2.movie.episode_current}</span>
            {"  | "}
            <span className="">{resServer1.data.item.time || resServer2.movie.time}</span>
            {"  | "}
            <span className="">{resServer1.data.item.year || resServer2.movie.year}</span>
            {"  | "}
            <span className="">{resServer1.data.item.lang || resServer2.movie.lang}</span>
          </p>{" "}
          <p className="dark:text-white font-semibold">
            {(server1Data?.country || server2Data?.country || []).map((country: any) => (
              <span key={country.id}>Quốc gia : {country.name}</span>
            ))}
          </p>
          <p className="flex flex-wrap mt-2 dark:text-white font-semibold">
            {(server1Data?.category || server2Data?.category || []).map((category: any) => (
              <Link
                href={`/loc-phim/phim-moi?sort_field=modified.time&category=${category.slug}&country=&year=&page=1`}
                key={category.id}
                className="w-auto h-auto min-w-[80px] mr-2 mb-2 px-2 min-h-[20px] text-center rounded-full border border-[#909090]"
              >
                {category.name}
              </Link>
            ))}
          </p>
          <p>
            <span className="">
              Đạo diễn :{" "}
              {(server1Data?.director || server2Data?.director || [])
                .map((director: any) => director)
                .join(", ")}
            </span>
          </p>
          <p>
            <span className="">
              Diễn viên :{" "}
              {(server1Data?.actor || server2Data?.actor || [])
                .map((actor: any) => actor)
                .join(", ")}
            </span>
          </p>
          <p className="mt-1">
            {" "}
            <div
              className=" "
              dangerouslySetInnerHTML={{ __html: resServer1.data.item.content || resServer2.movie.content }}
            ></div>
          </p>
        </div>
      </div>
    );
  } catch (error) {
    console.error(error);

    return (
      <div className="w-full h-screen flex items-center justify-center">
        <h1 className="text-2xl">Unable to load movie data </h1>
        <p>{JSON.stringify(error)}</p>
      </div>
    );
  }
}
