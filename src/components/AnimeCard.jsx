// src/components/AnimeCard.jsx
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToWatchlist, removeFromWatchlist } from '../features/watchlistSlice';
import { Link, useLocation } from 'react-router-dom';
import './AnimeCard.css';

const AnimeCard = ({ anime, loading = false }) => {
  const dispatch = useDispatch();
  const watchlist = useSelector((state) => state.watchlist.list);
  const location = useLocation();
  const [animationClass, setAnimationClass] = useState('');

  const isInWatchlist = watchlist.some((item) => item.id === anime?.id);

  const handleWatchlistToggle = (e) => {
    e.stopPropagation();
    
    // Add animation class
    const animationType = isInWatchlist ? 'checkmark-animation' : 'heart-beat';
    setAnimationClass(animationType);
    
    // Remove animation class after animation completes
    setTimeout(() => setAnimationClass(''), 1000);
    
    if (isInWatchlist) {
      dispatch(removeFromWatchlist(anime.id));
    } else {
      dispatch(addToWatchlist(anime));
    }
  };

  // Preserve search, genre, and page in the link
  const detailsLink = anime ? `/details/${anime.id}${location.search}` : '#';

  if (loading) {
    return (
      <div className="anime-card loading">
        <div className="anime-card-skeleton"></div>
        <div className="anime-card-skeleton-title"></div>
        <div className="anime-card-skeleton-btn"></div>
      </div>
    );
  }

  return (
    <div className="anime-card">
      <Link
        to={detailsLink}
        className="anime-card-link"
      >
        <img
          src={anime.coverImage?.large}
          alt={anime.title?.english || anime.title?.romaji}
          className="anime-card-img"
        />
        <h3
          title={anime.title?.english || anime.title?.romaji}
          className="anime-card-title"
        >
          {anime.title?.english || anime.title?.romaji}
        </h3>
        {anime.title?.english && anime.title?.romaji && anime.title.english !== anime.title.romaji && (
          <div className="anime-card-romaji">{anime.title.romaji}</div>
        )}
      </Link>
      <button
        onClick={handleWatchlistToggle}
        className={`anime-card-btn${isInWatchlist ? ' in-watchlist' : ''} ${animationClass}`}
      >
        {isInWatchlist ? (
          <>Remove</>
        ) : (
          <>
            Watchlist <span role="img" aria-label="heart" className="heart-icon">❤️</span>
          </>
        )}
      </button>
    </div>
  );
};

export default AnimeCard;
