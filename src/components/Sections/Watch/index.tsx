import { getDetailsMovie, getDetailsMovie2 } from "@/services/movie";
import WatchClient from "./WatchClient";
import { notFound } from "next/navigation";
import { deepMergeImage, getImageUrl, mapperData } from "@/utils/mapperData";
import Image from "@/components/Commons/Image";
import st from '../Hero/hero-details.module.scss'
import { EpisodeData, EpisodeServer } from "@/types/type";
import { Suspense } from "react";
import MovieSection from "../Movie";
import MovieCarouselLoading from "@/components/Features/MovieCarousel/Loading";

const getServerCategory = (serverName: string) => {
    const name = serverName.toLowerCase();
    if (name.includes('thuyết minh') || name.includes('thuyet minh')) return 'thuyet-minh';
    return 'vietsub'; 
}

export default async function Watch({slug, watchParams}: {slug: string, watchParams: string[]}) {
        const [query1,query2] = await Promise.all([
            getDetailsMovie(slug),
            getDetailsMovie2(slug)
        ])
        const [data1,err1] = query1
        const [data2,err2] = query2
        if ((!data1 && !data2) || (err1 && err2)) {
            notFound();
        }

        // @ts-expect-error
        const transformData = mapperData(data1?.item, data1?.APP_DOMAIN_CDN_IMAGE);
        // @ts-expect-error
        const deepImageData = await deepMergeImage(transformData, data1?.item?.slug);
        const movie = deepImageData;
        
        const hasCategoryInUrl = watchParams.length > 1;
        const urlCategory = hasCategoryInUrl ? watchParams[0] : 'vietsub';
        const urlEpisodeSlug = hasCategoryInUrl ? watchParams[1] : watchParams[0];

        const primaryServers: EpisodeServer[] = movie.episodes || [];
        const secondaryServers: EpisodeServer[] = data2.episodes || [];
        let targetEpisodeInfo: EpisodeData | null = null;
        for (const server of primaryServers) {
            const found = server.server_data.find(ep => ep.slug === urlEpisodeSlug);
            if (found) {
                targetEpisodeInfo = found;
                break;
            }
        }

        if (!targetEpisodeInfo) notFound();

        const availableSources: any[] = [];
        
        primaryServers.forEach(server => {
            if (getServerCategory(server.server_name) === urlCategory) {
                const ep = server.server_data.find(e => e.slug === urlEpisodeSlug || e.name === targetEpisodeInfo?.name);
                if (ep) {
                    availableSources.push({
                        ...ep,
                        server_name: server.server_name
                    });
                }
            }
        });

        secondaryServers.forEach(server => {
            if (getServerCategory(server.server_name) === urlCategory) {
                const ep = server.server_data.find(e => {
                    const cleanSecondarySlug = e.slug.replace(/^tap-/, '').replace(/^0+/, '');
                    const cleanUrlSlug = urlEpisodeSlug.replace(/^0+/, '');
                    
                    if (cleanSecondarySlug && cleanUrlSlug && cleanSecondarySlug === cleanUrlSlug) return true;

                    const cleanSecondaryName = e.name.replace(/\D/g, '').replace(/^0+/, '');
                    const cleanTargetName = targetEpisodeInfo?.name.replace(/\D/g, '').replace(/^0+/, '');
                    
                    if (cleanSecondaryName && cleanTargetName && cleanSecondaryName === cleanTargetName) return true;
                    
                    return e.name === targetEpisodeInfo?.name;
                });
                if (ep) {
                    availableSources.push({
                        ...ep,
                        server_name: `${server.server_name} (Backup)`
                    });
                }
            }
        });

        if (availableSources.length === 0) notFound();
    
    return (
        <article className={'relative'}>
              <div className={st.backdrop}>
            <Image src={getImageUrl(deepImageData.images?.primaryBackdrop,'w92')} alt={'backdrop'} fill />
        </div>
        <div className="relative z-10">
            <Suspense>
                   <WatchClient 
            movie={movie} 
            currentEpisode={targetEpisodeInfo as EpisodeData} 
            sources={availableSources} 
            episodes={primaryServers}
            />
            </Suspense>
            {data1?.item?.category?.[0] && (
                <Suspense fallback={<MovieCarouselLoading />}>
                    <MovieSection 
                        slug={data1.item.category[0].slug}
                        title="Phim Liên Quan"
                        type="category"
                        limit={16}
                        excludeSlug={slug}
                        heading="h3"
                    />
                </Suspense>
            )}
        </div>
        </article>
    );
}
