import { useState } from 'react';
import { db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { UserAuth } from '../context/AuthContext';

export const useWatchHistory = () => {
    const { user, watchHistory } = UserAuth();
    const [isUpdating, setIsUpdating] = useState(false);

    const addToHistory = async (movie) => {
        if (!user?.uid || !movie?.id) return;
        
        setIsUpdating(true);
        const movieRef = doc(db, 'users', user.uid);
        
        try {
            // Filter out if it already exists to move it to the top
            let currentList = watchHistory ? [...watchHistory] : [];
            currentList = currentList.filter(m => m.id !== movie.id);
            currentList.unshift(movie);
            
            // Clamp to recent 20
            if (currentList.length > 20) {
                currentList.pop();
            }

            await setDoc(movieRef, { watchHistory: currentList }, { merge: true });
        } catch (err) {
            console.error('Error updating watch history in Firestore', err);
        } finally {
            setIsUpdating(false);
        }
    };

    const removeFromHistory = async (movie) => {
        if (!user?.uid || !movie?.id) return;

        setIsUpdating(true);
        const movieRef = doc(db, 'users', user.uid);

        try {
            let currentList = watchHistory ? [...watchHistory] : [];
            currentList = currentList.filter(m => m.id !== movie.id);
            
            await setDoc(movieRef, { watchHistory: currentList }, { merge: true });
        } catch (err) {
            console.error('Error removing from watch history', err);
        } finally {
            setIsUpdating(false);
        }
    };

    return { addToHistory, removeFromHistory, isUpdating };
};
