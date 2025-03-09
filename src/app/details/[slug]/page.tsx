import React from "react";
import ViewDetailsHero from "./component/viewDetailHero";
import { getDetailMovie, getDetailMovieServer2 } from "@/api/movie.api";
import { cookies } from "next/headers";
import { Metadata, ResolvingMetadata } from "next";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;
  const product = await getDetailMovie(slug);
  const previousImages = (await parent).openGraph?.images || [];
  const image = process.env.BASE_IMAGE_URL + product?.data.item.poster_url;
  return {
    title: product?.data.seoOnPage.titleHead,
    description: product?.data.seoOnPage.descriptionHead,
    openGraph: {
      title: `${product?.data.seoOnPage.titleHead}`,
      description: product?.data.seoOnPage.descriptionHead,
      images: [{ url: image, width: 800, height: 600 }, ...previousImages],
    },
  };
}
export default async function DetailMovie({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const data = await getDetailMovie((await params).slug);
  const data2 = await getDetailMovieServer2((await params).slug);

  const token = (await cookies()).get("token")?.value;
  return (
    <main className="w-full h-auto min-h-[1500px] px-2 ">
      <div className=" h-auto relative ">
        <ViewDetailsHero
          data={data.data}
          url={process.env.BASE_IMAGE_URL}
          token={token}
        />

      </div>
    </main>
  );
}
