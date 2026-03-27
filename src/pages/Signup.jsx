import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserAuth } from '../context/AuthContext';

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { signUp, googleSignIn } = UserAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        console.log("Debug - Email:", email);
        console.log("Debug - Password:", password);
        console.log("Debug - Password Length:", password.length);
        
        // Explicit pre-validation before reaching out to Firebase
        if (password.length < 6) {
            setError('Password should be at least 6 characters.');
            return;
        }

        setLoading(true);
        try {
            await signUp(email, password);
            navigate('/');
        } catch (error) {
            console.error("Firebase Signup Error:", error);
            
            // Check for specific Firebase configuration error
            if (error.code === 'auth/configuration-not-found' || error.message?.includes('configuration-not-found')) {
                setError('Authentication provider not enabled. Please enable "Email/Password" Sign-in inside your Firebase Console.');
            } else {
                setError(error.message || 'Failed to create an account.');
            }
        }
        setLoading(false);
    };

    const handleGoogleSignUp = async () => {
        setError('');
        try {
            await googleSignIn();
            navigate('/');
        } catch (error) {
            console.error("Firebase Google Auth Error:", error);
            setError(error.message || 'Failed to authenticate via Google.');
        }
    };

    return (
        <div className="relative w-full h-screen">
            {/* Massive Cinematic Background Image */}
            <img 
                className="hidden sm:block absolute w-full h-full object-cover z-0" 
                src="https://assets.nflxext.com/ffe/siteui/vlv3/f841d4c7-10e1-40af-bcae-07a3f8dc141a/f6d7434e-d6de-4185-a6d4-c77a2d08737b/US-en-20220502-popsignuptwoweeks-perspective_alpha_website_small.jpg" 
                alt="Netflix Background" 
            />
            {/* Elegant overlay gradient mapping over the background exactly like Netflix */}
            <div className="absolute top-0 left-0 w-full h-full bg-black/60 sm:bg-black/50 z-10"></div>
            
            {/* Signup Box */}
            <div className="fixed w-full px-4 py-24 z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-10">
                <div className="max-w-[450px] mx-auto bg-black/75 md:bg-black/80 backdrop-blur-md rounded-md p-10 sm:p-14 lg:p-16 shadow-2xl">
                    <div className="max-w-[320px] mx-auto">
                        <h1 className="text-3xl md:text-[32px] font-bold text-white mb-7">Sign Up</h1>
                        
                        {error ? <p className="p-3 bg-[#e87c03] text-white text-sm rounded mb-4">{error}</p> : null}
                        
                        <form onSubmit={handleSubmit} className="w-full flex flex-col pt-2">
                            <div className="relative mb-5 flex flex-col">
                                <input 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="p-3 sm:p-4 my-1 sm:my-2 bg-[#333333] rounded-[4px] text-white focus:outline-none focus:ring-2 focus:ring-white/20 focus:bg-[#444] peer transition-all duration-300 font-medium text-[15px] pt-5 pb-2 hover:bg-[#444]" 
                                    type="email" 
                                    placeholder=" "
                                    autoComplete="email" 
                                    required
                                />
                                <label className="absolute text-gray-400 text-[15px] duration-300 transform -translate-y-3 scale-75 top-6 z-10 origin-[0] left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 pointer-events-none">
                                    Email address
                                </label>
                            </div>

                            <div className="relative mb-6 flex flex-col">
                                <input 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="p-3 sm:p-4 my-1 sm:my-2 bg-[#333333] rounded-[4px] text-white focus:outline-none focus:ring-2 focus:ring-white/20 focus:bg-[#444] peer transition-all duration-300 font-medium text-[15px] pt-5 pb-2 hover:bg-[#444]" 
                                    type="password" 
                                    placeholder=" "
                                    autoComplete="new-password" 
                                    required
                                />
                                <label className="absolute text-gray-400 text-[15px] duration-300 transform -translate-y-3 scale-75 top-6 z-10 origin-[0] left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 pointer-events-none">
                                    Password
                                </label>
                            </div>
                            
                            <button 
                                disabled={loading}
                                className="bg-[#e50914] py-3.5 my-4 rounded-[4px] font-bold text-[16px] text-white mt-4 disabled:opacity-50 hover:bg-[#f6121d] hover:scale-[1.03] hover:shadow-[0_0_20px_rgba(229,9,20,0.6)] transition-all duration-300"
                            >
                                {loading ? 'Creating Account...' : 'Sign Up'}
                            </button>
                            
                            <div className="flex items-center justify-between mt-1 mb-4">
                                <hr className="w-[45%] border-gray-600" />
                                <span className="text-gray-400 text-[13px] font-medium tracking-wide">OR</span>
                                <hr className="w-[45%] border-gray-600" />
                            </div>
                            
                            <button 
                                type="button" 
                                onClick={handleGoogleSignUp}
                                disabled={loading}
                                className="bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center w-full py-3.5 rounded font-medium border border-[#333] mb-4 text-white text-[15px] disabled:opacity-50"
                            >
                                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                                Continue with Google
                            </button>
                            
                            <div className="flex justify-between items-center text-[13px] text-[#b3b3b3] mt-2 font-medium">
                                <p><input className="mr-2 accent-[#737373] bg-[#737373]" type="checkbox" />Remember me</p>
                                <p className="hover:underline cursor-pointer">Need help?</p>
                            </div>

                            <p className="py-12 mt-10 text-[#737373] text-[16px] font-medium">
                                Already subscribed to Netflix?{' '}
                                <Link to="/login" className="text-white hover:underline">
                                    Sign In.
                                </Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
