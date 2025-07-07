import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const AnimeDetails = () => {
  const { id } = useParams();
  const [anime, setAnime] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchAnimeDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`https://api.jikan.moe/v4/anime/${id}`);
      console.log('Anime details:', response.data.data);
      setAnime(response.data.data);
    } catch (error) {
      console.error('Error fetching anime details', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnimeDetails();
  }, [id]);

  if (loading) return <p style={{ color: 'orange' }}>Loading details...</p>;
  if (!anime) return <p style={{ color: 'red' }}>Anime not found.</p>;

  return (
    <div style={styles.container}>
      <Link to="/" style={styles.backLink}>← Back to Home</Link>

      <div style={styles.detailsContainer}>
        <img src={anime.images.jpg.image_url} alt={anime.title} style={styles.image} />

        <div style={styles.info}>
          <h1 style={{ marginBottom: '1rem' }}>{anime.title}</h1>
          <p><strong>Episodes:</strong> {anime.episodes}</p>
          <p><strong>Status:</strong> {anime.status}</p>
          <p><strong>Score:</strong> {anime.score}</p>
          <p><strong>Rating:</strong> {anime.rating}</p>
          <p><strong>Duration:</strong> {anime.duration}</p>
          <p><strong>Aired:</strong> {anime.aired.string}</p>
          <p><strong>Broadcast:</strong> {anime.broadcast.string}</p>

          <p><strong>Genres:</strong> {' '}
            {anime.genres.map(genre => genre.name).join(', ')}
          </p>

          <a href={anime.url} target="_blank" rel="noreferrer" style={styles.link}>
            📖 View on MyAnimeList
          </a>
        </div>
      </div>

      <div style={styles.synopsis}>
        <h2 style={{ marginBottom: '0.5rem' }}>Synopsis:</h2>
        <p>{anime.synopsis}</p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '2rem',
    color: '#fff',
    backgroundColor: '#1c1c2b',
    minHeight: '100vh',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  backLink: {
    color: '#00aced',
    marginBottom: '1rem',
    display: 'inline-block'
  },
  detailsContainer: {
    display: 'flex',
    gap: '2rem',
    marginBottom: '2rem',
    alignItems: 'flex-start'
  },
  image: {
    width: '250px',
    borderRadius: '10px'
  },
  info: {
  flex: 1,
  fontSize: '1.05rem',
  lineHeight: '1.5',
  padding: '1rem',
  border: '1px solid #333',
  borderRadius: '8px'
},
  link: {
    color: '#00aced',
    marginTop: '1rem',
    display: 'inline-block'
  },
  synopsis: {
    marginTop: '2rem'
  }
};

export default AnimeDetails;
