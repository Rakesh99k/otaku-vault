import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AnimeCard from '../components/AnimeCard';

const Home = () => {
  const [animes, setAnimes] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchAnimes = async (query = '') => {
    try {
      setLoading(true);
      setAnimes([]); // Clear previous data immediately

      const response = query
        ? await axios.get(`https://api.jikan.moe/v4/anime?q=${query}&order_by=score`)
        : await axios.get('https://api.jikan.moe/v4/top/anime');

      console.log('Response data:', response.data.data); // Debug log

      const animeData = response.data.data || [];

      const uniqueAnimes = animeData.filter(
        (anime, index, self) =>
          index === self.findIndex((a) => a.mal_id === anime.mal_id)
      );

      setAnimes(uniqueAnimes);
    } catch (error) {
      console.error('Error fetching anime data', error);
      setAnimes([]); // fallback to empty
    } finally {
      setLoading(false);
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
        <button onClick={handleSearch} style={styles.searchButton}>
          Search
        </button>
      </div>


      {/* 🔄 Loader / No Results / Anime Grid */}
      {loading ? (
        <p style={{ marginTop: '2rem', fontSize: '1.2rem', color: 'orange' }}>Loading...</p>
      ) : animes.length === 0 ? (
        <p style={{ marginTop: '2rem', fontSize: '1.2rem', color: 'red' }}>No results found.</p>
      ) : (
        <div style={styles.grid}>
          {animes.map((anime) => (
            <AnimeCard key={anime.mal_id} anime={anime} />
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
