import { getDetailsMovie } from "@/services/movie";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { Suspense } from "react";
import Watch from "@/components/Sections/Watch";


export async function generateMetadata(
  { params }: { params: Promise<{ slug: string; params: string[] }> }
): Promise<Metadata> {
  const { slug, params: watchParams } = await params;
  const chapter = watchParams[watchParams.length - 1];
  const [data,err] = await getDetailsMovie(slug);
  if(!data || err) return {}
  const movie = data?.item;

  if (!movie) return {};

  const seo = data.seoOnPage;

  const title =
    seo?.titleHead ||
    `Xem phim ${movie.name} - Tập ${chapter}`;

  const description =
    seo?.descriptionHead ||
    `Xem phim ${movie.name} tập ${chapter} chất lượng cao, vietsub, thuyết minh.`;

  const images =
    seo?.og_image?.map(url => ({
      url,
      width: 1200,
      height: 630,
      alt: movie.name,
    })) || [];

  return {
    title,
    description,

    openGraph: {
      title,
      description,
      type: (seo?.og_type as any) || 'video.tv_show',
      url: `/${slug}/${watchParams.join('/')}`,
      images,
    },

    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: images.map(img => img.url),
    },

    alternates: {
      canonical: `/${slug}/${watchParams.join('/')}`,
    },
  };
}


export default async function WatchPage({ params }: { params: Promise<{ slug: string, params: string[] }> }) {
    const { slug, params: watchParams } = await params;

    return (
       <main>
         <Suspense>
         <Watch slug={slug} watchParams={watchParams}/>
         </Suspense>
       </main>
    );
}
