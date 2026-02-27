import st from './hero-details.module.scss'
import Image from '@/components/Commons/Image';
import { getImageUrl } from '@/utils/mapperData';
import { HeroSlideData, Movie } from '@/types/type';
import clsx from 'clsx';
import { Suspense } from 'react';

export default function HeroDetails({ movie, deepImage }: { movie: Movie, deepImage: HeroSlideData }) {

    return (
        <>
        <div className={st.backdrop}>
            <Suspense>
            <Image src={getImageUrl(deepImage.images?.primaryBackdrop,'w92')} alt={'backdrop'} fill />
            </Suspense>
        </div>
        <section aria-label="Hero Details" className={st.container}>
           <figure className={clsx(st.background)}>
            <Suspense>
            <Image src={getImageUrl(deepImage.images?.primaryBackdrop,'original')} alt={movie?.name} fill priority placeholder='blur'/>
            </Suspense>
           </figure>
        </section>
        </>
    );
}
