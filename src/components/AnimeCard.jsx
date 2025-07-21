// src/components/AnimeCard.jsx
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToWatchlist, removeFromWatchlist } from '../features/watchlistSlice';

const AnimeCard = ({ anime }) => {
  const dispatch = useDispatch();
  const watchlist = useSelector((state) => state.watchlist.list);

  const isInWatchlist = watchlist.some((item) => item.id === anime.id);

  const handleWatchlistToggle = () => {
    if (isInWatchlist) {
      dispatch(removeFromWatchlist(anime.id));
    } else {
      dispatch(addToWatchlist(anime));
    }
  };

  return (
    <div className="anime-card">
      <img src={anime.coverImage?.large} alt={anime.title?.romaji} />
      <h3>{anime.title?.romaji}</h3>
      <button onClick={handleWatchlistToggle}>
        {isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
      </button>
    </div>
  );
};

export default AnimeCard;
