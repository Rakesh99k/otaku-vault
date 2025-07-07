import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AnimeCard from '../components/AnimeCard';

const Home = () => {
  const [animes, setAnimes] = useState([]);
  const [search, setSearch] = useState('');

 const fetchAnimes = async (query = '') => {
  try {
    const response = query
      ? await axios.get(`https://api.jikan.moe/v4/anime?q=${query}&order_by=score`)
      : await axios.get('https://api.jikan.moe/v4/top/anime');

    // Deduplicate by mal_id
    const uniqueAnimes = response.data.data.filter(
      (anime, index, self) =>
        index === self.findIndex((a) => a.mal_id === anime.mal_id)
    );

    setAnimes(uniqueAnimes);
  } catch (error) {
    console.error("Error fetching anime data", error);
  }
};


  useEffect(() => {
    fetchAnimes();
  }, []);

  const handleSearch = () => {
    fetchAnimes(search);
  };

  return (
    <div style={styles.container}>
      <h1>Anime Explorer</h1>

      {/* 🔍 Search Box */}
      <div style={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search anime..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.input}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button onClick={handleSearch} style={styles.searchButton}>Search</button>
      </div>

      {/* Anime Cards */}
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
  searchContainer: {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '1.5rem'
  },
  input: {
    flex: 1,
    padding: '0.5rem 1rem',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '1rem'
  },
  searchButton: {
    padding: '0.5rem 1.2rem',
    background: '#2196f3',
    border: 'none',
    color: '#fff',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '1rem'
  },
  grid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1rem'
  }
};

export default Home;
