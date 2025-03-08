"use client";

import { getMovie } from "@/api/movie.api";
import { useEffect, useState } from "react";
import ListMovie from "./listMovie";
import { useInView } from "react-intersection-observer";

interface Country {
    _id: string;
    name: string;
    slug: string;
}

export default function CountryMovieList({ countries }: { countries: Country[] }) {
    const [visibleCountries, setVisibleCountries] = useState<Country[]>([]);
    const [loadedIndex, setLoadedIndex] = useState(4);
    const [isLoading, setIsLoading] = useState(false);
    const [movieData, setMovieData] = useState<Record<string, any>>({});

    const { ref, inView } = useInView({
        threshold: 0.1,
        triggerOnce: false,
    });

    useEffect(() => {
        if (countries.length > 0) {
            setVisibleCountries(countries.slice(0, loadedIndex));
        }
    }, [countries]);

    useEffect(() => {
        if (inView && !isLoading && loadedIndex < countries.length) {
            loadMoreCountries();
        }
    }, [inView]);

    const loadMoreCountries = async () => {
        if (isLoading || loadedIndex >= countries.length) return;

        setIsLoading(true);

        const nextBatch = countries.slice(loadedIndex, loadedIndex + 4);
        setVisibleCountries([...visibleCountries, ...nextBatch]);
        setLoadedIndex(loadedIndex + 4);

        setIsLoading(false);
    };

    const fetchMovieData = async (country: Country) => {
        if (movieData[country.slug]) return movieData[country.slug];

        const data = await getMovie({
            type: "phim-bo",
            country: country.slug,
            year: new Date().getFullYear().toString(),
            category: "",
            page: "1",
        });

        setMovieData(prev => ({
            ...prev,
            [country.slug]: data
        }));

        return data;
    };

    return (
        <div className="country-list">
            {visibleCountries.map((country, index) => (
                <CountryMovieSection key={country._id} country={country} fetchData={fetchMovieData} />
            ))}

            <div ref={ref} className="load-more-trigger py-4">
                {isLoading && <div className="text-center">Loading more countries...</div>}
            </div>
        </div>
    );
}

function CountryMovieSection({
    country,
    fetchData
}: {
    country: Country,
    fetchData: (country: Country) => Promise<any>
}) {
    const [movieData, setMovieData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            const data = await fetchData(country);
            setMovieData(data);
            setLoading(false);
        };

        loadData();
    }, [country]);

    if (loading) {
        return <div className="py-4">Loading {country.name} movies...</div>;
    }

    if (!movieData || movieData.data.items.length === 0) {
        return null;
    }

    return (
        <ListMovie
            name={`Phim ${country.name}`}
            data={movieData}
            slug={{ type: "phim-bo", country: country.slug, category: "" }}
        />
    );
}