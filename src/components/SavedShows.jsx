import React from 'react';
import { motion } from 'framer-motion';
import { UserAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';
import MovieCard from './MovieCard';

const SavedShows = ({ openTrailer }) => {
    const { user, savedShows } = UserAuth();

    // If no user is logged in, or the list is empty, don't render the row at all.
    if (!user?.uid || !savedShows || savedShows.length === 0) {
        return null;
    }

    const rowId = "saved_shows_slider";

    const slideLeft = () => {
        var slider = document.getElementById(rowId);
        slider.scrollLeft = slider.scrollLeft - 500;
    };

    const slideRight = () => {
        var slider = document.getElementById(rowId);
        slider.scrollLeft = slider.scrollLeft + 500;
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
        <div className="mt-4 relative group/row">
            <h2 className="text-[#e5e5e5] font-bold md:text-[1.4rem] lg:text-[1.6rem] px-4 md:px-14 mb-2 tracking-wide drop-shadow-sm flex items-center group-hover/row:text-white transition-colors cursor-pointer">
                My List
                <div className="opacity-0 group-hover/row:opacity-100 transition-opacity duration-500 ml-2 text-blue-300 text-sm font-bold flex items-center">
                    <span className="mr-1">Explore All</span>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
                </div>
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
                    {savedShows.map((item, id) => {
                        return <MovieCard key={id} item={item} openTrailer={openTrailer} removeShow={removeShow} />;
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

export default SavedShows;
