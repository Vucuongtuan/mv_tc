import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

export default function loading() {
  return (
    <div className="h-[91vh] w-full ">
      <div className="px-2 w-full h-full">
        <section className="w-full h-[400px] flex  sm:h-[400px] lg:h-[500px] min-[200px]:max-md:h-[300px]">
          <div className="w-full h-full ">
            <Skeleton className="w-full h-full" />
          </div>
        </section>
        <section className="w-full h-[450px] sm:h-[380px] md:h-[480px] min-[200px]:max-md:h-[300px]  xs:bg-black  my-3">
          <h3 className="text-3xl font-semibold p-2  text-black dark:text-white">
            <Skeleton className="w-[200px] h-full" />
          </h3>
          <div className="h-[85%] my-2 grid grid-cols-5 gap-4">
            {Array(5)
              .fill(0)
              .map((_, index) => (
                <div
                  key={index + 1}
                  className="h-full w-full shadow-xl rounded-md overflow-hidden"
                >
                  <Skeleton className="w-full h-full" />
                </div>
              ))}
            {/* <CarouselSize data={data} /> */}
          </div>
        </section>
        <section className="w-full h-[450px] sm:h-[380px] md:h-[480px] min-[200px]:max-md:h-[300px]  xs:bg-black  my-3">
          <h3 className="text-3xl font-semibold p-2  text-black dark:text-white">
            <Skeleton className="w-[200px] h-full" />
          </h3>
          <div className="h-[85%] my-2 grid grid-cols-5 gap-4">
            {Array(5)
              .fill(0)
              .map((_, index) => (
                <div
                  key={index + 1}
                  className="h-full w-full shadow-xl rounded-md overflow-hidden"
                >
                  <Skeleton className="w-full h-full" />
                </div>
              ))}
            {/* <CarouselSize data={data} /> */}
          </div>
        </section>
        <section className="w-full h-[450px] sm:h-[380px] md:h-[480px] min-[200px]:max-md:h-[300px]  xs:bg-black  my-3">
          <h3 className="text-3xl font-semibold p-2  text-black dark:text-white">
            <Skeleton className="w-[200px] h-full" />
          </h3>
          <div className="h-[85%] my-2 grid grid-cols-5 gap-4">
            {Array(5)
              .fill(0)
              .map((_, index) => (
                <div
                  key={index + 1}
                  className="h-full w-full shadow-xl rounded-md overflow-hidden"
                >
                  <Skeleton className="w-full h-full" />
                </div>
              ))}
            {/* <CarouselSize data={data} /> */}
          </div>
        </section>
        {/* <Skeleton className="w-full h-full" /> */}
      </div>
    </div>
  );
}
