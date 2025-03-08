"use client";
import React, { ChangeEvent, useCallback, useState } from "react";
import { getMovieSearch } from "@/api/movie.api";
import debounce from "lodash.debounce";
import Image from "next/image";
import { Card, CardContent } from "../ui/card";
import Link from "next/link";
import { Skeleton } from "../ui/skeleton";
export default function SearchBox() {
  const [dataResult, setDataResult] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [inputClicked, setInputClicked] = useState(false);
  const [loadtMode, setLoadMode] = useState<number>(1);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleChangeInput = useCallback(
    debounce(async (e: any) => {
      setLoading(true);
      try {
        if (e.length > 0) {
          setInputClicked(true);
        } else {
          setInputClicked(false);
        }
        const res = await getMovieSearch(e.toLowerCase(), loadtMode);

        setDataResult(res);
        if (e.length === 0) {
          setDataResult([]);
        }
      } catch (err) {
        setDataResult([]);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    }, 1000),
    []
  );

  return (
    <>
      <section className="h-[100px] w-[40%] min-[200px]:max-lg:w-[90%]   mx-auto mt-12">
        <div className="h-full w-full flex justify-center items-center  ">
          <div className="w-full flex relative">
            <input
              type="text"
              className="w-full h-[60px] rounded-full px-12 text-lg border-2 outline-none"
              placeholder="Tìm kiếm"
              onChange={(e) => handleChangeInput(e.target.value)}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 absolute left-4 top-[18px]"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
          </div>
        </div>
      </section>
      {loading ? (
        <Skeleton className="h-full w-full min-h-[1200px]" />
      ) : dataResult.length === 0 ? (
        <div className="">
          <Image
            src="/search.svg"
            alt="Tìm kiếm"
            width={400}
            height={800}
            className="h-full m-auto mt-2"
          />
        </div>
      ) : (
        <div className="w-full h-full min-h-[1200px] overflow-y-scroll grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {dataResult.status === false || dataResult.data.items.length === 0 ? (
            <div className="w-full h-full text-center">Không có data</div>
          ) : (
            dataResult?.data &&
            dataResult?.data?.items?.map((item: any) => (
              <Card
                className="h-full rounded-md overflow-hidden relative"
                key={item.slug}
              >
                <CardContent className="h-full  w-full flex flex-col aspect-square items-center justify-center ">
                  <Link
                    href={"/details/" + item.slug}
                    className="w-full h-full"
                  >
                    <Image
                      src={`${"https://img.ophim.live/uploads/movies/"}${
                        item.thumb_url
                      }`}
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
            ))
          )}
        </div>
      )}
    </>
  );
}
