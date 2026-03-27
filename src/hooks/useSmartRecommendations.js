import { useQuery } from '@tanstack/react-query';
import { UserAuth } from '../context/AuthContext';
import { computeUserPreferences } from '../utils/computeUserPreferences';
import { fetchFromTMDB } from '../services/tmdb';

export const useSmartRecommendations = () => {
    const { watchHistory, savedShows, user } = UserAuth();

    const topGenreString = computeUserPreferences(watchHistory, savedShows);

    const { data, isLoading, isError } = useQuery({
        queryKey: ['smart-recommendations', topGenreString, user?.uid],
        queryFn: async () => {
            if (!topGenreString) return [];
            
            const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
            // Use TMDB discover endpoint to build a custom feed
            const url = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${topGenreString}&sort_by=popularity.desc&include_adult=false&page=1`;
            
            const response = await fetchFromTMDB(url);
            
            return response.results.filter(item => item.backdrop_path);
        },
        enabled: !!topGenreString && !!user,
        staleTime: 1000 * 60 * 30, // Cache for 30 minutes
        refetchOnWindowFocus: false
    });

    return { 
        recommendations: data || [], 
        isLoading, 
        isError,
        hasPreferences: !!topGenreString 
    };
};
