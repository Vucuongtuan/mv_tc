
import { syncDataTMDB } from "@/services/movie";
import { Movie } from "@/types/type";

interface FilterOptions {
    limit?: number;
    exclude18Plus?: boolean;
    prioritizeNonCartoon?: boolean;
    priorityCountries?: string[];
    priorityYear?: number;
}

const calculateScore = (movie: Movie, currentYear: number, priorityCountries: string[]): number => {
    let score = 0;

    if (movie.year === currentYear) {
        score += 100;
    } else if (movie.year === currentYear - 1) {
        score += 50;
    }

    if (movie.country && movie.country.length > 0) {
        let countryScore = 0;
        
        const defaultPriority = ['han-quoc', 'trung-quoc', 'nhat-ban', 'au-my', 'my', 'anh'];
        const priorities = priorityCountries?.length ? priorityCountries : defaultPriority;

        for (const c of movie.country) {
            const index = priorities.indexOf(c.slug);
            if (index !== -1) {
                const points = Math.max(10, 50 - (index * 10));
                if (points > countryScore) {
                    countryScore = points;
                }
            }
        }
        score += countryScore;
    }
    
    return score;
};


export const filterMovies = async (movies: Movie[], options: FilterOptions = {}): Promise<Movie[]> => {
    const { 
        limit = movies.length, 
        exclude18Plus = true, 
        prioritizeNonCartoon = true,
        priorityCountries,
        priorityYear = new Date().getFullYear()
    } = options;

    let filteredItems = movies;

    if (exclude18Plus) {
        filteredItems = filteredItems.filter(item => {
            const is18Plus = item.category?.some(c => c.slug === 'phim-18');
            return !is18Plus;
        });
    }

    if (!prioritizeNonCartoon) {
        return filteredItems
            .sort((a, b) => calculateScore(b, priorityYear, priorityCountries || []) - calculateScore(a, priorityYear, priorityCountries || []))
            .slice(0, limit);
    }

    const isValidType = (item: Movie): boolean => {
        return item.type === 'series' || item.type === 'single';
    };

    let mainMovies = filteredItems.filter(item => isValidType(item));
    const otherMovies = filteredItems.filter(item => !isValidType(item));

    mainMovies = mainMovies.sort((a, b) => {
        const scoreA = calculateScore(a, priorityYear, priorityCountries || []);
        const scoreB = calculateScore(b, priorityYear, priorityCountries || []);
        return scoreB - scoreA; // Descending score
    });

    let finalItems = [...mainMovies];
    
    if (finalItems.length < limit) {
        const remainingSlots = limit - finalItems.length;
        const sortedOther = otherMovies.sort((a, b) => {
             const scoreA = calculateScore(a, priorityYear, priorityCountries || []);
             const scoreB = calculateScore(b, priorityYear, priorityCountries || []);
             return scoreB - scoreA;
        });
        finalItems = [...finalItems, ...sortedOther.slice(0, remainingSlots)];
    }
    
    const res = await Promise.all(finalItems.map(async(item) => await syncDataTMDB(item.tmdb.type, item.tmdb.id)));
   
    const result = finalItems.map((item, index) => {
        return {
            ...item,
            trailer_url: res[index]?.trailer_url || '',
        }
    }).slice(0, limit);
    
   
    return result;
};
