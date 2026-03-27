import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const WatchPlayer = () => {
    const { videoKey } = useParams();
    const navigate = useNavigate();
    const [controlsVisible, setControlsVisible] = useState(true);
    const timeoutRef = useRef(null);

    useEffect(() => {
        const resetControlsTimeout = () => {
            setControlsVisible(true);
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            timeoutRef.current = setTimeout(() => {
                setControlsVisible(false);
            }, 3000);
        };

        window.addEventListener('mousemove', resetControlsTimeout);
        resetControlsTimeout(); // init

        return () => {
            window.removeEventListener('mousemove', resetControlsTimeout);
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, []);

    if (!videoKey) {
        return (
            <div className="w-full h-screen bg-black flex justify-center items-center text-white">
                <h2>No Video Available</h2>
                <button onClick={() => navigate(-1)} className="mt-4 px-6 py-2 bg-red-600 rounded flex items-center gap-2">Go Back</button>
            </div>
        );
    }

    return (
        <div className="w-full h-screen bg-black relative overflow-hidden group">
            <AnimatePresence>
                {controlsVisible && (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
                        className="absolute top-0 left-0 w-full p-6 lg:p-10 z-50 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent"
                    >
                        <button onClick={() => navigate(-1)} className="text-white hover:text-gray-300 transition flex items-center gap-2 text-lg font-semibold drop-shadow-md">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                            Back to Browse
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
            
            <iframe
                src={`https://www.youtube.com/embed/${videoKey}?autoplay=1&controls=0&modestbranding=1&rel=0`}
                className="w-full h-full border-none pointer-events-none" // prevent interaction with YT so our controls overlay overlay
                allow="autoplay; encrypted-media"
                allowFullScreen
            />
            
            {/* Fake Controls Overlay */}
            <AnimatePresence>
                {controlsVisible && (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
                        className="absolute bottom-0 left-0 w-full p-6 lg:p-10 z-50 flex flex-col justify-end bg-gradient-to-t from-black/90 to-transparent pointer-events-none"
                    >
                        <div className="flex items-center gap-6 mb-4 max-w-4xl opacity-50">
                            {/* We simulate controls visually, real playback is via iframe autoplay logic */}
                            <svg className="w-10 h-10 text-white cursor-pointer hover:text-gray-300 pointer-events-auto" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                            <div className="w-full bg-gray-600 h-1.5 rounded-full relative overflow-hidden pointer-events-auto cursor-pointer">
                                <div className="bg-[#e50914] h-full absolute left-0 top-0 w-1/3"></div>
                            </div>
                            <svg className="w-8 h-8 text-white cursor-pointer hover:text-gray-300 pointer-events-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
                            <svg className="w-8 h-8 text-white cursor-pointer hover:text-gray-300 pointer-events-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default WatchPlayer;
