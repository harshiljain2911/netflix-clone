import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchFromTMDB, fetchTrailer } from '../services/tmdb';
import { motion } from 'framer-motion';
import MovieCard from '../components/MovieCard';

const fetchMovieDetails = async (id, type) => {
    const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
    const url = `https://api.themoviedb.org/3/${type}/${id}?api_key=${API_KEY}&language=en-US&append_to_response=credits,similar,videos`;
    return fetchFromTMDB(url);
};

const MovieDetails = () => {
    const { id, type } = useParams(); // URL format: /title/:type/:id (e.g., /title/movie/123)
    const navigate = useNavigate();

    const { data: movie, isLoading, error } = useQuery({
        queryKey: ['movieDetails', type, id],
        queryFn: () => fetchMovieDetails(id, type),
        enabled: !!id && !!type,
    });

    useEffect(() => {
        window.scrollTo(0, 0); // Scroll to top on load
    }, [id]);

    if (isLoading) {
        return (
            <div className="w-full h-screen bg-[#141414] flex justify-center items-center">
                <div className="w-16 h-16 border-4 border-[#333] border-t-[#e50914] rounded-full animate-spin shadow-2xl"></div>
            </div>
        );
    }

    if (error || !movie) {
        return (
            <div className="w-full h-screen bg-[#141414] flex flex-col justify-center items-center text-white">
                <h2 className="text-2xl font-bold mb-4">Title Not Found</h2>
                <button onClick={() => navigate(-1)} className="bg-[#e50914] px-6 py-2 rounded font-bold hover:bg-red-600 transition">Go Back</button>
            </div>
        );
    }

    const { credits, similar, videos } = movie;
    const cast = credits?.cast?.slice(0, 10) || [];
    const similarMovies = similar?.results?.filter(m => m.backdrop_path).slice(0, 12) || [];
    
    const trailer = videos?.results?.find(v => v.site === 'YouTube' && v.type === 'Trailer') || videos?.results?.[0];

    const releaseYear = movie.release_date ? movie.release_date.substring(0, 4) : movie.first_air_date ? movie.first_air_date.substring(0, 4) : '';
    const runtime = movie.runtime ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` : movie.number_of_seasons ? `${movie.number_of_seasons} Seasons` : '';

    return (
        <div className="w-full min-h-screen bg-[#141414] text-white selection:bg-[#e50914] selection:text-white">
            {/* Hero Section */}
            <div className="relative w-full h-[70vh] lg:h-[85vh]">
                <div className="absolute inset-0">
                    <img 
                        src={`https://image.tmdb.org/t/p/original${movie.backdrop_path || movie.poster_path}`} 
                        alt={movie.title || movie.name} 
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#141414] via-[#141414]/70 to-transparent"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent h-[40%] mt-auto"></div>
                </div>

                <div className="absolute bottom-0 left-0 w-full p-6 md:p-14 lg:w-2/3 xl:w-1/2 z-10">
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
                        className="text-4xl md:text-6xl font-bold drop-shadow-2xl mb-4 font-['Bebas_Neue'] tracking-wide"
                    >
                        {movie.title || movie.name}
                    </motion.h1>

                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="flex items-center space-x-4 text-sm md:text-base font-semibold text-gray-300 mb-6 drop-shadow-md">
                        <span className="text-[#46d369]">{(movie.vote_average * 10).toFixed(0)}% Match</span>
                        <span>{releaseYear}</span>
                        <span>{runtime}</span>
                        <span className="border border-gray-400 px-1 rounded text-xs">HD</span>
                    </motion.div>

                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="text-base md:text-lg text-gray-200 mb-8 max-w-[85%] leading-relaxed drop-shadow-lg">
                        {movie.overview}
                    </motion.p>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="flex space-x-4 mb-4">
                        <button 
                            onClick={() => trailer ? navigate(`/watch/${trailer.key}`) : alert('No video available')}
                            className="bg-white text-black px-6 md:px-8 py-2 md:py-3 rounded-[4px] font-bold text-lg md:text-xl flex items-center hover:bg-gray-200 transition shadow-xl"
                        >
                            <svg className="w-8 h-8 mr-2 -ml-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
                            Play
                        </button>
                    </motion.div>
                </div>
            </div>

            {/* Details Section */}
            <div className="px-6 md:px-14 py-8 max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2">
                    <h2 className="text-2xl font-bold mb-6 border-b border-[#333] pb-2 text-gray-200">Cast & Crew</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                        {cast.map((actor) => (
                            <div key={actor.id} className="flex flex-col items-center">
                                <img 
                                    src={actor.profile_path ? `https://image.tmdb.org/t/p/w185${actor.profile_path}` : 'https://via.placeholder.com/185x278?text=No+Image'} 
                                    className="w-24 h-24 object-cover rounded-full mb-3 shadow-lg border-2 border-transparent hover:border-gray-500 transition"
                                    alt={actor.name} 
                                    loading="lazy"
                                />
                                <span className="text-sm font-semibold text-center leading-tight">{actor.name}</span>
                                <span className="text-xs text-gray-400 text-center leading-tight">{actor.character}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col space-y-6">
                    <div>
                        <span className="text-gray-400 text-sm block mb-1">Genres</span>
                        <div className="flex flex-wrap gap-2">
                            {movie.genres?.map(g => (
                                <span key={g.id} className="text-sm text-gray-200 bg-[#333] px-3 py-1 rounded-full">{g.name}</span>
                            ))}
                        </div>
                    </div>
                    {movie.production_companies && movie.production_companies.length > 0 && (
                        <div>
                            <span className="text-gray-400 text-sm block mb-1">Production</span>
                            <span className="text-sm text-gray-200">{movie.production_companies.map(c => c.name).join(', ')}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Similar Movies */}
            {similarMovies.length > 0 && (
                <div className="px-6 md:px-14 py-8 mb-20 max-w-[1400px] mx-auto">
                    <h2 className="text-2xl font-bold mb-6 border-b border-[#333] pb-2 text-gray-200">More Like This</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {similarMovies.map((item, id) => (
                            <MovieCard key={id} item={item} openTrailer={() => navigate(`/title/${type}/${item.id}`)} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MovieDetails;
