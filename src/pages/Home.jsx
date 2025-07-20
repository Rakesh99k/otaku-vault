import React, { useState, useEffect } from 'react';
import AnimeCard from '../components/AnimeCard';

const Home = () => {
  const [animeList, setAnimeList] = useState([]);
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);

  const fetchAnime = async (searchTerm) => {
    setSearching(true);
    const query = `
      query ($search: String) {
        Page(perPage: 20) {
          media(search: $search, type: ANIME) {
            id
            title {
              romaji
            }
            coverImage {
              large
            }
          }
        }
      }
    `;

    const variables = { search: searchTerm };

    const response = await fetch('https://graphql.anilist.co', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables }),
    });

    const data = await response.json();
    setAnimeList(data.data.Page.media);
    setSearching(false);
  };

  useEffect(() => {
    fetchAnime('Naruto'); // default search
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim() !== '') {
      fetchAnime(query);
    }
  };

  return (
    <div style={{ padding: '2rem', backgroundColor: '#1c1c2b', minHeight: '100vh', color: 'white' }}>
      <form onSubmit={handleSearch} style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <input
          type="text"
          placeholder="Search anime..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={searchInputStyle}
        />
        <button type="submit" style={searchButtonStyle}>
          Search
        </button>
      </form>

      {searching ? (
        <h2 style={{ textAlign: 'center' }}>Searching...</h2>
      ) : (
        <div style={cardGridStyle}>
          {animeList.map((anime) => (
            <AnimeCard key={anime.id} anime={anime} />
          ))}
        </div>
      )}
    </div>
  );
};

const searchInputStyle = {
  padding: '0.7rem',
  width: '260px',
  borderRadius: '8px',
  border: '1px solid #ccc',
  fontSize: '1rem',
  marginRight: '0.5rem',
};

const searchButtonStyle = {
  padding: '0.7rem 1.2rem',
  background: '#4b6cb7',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  fontWeight: 'bold',
};

const cardGridStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
};

export default Home;
