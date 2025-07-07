import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AnimeCard from '../components/AnimeCard';

const Home = () => {
  const [animes, setAnimes] = useState([]);

  useEffect(() => {
    const fetchAnimes = async () => {
      try {
        const response = await axios.get('https://api.jikan.moe/v4/top/anime');
        setAnimes(response.data.data);
      } catch (error) {
        console.error("Error fetching anime data", error);
      }
    };

    fetchAnimes();
  }, []);

  return (
    <div style={styles.container}>
      <h1>Top Animes</h1>
      <div style={styles.grid}>
        {animes.map((anime) => (
          <AnimeCard key={anime.mal_id} anime={anime} />
        ))}
      </div>
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

export default Home;
