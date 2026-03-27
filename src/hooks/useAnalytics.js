import { logEvent } from "firebase/analytics";
import { analytics } from "../firebase";
import { useCallback } from "react";

export const useAnalytics = () => {
    
    /**
     * Standardized event tracker
     * @param {string} eventName - e.g., 'video_play', 'search_query', 'movie_hover'
     * @param {object} eventParams - specific properties to track
     */
    const trackEvent = useCallback((eventName, eventParams = {}) => {
        try {
            if (analytics) {
                logEvent(analytics, eventName, {
                    ...eventParams,
                    timestamp: new Date().toISOString()
                });
                console.log(`📡 [Analytics Logged] ${eventName}`, eventParams);
            }
        } catch (error) {
            console.warn("Analytics error:", error);
        }
    }, []);

    const trackWatchTime = useCallback((videoData, secondsWatched) => {
        trackEvent('content_watch_time', {
            video_id: videoData?.id,
            title: videoData?.title || videoData?.name,
            duration_watched_seconds: secondsWatched
        });
    }, [trackEvent]);

    const trackInteraction = useCallback((type, item) => {
        trackEvent('content_interaction', {
            interaction_type: type, // 'like', 'dislike', 'save', 'hover'
            item_id: item?.id,
            title: item?.title || item?.name
        });
    }, [trackEvent]);

    return { trackEvent, trackWatchTime, trackInteraction };
};
