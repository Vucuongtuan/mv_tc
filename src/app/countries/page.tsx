import { getCountry, getMovie } from "@/api/movie.api";
import React, { Suspense } from "react";
import { Metadata } from "next";
import { Skeleton } from "@/components/ui/skeleton";

const ListMovie = React.lazy(() => import("../component/listMovie"));

export const metadata: Metadata = {
    title: "TC Phim | All Countries",
    description: "Browse movies by country",
};

export default async function CountriesPage() {
    const renderAllCountries = async () => {
        const countryList = await getCountry();
        const data = countryList.data.items || [];

        return (<>
            {await Promise.all(data.map(async (country: { _id: string, name: string, slug: string }) => {
                const getMovieData = await getMovie({
                    type: "phim-bo",
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
                        slug={{ type: "phim-bo", country: country.slug, category: "" }}
                    />
                )
            }))}
        </>)
    }

    return (
        <main className="h-auto mt-2 container mx-auto">

            {renderAllCountries()}

            <div className="mt-8 mb-8">
                <a href="/" className="px-6 py-3 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors">
                    Back to Home
                </a>
            </div>
        </main>
    );
}