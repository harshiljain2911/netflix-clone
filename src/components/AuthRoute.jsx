import React from 'react';
import { Navigate } from 'react-router-dom';
import { UserAuth } from '../context/AuthContext';

const AuthRoute = ({ children }) => {
    const { user, authLoading } = UserAuth();

    if (authLoading) {
        return (
            <div className="w-full h-screen bg-[#141414] flex flex-col items-center justify-center space-y-4">
                <div className="w-16 h-16 border-4 border-[#333] border-t-[#e50914] rounded-full animate-spin shadow-2xl"></div>
                <p className="text-gray-400 text-sm font-semibold tracking-wider animate-pulse">AUTHENTICATING...</p>
            </div>
        );
    }

    if (user) {
        return <Navigate to="/" />;
    }

    return children;
};

export default AuthRoute;
