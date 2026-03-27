import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

/**
 * FIREBASE SETUP GUIDE:
 * If you get an 'auth/configuration-not-found' error, it means you have not enabled the Email/Password provider.
 * 1. Go to your Firebase Console -> Build -> Authentication
 * 2. Click "Get Started"
 * 3. Go to the "Sign-in method" tab
 * 4. Click "Email/Password", enable it, and save.
 * 
 * ALSO: Enable Firestore Database to use "My List".
 */

// Ensure your .env file defines these exact VITE_ variables correctly.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID // Optional for Analytics
};

console.log("Firebase Config Initialization Data: ", firebaseConfig);

// Ensure Firebase is initialized only once to prevent redundant initialization errors
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);

// Enable Offline Persistence for Phase 8 Scale
enableIndexedDbPersistence(db).catch((err) => {
    if (err.code == 'failed-precondition') {
        console.warn('Multiple tabs open, offline persistence can only be enabled in one tab at a time.');
    } else if (err.code == 'unimplemented') {
        console.warn('The current browser does not support all of the features required to enable persistence');
    }
});

// Initialize Analytics (Phase 6)
export let analytics = null;
isSupported().then((supported) => {
    if (supported) {
        analytics = getAnalytics(app);
    }
});
