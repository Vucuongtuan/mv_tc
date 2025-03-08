"use client";
import { getMovieSearch } from "@/api/movie.api";
import debounce from "lodash.debounce";
import Image from "next/image";
import Link from "next/link";
import React, { useCallback, useMemo, useState } from "react";

export default function Search() {
  const [dataResult, setDataResult] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [inputClicked, setInputClicked] = useState<boolean>(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleChangeInput = useCallback(
    debounce(async (e) => {
      setLoading(true);
      try {
        if (e.length > 0) {
          setInputClicked(true);
        } else {
          setInputClicked(false);
        }
        const res = await getMovieSearch(e.toLowerCase(), 1);
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
  const containerClassName = useMemo(() => {
    return `relative float-right h-full w-full flex justify-end items-end transition-all duration-500 md:justify-center`;
  }, []);

  const resultContainerClassName = useMemo(() => {
    return `absolute h-auto max-h-[400px] w-[350px] top-14 rounded-md overflow-hidden items-start z-40 text-xl leading-[100px] bg-[#1e1e1e] transition-all duration-500 ${
      inputClicked ? "" : "hidden"
    }`;
  }, [inputClicked]);
  return (
    <div className={containerClassName}>
      <input
        type="text"
        className="p-2   rounded-full flex-grow text-black bg-[#c7c6c638] dark:text-white "
        placeholder="Tìm kiếm ...."
        onChange={(e) => handleChangeInput(e.target.value)}
      />
      <div className={resultContainerClassName}>
        {loading ? (
          <div className="flex space-x-2 justify-center py-4 h-screen dark:invert transition-all duration-500">
            <span className="sr-only">Loading...</span>
            <div className="h-5 w-5 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="h-5 w-5 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="h-5 w-5 bg-white rounded-full animate-bounce"></div>
          </div>
        ) : dataResult.length === 0 ? (
          <span className="transition-all duration-500 text-center">
            Không có data
          </span>
        ) : dataResult.data?.data?.items.length === 0 ? (
          <span className="transition-all duration-500 text-center">
            Không có data
          </span>
        ) : (
          <ul className="w-full h-auto max-h-[400px] overflow-y-scroll transition-all duration-500">
            {dataResult &&
              dataResult?.data?.items?.map((item: any) => (
                <Link
                  onClick={() => {
                    setInputClicked(false);
                  }}
                  href={`/details/${item.slug}`}
                  className="my-2 h-[80px]  w-full flex  text-ellipsis overflow-hidden ..."
                  key={item._id}
                >
                  <div className="w-[40%] h-full">
                    <Image
                      src={
                        "https://img.ophim.live/uploads/movies/" +
                        item.poster_url
                      }
                      alt={item.name}
                      height={200}
                      width={200}
                      loading="lazy"
                      className={"w-full h-full rounded-md object-cover"}
                    />
                  </div>
                  <div className="w-[60%] h-full flex flex-col items-start leading-[20px] pl-1 ">
                    <span className=" -py-4 text-[1rem] font-semibold">
                      {item.name}
                    </span>
                    <span className="pr-2 text-[0.8rem] w-full text-ellipsis overflow-hidden">
                      {item.origin_name}
                    </span>
                    <span className="text-[0.8rem]">
                      {item.episode_current} | {item.time}
                    </span>
                    <span className="text-[0.8rem]">{item.year}</span>
                  </div>
                </Link>
              ))}
          </ul>
        )}
      </div>
    </div>
  );
}
