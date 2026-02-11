import HeroDetails from "@/components/Sections/Hero/HeroDetails";
import MovieInfo from "@/components/Sections/Movie/MovieInfo";
import { getDetailsMovie } from "@/services/movie";
import { deepMergeImage, mapperData } from "@/utils/mapperData";
import { getSlugGenerateStaticParams } from "@/services/movie";
import { notFound } from "next/navigation";


export async function generateStaticParams(){
    const res = await getSlugGenerateStaticParams(new Date());
    return res.map(s => ({slug: s.slug}));
}


export default async function MovieDetailsPage({params}: {params: Promise<{slug: string}>}) {
    const {slug} = await params;
    
    const [data,err] = await getDetailsMovie(slug);
    if (!data || err || !data.item) return notFound();

    const transformData = mapperData(data.item, data.APP_DOMAIN_CDN_IMAGE);
    const deepImageData = await deepMergeImage(transformData, data.item.slug);
  
    return (
        <main aria-label="Movie Details">
            <HeroDetails movie={data.item} deepImage={deepImageData} />
            <MovieInfo movie={data.item} transformData={deepImageData} />
        </main>
    );
}