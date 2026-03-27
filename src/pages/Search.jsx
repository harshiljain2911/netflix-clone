import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fetchFromTMDB, fetchTrailer } from '../services/tmdb';
import { useAnalytics } from '../hooks/useAnalytics';
import { useInfiniteQuery } from '@tanstack/react-query';
import MovieCard from '../components/MovieCard';
import TrailerModal from '../components/TrailerModal';

const fetchSearchResults = async ({ pageParam = 1, queryKey }) => {
    const [, query] = queryKey;
    if (!query) return { results: [], nextPage: null };
    
    const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
    const url = `https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(query)}&page=${pageParam}&include_adult=false`;
    const data = await fetchFromTMDB(url);
    
    // Filter out non-media items (like people profiles) and items without images
    const validResults = data.results.filter(item => 
        item.media_type !== 'person' && item.backdrop_path
    );
    
    return {
        results: validResults,
        nextPage: data.page < data.total_pages ? data.page + 1 : null
    };
};

const Search = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const [modalTrailer, setModalTrailer] = useState(null);
    const observer = useRef();
    const { trackEvent } = useAnalytics();

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
    } = useInfiniteQuery({
        queryKey: ['search', query],
        queryFn: fetchSearchResults,
        initialPageParam: 1,
        getNextPageParam: (lastPage) => lastPage.nextPage,
        enabled: !!query,
    });

    const lastElementRef = useCallback(node => {
        if (isLoading || isFetchingNextPage) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasNextPage) {
                fetchNextPage();
            }
        });
        if (node) observer.current.observe(node);
    }, [isLoading, isFetchingNextPage, hasNextPage, fetchNextPage]);

    const results = data?.pages.flatMap(page => page.results) || [];

    // Effect to reset scroll top when query changes
    useEffect(() => {
        window.scrollTo(0, 0);
        if (query) {
            trackEvent('search_query', { query });
        }
    }, [query, trackEvent]);

    const handleOpenTrailer = async (movie) => {
        if (!movie?.id) return;
        const trailerKey = await fetchTrailer(movie);
        
        if (trailerKey) {
            setModalTrailer(trailerKey);
        } else {
            setModalTrailer('NOT_FOUND');
        }
    };

    return (
        <div className="w-full text-white min-h-screen bg-[#141414] pt-[120px] px-4 md:px-14 pb-20">
            <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
                    Results for "{query}"
                </h1>
            </div>
            
            {isLoading && !results.length ? (
                <div className="w-full h-[40vh] flex flex-col items-center justify-center">
                    <div className="w-16 h-16 border-4 border-[#333] border-t-[#e50914] rounded-full animate-spin shadow-2xl"></div>
                    <p className="text-gray-400 mt-4 text-sm font-semibold tracking-wider animate-pulse">SEARCHING TMDB...</p>
                </div>
            ) : results.length === 0 ? (
                <div className="flex flex-col items-center justify-center mt-20 text-gray-400">
                    <svg className="w-24 h-24 mb-6 opacity-30 drop-shadow-md" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    <p className="text-xl md:text-2xl font-medium tracking-wide">No recommendations found.</p>
                    <p className="text-sm mt-2">Try adjusting your search to find more movies or TV shows.</p>
                </div>
            ) : (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
                >
                    {results.map((item, index) => {
                        if (results.length === index + 1) {
                            return <div ref={lastElementRef} key={`search-${item.id}-${index}`}><MovieCard item={item} openTrailer={handleOpenTrailer} /></div>;
                        } else {
                            return <MovieCard key={`search-${item.id}-${index}`} item={item} openTrailer={handleOpenTrailer} />;
                        }
                    })}
                </motion.div>
            )}

            {isFetchingNextPage && (
                <div className="w-full py-8 flex justify-center">
                    <div className="w-8 h-8 border-2 border-[#333] border-t-[#e50914] rounded-full animate-spin"></div>
                </div>
            )}

            <TrailerModal trailerKey={modalTrailer} onClose={() => setModalTrailer(null)} />
        </div>
    );
};

export default Search;
