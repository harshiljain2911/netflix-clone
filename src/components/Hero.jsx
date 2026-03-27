import React, { useState, useEffect } from 'react';
import { fetchTrailer } from '../services/tmdb';
import { useMovies } from '../hooks/useMovies';
import { motion } from 'framer-motion';
import { useAnalytics } from '../hooks/useAnalytics';

const Hero = ({ fetchUrl, openTrailer }) => {
    const { data, isLoading } = useMovies('hero-movies', fetchUrl);
    const [movie, setMovie] = useState(null);
    const [videoKey, setVideoKey] = useState(null);
    const [showTrailer, setShowTrailer] = useState(false);
    const { trackInteraction } = useAnalytics();

    useEffect(() => {
        let timeoutId;
        const processHeroMovie = async () => {
            if (data?.results?.length > 0 && !movie) {
                const movies = data.results.filter(m => m.backdrop_path);
                if (movies.length > 0) {
                    const randomMovie = movies[Math.floor(Math.random() * movies.length)];
                    setMovie(randomMovie);

                    if (randomMovie?.id) {
                        const fetchedTrailerKey = await fetchTrailer(randomMovie);
                        if (fetchedTrailerKey) {
                            setVideoKey(fetchedTrailerKey);
                            timeoutId = setTimeout(() => {
                                setShowTrailer(true);
                            }, 4000); 
                        }
                    }
                }
            }
        };

        if (data) processHeroMovie();
        
        return () => {
            setShowTrailer(false);
            setVideoKey(null);
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, [data]);

    if (isLoading) {
        return (
            <div className="relative w-full text-white bg-black overflow-hidden flex flex-col justify-center min-h-[85vh] lg:min-h-[100vh]">
                {/* Background Skeleton */}
                <div className="absolute inset-0 z-0 bg-[#0a0a0a]">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]"></div>
                </div>
                
                {/* Gradient Overlays to preserve layout structure during load */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#141414]/95 via-[#141414]/40 to-transparent z-20"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent z-20 mt-auto h-[40%]"></div>

                {/* Content Skeleton */}
                <div className="relative z-30 px-4 md:px-14 w-full md:w-[75%] lg:w-[60%] pt-[25vh] md:pt-[32vh] pb-[15vh]">
                    <div className="w-48 h-4 bg-[#222] rounded mb-3 overflow-hidden relative"><div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div></div>
                    <div className="w-[80%] h-24 md:h-32 lg:h-40 bg-[#222] rounded mb-4 overflow-hidden relative"><div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div></div>
                    
                    {/* Metadata dots skeleton */}
                    <div className="flex gap-3 mb-5">
                        <div className="w-16 h-5 bg-[#222] rounded overflow-hidden relative"><div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div></div>
                        <div className="w-12 h-5 bg-[#222] rounded overflow-hidden relative"><div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div></div>
                        <div className="w-10 h-5 bg-[#222] rounded overflow-hidden relative"><div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div></div>
                    </div>
                    
                    {/* Text lines skeleton */}
                    <div className="w-full h-4 bg-[#222] rounded mb-2 overflow-hidden relative"><div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]"></div></div>
                    <div className="w-[90%] h-4 bg-[#222] rounded mb-2 overflow-hidden relative"><div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]"></div></div>
                    <div className="w-[75%] h-4 bg-[#222] rounded mb-8 overflow-hidden relative"><div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]"></div></div>

                    {/* Buttons skeleton */}
                    <div className="flex space-x-4 mt-6">
                        <div className="w-32 h-10 md:h-12 bg-[#222] rounded-[4px] overflow-hidden relative"><div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]"></div></div>
                        <div className="w-40 h-10 md:h-12 bg-[#222] rounded-[4px] overflow-hidden relative"><div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]"></div></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!movie) {
        return null;
    }

    const releaseYear = movie?.release_date ? movie.release_date.split('-')[0] : movie?.first_air_date ? movie.first_air_date.split('-')[0] : '';
    const voteAvg = movie?.vote_average ? movie.vote_average.toFixed(1) : '';

    return (
        <div className="relative w-full text-white bg-black overflow-hidden flex flex-col justify-center min-h-[85vh] lg:min-h-[100vh]">
            
            {/* Background Media Container (z-0) mapped to absolute inset to fill wrapper */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                
                {/* Fallback Image */}
                <div className={`absolute inset-0 z-10 transition-opacity duration-1000 ${showTrailer ? 'opacity-0' : 'opacity-100'}`}>
                    <img 
                        className="w-full h-full object-cover" 
                        src={`https://image.tmdb.org/t/p/original${movie?.backdrop_path}`} 
                        alt={movie?.title || movie?.name} 
                    />
                </div>
                
                {/* YouTube Trailer Component (renders natively via raw iframe) */}
                {videoKey && (
                    <div className="absolute inset-0 z-0 pointer-events-none scale-[1.35] md:scale-150">
                        <iframe
                            src={`https://www.youtube.com/embed/${videoKey}?autoplay=1&mute=1&controls=0&loop=1&playlist=${videoKey}`}
                            frameBorder="0"
                            allow="autoplay; encrypted-media"
                            allowFullScreen
                            className="absolute inset-0 w-full h-full object-cover opacity-90"
                        />
                    </div>
                )}
            </div>
            
            {/* Gradient Overlays (z-20) */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#141414]/95 via-[#141414]/40 to-transparent z-20"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent z-20 mt-auto h-[40%]"></div>

            {/* Content Container (z-30) - Relative to expand Hero height if text wraps heavily */}
            <div className="relative z-30 px-4 md:px-14 w-full md:w-[75%] lg:w-[60%] pt-[25vh] md:pt-[32vh] pb-[15vh] animate-[slideUp_1s_ease-out]">
                <h3 className="text-[#e50914] font-black uppercase tracking-[0.25em] text-[12px] md:text-sm mb-3 drop-shadow-md hidden md:block">
                    N e t f l i x   O r i g i n a l
                </h3>

                {/* Highly Responsive Title preventing overflow and cutting */}
                <h1 
                    className="font-['Bebas_Neue'] mb-4 drop-shadow-2xl text-white font-bold break-words whitespace-normal"
                    style={{ 
                        fontSize: 'clamp(3rem, 7vw + 2rem, 10rem)', 
                        lineHeight: '0.95', 
                        letterSpacing: '0.03em',
                        wordWrap: 'break-word'
                    }}
                >
                    {movie?.title || movie?.name}
                </h1>

                <div className="flex items-center flex-wrap gap-y-2 gap-x-3 mb-5 text-[14px] md:text-[16px] font-semibold text-white drop-shadow-md">
                    <span className="text-[#46d369] font-bold">98% Match</span>
                    {releaseYear && <span className="text-gray-200">{releaseYear}</span>}
                    {voteAvg && <span className="border border-white/40 px-[6px] py-[1px] text-[11px] md:text-[12px] rounded-[3px] text-gray-300">TV-MA</span>}
                    <span className="border border-white/40 px-[6px] py-[1px] text-[11px] md:text-[12px] rounded-[3px] text-gray-300">HD</span>
                </div>
                
                <p className="text-[#e5e5e5] text-[15px] md:text-[18px] font-normal mb-8 drop-shadow-2xl leading-[1.5] w-full md:max-w-[85%] break-words whitespace-normal">
                    {movie?.overview}
                </p>

                <div className="flex space-x-4 mt-6">
                    <motion.button 
                        onClick={() => {
                            trackInteraction('play_hero', movie);
                            openTrailer(movie);
                        }}
                        whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.8)" }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center justify-center bg-white text-black px-6 md:px-8 py-2 md:py-[12px] rounded-[4px] font-bold text-[1.15rem] shadow-xl"
                    >
                        <svg className="w-8 h-8 mr-1 -ml-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                        </svg>
                        Play
                    </motion.button>
                    <motion.button 
                        onClick={() => trackInteraction('more_info_hero', movie)}
                        whileHover={{ scale: 1.05, backgroundColor: "rgba(109, 109, 110, 0.4)" }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center justify-center bg-[#6d6d6e]/70 text-white px-6 md:px-9 py-2 md:py-[12px] rounded-[4px] font-bold text-[1.15rem] shadow-xl backdrop-blur-sm"
                    >
                        <svg className="w-7 h-7 mr-2 -ml-1 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        More Info
                    </motion.button>
                </div>
            </div>
        </div>
    );
};

export default Hero;
