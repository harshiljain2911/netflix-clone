import { useQuery } from '@tanstack/react-query';
import { fetchFromTMDB } from '../services/tmdb';

export const useMovies = (queryKey, fetchUrl) => {
    return useQuery({
        queryKey: [queryKey, fetchUrl],
        queryFn: () => fetchFromTMDB(fetchUrl),
        enabled: !!fetchUrl, // Only run if a proper URL is passed
        staleTime: 1000 * 60 * 60, // Cache list results for 1 hour to prevent redundant network calls
    });
};
