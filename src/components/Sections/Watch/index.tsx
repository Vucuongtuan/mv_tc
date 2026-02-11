import { getDetailsMovie, getDetailsMovie2 } from "@/services/movie";
import WatchClient from "./WatchClient";
import { notFound } from "next/navigation";
import { deepMergeImage, getImageUrl, mapperData } from "@/utils/mapperData";
import Image from "@/components/Commons/Image";
import st from '../Hero/hero-details.module.scss'
import { EpisodeData } from "@/types/type";
import { Suspense } from "react";


export default async function Watch({slug, chapter}: {slug: string, chapter: string}) {
        const [query1,query2] = await Promise.all([
            getDetailsMovie(slug),
            getDetailsMovie2(slug)
        ])
        const [data1,err1] = query1
        const [data2,err2] = query2
        if ((!data1 && !data2) || (err1 && err2)) {
            notFound();
        }
        const transformData = mapperData(data1.item, data1.APP_DOMAIN_CDN_IMAGE);
        const deepImageData = await deepMergeImage(transformData, data1.item.slug);
          
        const movie = deepImageData;
        let currentEpisode = null;
        let serverList = movie.episodes || [];
    
        for (const server of serverList) {
            const found = server.server_data.find(ep => ep.slug === chapter);
            if (found) {
                currentEpisode = found;
                break;
            }
        }
        if(data2 && data2.length > 0){
            for(const server of data2){
                const found = server.server_data.find((ep:any) => ep.slug === chapter);
                if (found) {
                    currentEpisode = found;
                    break;
                }
            }
        }
    
        if (!currentEpisode && serverList.length > 0 && serverList[0].server_data.length > 0) {
            notFound();
        }
    
    return (
        <article className={'relative'}>
              <div className={st.backdrop}>
            <Image src={getImageUrl(deepImageData.images?.primaryBackdrop,'w92')} alt={'backdrop'} fill />
        </div>
        <div className="relative z-10">
            <Suspense>
                   <WatchClient 
            movie={movie} 
            currentEpisode={currentEpisode as EpisodeData} 
            episodes={serverList} 
            />
            </Suspense>
        </div>
        </article>
    );
}