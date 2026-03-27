import React from 'react';
import { useSmartRecommendations } from '../hooks/useSmartRecommendations';
import MovieCard from './MovieCard';

const SmartRecommendationRow = ({ openTrailer }) => {
    const { recommendations, isLoading, hasPreferences } = useSmartRecommendations();

    const slideLeft = () => {
        var slider = document.getElementById('slider-smart');
        slider.scrollLeft = slider.scrollLeft - 500;
    };

    const slideRight = () => {
        var slider = document.getElementById('slider-smart');
        slider.scrollLeft = slider.scrollLeft + 500;
    };

    if (!hasPreferences || recommendations.length === 0) {
        return null;
    }

    if (isLoading) {
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

    return (
        <div className="mt-8 px-4 md:px-14 relative group z-10 w-full mb-8">
            <h2 className="text-white font-bold md:text-xl p-2 lg:text-2xl drop-shadow-md">
                Top Picks For You (AI Generated)
            </h2>
            
            <div className="relative group/slider w-full h-full overflow-hidden">
                <svg
                    onClick={slideLeft}
                    className="w-12 h-12 bg-black/60 rounded-full absolute -left-6 top-[35%] -translate-y-1/2 opacity-0 group-hover/slider:opacity-100 cursor-pointer z-[100] text-white hover:bg-black hover:text-[#e50914] transition-all hover:scale-110 drop-shadow-xl"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path fillRule="evenodd" d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z" clipRule="evenodd" />
                </svg>
                
                <div
                    id={'slider-smart'}
                    className="w-full h-full overflow-x-scroll whitespace-nowrap scroll-smooth scrollbar-hide py-12 -my-12 relative flex items-center"
                >
                    {/* Render Smart Results */}
                    {recommendations.map((item, index) => (
                        <div key={`smart-${item.id}-${index}`} className="inline-block px-1 h-full">
                            <MovieCard item={item} openTrailer={openTrailer} />
                        </div>
                    ))}
                </div>
                
                <svg
                    onClick={slideRight}
                    className="w-12 h-12 bg-black/60 rounded-full absolute -right-6 top-[35%] -translate-y-1/2 opacity-0 group-hover/slider:opacity-100 cursor-pointer z-[100] text-white hover:bg-black hover:text-[#e50914] transition-all hover:scale-110 drop-shadow-xl"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path fillRule="evenodd" d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" clipRule="evenodd" />
                </svg>
            </div>
        </div>
    );
};

export default SmartRecommendationRow;
