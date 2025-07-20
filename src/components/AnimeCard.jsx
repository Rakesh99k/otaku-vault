import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToWatchlist, removeFromWatchlist } from '../features/watchlistSlice';
import { Link } from 'react-router-dom';

const AnimeCard = ({ anime }) => {
  const dispatch = useDispatch();
  const watchlist = useSelector((state) => state.watchlist.animeList);
  const isInWatchlist = watchlist.some(item => item.id === anime.id);

  const handleWatchlistToggle = () => {
    if (isInWatchlist) {
      dispatch(removeFromWatchlist(anime.id));
    } else {
      dispatch(addToWatchlist(anime));
    }
  };

  return (
    <div style={cardStyle}>
      <Link to={`/details/${anime.id}`}>
        <img
          src={anime.coverImage.large}
          alt={anime.title.romaji}
          style={imageStyle}
        />
      </Link>
      <h3 style={titleStyle}>{anime.title.romaji}</h3>
      <button style={buttonStyle} onClick={handleWatchlistToggle}>
        {isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
      </button>
    </div>
  );
};

const cardStyle = {
  background: '#2d2d3d',
  color: 'white',
  borderRadius: '10px',
  overflow: 'hidden',
  padding: '1rem',
  width: '220px',
  margin: '1rem',
  textAlign: 'center',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
};

const imageStyle = {
  width: '100%',
  height: '320px',
  objectFit: 'cover',
  borderRadius: '6px',
};

const titleStyle = {
  margin: '0.75rem 0',
  fontSize: '1.1rem',
};

const buttonStyle = {
  padding: '0.5rem 1rem',
  background: '#4b6cb7',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  fontWeight: 'bold',
};

export default AnimeCard;
