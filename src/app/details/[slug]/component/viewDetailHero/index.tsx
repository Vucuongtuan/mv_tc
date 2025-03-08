"use client";
import { AddMovieToList } from "@/api/auth.api";
import { useToast } from "@/components/ui/use-toast";
import { RootState } from "@/lib/redux";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React, { useCallback, useState } from "react";
import { useSelector } from "react-redux";

export default function ViewDetailsHero({
  data,
  url,
  token,
}: {
  data: any;
  url: string | undefined;
  token: string | undefined;
}) {
  const { toast } = useToast();
  const dataUser = useSelector((state: RootState) => state.checkAuth.dataAuth);
  const [onTrailer, setOnTrailer] = useState<boolean>(false);
  const trailerFrame = (): any => {
    return (
      <iframe
        width="auto"
        height="500"
        src={data.item.trailer_url
          .replace("https://www.youtube.com", "https://www.youtube.com/embed")
          .replace("/watch?v=", "/")}
        title={data.item.name}
        allow="autoplay"
        className="w-full h-full object-cover rounded-md"
      ></iframe>
    );
  };
  const { data: session, status } = useSession();

  const handleAddMovieToList = useCallback(async (movie: any) => {
    if (token === undefined) {
      alert("Vui lòng đăng nhập để có thể lưu phim");
    } else {
      const local =
        typeof window !== "undefined"
          ? JSON.parse(localStorage.getItem("profileUser") ?? "")
          : undefined;
      const res = await AddMovieToList(local.email, {
        name: movie.name,
        slug: movie.slug,
        tap: movie.episode_current,
        thumb_url: movie.thumb_url,
        poster_url: movie.poster_url,
      });

      if (res.status === "success") {
        toast({
          title: "Thêm phim vào danh sách thành công",
        });
      } else {
        toast({
          title: "Thêm phim vào danh sách thất bại",
          description: `${res.message}`,
          variant: "destructive",
        });
      }
    }
    // const res = await AddMovieToList(dataUser.id, dataUser);
  }, []);
  return (
    <div className="h-full min-h-[400px] w-full relative">
      <section
        className={`w-full ${
          onTrailer
            ? "xl:h-[600px] min-[200px]:h-[400px]"
            : " xl:h-[600px] min-[200px]:h-[400px]"
        } transition-all duration-500  flex relative my-2 `}
      >
        {onTrailer ? (
          data.item.trailer_url.length > 1 ? (
            trailerFrame()
          ) : (
            <>
              <Image
                src={url + data.item.poster_url}
                alt={data.item.name}
                width={1032}
                height={580}
                className="h-full w-full  object-cover object-center rounded-md "
              />
            </>
          )
        ) : (
          <>
            <div className="w-full h-full relative ">
              <Image
                src={url + data.item.poster_url}
                alt={data.item.name}
                width={476}
                height={267}
                className="h-full w-full  object-cover object-top rounded-md brightness-50"
              />{" "}
              <div className=" absolute w-full z-10 h-1/6 bottom-0 bg-gradient-to-t from-[rgb(255,255,255)] via-[rgba(255,255,255,0.69)] to-[rgba(0,0,0,0)] dark:from-[rgb(0,0,0)] dark:via-[rgba(0,0,0,0.69)] dark:to-[rgba(0,0,0,0)]"></div>
            </div>
            <div className="absolute h-full w-full flex justify-center items-center group  z-9 ">
              <div className="h-32 w-32">
                {" "}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className=" w-32 h-32 group-hover:text-red-500 cursor-pointer"
                  onClick={() => setOnTrailer(true)}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112Z"
                  />
                </svg>
              </div>
            </div>
          </>
        )}
      </section>
      <section
        className={`h-auto w-full  flex min-[200px]:max-lg:flex-col  transition-all absolute  duration-500 z-50 ${
          onTrailer ? "mt-0 px-0" : "-mt-36 px-4"
        }`}
      >
        <div className="w-[20%] h-full xl:[w-20%] lg:w-[18%] lg:max-xl:w-[22%] md:w-[30%] min-[200px]:max-lg:m-auto min-[200px]:max-lg:w-[60%]">
          <Image
            src={url + data.item.thumb_url}
            alt={data.item.name}
            width={200}
            height={400}
            className="w-full h-[85%] rounded-md"
          />
          <div className="h-[15%]  w-full py-2">
            {data.item.episodes[0].server_data[0].slug === "" ? (
              <button
                className=" w-full h-[100%] py-2 bg-red-500 rounded-md hover:bg-red-600"
                onClick={() => setOnTrailer(true)}
              >
                Trailer
              </button>
            ) : (
              <div className="flex mt-1">
                <Link
                  href={`/phim/${data.item.slug}/${
                    data.item.episodes[0].server_data[0].slug === "full"
                      ? "full"
                      : `tap-1`
                  }`}
                  className=" w-2/3 h-[100%] py-2 bg-red-500 rounded-md hover:bg-red-600"
                >
                  <button className="w-full h-[100%]">Xem phim</button>
                </Link>
                <button
                  className="w-1/3 bg-red-500 rounded-md ml-1 flex justify-center items-center"
                  title="Thêm vào danh sách xem sau"
                  onClick={() => handleAddMovieToList(data.item)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z"
                    />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="w-[70%] px-2 h-full min-[200px]:max-lg:w-full">
          <h1 className="text-5xl font-bold text-red-600 dark:text-white min-[200px]:max-lg:text-4xl">
            {data.item.name}
          </h1>
          <p>
            <label
              className="text-lg dark:text-white font-semibold"
              htmlFor={data.item.origin_name}
            >
              {data.item.origin_name}
            </label>
          </p>
          <p className="dark:text-white font-semibold">
            <span className="border-r-2 border-col-white">
              {data.item.episode_current}
            </span>
            {"  | "}
            <span className="border-r-2 border-col-white">
              {data.item.time}
            </span>
            {"  | "}
            <span className="border-r-2 border-col-white">
              {data.item.year}
            </span>
            {"  | "}
            <span className="border-r-2 border-col-white">
              {data.item.lang}
            </span>
          </p>{" "}
          <p className="dark:text-white font-semibold">
            {data.item.country.map((country: any) => (
              <span key={country.id}>Quốc gia : {country.name}</span>
            ))}
          </p>
          <p className="flex flex-wrap mt-2 dark:text-white font-semibold">
            {data.item.category.map((category: any) => (
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
            {" "}
            <span className="">
              Đạo diễn :{" "}
              {data.item?.director.map((director: any) => director).join(", ")}{" "}
            </span>
          </p>
          <p>
            <span className="">
              Diễn viên :{" "}
              {data.item?.actor &&
                data.item?.actor.map((actor: any) => actor).join(", ")}{" "}
            </span>
          </p>
          <p className="mt-1">
            {" "}
            <div
              className=" "
              dangerouslySetInnerHTML={{ __html: data.item.content }}
            ></div>
          </p>
        </div>
      </section>
    </div>
  );
}
