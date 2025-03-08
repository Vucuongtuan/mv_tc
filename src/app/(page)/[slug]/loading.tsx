import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <main className="h-auto mt-2">
            {/* Carousel skeleton */}
            <section className="w-full h-[400px] flex px-2 xl:h-[500px] 2xl:h-[600px] sm:h-[400px] lg:h-[500px] min-[200px]:max-md:h-[200px]">
                <Skeleton className="w-full h-full" />
            </section>

            {/* Movie list skeletons - showing 5 sections for countries */}
            {[...Array(5)].map((_, index) => (
                <div key={index} className="mt-8 px-2">
                    {/* Title skeleton */}
                    <Skeleton className="h-8 w-48 mb-4" />
                    
                    {/* Movie cards skeleton */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                        {[...Array(6)].map((_, idx) => (
                            <Skeleton key={idx} className="aspect-[2/3] rounded-lg" />
                        ))}
                    </div>
                </div>
            ))}

            {/* View All Countries button skeleton */}
            <div className="mt-8 text-center">
                <Skeleton className="inline-block w-40 h-12 rounded-md" />
            </div>
        </main>
    );
}