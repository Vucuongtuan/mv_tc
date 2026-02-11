import st from './hero-details.module.scss'
import Image from '@/components/Commons/Image';
import { getImageUrl } from '@/utils/mapperData';
import { HeroSlideData, Movie } from '@/types/type';
import { ViewTransition } from 'react';

export default function HeroDetails({ movie, deepImage }: { movie: Movie, deepImage: HeroSlideData }) {
    return (
        <>
        <div className={st.backdrop}>
            <Image src={getImageUrl(deepImage.images?.primaryBackdrop,'w92')} alt={'backdrop'} fill />
        </div>
        <section aria-label="Hero Details" className={st.container}>
           <figure className={st.background}>
            <ViewTransition name={`movie-${movie?.slug}`}>
            <Image src={getImageUrl(deepImage.images?.primaryBackdrop,'original')} alt={movie?.name} fill priority placeholder='blur'/>
            </ViewTransition>
           </figure>
        </section>
        </>
    );
}
