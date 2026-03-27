import { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged,
    updateProfile,
    GoogleAuthProvider,
    signInWithPopup
} from 'firebase/auth';
import { setDoc, doc, onSnapshot } from 'firebase/firestore';

const AuthContext = createContext();

export function AuthContextProvider({ children }) {
    const [user, setUser] = useState(null);
    const [activeProfile, setActiveProfile] = useState(null);
    const [savedShows, setSavedShows] = useState([]);
    const [watchHistory, setWatchHistory] = useState([]);
    const [authLoading, setAuthLoading] = useState(true);
    const [toastMessage, setToastMessage] = useState(null);

    function triggerToast(message) {
        setToastMessage(message);
        setTimeout(() => setToastMessage(null), 3500);
    }

    async function signUp(email, password) {
        const { user } = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(user, {
            displayName: email.split('@')[0],
            photoURL: "https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png"
        });
        await setDoc(doc(db, 'users', user.uid), {
            savedShows: [],
            watchHistory: []
        });
    }

    async function updateUserProfile(displayName, photoURL) {
        if (auth.currentUser) {
            await updateProfile(auth.currentUser, {
                displayName,
                photoURL
            });
            // Force React to recognize the mutated Auth Object
            setUser({ ...auth.currentUser });
        }
    }

    async function googleSignIn() {
        const provider = new GoogleAuthProvider();
        const { user } = await signInWithPopup(auth, provider);
        
        // Merge true ensures existing Google users don't have their My List arrays erased on subsequent logins!
        await setDoc(doc(db, 'users', user.uid), {
            savedShows: [],
            watchHistory: []
        }, { merge: true });

        // If Google account somehow has no photo, initialize Netflix fallback
        if (!user.photoURL) {
            await updateProfile(user, {
                photoURL: "https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png"
            });
            setUser({ ...auth.currentUser });
        }
    }

    function logIn(email, password) {
        return signInWithEmailAndPassword(auth, email, password);
    }

    function logOut() {
        return signOut(auth);
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setAuthLoading(false);
        });
        return () => {
            unsubscribe();
        };
    }, []);

    // Global listener for My List
    useEffect(() => {
        if (user?.uid) {
            const unsubscribe = onSnapshot(doc(db, 'users', user.uid), (document) => {
                if (document.exists()) {
                    setSavedShows(document.data()?.savedShows || []);
                    setWatchHistory(document.data()?.watchHistory || []);
                }
            });
            return () => {
                unsubscribe();
            };
        } else {
            setSavedShows([]);
            setWatchHistory([]);
        }
    }, [user?.uid]);

    return (
        <AuthContext.Provider value={{ signUp, logIn, logOut, updateUserProfile, googleSignIn, triggerToast, toastMessage, user, activeProfile, setActiveProfile, savedShows, watchHistory, authLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function UserAuth() {
    return useContext(AuthContext);
}
