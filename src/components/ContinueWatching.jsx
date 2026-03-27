import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UserAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { arrayUnion, doc, updateDoc } from 'firebase/firestore';
import MovieCard from './MovieCard';

const ContinueWatching = ({ shows, openTrailer, removeShow }) => {
    const { user, savedShows } = UserAuth();

    if (!shows || shows.length === 0) {
        return null;
    }

    const rowId = "continue_watching_slider";

    const slideLeft = () => {
        var slider = document.getElementById(rowId);
        slider.scrollLeft = slider.scrollLeft - 500;
    };

    const slideRight = () => {
        var slider = document.getElementById(rowId);
        slider.scrollLeft = slider.scrollLeft + 500;
    };

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
            alert('Please log in to save a movie');
        }
    };

    // Helper to generate a fake progress percentage for aesthetics based on movie ID
    const getProgress = (id) => {
        // Deterministic pseudo-random progress based on movie ID so it doesn't flicker on re-renders
        return (id % 60) + 15; // Returns between 15% and 75%
    };

    return (
        <div className="mt-4 relative group/row">
            <h2 className="text-[#e5e5e5] font-bold md:text-[1.4rem] lg:text-[1.6rem] px-4 md:px-14 mb-2 tracking-wide drop-shadow-sm flex items-center group-hover/row:text-white transition-colors cursor-pointer">
                Continue Watching for {user?.email ? user.email.split('@')[0] : 'You'}
            </h2>
            
            <div className="relative flex items-center group/slider">
                
                {/* Left Chevron */}
                <div 
                    onClick={slideLeft} 
                    className="absolute left-0 bg-black/40 hover:bg-black/80 backdrop-blur-sm text-white z-40 cursor-pointer hidden group-hover/slider:flex items-center justify-center transition-all duration-300 h-full w-[40px] md:w-[50px] opacity-0 group-hover/slider:opacity-100 hover:scale-110 origin-left">
                    <svg className="w-8 h-8 md:w-10 md:h-10 transform hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
                </div>
                
                <div 
                    id={rowId}
                    className="w-full h-full overflow-x-scroll overflow-y-hidden whitespace-nowrap scroll-smooth scrollbar-hide relative px-4 md:px-14 flex gap-2 py-12 -my-12"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {shows.map((item, id) => {
                        return <MovieCard key={id} item={item} openTrailer={openTrailer} showProgress={true} removeShow={removeShow} />;
                    })}
                </div>

                {/* Right Chevron */}
                <div 
                    onClick={slideRight} 
                    className="absolute right-0 bg-black/40 hover:bg-black/80 backdrop-blur-sm text-white z-40 cursor-pointer hidden group-hover/slider:flex items-center justify-center transition-all duration-300 h-full w-[40px] md:w-[50px] opacity-0 group-hover/slider:opacity-100 hover:scale-110 origin-right">
                    <svg className="w-8 h-8 md:w-10 md:h-10 transform hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                </div>
            </div>
        </div>
    );
};

export default ContinueWatching;
