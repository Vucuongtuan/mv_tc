import st from './hero-details.module.scss'
import Image from '@/components/Commons/Image';
import { getImageUrl } from '@/utils/mapperData';
import { HeroSlideData, Movie } from '@/types/type';

export default function HeroDetails({ movie, deepImage }: { movie: Movie, deepImage: HeroSlideData }) {
    return (
        <>
        <div className={st.backdrop}>
            <Image src={getImageUrl(deepImage.images?.primaryBackdrop,'w92')} alt={'backdrop'} fill />
        </div>
        <section aria-label="Hero Details" className={st.container}>
           <figure className={st.background}>
            <Image src={getImageUrl(deepImage.images?.primaryBackdrop,'original')} alt={movie?.name} fill priority placeholder='blur'/>
           </figure>
        </section>
        </>
    );
}
