import React from "react";
import FormLoc from "./form";
import { getListOption, getMovieByOption } from "@/api/movie.api";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";

export default async function LocMoviePage({
  searchParams,
}: {
  searchParams: Promise<
    {
      type: string;
      country: string;
      page: string;
      category: string;
      year: string;
    }>;
}) {
  const data = await getMovieByOption(
    "phim-moi-cap-nhat",
    (await searchParams).category,
    (await searchParams).country,
    (await searchParams).year,
    (await searchParams).page || "1"
  );

  return (
    <div className="w-full  min-h-[700px] h-[2000px]  ">
      <section className="w-full h-full grid gap-4 xl:grid-cols-5 ">
        {data.data.items.map((item: any) => (
          <Card
            className="h-[404px] rounded-md overflow-hidden relative"
            key={item._id}
          >
            <CardContent className="h-full  w-full flex flex-col aspect-square items-center justify-center ">
              <Link href={"/details/" + item.slug} className="w-full h-full">
                <Image
                  src={process.env.BASE_IMAGE_URL + item.thumb_url}
                  alt={item.name}
                  width={175}
                  height={270}
                  loading="lazy"
                  className="w-full h-5/6"
                />
                <span className="h-1/6  w-full p-1 text-md font-semibold">
                  {item.name}
                </span>
              </Link>
            </CardContent>
            <div className="h-6 text-sm w-full flex justify-between pt-1 px-1 absolute top-0 right-0 dark:text-white font-[500]">
              {item.episode_current.length > 8 ? (
                <span className="bg-white dark:bg-[#1f1f1f] h-full rounded-full px-2">
                  {item.episode_current.slice(0, 8)}
                </span>
              ) : (
                <span className="bg-white dark:bg-[#1f1f1f] h-full rounded-full px-2">
                  {item.episode_current}
                </span>
              )}

              <span className="bg-white dark:bg-[#1f1f1f] h-full rounded-full px-2">
                {item.lang} / {item.year}
              </span>
            </div>
          </Card>
        ))}
      </section>
    </div>
  );
}
