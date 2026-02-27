import { Metadata } from "next";
import HeroDetails from "@/components/Sections/Hero/HeroDetails";
import MovieInfo from "@/components/Sections/Movie/MovieInfo";
import MovieSection from "@/components/Sections/Movie";
import { getDetailsMovie } from "@/services/movie";
import { deepMergeImage, mapperData } from "@/utils/mapperData";
import { getSlugGenerateStaticParams } from "@/services/movie";
import { notFound } from "next/navigation";
import { MovieJsonLd } from "@/components/Commons/JsonLd";
import { Suspense } from "react";
import MovieCarouselLoading from "@/components/Features/MovieCarousel/Loading";


export async function generateStaticParams(){
    const res = await getSlugGenerateStaticParams(new Date());
    return res.map(s => ({slug: s.slug}));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const [data] = await getDetailsMovie(slug);

    if (!data || !data.item) {
        return {
            title: 'Không tìm thấy phim',
            description: 'Phim bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.',
        };
    }

    const seo = data.seoOnPage;
    
    // Normalize image paths
    const getCdnImageUrl = (url?: string) => {
        if (!url) return '';
        if (url.startsWith('http')) return url;
        return `${data.APP_DOMAIN_CDN_IMAGE}/uploads/movies/${url}`;
    };

    const title = seo?.titleHead || `Phim ${data.item.name} - ${data.item.origin_name}`;
    const description = seo?.descriptionHead || data.item.content?.replace(/(<([^>]+)>)/gi, "") || '';
    
    // Construct images array
    let images: string[] = [];
    if (seo?.og_image && seo.og_image.length > 0) {
        images = seo.og_image.map(getCdnImageUrl);
    } else {
        const thumb = getCdnImageUrl(data.item.thumb_url);
        const poster = getCdnImageUrl(data.item.poster_url);
        if (thumb) images.push(thumb);
        if (poster) images.push(poster);
    }

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            type: (seo?.og_type as any) || 'video.movie',
            images,
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images,
        }
    };
}


function MovieDetailsSkeleton() {
    return (
        <div className="w-full h-[100dvh] bg-background animate-pulse flex flex-col z-50">
            <div className="w-full h-[60vh] md:h-[80vh] bg-neutral-800/50" />
            <div className="max-w-screen-2xl mx-auto w-full p-4 md:p-8 space-y-4 -mt-32 relative z-10">
                <div className="h-10 w-2/3 md:w-1/3 bg-neutral-800 rounded" />
                <div className="h-6 w-1/2 md:w-1/4 bg-neutral-800 rounded" />
                <div className="flex gap-2 mt-4">
                     <div className="h-8 w-20 bg-neutral-800 rounded-full" />
                     <div className="h-8 w-20 bg-neutral-800 rounded-full" />
                </div>
                <div className="h-32 w-full max-w-3xl bg-neutral-800/50 rounded mt-8" />
            </div>
        </div>
    );
}

async function MovieDetailsData({ slug }: { slug: string }) {
    "use memo";
    const [data,err] = await getDetailsMovie(slug);
    if (!data || err || !data.item) return notFound();

    const transformData = mapperData(data.item, data.APP_DOMAIN_CDN_IMAGE);
    const deepImageData = await deepMergeImage(transformData, data.item.slug);

    const relatedCategory = data.item.category?.[0];
  
    return (
        <>
            <MovieJsonLd movie={deepImageData} />
            <HeroDetails movie={data.item} deepImage={deepImageData} />
            <MovieInfo movie={data.item} transformData={deepImageData} />
            {relatedCategory && (
                <Suspense fallback={<MovieCarouselLoading />}>
                    <MovieSection 
                        slug={relatedCategory.slug}
                        title="Phim Liên Quan"
                        type="category"
                        limit={16}
                        excludeSlug={slug}
                        heading="h3"
                    />
                </Suspense>
            )}
        </>
    );
}

export default async function MovieDetailsPage({params}: {params: Promise<{slug: string}>}) {
    const {slug} = await params;
    
    return (
        <main aria-label="Movie Details" className="min-h-screen bg-background">
            <Suspense fallback={<MovieDetailsSkeleton />}>
                <MovieDetailsData slug={slug} />
            </Suspense>
        </main>
    );
}

