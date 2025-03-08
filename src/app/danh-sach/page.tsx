"use client";
import { getListMovie } from "@/api/auth.api";
import React, { useContext, useEffect, useState } from "react";
import NotFound from "./notFound";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { BASE_IMAGE_URL } from "@/api/movie.api";

export default function ListMoviePage() {
  const [data, setData] = useState<any>([]);

  // useEffect(() => {
  //   const local = localStorage.getItem("profileUser") ?? "";
  //   if (local !== undefined) {
  //     const email = JSON.parse(local)?.email;
  //     const getData = async () => {
  //       const res = await getListMovie(email);
  //       setData(res.data.list);
  //     };
  //     getData();
  //   }
  // }, []);

  if (data.length === 0) {
    return <NotFound />;
  }

  return (
    <main className="h-auto w-full px-2">
      <section className="w-full h-fulll flex flex-wrap gap-4">
        {data.map((item: any) => (
          <Card
            className="h-[390px] w-[250px] rounded-md overflow-hidden relative min-[200px]:max-md:h-[290px] min-[200px]:max-md:w-[190px]"
            key={item.name}
          >
            <CardContent className="h-full  w-full flex flex-col aspect-square items-center justify-center ">
              <Link href={"/details/" + item.slug} className="w-full h-full">
                <Image
                  src={BASE_IMAGE_URL + item.thumb_url}
                  alt={item.name}
                  width={175}
                  height={270}
                  loading="lazy"
                  className="w-full h-5/6"
                />
                <span className="h-1/6  w-full p-1 text-md font-semibold min-[200px]:max-md:text-[0.8rem]">
                  {item.name}
                </span>
              </Link>
            </CardContent>
            <div className="h-6 text-sm w-full flex justify-between pt-1 px-1 absolute top-0 right-0 dark:text-white font-[500] min-[200px]:max-md:text-[0.5rem]">
              <span className="bg-white dark:bg-[#1f1f1f] h-full rounded-full px-2">
                {item.tap}
              </span>
            </div>
          </Card>
        ))}
      </section>
    </main>
  );
}
