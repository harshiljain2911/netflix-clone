import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { UserAuth } from '../context/AuthContext';
import { fetchFromTMDB, fetchTrailer } from '../services/tmdb';
import TrailerModal from './TrailerModal';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const { user, logOut } = UserAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Search state
    const [searchOpen, setSearchOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loadingSearch, setLoadingSearch] = useState(false);
    
    // Trailer state
    const [modalTrailer, setModalTrailer] = useState(null);
    const searchRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    // Click outside to close search dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setSearchOpen(false);
                setQuery('');
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Debounce TMDB search logic
    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (query.trim()) {
                setLoadingSearch(true);
                const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
                const url = `https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&language=en-US&query=${query}&page=1&include_adult=false`;
                try {
                    const data = await fetchFromTMDB(url);
                    const validResults = data.results.filter(item => item.media_type !== 'person' && item.backdrop_path);
                    setResults(validResults.slice(0, 5)); // Show top 5 dropdown suggestions
                } catch (e) {
                    console.error("Search error:", e);
                }
                setLoadingSearch(false);
            } else {
                setResults([]);
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [query]);

    // Isolated Trailer fetcher so dropdown links can instantly play
    const handleOpenTrailer = async (movie) => {
        if (!movie?.id) return;
        setSearchOpen(false); // Map trailer click closes dropdown
        const trailerKey = await fetchTrailer(movie);
        
        if (trailerKey) {
            setModalTrailer(trailerKey);
        } else {
            setModalTrailer('NOT_FOUND');
        }
    };

    const handleLogout = async () => {
        try {
            await logOut();
            navigate('/login');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

    return (
        <>
        <motion.nav 
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, ease: [0.25, 1, 0.5, 1] }}
            className={`fixed w-full z-50 px-4 py-5 md:px-14 flex justify-between items-center transition-all duration-500 ease-in-out ${
                isScrolled ? 'bg-black/80 backdrop-blur-lg shadow-2xl border-b border-white/5' : 'bg-gradient-to-b from-black/90 via-black/50 to-transparent'
            }`}
        >
            <div className="flex items-center">
                
                {/* Mobile Hamburger Button */}
                {user?.email && !isAuthPage && (
                    <button 
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
                        className="lg:hidden text-white mr-4 hover:text-gray-300 transition-colors"
                    >
                        {mobileMenuOpen ? (
                           <svg className="w-6 h-6 md:w-7 md:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                        ) : (
                           <svg className="w-6 h-6 md:w-7 md:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" /></svg>
                        )}
                    </button>
                )}

                <Link to="/">
                    <img 
                        src="https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg" 
                        alt="Netflix Logo" 
                        className="w-[90px] md:w-[110px] cursor-pointer mr-10 hover:scale-105 transition-transform duration-300" 
                    />
                </Link>
                
                {user?.email && !isAuthPage && (
                    <ul className="hidden lg:flex space-x-5 text-[14px] font-medium text-[#e5e5e5]">
                        <Link to="/"><li className="cursor-pointer text-white font-bold tracking-wide hover:scale-105 hover:text-white transition-all duration-300">Home</li></Link>
                        <li className="cursor-pointer text-[#e5e5e5] hover:text-white hover:scale-105 transition-all duration-300 tracking-wide">TV Shows</li>
                        <li className="cursor-pointer text-[#e5e5e5] hover:text-white hover:scale-105 transition-all duration-300 tracking-wide">Movies</li>
                        <li className="cursor-pointer text-[#e5e5e5] hover:text-white hover:scale-105 transition-all duration-300 tracking-wide">New & Popular</li>
                        <Link to="/mylist"><li className="cursor-pointer text-[#e5e5e5] hover:text-white hover:scale-105 transition-all duration-300 tracking-wide">My List</li></Link>
                        <li className="cursor-pointer text-[#e5e5e5] hover:text-white hover:scale-105 transition-all duration-300 tracking-wide">Browse by Languages</li>
                    </ul>
                )}
            </div>

            {isAuthPage ? (
                <div className="flex items-center">
                    {location.pathname === '/login' ? (
                        <Link to="/signup" className="text-white hover:underline text-sm font-semibold">Sign Up</Link>
                    ) : (
                        <Link to="/login" className="bg-[#e50914] text-white px-5 py-1.5 rounded-[4px] font-medium cursor-pointer text-sm shadow-md hover:bg-[#f6121d] transition-colors">Sign In</Link>
                    )}
                </div>
            ) : user?.email ? (
                <div className="flex items-center space-x-4 md:space-x-6">
                    
                    {/* Netflix Custom Search Component */}
                    <div ref={searchRef} className="relative flex items-center">
                        <div className={`flex items-center bg-black/60 border ${searchOpen ? 'border-white px-2 py-1' : 'border-transparent'} transition-all duration-300 rounded-[4px]`}>
                            <svg 
                                onClick={() => setSearchOpen(!searchOpen)}
                                className="w-5 h-5 lg:w-6 lg:h-6 text-white cursor-pointer hover:text-gray-300 transition-colors" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                autoFocus={searchOpen}
                                type="text"
                                placeholder="Titles, people, genres"
                                className={`bg-transparent text-white text-[14px] outline-none transition-all duration-300 ${searchOpen ? 'w-[150px] md:w-[220px] ml-2 opacity-100' : 'w-0 opacity-0 hidden'}`}
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && query.trim()) {
                                        setSearchOpen(false);
                                        navigate(`/search?q=${encodeURIComponent(query)}`);
                                    }
                                }}
                            />
                        </div>

                        {/* Search Quick-Results Dropdown */}
                        <AnimatePresence>
                            {searchOpen && query && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className="absolute top-[120%] right-0 w-[260px] md:w-[320px] bg-black/90 border border-[#333] rounded-md shadow-2xl overflow-hidden backdrop-blur-md"
                                >
                                    {loadingSearch ? (
                                        <div className="p-4 text-center text-gray-400 text-sm animate-pulse">Searching TMDB...</div>
                                    ) : results.length > 0 ? (
                                        <div className="max-h-[400px] overflow-y-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                                            {results.map((item, idx) => (
                                                <div 
                                                    key={idx} 
                                                    onClick={() => handleOpenTrailer(item)}
                                                    className="flex items-center gap-3 p-3 hover:bg-[#333] cursor-pointer transition-colors border-b border-[#222] last:border-b-0"
                                                >
                                                    <img 
                                                        src={`https://image.tmdb.org/t/p/w92${item.backdrop_path}`} 
                                                        className="w-20 h-[45px] object-cover rounded shadow-lg"
                                                        alt="poster" 
                                                        loading="lazy"
                                                    />
                                                    <div className="flex flex-col overflow-hidden">
                                                        <span className="text-white text-sm font-bold truncate">{(item.title || item.name)}</span>
                                                        <span className="text-gray-400 text-[11px] truncate">{item.media_type === 'tv' ? 'TV Series' : 'Movie'} • {item.release_date?.split('-')[0] || item.first_air_date?.split('-')[0]}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="p-4 text-center text-gray-400 text-sm">No results found for "{query}"</div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <span className="hidden lg:block text-white text-[14px] font-bold drop-shadow-md">Children</span>
                    <button 
                        onClick={handleLogout}
                        className="bg-[#e50914] px-4 py-1.5 rounded-[4px] text-white font-bold cursor-pointer text-xs md:text-sm hover:bg-[#f6121d] transition-colors shadow-lg drop-shadow-sm"
                    >
                        Sign Out
                    </button>
                    <div className="flex items-center cursor-pointer group rounded-[2px] transition">
                        <Link to="/account" className="flex items-center">
                            <span className="text-white text-sm mr-2 font-semibold hidden md:block opacity-90 hover:opacity-100">{user?.displayName || user?.email?.split('@')[0]}</span>
                            <img 
                                className="w-8 h-8 rounded-[4px] drop-shadow-md border border-transparent group-hover:border-white transition-colors" 
                                src={user?.photoURL || "https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png"} 
                                alt="Profile Avatar" 
                            />
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="flex items-center">
                    <Link to="/login">
                        <button className="bg-[#e50914] text-white px-5 py-1.5 rounded-[4px] font-bold cursor-pointer text-sm drop-shadow-md shadow-lg hover:bg-[#f6121d] transition-colors">
                            Sign In
                        </button>
                    </Link>
                </div>
            )}

            {/* Mobile Dropdown Menu */}
            <AnimatePresence>
                {mobileMenuOpen && user?.email && !isAuthPage && (
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 w-full bg-[#141414] shadow-[0_20px_40px_rgba(0,0,0,0.8)] flex flex-col lg:hidden border-t border-[#333]"
                    >
                        <Link onClick={() => setMobileMenuOpen(false)} to="/" className="text-white px-6 py-4 border-b border-[#222] font-semibold hover:bg-[#222] transition-colors text-sm md:text-base">Home</Link>
                        <span className="text-gray-300 px-6 py-4 border-b border-[#222] hover:text-white cursor-pointer transition-colors text-sm md:text-base">TV Shows</span>
                        <span className="text-gray-300 px-6 py-4 border-b border-[#222] hover:text-white cursor-pointer transition-colors text-sm md:text-base">Movies</span>
                        <span className="text-gray-300 px-6 py-4 border-b border-[#222] hover:text-white cursor-pointer transition-colors text-sm md:text-base">New & Popular</span>
                        <Link onClick={() => setMobileMenuOpen(false)} to="/mylist" className="text-white px-6 py-4 border-b border-[#222] font-semibold hover:bg-[#222] transition-colors text-sm md:text-base">My List</Link>
                        <Link onClick={() => setMobileMenuOpen(false)} to="/account" className="text-gray-300 px-6 py-4 border-b border-[#222] hover:text-white transition-colors text-sm md:text-base">Account Settings</Link>
                    </motion.div>
                )}
            </AnimatePresence>

        </motion.nav>
        
        {/* Isolated global trailer modal attached strictly to search components */}
        <TrailerModal trailerKey={modalTrailer} onClose={() => setModalTrailer(null)} />
        </>
    );
};

export default Navbar;
