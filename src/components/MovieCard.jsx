import React, { useState, useRef, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchTrailer } from '../services/tmdb';
import { UserAuth } from '../context/AuthContext';
import { useMyList } from '../hooks/useMyList';
import { useLikeDislike } from '../hooks/useLikeDislike';
import { useAnalytics } from '../hooks/useAnalytics';

const MovieCard = ({ item, openTrailer, showProgress = false, removeShow = null }) => {
    const { user, savedShows, triggerToast } = UserAuth();
    const [isHovered, setIsHovered] = useState(false);
    const [trailerKey, setTrailerKey] = useState(null);
    const hoverTimerRef = useRef(null);

    const { toggleSaveShow } = useMyList();
    const { rating: userRating, setRating } = useLikeDislike(item?.id);
    const { trackInteraction } = useAnalytics();

    const isSaved = savedShows?.some(show => show.id === item.id);
    const [optimisticLocalSave, setOptimisticLocalSave] = useState(null);
    const currentlySaved = optimisticLocalSave !== null ? optimisticLocalSave : isSaved;

    // Immediately resolve optimistic states once Firebase catches up and broadcasts down
    useEffect(() => {
        if (optimisticLocalSave !== null && isSaved === optimisticLocalSave) {
            setOptimisticLocalSave(null);
        }
    }, [isSaved, optimisticLocalSave]);

    const rating = item?.vote_average ? Number(item.vote_average).toFixed(1) : 'N/A';
    const releaseYear = item?.release_date ? item.release_date.split('-')[0] : item?.first_air_date ? item.first_air_date.split('-')[0] : '';
    const progress = showProgress ? (item.id % 60) + 15 : null;

    const handleMouseEnter = () => {
        setIsHovered(true);
        trackInteraction('hover', item);
        // We only fetch trailer on click now to ensure fast hover scalability
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    const handleSaveShow = (e) => {
        e.stopPropagation();
        trackInteraction(currentlySaved ? 'unsave' : 'save', item);
        toggleSaveShow(item, currentlySaved, setOptimisticLocalSave);
    };

    return (
        <motion.div 
            onClick={() => openTrailer(item)}
            onHoverStart={handleMouseEnter}
            onHoverEnd={handleMouseLeave}
            whileHover={{ 
                scale: 1.35, 
                zIndex: 50, 
                y: -20,
                transition: { delay: 0.15, duration: 0.3, ease: 'easeOut' }
            }}
            // Note: We avoid styling conflicts by replacing w-[320] exacts with strict sizing relative to the parent, but since standard layout expects manual widths, we keep them:
            className={`w-[180px] sm:w-[220px] md:w-[280px] lg:w-[320px] inline-block cursor-pointer relative shrink-0 shadow-none origin-bottom hover:shadow-[0_0_30px_rgba(255,255,255,0.1),_0_20px_40px_rgba(0,0,0,0.8)] rounded-md group/card`}
        >
            <div className="w-full aspect-video rounded-md relative overflow-hidden bg-[#181818] border border-transparent hover:border-[#333] transition-colors shadow-none group/item">
                
                {/* Backdrop Image */}
                <img 
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${isHovered ? 'opacity-40' : 'opacity-100'}`} 
                    src={`https://image.tmdb.org/t/p/w500${item?.backdrop_path}`} 
                    alt={item?.title || item?.name} 
                    loading="lazy"
                />
                
                {/* Dynamic Content Gradient Overlay */}
                <div className={`absolute inset-0 w-full h-full p-3 lg:p-4 flex flex-col justify-end transition-opacity duration-300 z-10 bg-gradient-to-t from-black/95 via-black/40 to-transparent ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
                    
                    {/* Interactive Buttons Row */}
                    <div className="flex space-x-2 mb-2 translate-y-4 group-hover/item:translate-y-0 transition-transform duration-300">
                        <button onClick={(e) => { e.stopPropagation(); openTrailer(item); }} className="bg-white hover:bg-gray-300 text-black rounded-full p-[6px] md:p-2 transition-transform hover:scale-110 shadow-lg">
                            <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
                        </button>
                        <button 
                            onClick={handleSaveShow} 
                            title={currentlySaved ? "Remove from My List" : "Add to My List"}
                            className="border-2 border-gray-400 hover:border-white text-white rounded-full p-[6px] md:p-2 transition-colors bg-black/50 backdrop-blur-sm shadow-xl hover:bg-white/20 flex items-center justify-center overflow-hidden"
                        >
                            <AnimatePresence mode="wait">
                                {currentlySaved ? (
                                    <motion.svg 
                                        key="saved" 
                                        initial={{ scale: 0, opacity: 0 }} 
                                        animate={{ scale: 1, opacity: 1, rotate: [0, -15, 15, 0] }} 
                                        exit={{ scale: 0, opacity: 0 }} 
                                        transition={{ duration: 0.3 }}
                                        className="w-5 h-5 text-[#e50914]" 
                                        fill="currentColor" viewBox="0 0 24 24"
                                    >
                                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                                    </motion.svg>
                                ) : (
                                    <motion.svg 
                                        key="unsaved" 
                                        initial={{ scale: 0, opacity: 0 }} 
                                        animate={{ scale: 1, opacity: 1 }} 
                                        exit={{ scale: 0, opacity: 0 }} 
                                        transition={{ duration: 0.2 }}
                                        className="w-5 h-5 text-white" 
                                        fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </motion.svg>
                                )}
                            </AnimatePresence>
                        </button>
                        
                        <button 
                            onClick={(e) => { e.stopPropagation(); setRating('like'); trackInteraction('like', item); }} 
                            title="Like"
                            className={`border-2 border-gray-400 hover:border-white text-white rounded-full p-[6px] md:p-2 transition-colors bg-black/50 backdrop-blur-sm shadow-xl flex items-center justify-center overflow-hidden ${userRating === 'like' ? 'text-green-400 border-green-400 hover:border-green-400' : 'hover:bg-white/20'}`}
                        >
                            <svg className="w-5 h-5" fill={userRating === 'like' ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.514M9 11l2-2" /></svg>
                        </button>

                        <button 
                            onClick={(e) => { e.stopPropagation(); setRating('dislike'); trackInteraction('dislike', item); }} 
                            title="Dislike"
                            className={`border-2 border-gray-400 hover:border-white text-white rounded-full p-[6px] md:p-2 transition-colors bg-black/50 backdrop-blur-sm shadow-xl flex items-center justify-center overflow-hidden ${userRating === 'dislike' ? 'text-red-400 border-red-400 hover:border-red-400' : 'hover:bg-white/20'}`}
                        >
                            <svg className="w-5 h-5" fill={userRating === 'dislike' ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.514M15 13l-2 2" /></svg>
                        </button>
                        
                        {removeShow && (
                            <>
                                <div className="flex-grow"></div>
                                <button 
                                    onClick={(e) => removeShow(item, e)} 
                                    title="Remove from row"
                                    className="border-2 border-transparent text-gray-300 hover:text-white rounded-full p-[6px] transition-colors hover:bg-white/10"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </>
                        )}
                    </div>

                    <h3 className="text-white text-[13px] md:text-sm font-bold drop-shadow-md line-clamp-1 whitespace-normal break-words leading-tight">
                        {item?.title || item?.name}
                    </h3>
                    
                    <div className="flex items-center space-x-2 mt-1 translate-y-2 group-hover/item:translate-y-0 transition-transform duration-300 delay-75">
                        <span className="text-[#46d369] font-bold text-[10px] drop-shadow-md">98% Match</span>
                        {releaseYear && <span className="text-gray-300 text-[10px] font-bold">{releaseYear}</span>}
                        <span className="text-gray-300 border border-gray-500 px-1 rounded-[2px] text-[9px] font-semibold drop-shadow-md">Rating {rating}</span>
                    </div>

                    {/* NEW: Overview Text Expansion strictly on hover! */}
                    {isHovered && item?.overview && (
                        <p className="hidden md:block text-gray-300 text-[9px] mt-1.5 line-clamp-2 leading-[1.2] drop-shadow-md animate-[fadeIn_0.5s_ease-out]">
                            {item.overview}
                        </p>
                    )}
                </div>

                {/* Optional Progress Bar for Continue Watching UX */}
                {showProgress && (
                    <>
                        <div className={`absolute inset-0 flex items-center justify-center opacity-80 transition-opacity duration-300 pointer-events-none ${isHovered ? 'opacity-0' : 'opacity-100'}`}>
                            <svg className="w-10 h-10 md:w-12 md:h-12 text-white/90 drop-shadow-2xl" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
                        </div>
                        <div className={`absolute bottom-0 left-0 w-full h-[3px] md:h-[4px] bg-gray-500/50 transition-opacity duration-300 z-20 shrink-0 ${isHovered ? 'opacity-0' : 'opacity-100'}`}>
                            <div className="h-full bg-[#e50914]" style={{ width: `${progress}%` }}></div>
                        </div>
                    </>
                )}
            </div>
        </motion.div>
    );
};

export default memo(MovieCard, (prevProps, nextProps) => {
    // Only re-render if the item ID changes, or if the showProgress state changes
    return prevProps.item.id === nextProps.item.id && prevProps.showProgress === nextProps.showProgress;
});
