import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AnimeCard from '../components/AnimeCard';
import { useLocation, useNavigate } from 'react-router-dom';

const Home = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [animes, setAnimes] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchAnimes = async (query = '') => {
    try {
      setLoading(true);
      const url = query
        ? `https://api.jikan.moe/v4/anime?q=${query}&order_by=score`
        : `https://api.jikan.moe/v4/top/anime`;
      const response = await axios.get(url);
      const data = response.data.data || [];

      const uniqueAnimes = data.filter(
        (anime, index, self) =>
          index === self.findIndex((a) => a.mal_id === anime.mal_id)
      );

      setAnimes(uniqueAnimes);
    } catch (error) {
      console.error('Error fetching anime:', error);
      setAnimes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (search.trim()) {
      fetchAnimes(search);
    }
  };

  // ✅ FIXED: Handles "?reset=true" when the page is opened directly
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const shouldReset = params.get('reset') === 'true';

    if (shouldReset) {
      setSearch('');
      // ✅ DELAY execution slightly to wait until component is ready
      setTimeout(() => {
        fetchAnimes('');
        // ✅ Removes reset param from the URL
        navigate('/', { replace: true });
      }, 0);
    } else {
      // ✅ Load top anime by default when there's no reset param
      fetchAnimes('');
    }
  }, [location.search]);

  return (
    <div style={styles.container}>
      <h1>Anime Explorer</h1>

      <div style={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search anime..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          style={styles.input}
        />
        <button onClick={handleSearch} style={styles.searchButton}>
          Search
        </button>
      </div>

      {loading ? (
        <p style={styles.message}>Loading...</p>
      ) : animes.length === 0 ? (
        <p style={styles.message}>No anime found.</p>
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
    color: '#fff',
  },
  searchContainer: {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '1.5rem',
  },
  input: {
    flex: 1,
    padding: '0.5rem 1rem',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '1rem',
  },
  searchButton: {
    padding: '0.5rem 1.2rem',
    background: '#2196f3',
    border: 'none',
    color: '#fff',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '1rem',
  },
  grid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  message: {
    marginTop: '2rem',
    fontSize: '1.2rem',
    color: 'orange',
  },
};

export default Home;
