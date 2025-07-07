import React from 'react';

const AnimeCard = ({ anime }) => {
  return (
    <div style={styles.card}>
      <img src={anime.images.jpg.image_url} alt={anime.title} style={styles.image} />
      <h3 style={styles.title}>{anime.title}</h3>
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
  }
};

export default AnimeCard;
