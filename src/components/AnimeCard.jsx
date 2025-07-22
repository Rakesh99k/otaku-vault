// src/components/AnimeCard.jsx
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToWatchlist, removeFromWatchlist } from '../features/watchlistSlice';
import { Link } from 'react-router-dom';
import './AnimeCard.css';

const AnimeCard = ({ anime }) => {
  const dispatch = useDispatch();
  const watchlist = useSelector((state) => state.watchlist.list);

  const isInWatchlist = watchlist.some((item) => item.id === anime.id);

  const handleWatchlistToggle = (e) => {
    e.stopPropagation();
    if (isInWatchlist) {
      dispatch(removeFromWatchlist(anime.id));
    } else {
      dispatch(addToWatchlist(anime));
    }
  };

  return (
    <div className="anime-card">
      <Link
        to={`/details/${anime.id}`}
        className="anime-card-link"
      >
        <img
          src={anime.coverImage?.large}
          alt={anime.title?.romaji}
          className="anime-card-img"
        />
        <h3
          title={anime.title?.romaji}
          className="anime-card-title"
        >
          {anime.title?.romaji}
        </h3>
      </Link>
      <button
        onClick={handleWatchlistToggle}
        className={`anime-card-btn${isInWatchlist ? ' in-watchlist' : ''}`}
      >
        {isInWatchlist ? 'Remove' : 'Add to Watchlist'}
      </button>
    </div>
  );
};

export default AnimeCard;
