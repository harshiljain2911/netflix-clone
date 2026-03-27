export const computeUserPreferences = (watchHistory = [], savedShows = []) => {
    const genreCounts = {};
    
    // Weight watchHistory heavily
    watchHistory.forEach(item => {
        if (item.genre_ids) {
            item.genre_ids.forEach(id => {
                genreCounts[id] = (genreCounts[id] || 0) + 2; 
            });
        }
    });

    // Add saved shows weight
    savedShows.forEach(item => {
        if (item.genre_ids) {
            item.genre_ids.forEach(id => {
                genreCounts[id] = (genreCounts[id] || 0) + 1.5;
            });
        }
    });

    if (Object.keys(genreCounts).length === 0) {
        return ''; // Default
    }

    // Sort by most frequent
    const sortedGenres = Object.entries(genreCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3) // Take top 3 genres
        .map(g => g[0]);

    // Join with comma OR pipe. Pipe means OR, Comma means AND in TMDB discover endpoint.
    // We want movies matching ANY of these top genres to have a broad net.
    return sortedGenres.join('|');
};
