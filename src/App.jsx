import React, { Suspense, lazy } from 'react';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import AuthRoute from './components/AuthRoute';

const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const MyList = lazy(() => import('./pages/MyList'));
const Search = lazy(() => import('./pages/Search'));
const Account = lazy(() => import('./pages/Account'));
const MovieDetails = lazy(() => import('./pages/MovieDetails'));
const WatchPlayer = lazy(() => import('./pages/WatchPlayer'));
const Profiles = lazy(() => import('./pages/Profiles'));
import { AuthContextProvider, UserAuth } from './context/AuthContext';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  return (
    <AuthContextProvider>
      <BrowserRouter>
        <AnimatePresence>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="w-full h-full relative"
          >
            <Navbar />
            <AnimatedRoutes />
            <GlobalToast />
          </motion.div>
        </AnimatePresence>
      </BrowserRouter>
    </AuthContextProvider>
  );
}

// Sub-component rendering the Routes to gain access to useLocation
function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <Suspense fallback={
      <div className="w-full h-screen flex flex-col items-center justify-center bg-[#141414]">
        <div className="w-16 h-16 border-4 border-[#333] border-t-[#e50914] rounded-full animate-spin"></div>
      </div>
    }>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<ProtectedRoute><motion.div initial={{opacity: 0, scale: 0.98}} animate={{opacity: 1, scale: 1}} exit={{opacity: 0, scale: 0.98}} transition={{duration: 0.3}} className="w-full h-full absolute"><Home /></motion.div></ProtectedRoute>} />
          <Route path="/mylist" element={<ProtectedRoute><motion.div initial={{opacity: 0, scale: 0.98}} animate={{opacity: 1, scale: 1}} exit={{opacity: 0, scale: 0.98}} transition={{duration: 0.3}} className="w-full h-full absolute"><MyList /></motion.div></ProtectedRoute>} />
          <Route path="/search" element={<ProtectedRoute><motion.div initial={{opacity: 0, scale: 0.98}} animate={{opacity: 1, scale: 1}} exit={{opacity: 0, scale: 0.98}} transition={{duration: 0.3}} className="w-full h-full absolute"><Search /></motion.div></ProtectedRoute>} />
          <Route path="/account" element={<ProtectedRoute><motion.div initial={{opacity: 0, scale: 0.98}} animate={{opacity: 1, scale: 1}} exit={{opacity: 0, scale: 0.98}} transition={{duration: 0.3}} className="w-full h-full absolute"><Account /></motion.div></ProtectedRoute>} />
          <Route path="/login" element={<AuthRoute><motion.div initial={{opacity: 0, scale: 0.98}} animate={{opacity: 1, scale: 1}} exit={{opacity: 0, scale: 0.98}} transition={{duration: 0.3}} className="w-full h-full absolute"><Login /></motion.div></AuthRoute>} />
          <Route path="/signup" element={<AuthRoute><motion.div initial={{opacity: 0, scale: 0.98}} animate={{opacity: 1, scale: 1}} exit={{opacity: 0, scale: 0.98}} transition={{duration: 0.3}} className="w-full h-full absolute"><Signup /></motion.div></AuthRoute>} />
          <Route path="/title/:type/:id" element={<ProtectedRoute><motion.div initial={{opacity: 0, scale: 0.98}} animate={{opacity: 1, scale: 1}} exit={{opacity: 0, scale: 0.98}} transition={{duration: 0.3}} className="w-full h-full absolute"><MovieDetails /></motion.div></ProtectedRoute>} />
          <Route path="/profiles" element={<ProtectedRoute><motion.div initial={{opacity: 0, scale: 0.98}} animate={{opacity: 1, scale: 1}} exit={{opacity: 0, scale: 0.98}} transition={{duration: 0.3}} className="w-full h-full absolute"><Profiles /></motion.div></ProtectedRoute>} />
          <Route path="/watch/:videoKey" element={<ProtectedRoute><motion.div initial={{opacity: 0, scale: 0.98}} animate={{opacity: 1, scale: 1}} exit={{opacity: 0, scale: 0.98}} transition={{duration: 0.3}} className="w-full h-full absolute z-50"><WatchPlayer /></motion.div></ProtectedRoute>} />
        </Routes>
      </AnimatePresence>
    </Suspense>
  );
}

// Sub-component rendering the active ToastMessage 
function GlobalToast() {
  const { toastMessage } = UserAuth();
  
  return (
    <AnimatePresence>
      {toastMessage && (
        <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] bg-[#e50914] text-white px-6 py-3 rounded shadow-[0_10px_40px_rgba(229,9,20,0.6)] font-bold text-sm tracking-wide flex items-center gap-3"
        >
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
          {toastMessage}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default App;
