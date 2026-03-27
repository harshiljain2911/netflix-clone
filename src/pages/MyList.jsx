import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UserAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';
import TrailerModal from '../components/TrailerModal';
import axios from 'axios';
import MovieCard from "../components/MovieCard";

const MyList = () => {
    const { user, savedShows } = UserAuth();
    const [modalTrailer, setModalTrailer] = useState(null);

    const handleOpenTrailer = async (movie) => {
        if (!movie?.id) return;
        const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
        const isMovie = movie.title || movie.media_type === 'movie' ? 'movie' : 'tv';
        const videoUrl = `https://api.themoviedb.org/3/${isMovie}/${movie.id}/videos?api_key=${API_KEY}&language=en-US`;

        try {
            const res = await axios.get(videoUrl);
            const trailers = res.data.results.filter(v => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser'));
            const official = trailers.find(v => v.name.toLowerCase().includes('official trailer')) || trailers[0];

            if (official?.key) {
                setModalTrailer(official.key);
            } else {
                setModalTrailer('NOT_FOUND');
            }
        } catch (err) {
            console.error(err);
            setModalTrailer('NOT_FOUND');
        }
    };

    const removeShow = async (item, e) => {
        e.stopPropagation();
        try {
            const result = savedShows.filter((show) => show.id !== item.id);
            await updateDoc(doc(db, 'users', user.uid), {
                savedShows: result
            });
        } catch (error) {
            console.error("Error removing show:", error);
        }
    };

    return (
        <div className="w-full text-white min-h-screen bg-[#141414] pt-[120px] px-4 md:px-14 pb-20">
            <h1 className="text-3xl md:text-4xl font-bold mb-8">My List</h1>

            {!savedShows || savedShows.length === 0 ? (
                <div className="flex flex-col items-center justify-center mt-20 text-gray-500">
                    <svg className="w-24 h-24 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 13l4 4L19 7" /></svg>
                    <p className="text-xl font-medium tracking-wide">You haven't added any shows to your list yet.</p>
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
                >
                    {savedShows.map((item, id) => {
                        return <MovieCard key={id} item={item} openTrailer={handleOpenTrailer} removeShow={removeShow} />;
                    })}
                </motion.div>
            )}

            <TrailerModal trailerKey={modalTrailer} onClose={() => setModalTrailer(null)} />
        </div>
    );
};

export default MyList;
