// src/components/AnimeCard.jsx
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToWatchlist, removeFromWatchlist } from '../features/watchlistSlice';
import { Link } from 'react-router-dom'; // Add this import

const AnimeCard = ({ anime }) => {
  const dispatch = useDispatch();
  const watchlist = useSelector((state) => state.watchlist.list);

  const isInWatchlist = watchlist.some((item) => item.id === anime.id);

  const handleWatchlistToggle = (e) => {
    e.stopPropagation(); // Prevent card click navigation
    if (isInWatchlist) {
      dispatch(removeFromWatchlist(anime.id));
    } else {
      dispatch(addToWatchlist(anime));
    }
  };

  return (
    <div className="anime-card" style={{
      width: '180px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '1rem',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      borderRadius: '8px',
      background: 'black',
      overflow: 'hidden',
      cursor: 'pointer'
    }}>
      <Link
        to={`/details/${anime.id}`}
        style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}
      >
        <img src={anime.coverImage?.large} alt={anime.title?.romaji} style={{
          width: '100%',
          height: '240px',
          objectFit: 'cover',
          borderRadius: '6px'
        }} />
        <h3
          title={anime.title?.romaji}
          style={{
            width: '100%',
            fontSize: '1rem',
            margin: '0.5rem 0',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            textAlign: 'center',
            whiteSpace: 'nowrap',
            color: '#fff'
          }}
        >
          {anime.title?.romaji}
        </h3>
      </Link>
      <button
        onClick={handleWatchlistToggle}
        style={{
          padding: '0.4rem 0.8rem',
          borderRadius: '4px',
          border: 'none',
          background: isInWatchlist ? '#e74c3c' : '#3498db',
          color: '#fff',
          cursor: 'pointer',
          marginTop: '0.5rem'
        }}
      >
        {isInWatchlist ? 'Remove' : 'Add to Watchlist'}
      </button>
    </div>
  );
};

export default AnimeCard;
