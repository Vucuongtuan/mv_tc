"use client";
import { AddMovieToList } from "@/api/auth.api";
import { useToast } from "@/components/ui/use-toast";
import Image from "next/image";
import React, { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, Info, Calendar, Clock, Globe, ChevronRight, Menu } from "lucide-react"
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { IMovieData } from "@/types/movie.types";
import Link from "next/link";
import HeroVideoDialog from "@/components/magicui/hero-video-dialog";

export default function ViewDetailsHero({
  data,
  url,
  token,
}: {
  data: { item: IMovieData };
  url: string | undefined;
  token: string | undefined;
}) {
  const { toast } = useToast();

  const [onTrailer, setOnTrailer] = useState<boolean>(false);
  const trailerFrame = (): any => {
    return (
      <div className="relative">
        <HeroVideoDialog
          className="block dark:hidden"
          animationStyle="from-center"
          videoSrc={data.item?.trailer_url
            .replace("https://www.youtube.com", "https://www.youtube.com/embed")
            .replace("/watch?v=", "/")}
          thumbnailSrc="https://startup-template-sage.vercel.app/hero-light.png"
          thumbnailAlt="Hero Video"
        />
        <HeroVideoDialog
          className="hidden dark:block"
          animationStyle="from-center"
          videoSrc={data.item?.trailer_url
            .replace("https://www.youtube.com", "https://www.youtube.com/embed")
            .replace("/watch?v=", "/")}
          thumbnailSrc="https://startup-template-sage.vercel.app/hero-dark.png"
          thumbnailAlt="Hero Video"
        />
      </div>

    );
  };

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
      {/* <section
        className={`w-full ${onTrailer
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
      </section> */}
      <div className="min-h-screen bg-gray-950 text-gray-100 mt-2 rounded-md">
        {/* <div className="lg:hidden  fixed top-0 left-0 right-0 z-50 bg-gray-950 border-b border-gray-800 h-16 flex items-center px-4">
          <Button variant="ghost" size="icon" className="mr-2">
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex-1 truncate">
            <h1 className="text-lg font-bold truncate">{data.name}</h1>
          </div>
          <Button variant="ghost" size="icon" className="ml-2">
            <Heart
              className={cn("h-5 w-5")}
            />
          </Button>
        </div> */}

        <main className=" rounded-md">
          <div className="relative ">
            <div className="relative  rounded-md h-[30vh] sm:h-[40vh] md:h-[50vh] w-full overflow-hidden ">
              <div className="absolute  inset-0 bg-gradient-to-t from-gray-950 via-gray-950/80 to-gray-950/30 z-10 "></div>
              <Image
                src={url + data.item.poster_url}
                alt={data.item.name}
                fill
                className="object-cover object-center"
              />
            </div>

            <div className=" mx-auto px-4 relative z-20 -mt-20 sm:-mt-32 md:-mt-40">
              <div className="flex flex-col md:flex-row gap-6 md:gap-8">
                <div className="flex-shrink-0 mx-auto md:mx-0 w-48 sm:w-56 md:w-64">
                  <div className="relative aspect-[2/3] rounded-xl overflow-hidden shadow-2xl border border-gray-800">
                    <Image
                      src={url + data.item.thumb_url}
                      alt={data.item.name}
                      fill
                      className="object-cover"
                    />

                  </div>
                  <div className="  mt-2 gap-2 sm:gap-3">
                    <Link href={`/phim/${data.item.slug}/${data.item.episodes[0].server_data[0].slug === "full"
                      ? "full"
                      : `tap-1`
                      }`} className="w-full flex px-2 py-3 items-center justify-center rounded-md sm:w-auto bg-red-600 hover:bg-red-700 text-white">
                      <Play className=" h-4 w-4 md:h-5 md:w-5" />
                    </Link>
                  </div>
                  {/* <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span> {data.item.episode_current}</span>
                    </div>
                  </div> */}
                </div>

                <div className="flex-1 space-y-4 md:space-y-6 mt-6 md:mt-0">
                  <div className="hidden md:block">
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-1">{data.item.name}</h1>
                    <h2 className="text-xl md:text-2xl text-gray-400 mb-4">{data.item.origin_name}</h2>
                  </div>

                  <div className="flex flex-wrap gap-2 md:gap-3 mb-4 md:mb-6">
                    {data.item.category && data.item.category.map((cate) => (
                      <Badge key={cate.name} className="bg-red-600 hover:bg-red-700 text-white cursor-pointer">{cate.name}</Badge>
                    ))}
                    <Badge variant="outline" className="text-gray-400 border-gray-700">
                      {data.item.lang}
                    </Badge>
                    <Badge variant="outline" className="text-gray-400 border-gray-700">
                      {data.item.quality}
                    </Badge>

                  </div>

                  <div className="flex flex-wrap items-center gap-3 md:gap-4 mb-4 md:mb-6 text-sm md:text-base">
                    <div className="flex items-center text-gray-400">
                      <Clock className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                      <span>{data.item.episode_current}</span>
                    </div>
                    <div className="flex items-center text-gray-400">
                      <Calendar className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                      <span> {data.item.year}</span>
                    </div>
                    <div className="flex items-center text-gray-400">
                      <Globe className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                      {data.item.country && data.item.country.map((country: any) => (
                        <span key={country._id}> {country.name}</span>
                      ))}
                    </div>
                  </div>



                  <div className="bg-gray-900/50 rounded-xl p-4 md:p-6 border border-gray-800">
                    <h3 className="text-lg md:text-xl font-medium mb-2 md:mb-3 flex items-center">
                      <Info className="mr-2 h-4 w-4 md:h-5 md:w-5 text-gray-400" />
                      Tóm tắt
                    </h3>
                    <p className="text-sm md:text-base text-gray-300 leading-relaxed line-clamp-4 md:line-clamp-none">
                      <div
                        className=" "
                        dangerouslySetInnerHTML={{ __html: data.item.content }}
                      ></div>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className=" mx-auto px-4 mt-8 md:mt-12">
            <div className="bg-gray-900/50 rounded-xl p-4 md:p-6 border border-gray-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg md:text-xl font-medium">Diễn viên & Đạo diễn</h3>
                <Button variant="ghost" className="text-gray-400 hover:text-white text-sm md:text-base">
                  Xem tất cả <ChevronRight className="ml-1 h-3 w-3 md:h-4 md:w-4" />
                </Button>
              </div>

              <div className="mb-6">
                <h4 className="text-sm text-gray-400 mb-2">Đạo diễn:</h4>
                <div className="flex flex-wrap gap-2">
                  {data.item?.director.map((direc: string) => (
                    <Badge key={direc} variant="secondary" className="text-sm py-1 px-3">
                      {direc}
                    </Badge>
                  ))}

                </div>
              </div>

              <div>
                <h4 className="text-sm text-gray-400 mb-2">Diễn viên chính:</h4>
                <div className="flex flex-wrap gap-2">
                  {data.item?.actor.map((ac: string) => (
                    <Badge key={ac} variant="secondary" className="text-sm py-1 px-3">
                      {ac}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className=" mx-auto px-4 py-8 md:py-12">
            <Tabs defaultValue="episodes" className="w-full">
              <TabsList className="w-full ">
                <TabsTrigger value="episodes" className="w-full">Tập phim</TabsTrigger>
              </TabsList>

              <TabsContent value="episodes" className="space-y-4 md:space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg md:text-xl font-medium">Danh sách tập</h3>
                </div>

                <div className="space-y-3 md:space-y-4">
                  {[...data.item.episodes[0].server_data].reverse().map((epi: { filename: string, name: string, slug: string }) => (
                    <Link
                      href={`/phim/${data.item.slug}/${data.item.episodes[0].server_data[0].slug === "full"
                        ? "full"
                        : epi.slug.includes("tap")
                          ? epi.slug
                          : `tap-${epi.slug}`
                        }`}
                      key={epi.slug}
                      className={cn(
                        "flex flex-col sm:flex-row gap-3 md:gap-4 p-3 md:p-4 rounded-xl border border-gray-800 hover:bg-gray-900/50 transition-colors",
                      )}
                    >
                      <div className="relative w-full sm:w-48 h-44 md:h-28 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={url + data.item.thumb_url}
                          alt={`Tập ${data.item.episodes[0].server_data.length - parseInt(epi.name)}`}
                          fill
                          className="object-cover object-bottom md:object-center"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Button size="icon" className="w-10 h-10 rounded-full bg-black/50 hover:bg-red-600">
                            <Play className="h-5 w-5" />
                          </Button>
                        </div>
                        {epi.name === (data.item.episodes[0].server_data.length).toString() && <Badge className="absolute top-2 right-2 bg-red-600">Mới nhất</Badge>}
                      </div>
                      <div className="flex-1 pt-2 sm:pt-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium">{epi.filename}</h4>
                          <span className="text-sm text-gray-400">{data.item.time}</span>
                        </div>
                        <p className="text-sm text-gray-300 mb-2 md:mb-3 line-clamp-2">
                          <div
                            className=" "
                            dangerouslySetInnerHTML={{ __html: data.item.content }}
                          ></div>
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>

              </TabsContent>

              <TabsContent value="similar">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
                  {[...Array(12)].map((_, i) => (
                    <div key={i} className="group">
                      <div className="relative aspect-[2/3] rounded-lg overflow-hidden mb-2">
                        <Image
                          src={`/placeholder.svg?height=300&width=200&text=Similar+${i + 1}`}
                          alt={`Similar show ${i + 1}`}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <Button
                          size="icon"
                          className="absolute right-2 top-2 h-8 w-8 rounded-full bg-black/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100 hover:bg-red-600"
                        >
                          <Play className="h-4 w-4" />
                        </Button>
                      </div>
                      <h4 className="text-sm font-medium text-white truncate">Phim tương tự {i + 1}</h4>
                      <p className="text-xs text-gray-400">2024 • Tình cảm</p>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
      {/* <section
        className={`h-auto w-full  flex min-[200px]:max-lg:flex-col  transition-all absolute  duration-500 z-50 ${onTrailer ? "mt-0 px-0" : "-mt-36 px-4"
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
                  href={`/phim/${data.item.slug}/${data.item.episodes[0].server_data[0].slug === "full"
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
      </section> */}
    </div>
  );
}
{/* <div className="relative">
  <div className="relative h-[55vh] w-full overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/80 to-gray-950/30 z-10"></div>
    <Image
      src={url + data.item.poster_url}
      alt="Yêu Em backdrop"
      fill
      className="object-cover object-center"
      priority
    />
  </div>

  <div className="container mx-auto px-4 relative z-20 -mt-40">
    <div className="flex flex-col md:flex-row gap-8">
      <div className="flex-shrink-0">
        <div className="relative w-64 h-96 rounded-xl overflow-hidden shadow-2xl border border-gray-800">
          <Image
            src="/placeholder.svg?height=384&width=256"
            alt="Yêu Em poster"
            fill
            className="object-cover"
          />
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span>Episode 22/40</span>
            <span>55%</span>
          </div>
          <Progress value={55} className="h-2 bg-gray-800" />
        </div>
      </div>

      <div className="flex-1 space-y-6">
        <div>
          <h1 className="text-4xl font-bold text-white mb-1">Yêu Em</h1>
          <h2 className="text-2xl text-gray-400 mb-4">The Best Thing</h2>

          <div className="flex flex-wrap gap-3 mb-6">
            <Badge className="bg-red-600 hover:bg-red-700 text-white">Chính kịch</Badge>
            <Badge className="bg-red-600 hover:bg-red-700 text-white">Tình Cảm</Badge>
            <Badge variant="outline" className="text-gray-400 border-gray-700">
              2025
            </Badge>
            <Badge variant="outline" className="text-gray-400 border-gray-700">
              Vietsub
            </Badge>
            <Badge variant="outline" className="text-gray-400 border-gray-700">
              Trung Quốc
            </Badge>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center">
              <Star className="w-5 h-5 fill-yellow-500 text-yellow-500 mr-1" />
              <span className="text-lg font-medium">8.7</span>
              <span className="text-gray-500 text-sm ml-1">/10</span>
            </div>
            <div className="flex items-center text-gray-400">
              <Clock className="w-4 h-4 mr-1" />
              <span>42 phút/tập</span>
            </div>
            <div className="flex items-center text-gray-400">
              <Calendar className="w-4 h-4 mr-1" />
              <span>2025</span>
            </div>
            <div className="flex items-center text-gray-400">
              <Globe className="w-4 h-4 mr-1" />
              <span>Trung Quốc</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white">
              <Play className="mr-2 h-5 w-5" />
              Xem ngay
            </Button>
            <Button
              size="lg"
              variant="outline"
              className={cn(
                "border-gray-700 text-gray-300 hover:bg-gray-800",
              )}
            >
              <Heart className={cn("mr-2 h-5 w-5", "fill-pink-500")} />
            </Button>
            <Button size="lg" variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
              <Share2 className="mr-2 h-5 w-5" />
              Chia sẻ
            </Button>
            <Button size="lg" variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
              <Download className="mr-2 h-5 w-5" />
              Tải xuống
            </Button>
          </div>
        </div>

        <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
          <h3 className="text-xl font-medium mb-3 flex items-center">
            <Info className="mr-2 h-5 w-5 text-gray-400" />
            Tóm tắt
          </h3>
          <p className="text-gray-300 leading-relaxed">
            Phim kể về mối quan hệ giữa Thẩm Tích Phàm, một quản lý khách sạn đam mê công việc, và Hà Tô Diệp,
            một bác sĩ Đông y điềm đạm. Vì chứng mất ngủ, cô tìm đến Đông y và tình cờ gặp anh. Ban đầu chỉ là
            bác sĩ và bệnh nhân, nhưng những lần chạm mặt bất ngờ dần kéo họ lại gần nhau. Khi tình cảm này nở,
            cả hai phải đối mặt với những đổ vỡ từ quá khứ và dần tìm thấy ý nghĩa thực sự của tình yêu và đam
            mê của mình.
          </p>
        </div>

<div>
  <div className="flex items-center justify-between mb-3">
    <h3 className="text-xl font-medium">Diễn viên & Đạo diễn</h3>
    <Button variant="ghost" className="text-gray-400 hover:text-white">
      Xem tất cả <ChevronRight className="ml-1 h-4 w-4" />
    </Button>
  </div>
  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
    {[1, 2, 3, 4, 5, 6].map((actor) => (
      <div key={actor} className="group">
        <div className="relative aspect-square rounded-lg overflow-hidden mb-2 bg-gray-800">
          <Image
            src={`/placeholder.svg?height=120&width=120&text=Actor+${actor}`}
            alt={`Actor ${actor}`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <h4 className="text-sm font-medium text-white truncate">Diễn viên {actor}</h4>
        <p className="text-xs text-gray-400 truncate">Vai diễn {actor}</p>
      </div>
    ))}
  </div>
</div>
      </div >
    </div >
  </div >
</div > */}
