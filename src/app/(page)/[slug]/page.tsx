import { getCountry, getMovie } from "@/api/movie.api";
import CarouselSlide from "@/app/component/carouselSlide";
import ListMovie from "@/app/component/listMovie";
import { Skeleton } from "@/components/ui/skeleton";
import { notFound } from "next/navigation";
import { cache, Suspense } from "react";


const pageList = ['phim-bo', 'phim-le', 'hoat-hinh', 'phim-chieu-rap', 'phim-sap-chieu']

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
    const slug = (await params).slug;

    if (!pageList.includes(slug)) {
        return notFound();
    }
    const
        newMovie = await
            getMovie({
                type: slug,
                country: "",
                year: new Date().getFullYear().toString(),
                category: "",
                page: "1",
            })
    const renderLimitedCountries = cache(async () => {
        const countryList = await getCountry();
        const data = (countryList.data.items || []).slice(0, 5);

        return (<>
            {await Promise.all(data.map(async (country: { _id: string, name: string, slug: string }) => {
                const getMovieData = await getMovie({
                    type: slug,
                    country: country.slug,
                    year: new Date().getFullYear().toString(),
                    category: "",
                    page: "1",
                })
                if (getMovieData.data.items.length === 0) {
                    return null
                }
                return (
                    <ListMovie
                        key={country._id}
                        name={`Phim ${country.name}`}
                        data={getMovieData}
                        slug={{ type: slug, country: country.slug, category: "" }}
                    />
                )
            }))}
        </>)
    })

    return (<main className="h-auto mt-2">
        <Suspense
            fallback={
                <Skeleton className="w-full h-[400px] flex mx-2 sm:h-[400px] lg:h-[500px] min-[200px]:max-md:h-[300px]" />
            }
        >
            <section className="w-full h-[400px] flex px-2 xl:h-[500px] 2xl:h-[600px] sm:h-[400px] lg:h-[500px] min-[200px]:max-md:h-[200px]">
                <div className="w-full h-full">
                    <CarouselSlide data={newMovie.data} />
                </div>
            </section>
        </Suspense>

        <Suspense fallback={<>Loading ....</>}>
            {renderLimitedCountries()}
        </Suspense>

        <div className="mt-8 text-center">
            <a href="/countries" className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                View All Countries
            </a>
        </div>
    </main>)
}