import { useState } from 'react';
import { db } from '../firebase';
import { arrayUnion, arrayRemove, doc, setDoc } from 'firebase/firestore';
import { UserAuth } from '../context/AuthContext';

export const useMyList = () => {
    const { user, savedShows, triggerToast } = UserAuth();
    const [isSaving, setIsSaving] = useState(false);

    const toggleSaveShow = async (item, currentlySaved, setOptimisticLocalSave) => {
        if (!user?.uid) {
            alert('Please log in to save a movie');
            return;
        }

        const nextState = !currentlySaved;
        // Optimistic UI update
        if (setOptimisticLocalSave) {
            setOptimisticLocalSave(nextState);
        }
        
        setIsSaving(true);
        if (nextState) {
            triggerToast('Added to My List');
        } else {
            triggerToast('Removed from My List');
        }

        const movieRef = doc(db, 'users', user.uid);
        try {
            if (!nextState) {
                const exactItemToRemove = savedShows?.find(show => show.id === item.id) || item;
                await setDoc(movieRef, { savedShows: arrayRemove(exactItemToRemove) }, { merge: true });
            } else {
                await setDoc(movieRef, { savedShows: arrayUnion(item) }, { merge: true });
            }
        } catch (err) { 
            console.error("Error toggling save show:", err); 
            if (setOptimisticLocalSave) setOptimisticLocalSave(!nextState); // Rollback
            triggerToast('Network error: Action reverted.');
        } finally {
            setIsSaving(false);
        }
    };

    return { toggleSaveShow, isSaving };
};
