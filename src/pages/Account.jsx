import React, { useState } from 'react';
import { UserAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const avatars = [
    "https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png",
    "https://mir-s3-cdn-cf.behance.net/project_modules/disp/84c20033850498.56ba69ac290ea.png",
    "https://mir-s3-cdn-cf.behance.net/project_modules/disp/64623a33850498.56ba69ac2a6f7.png",
    "https://pbs.twimg.com/media/DmBraqkXcAA1Yco.jpg"
];

const Account = () => {
    const { user, updateUserProfile } = UserAuth();
    const [name, setName] = useState(user?.displayName || user?.email?.split('@')[0] || '');
    const [selectedAvatar, setSelectedAvatar] = useState(user?.photoURL || avatars[0]);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            await updateUserProfile(name, selectedAvatar);
            setSuccess('Profile successfully updated!');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError('Failed to update profile. Please try again.');
            console.error(err);
        }

        setLoading(false);
    };

    return (
        <div className="w-full text-white min-h-screen bg-[#141414] pt-[100px] md:pt-[120px] px-4 md:px-14 pb-20">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-[800px] mx-auto"
            >
                <h1 className="text-3xl md:text-5xl font-normal mb-8 border-b border-[#333] pb-4">Edit Profile</h1>

                <div className="flex flex-col md:flex-row gap-8 md:gap-12 mt-8">
                    {/* Left Column - Current Avatar */}
                    <div className="flex flex-col items-center md:items-start shrink-0">
                        <img 
                            src={selectedAvatar} 
                            alt="Current Avatar" 
                            className="w-[120px] md:w-[160px] h-[120px] md:h-[160px] rounded object-cover shadow-[0_0_20px_rgba(0,0,0,0.8)]"
                        />
                    </div>

                    {/* Right Column - Settings Form */}
                    <div className="flex-grow">
                        <form onSubmit={handleSave} className="flex flex-col space-y-6">
                            
                            {/* Display Name Input */}
                            <div className="bg-[#333] p-1 border border-transparent focus-within:border-white transition-colors">
                                <input 
                                    type="text" 
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Display Name"
                                    className="w-full bg-[#333] text-white p-3 outline-none text-lg"
                                />
                            </div>

                            {/* Email Read-only */}
                            <div className="text-gray-400 text-sm">
                                <span className="block mb-1">Email tied to account:</span>
                                <span className="text-gray-300 font-semibold">{user?.email}</span>
                            </div>

                            {/* Avatar Picker */}
                            <div className="border-t border-[#333] pt-6 mt-4">
                                <h3 className="text-xl mb-4 text-gray-200 font-medium">Select Avatar</h3>
                                <div className="flex flex-wrap gap-4">
                                    {avatars.map((avatar, idx) => (
                                        <img 
                                            key={idx}
                                            src={avatar}
                                            onClick={() => setSelectedAvatar(avatar)}
                                            alt={`Avatar option ${idx + 1}`}
                                            className={`w-[60px] md:w-[80px] h-[60px] md:h-[80px] rounded cursor-pointer transition-transform hover:scale-110 ${selectedAvatar === avatar ? 'border-2 border-white scale-105 shadow-[0_0_15px_rgba(255,255,255,0.4)]' : 'opacity-60 hover:opacity-100'}`}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Status Messages */}
                            {error && <p className="text-red-500 text-sm bg-red-500/10 p-2 rounded">{error}</p>}
                            {success && <p className="text-[#46d369] text-sm bg-[#46d369]/10 p-2 rounded">{success}</p>}

                            {/* Action Buttons */}
                            <div className="border-t border-[#333] pt-8 flex gap-4 mt-8">
                                <button 
                                    disabled={loading}
                                    type="submit"
                                    className="bg-white text-black px-8 py-2 md:py-3 font-bold text-sm md:text-base hover:bg-[#e50914] hover:text-white transition-colors tracking-wide disabled:opacity-50"
                                >
                                    {loading ? 'SAVING...' : 'SAVE'}
                                </button>
                                <button 
                                    type="button"
                                    onClick={() => {
                                        setName(user?.displayName || user?.email?.split('@')[0] || '');
                                        setSelectedAvatar(user?.photoURL || avatars[0]);
                                    }}
                                    className="border border-[#666] text-gray-400 px-8 py-2 md:py-3 font-medium text-sm md:text-base hover:border-white hover:text-white transition-colors tracking-wide"
                                >
                                    CANCEL
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Account;
