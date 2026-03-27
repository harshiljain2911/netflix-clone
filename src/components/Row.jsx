import React, { useState, useEffect } from 'react';
import { useMovies } from '../hooks/useMovies';
import { motion } from 'framer-motion';
import { UserAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { arrayUnion, doc, updateDoc } from 'firebase/firestore';
import MovieCard from './MovieCard';

const Row = ({ title, fetchUrl, rowId, openTrailer }) => {
    const { data, isLoading: loading, error } = useMovies(`row-${title}`, fetchUrl);
    const movies = data?.results || [];
    const { user, savedShows } = UserAuth();

    const slideLeft = () => {
        var slider = document.getElementById('slider' + rowId);
        slider.scrollLeft = slider.scrollLeft - 500;
    };

    const slideRight = () => {
        var slider = document.getElementById('slider' + rowId);
        slider.scrollLeft = slider.scrollLeft + 500;
    };

    if (loading) {
        return (
            <div className="mt-4 px-4 md:px-14">
                <div className="w-1/4 h-6 md:h-8 bg-[#333] rounded animate-pulse mb-2"></div>
                <div className="flex gap-2 overflow-hidden py-12 -my-12">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className={`w-[180px] sm:w-[220px] md:w-[280px] lg:w-[320px] shrink-0 aspect-video bg-[#222] rounded-md animate-pulse`} style={{ animationDelay: `${i * 0.15}s` }}></div>
                    ))}
                </div>
            </div>
        );
    }

    const saveShow = async (item, e) => {
        e.stopPropagation();
        if (user?.uid) {
            const movieRef = doc(db, 'users', user.uid);
            const isSaved = savedShows?.some(show => show.id === item.id);
            
            try {
                if (isSaved) {
                    const updatedShows = savedShows.filter(show => show.id !== item.id);
                    await updateDoc(movieRef, { savedShows: updatedShows });
                } else {
                    await updateDoc(movieRef, { savedShows: arrayUnion(item) });
                }
            } catch (err) {
                console.error("Error saving show:", err);
            }
        } else {
            alert('Please log in to save a movie to your list');
        }
    };

    return (
        <div className="mt-4 relative group/row">
            <h2 className="text-[#e5e5e5] font-bold md:text-[1.4rem] lg:text-[1.6rem] px-4 md:px-14 mb-2 tracking-wide drop-shadow-sm flex items-center group-hover/row:text-white transition-colors cursor-pointer">
                {title}
                <div className="opacity-0 group-hover/row:opacity-100 transition-opacity duration-500 ml-2 text-blue-300 text-sm font-bold flex items-center">
                    <span className="mr-1">Explore All</span>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
                </div>
            </h2>
            
            {loading ? (
                <div className="w-full relative px-4 md:px-14 flex gap-2 py-12 -my-12 overflow-hidden mb-4">
                    {[1, 2, 3, 4, 5, 6].map((idx) => (
                        <div 
                            key={idx} 
                            className="w-[180px] sm:w-[220px] md:w-[280px] lg:w-[320px] aspect-video bg-[#222] rounded-md shrink-0 relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]"></div>
                        </div>
                    ))}
                </div>
            ) : error ? (
                <div className="text-red-500 px-4 md:px-14 py-8">{error}</div>
            ) : (
                <div className="relative flex items-center group/slider">
                    
                    {/* Left Chevron */}
                    <div 
                        onClick={slideLeft} 
                        className="absolute left-0 bg-black/40 hover:bg-black/80 backdrop-blur-sm text-white z-40 cursor-pointer hidden group-hover/slider:flex items-center justify-center transition-all duration-300 h-full w-[40px] md:w-[50px] opacity-0 group-hover/slider:opacity-100 hover:scale-110 origin-left">
                        <svg className="w-8 h-8 md:w-10 md:h-10 transform hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
                    </div>
                    
                    <div 
                        id={'slider' + rowId}
                        className="w-full h-full overflow-x-scroll overflow-y-hidden whitespace-nowrap scroll-smooth scrollbar-hide relative px-4 md:px-14 flex gap-2 py-12 -my-12"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {movies.map((item, id) => {
                            if (!item?.backdrop_path) return null;
                            const isSaved = savedShows?.some(show => show.id === item.id);
                            return <MovieCard key={id} item={item} openTrailer={openTrailer} saveShow={saveShow} isSaved={isSaved} />;
                        })}
                    </div>

                    {/* Right Chevron */}
                    <div 
                        onClick={slideRight} 
                        className="absolute right-0 bg-black/40 hover:bg-black/80 backdrop-blur-sm text-white z-40 cursor-pointer hidden group-hover/slider:flex items-center justify-center transition-all duration-300 h-full w-[40px] md:w-[50px] opacity-0 group-hover/slider:opacity-100 hover:scale-110 origin-right">
                        <svg className="w-8 h-8 md:w-10 md:h-10 transform hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Row;
