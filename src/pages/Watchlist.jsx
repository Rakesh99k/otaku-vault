import React from 'react';

const Watchlist = () => {
  return (
    <div style={styles.container}>
      <h1>Your Anime Watchlist</h1>
      <p>Start adding your favorite animes to your watchlist!</p>
    </div>
  );
};

const styles = {
  container: {
    padding: '2rem',
    color: '#fff'
  }
};

export default Watchlist;
