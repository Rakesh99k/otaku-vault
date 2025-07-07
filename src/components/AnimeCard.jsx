import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addToWatchlist } from '../features/watchlistSlice';

const AnimeCard = ({ anime, showAddButton = true }) => {
  const dispatch = useDispatch();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    dispatch(addToWatchlist(anime));
    setAdded(true);
  };

  return (
    <div style={styles.card}>
      <img src={anime.images.jpg.image_url} alt={anime.title} style={styles.image} />
      <h3 style={styles.title}>{anime.title}</h3>

      {showAddButton && (
        <button
          style={added ? styles.addedButton : styles.button}
          onClick={handleAdd}
          disabled={added}
        >
          {added ? 'Added' : 'Add to Watchlist'}
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
    color: '#fff'
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
  }
};

export default AnimeCard;
