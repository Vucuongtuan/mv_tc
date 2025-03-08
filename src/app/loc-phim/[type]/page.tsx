import { getMovieByOption } from "@/api/movie.api";
import Transition from "@/app/transition";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import React from "react";

import { AnimatePresence, motion } from "framer-motion";
export default async function LocMovieType({
  params,
  searchParams,
}: {
  params: Promise<{ type: string }>;
  searchParams: Promise<
    {
      country: string;
      category: string;
      year: string;
      page: string;
    }>;
}) {
  const res = await getMovieByOption(
    (await params).type,
    (await searchParams).category,
    (await searchParams).country,
    (await searchParams).year,
    (await searchParams).page
  );
  const data = res.data.items;
  return (
    <div className="w-full min-h-[700px]">
      <section className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
        {data.map((item: any, index: number) => (
          <Transition key={item._id} index={index}>
            <Card className="rounded-md overflow-hidden relative border shadow-sm hover:shadow-md transition-all duration-300">
              <CardContent className="p-0">
                <Link href={"/details/" + item.slug} className="block">
                  <div className="relative pb-[140%]">
                    <Image
                      src={process.env.BASE_IMAGE_URL + item.thumb_url}
                      alt={item.name}
                      fill
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                      className="object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-2 h-16 flex items-center">
                    <h3 className="text-sm font-medium line-clamp-2">{item.name}</h3>
                  </div>
                </Link>
              </CardContent>

              <div className="absolute top-2 left-0 right-0 flex justify-between px-2">
                <span className="bg-black/70 text-white text-xs rounded-full px-2 py-1 backdrop-blur-sm">
                  {item.episode_current.length > 8
                    ? item.episode_current.slice(0, 8)
                    : item.episode_current}
                </span>

                <span className="bg-black/70 text-white text-xs rounded-full px-2 py-1 backdrop-blur-sm">
                  <span className="hidden sm:inline">{item.lang} / </span>
                  {item.year}
                </span>
              </div>
            </Card>
          </Transition>
        ))}
      </section>
    </div>
  );
}
