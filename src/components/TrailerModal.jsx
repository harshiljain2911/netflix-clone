import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TrailerModal = ({ trailerKey, onClose }) => {

    return (
        <AnimatePresence>
            {trailerKey && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-10">
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-pointer"
                    ></motion.div>
                    
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9, y: 50 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 50 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="relative w-full max-w-5xl aspect-video bg-black rounded-lg sm:rounded-xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] z-10 border border-[#333]"
                    >
                        <button 
                            onClick={onClose}
                            className={`absolute top-4 right-4 z-50 rounded-full p-2.5 transition-colors duration-200 shadow-xl ${trailerKey === 'NOT_FOUND' ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-black/60 backdrop-blur-sm hover:bg-white text-white hover:text-black'}`}
                        >
                            <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                        
                        {trailerKey === 'NOT_FOUND' ? (
                            <div className="w-full h-full flex flex-col items-center justify-center bg-[#141414] text-[#e5e5e5]">
                                <svg className="w-16 h-16 text-gray-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                                <h2 className="text-2xl font-bold tracking-wide">Trailer Not Available</h2>
                                <p className="text-gray-400 mt-2">We couldn't find an official trailer for this title.</p>
                            </div>
                        ) : (
                            <iframe 
                                className="w-full h-full pointer-events-auto"
                                src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&modestbranding=1&rel=0&fs=1&color=white`}
                                title="YouTube video player"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default TrailerModal;
