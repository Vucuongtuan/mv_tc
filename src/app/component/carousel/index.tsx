import * as React from "react";

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { IMovieData } from "@/types/movie.types";
import Image from "next/image";
import Link from "next/link";
import { BlurFade } from "@/components/magicui/blur-fade";

export default function CarouselSize({ data }: { data: any }) {
  return (
    <Carousel
      opts={{
        align: "start",
      }}
      className="w-full h-full px-2 carousel_custom  "
    >
      <CarouselContent>
        {data &&
          data.data.items &&
          data.data.items.map((item: IMovieData, index: number) => (
            <CarouselItem
              key={item._id}
              className="basis-1/3  md:basis-1/4 lg:basis-1/5 xl:basis-1/6 group relative"
            >
              <div  className="h-full">
                <div className="h-full w-full">
                  <Card
                    className="h-full w-full rounded-md overflow-hidden relative border-0 shadow-sm hover:shadow-md transition-shadow duration-300"
                    key={item._id}
                  >
                    <CardContent className="h-full w-full p-0 flex flex-col aspect-square">
                      <Link
                        href={"/details/" + item.slug}
                        className="w-full h-full flex flex-col"
                      >
                        <div className="relative w-full h-[85%]">
                          <Image
                            src={process.env.BASE_IMAGE_URL + item.thumb_url}
                            alt={item.name}
                            width={256}
                            height={384}
                            loading="lazy"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="h-[15%] w-full p-2 text-sm font-medium line-clamp-1 flex items-center">
                          <span>{item.name}</span>
                        </div>
                      </Link>
                    </CardContent>
                    <div className="absolute top-0 right-0 left-0 flex justify-between p-1 text-xs font-medium">
                      <span className="bg-white/90 dark:bg-[#1f1f1f]/90 rounded-full px-2 py-0.5 backdrop-blur-sm truncate max-w-[45%]">
                        {item.episode_current.length > 8
                          ? item.episode_current.slice(0, 8)
                          : item.episode_current}
                      </span>
                      <span className="bg-white/90 dark:bg-[#1f1f1f]/90 rounded-full px-2 py-0.5 backdrop-blur-sm">
                        <span className="md:inline hidden">{item.lang}/</span>
                        {item.year}
                      </span>
                    </div>
                  </Card>
                </div>
              </div>
            </CarouselItem>
          ))}
      </CarouselContent>
      <CarouselPrevious className=" absolute" />
      <CarouselNext />
    </Carousel >
  );
}
