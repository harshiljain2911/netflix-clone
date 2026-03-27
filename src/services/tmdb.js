const key = import.meta.env.VITE_TMDB_API_KEY;

const requests = {
    requestTrending: `https://api.themoviedb.org/3/trending/movie/day?api_key=${key}&language=en-US`,
    requestTopRated: `https://api.themoviedb.org/3/movie/top_rated?api_key=${key}&language=en-US`,
    requestOriginals: `https://api.themoviedb.org/3/discover/tv?api_key=${key}&with_networks=213`,
    // Optional extensions of tmdb
    requestPopular: `https://api.themoviedb.org/3/movie/popular?api_key=${key}&language=en-US`,
    requestAction: `https://api.themoviedb.org/3/discover/movie?api_key=${key}&with_genres=28`,
    requestHorror: `https://api.themoviedb.org/3/discover/movie?api_key=${key}&with_genres=27`,
};

export const fetchFromTMDB = async (url) => {
    try {
        console.info(`[TMDB API] Fetching: ${url.split('?')[0]}`);
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`TMDB API Error: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`[TMDB API] Failed to fetch from ${url}:`, error.message);
        // Handle common network errors (e.g., CORS, Brave Shields)
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            throw new Error('Network Error: Request blocked. Please check your internet connection or disable ad-blockers (like Brave Shields).');
        }
        throw error;
    }
};

export const fetchTrailer = async (movieOrTvObj) => {
    if (!movieOrTvObj?.id) {
        console.warn("[TMDB API] fetchTrailer called without valid ID", movieOrTvObj);
        return null;
    }
    try {
        // More robust check for TV vs Movie detection
        const isMovie = (movieOrTvObj.media_type === 'tv' || movieOrTvObj.first_air_date || (movieOrTvObj.name && !movieOrTvObj.title)) ? 'tv' : 'movie';
        
        const videoUrl = `https://api.themoviedb.org/3/${isMovie}/${movieOrTvObj.id}/videos?api_key=${key}&language=en-US`;
        console.log(`[TMDB API] Fetching trailer for ${isMovie} (${movieOrTvObj.id}): ${videoUrl.replace(key, "API_KEY_HIDDEN")}`);
        
        const data = await fetchFromTMDB(videoUrl);
        
        if (!data.results || data.results.length === 0) {
            console.log(`[TMDB API] No video results found for ${movieOrTvObj.title || movieOrTvObj.name}`);
            return null;
        }

        const trailers = data.results.filter(v => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser'));
        const official = trailers.find(v => v.name.toLowerCase().includes('official trailer')) || trailers[0];
        
        if (official?.key) {
            console.log(`[TMDB API] Found trailer: ${official.key} (${official.name})`);
            return official.key;
        }
        
        console.log(`[TMDB API] No YouTube trailer/teaser found in results for ${movieOrTvObj.title || movieOrTvObj.name}`);
        return null;
    } catch (error) {
        console.error(`[TMDB API] Failed to fetch trailer for ID ${movieOrTvObj.id}:`, error.message);
        return null; // Return null instead of throwing so it doesn't break UI
    }
};

export default requests;
