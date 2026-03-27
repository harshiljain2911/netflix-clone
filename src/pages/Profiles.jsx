import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const profiles = [
    { id: 1, name: 'Harshil', avatar: 'https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png' },
    { id: 2, name: 'Kids', avatar: 'https://mir-s3-cdn-cf.behance.net/project_modules/disp/84c20033850498.56ba69ac290ea.png' },
    { id: 3, name: 'Guest', avatar: 'https://mir-s3-cdn-cf.behance.net/project_modules/disp/366be133850498.56ba69ac36858.png' }
];

const Profiles = () => {
    const { user, setActiveProfile } = UserAuth();
    const navigate = useNavigate();

    const selectProfile = (profile) => {
        setActiveProfile(profile);
        navigate('/');
    };

    return (
        <div className="w-full h-screen bg-[#141414] flex flex-col justify-center items-center text-white relative">
            
            <div className="absolute top-0 left-0 p-6 md:p-10 w-full flex justify-between">
                <h1 className="text-red-600 text-3xl md:text-5xl font-bold cursor-pointer inline-block leading-none tracking-tight" style={{ fontFamily: '"Bebas Neue", sans-serif' }}>
                    NETFLIX
                </h1>
            </div>

            <motion.h1 
                initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                className="text-3xl md:text-5xl font-semibold mb-12 tracking-wide"
            >
                Who's watching?
            </motion.h1>

            <motion.div 
                initial="hidden" animate="visible"
                variants={{
                    hidden: { opacity: 0 },
                    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
                }}
                className="flex flex-wrap justify-center gap-6 md:gap-10 max-w-4xl"
            >
                {profiles.map((profile) => (
                    <motion.div 
                        key={profile.id}
                        variants={{
                            hidden: { opacity: 0, scale: 0.8 },
                            visible: { opacity: 1, scale: 1, transition: { type: 'spring', bounce: 0.4 } }
                        }}
                        onClick={() => selectProfile(profile)}
                        className="flex flex-col items-center group cursor-pointer w-[100px] md:w-[150px]"
                    >
                        <div className="w-[100px] h-[100px] md:w-[150px] md:h-[150px] rounded border-2 border-transparent group-hover:border-white transition-colors overflow-hidden mb-4 relative">
                            <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                        </div>
                        <span className="text-gray-400 group-hover:text-white transition-colors text-lg md:text-xl font-medium tracking-wide">
                            {profile.name}
                        </span>
                    </motion.div>
                ))}
            </motion.div>

            <motion.button 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
                className="mt-16 md:mt-24 border border-gray-500 text-gray-400 px-6 py-2 text-sm md:text-xl md:px-8 md:py-2 hover:text-white hover:border-white transition-colors tracking-widest"
            >
                MANAGE PROFILES
            </motion.button>
        </div>
    );
};

export default Profiles;
