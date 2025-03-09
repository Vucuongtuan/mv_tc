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

    // Validate server responses
    const server1Data = resServer1?.data?.item;
    const server2Data = resServer2?.movie;
    const episodes1 = server1Data?.episodes?.[0]?.server_data;
    const episodes2 = resServer2?.episodes?.[0]?.server_data;

    if (!episodes1 && !episodes2) {
      throw new Error("No valid episode data found");
    }

    const tapp = tap ? parseInt(tap.split("-")[1]?.trim()) : 1;
    const tapMovie = episodes1 || [];
    const tapMovie2 = episodes2 || [];

    const tapResult = () => {
      if (tap === "full") {
        return {
          link1: tapMovie[0] || null,
          link2: tapMovie2[0] || null,
        };
      } else if (tap.includes("tap")) {
        const episode = tapMovie.find((ep: any) => parseInt(ep.name) === tapp);
        const episode2 = tapMovie2.find((ep: any) => parseInt(ep.name) === tapp);
        return {
          link1: episode || null,
          link2: episode2 || null,
        };
      }
      return { link1: null, link2: null };
    };

    return (
      <div className="w-3/4 h-full min-[200px]:max-lg:w-full">
        <div className="h-[500px] w-full min-[200px]:max-md:h-[400px] min-md:max-lg:h-[450px] xl:h-[550px]">
          <Suspense fallback={<Skeleton className="h-full w-full rounded-md" />}>
            <ViewMovie link={tapResult()} />
          </Suspense>
        </div>
        <div className="w-full h-auto mt-2">
          <h1 className="text-4xl py-3 font-semibold min-[200px]:max-md:text-3xl">
            {server1Data?.name || server2Data?.name} |{" "}
            {tap === "full" ? "Full" : `Tập ${tap}`}
          </h1>
          {/* Rest of your JSX remains the same, just replace resServer1.data.item with server1Data 
              and resServer2.movie with server2Data */}
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <h1 className="text-2xl">Unable to load movie data</h1>
      </div>
    );
  }
}
