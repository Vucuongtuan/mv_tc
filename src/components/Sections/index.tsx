import React, { Suspense } from "react";
import Hero from "./Hero";
import MovieSection from "./Movie";
import MovieCarouselLoading from "../Features/MovieCarousel/Loading";
import SectionInView from "./SectionInView";
import GenreDiscovery from "./GenreDiscovery";


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
            const fallback = section.section === 'Hero' 
                ? <div className="h-[60vh] md:h-[80vh] w-full bg-neutral-900/50 animate-pulse" /> 
                : <MovieCarouselLoading />;
            
            const content = section.section === 'Hero' ? (
                <Suspense fallback={fallback}>
                    <Hero />
                </Suspense>
            ) : (
                <Suspense fallback={fallback}>
                    <MovieSection slug={section.slug} title={section.title} type={section.type} />
                </Suspense>
            );

            const genreSection = index === 2 ? (
                <SectionInView key="genre-discovery" fallback={<MovieCarouselLoading />}>
                    <Suspense fallback={<MovieCarouselLoading />}>
                        <GenreDiscovery />
                    </Suspense>
                </SectionInView>
            ) : null;

            if (isInitial) {
                return (
                    <React.Fragment key={index}>
                        {content}
                        {genreSection}
                    </React.Fragment>
                )
            }

            return (
                <SectionInView key={index} fallback={fallback}>
                    {content}
                </SectionInView>
            )
        })}
 
        </>
    )
}