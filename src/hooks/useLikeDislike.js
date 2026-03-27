import { useState } from 'react';
import { db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { UserAuth } from '../context/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export const useLikeDislike = (movieId) => {
    const { user } = UserAuth();
    const queryClient = useQueryClient();

    // Query to fetch user's rating (like/dislike) for a specific movie
    const { data: rating } = useQuery({
        queryKey: ['rating', user?.uid, movieId],
        queryFn: async () => {
            if (!user?.uid || !movieId) return null;
            const ref = doc(db, 'users', user.uid, 'ratings', String(movieId));
            const snap = await getDoc(ref);
            return snap.exists() ? snap.data().type : null; // 'like', 'dislike', or null
        },
        enabled: !!user?.uid && !!movieId,
    });

    const mutation = useMutation({
        mutationFn: async (type) => { // 'like' or 'dislike' or null to remove
            if (!user?.uid) throw new Error('Not logged in');
            const ref = doc(db, 'users', user.uid, 'ratings', String(movieId));
            if (type === null) {
                // If we want to remove rating entirely, we could deleteDoc, 
                // but setting null is fine too for basic implementation
                await setDoc(ref, { type: null, movieId }, { merge: true });
            } else {
                await setDoc(ref, { type, movieId }, { merge: true });
            }
        },
        onMutate: async (newType) => {
            // Optimistic update
            await queryClient.cancelQueries({ queryKey: ['rating', user?.uid, movieId] });
            const previousRating = queryClient.getQueryData(['rating', user?.uid, movieId]);
            queryClient.setQueryData(['rating', user?.uid, movieId], newType);
            return { previousRating };
        },
        onError: (err, newType, context) => {
            queryClient.setQueryData(['rating', user?.uid, movieId], context.previousRating);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['rating', user?.uid, movieId] });
        }
    });

    const setRating = (type) => {
        // Toggle off if clicking the same rating again
        if (rating === type) {
            mutation.mutate(null);
        } else {
            mutation.mutate(type);
        }
    };

    return { rating, setRating, isPending: mutation.isPending };
};
