import { Suspense } from "react";
import Hero from "./Hero";
import MovieSection from "./Movie";
import UpcomingMovies from "./UpcomingMovies";
import MovieCarouselLoading from "../Features/MovieCarousel/Loading";
import SectionInView from "./SectionInView";


const listSection = [
    {
        slug: 'han-quoc',
        title: 'Phim Hàn Quốc',
        type: 'topic',
        section:'Hero'
    },
    {
        slug: 'han-quoc',
        title: 'Phim Hàn Quốc',
        type: 'country',
        section:'Carousel'
    },
    {
        slug:'trung-quoc',
        title:'Phim Trung Quốc',
        type:'country',
        section:'Carousel'
    },
    {
        slug:'au-my',
        title:'Phim Âu Mỹ',
        type:'country',
        section:'Carousel'
    },
    {
        slug:'thai-lan',
        title:'Phim Thái Lan',
        type:'country',
        section:'Carousel'
    },
    {
        slug:'hoat-hinh',
        title:'Phim Hoạt Hình',
        type:'topic',
        section:'Carousel'
    },
    {
        slug:'phim-sap-chieu',
        title:'Phim Sắp Chiếu',
        type:'topic',
        section:'Carousel'
    },
    {
        slug:'hanh-dong',
        title:'Phim Hành Động',
        type:'category',
        section:'Carousel'
    },
    {
        slug:'tinh-cam',
        title:'Phim Tình Cảm',
        type:'category',
        section:'Carousel'
    }
] as const

export default function Sections() {
    return (
        <>
        {listSection.map((section,index)=>{
            const isInitial = index < 3;
            const fallback = <MovieCarouselLoading />;
            
            const content = section.section === 'Hero' ? (
                <Hero />
            ) : (
                <MovieSection slug={section.slug} title={section.title} type={section.type} />
            );

            if (isInitial) {
                return (
                    <Suspense key={index} fallback={fallback}>
                        {content}
                    </Suspense>
                )
            }

            return (
                <SectionInView key={index} fallback={fallback}>
                    <Suspense fallback={fallback}>
                        {content}
                    </Suspense>
                </SectionInView>
            )
        })}
 
        </>
    )
}