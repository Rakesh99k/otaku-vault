import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToWatchlist, removeFromWatchlist } from '../features/watchlistSlice';
import { Link } from 'react-router-dom';

const AnimeCard = ({ anime, showAddButton = true, showRemoveButton = false }) => {
  const dispatch = useDispatch();
  const watchlist = useSelector((state) => state.watchlist.watchlist || []);

  const isAlreadyAdded = watchlist.some(item => item.mal_id === anime.mal_id);

  const handleAdd = () => {
    if (!isAlreadyAdded) {
      dispatch(addToWatchlist(anime));
    }
  };

  const handleRemove = () => {
    dispatch(removeFromWatchlist(anime.mal_id));
  };

  return (
    <div style={styles.card}>
      {showRemoveButton && (
        <button style={styles.removeButton} onClick={handleRemove}>✖</button>
      )}

      <Link to={`/details/${anime.mal_id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <img src={anime.images.jpg.image_url} alt={anime.title} style={styles.image} />
        <h3 style={styles.title}>{anime.title}</h3>
      </Link>

      {showAddButton && (
        <button
          style={isAlreadyAdded ? styles.addedButton : styles.button}
          onClick={handleAdd}
          disabled={isAlreadyAdded}
        >
          {isAlreadyAdded ? 'Added' : 'Add to Watchlist'}
        </button>
      )}
    </div>
  );
};

const styles = {
  card: {
    backgroundColor: '#2c2c3e',
    padding: '1rem',
    borderRadius: '10px',
    margin: '1rem',
    width: '200px',
    textAlign: 'center',
    color: '#fff',
    position: 'relative'
  },
  image: {
    width: '100%',
    height: '300px',
    objectFit: 'cover',
    borderRadius: '8px'
  },
  title: {
    marginTop: '0.5rem',
    fontSize: '1rem'
  },
  button: {
    marginTop: '0.5rem',
    background: '#00c853',
    border: 'none',
    padding: '0.4rem 0.8rem',
    borderRadius: '6px',
    color: '#fff',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  addedButton: {
    marginTop: '0.5rem',
    background: '#616161',
    border: 'none',
    padding: '0.4rem 0.8rem',
    borderRadius: '6px',
    color: '#fff',
    cursor: 'not-allowed',
    transition: 'all 0.3s ease'
  },
  removeButton: {
    position: 'absolute',
    top: '8px',
    right: '8px',
    background: '#ff1744',
    border: 'none',
    borderRadius: '50%',
    width: '28px',
    height: '28px',
    color: '#fff',
    fontSize: '16px',
    cursor: 'pointer'
  }
};

export default AnimeCard;
