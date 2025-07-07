import React from 'react';
import { useSelector } from 'react-redux';
import AnimeCard from '../components/AnimeCard';

const Watchlist = () => {
  const watchlist = useSelector((state) => state.watchlist.watchlist || []);

  return (
    <div style={styles.container}>
      <h2>Your Watchlist</h2>
      {(!watchlist || watchlist.length === 0) ? (
        <p style={{ marginTop: '1rem' }}>Your watchlist is empty. Add some anime!</p>
      ) : (
        <div style={styles.grid}>
          {watchlist.map((anime) => (
            <AnimeCard key={anime.mal_id} anime={anime} showAddButton={false} />
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '2rem',
    color: '#fff'
  },
  grid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1rem'
  }
};

export default Watchlist;
