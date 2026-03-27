import React, { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import Row from '../components/Row';
import SavedShows from '../components/SavedShows';
import ContinueWatching from '../components/ContinueWatching';
import SmartRecommendationRow from '../components/SmartRecommendationRow';
import Footer from '../components/Footer';
import TrailerModal from '../components/TrailerModal';
import requests, { fetchTrailer } from '../services/tmdb';
import { motion, AnimatePresence } from 'framer-motion';
import { UserAuth } from '../context/AuthContext';
import { useWatchHistory } from '../hooks/useWatchHistory';

const Home = () => {
  const [modalTrailer, setModalTrailer] = useState(null);
  const { user, watchHistory } = UserAuth();
  const { addToHistory, removeFromHistory } = useWatchHistory();

  const removeHistoryItem = (item, e) => {
      e.stopPropagation();
      removeFromHistory(item);
  };

  const handleOpenTrailer = async (movie) => {
      if (!movie?.id) return;
      
      // Cache viewing history globally
      if (user?.uid && movie) {
          addToHistory(movie);
      }

      const trailerKey = await fetchTrailer(movie);
      
      if (trailerKey) {
          setModalTrailer(trailerKey);
      } else {
          setModalTrailer('NOT_FOUND');
      }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.4 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 1, 0.5, 1] } }
  };

  return (
    <>
        <Hero fetchUrl={requests.requestPopular} openTrailer={handleOpenTrailer} />
        
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          {watchHistory?.length > 0 && (
              <motion.div variants={itemVariants}>
                  <ContinueWatching shows={watchHistory} openTrailer={handleOpenTrailer} removeShow={removeHistoryItem} />
              </motion.div>
          )}

          <motion.div variants={itemVariants}>
              <SmartRecommendationRow openTrailer={handleOpenTrailer} />
          </motion.div>

          <motion.div variants={itemVariants}>
            <Row rowId="1" title="NETFLIX ORIGINALS" fetchUrl={requests.requestOriginals} openTrailer={handleOpenTrailer} />
          </motion.div>
          <motion.div variants={itemVariants}>
            <SavedShows openTrailer={handleOpenTrailer} />
          </motion.div>
          <motion.div variants={itemVariants}>
            <Row rowId="2" title="Trending Now" fetchUrl={requests.requestTrending} openTrailer={handleOpenTrailer} />
          </motion.div>
          <motion.div variants={itemVariants}>
            <Row rowId="3" title="Top Rated" fetchUrl={requests.requestTopRated} openTrailer={handleOpenTrailer} />
          </motion.div>
          <motion.div variants={itemVariants}>
            <Row rowId="4" title="Action Movies" fetchUrl={requests.requestAction} openTrailer={handleOpenTrailer} />
          </motion.div>
          <motion.div variants={itemVariants}>
            <Row rowId="5" title="Horror" fetchUrl={requests.requestHorror} openTrailer={handleOpenTrailer} />
          </motion.div>
        </motion.div>

        <Footer />
        <TrailerModal trailerKey={modalTrailer} onClose={() => setModalTrailer(null)} />
    </>
  );
};

export default Home;
