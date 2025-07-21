import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AnimeCard from '../components/AnimeCard';

const Home = () => {
  const [animeList, setAnimeList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [queryTerm, setQueryTerm] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  // Fetch anime from AniList API
  const fetchAnime = async (search = '') => {
    const query = `
      query ($search: String) {
        Page(perPage: 48) {
          media(search: $search, type: ANIME, sort: POPULARITY_DESC) {
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

    const variables = {
      search: search || undefined,
    };

    const response = await fetch("https://graphql.anilist.co", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables }),
    });

    const { data } = await response.json();
    setAnimeList(data.Page.media);
  };

  // Handle search submit
  const handleSearch = (e) => {
    e.preventDefault();
    setQueryTerm(searchTerm.trim());
    if (location.pathname !== '/') {
      navigate('/');
    }
  };

  // Fetch anime when queryTerm changes
  useEffect(() => {
    fetchAnime(queryTerm);
  }, [queryTerm]);

  // Reset logic for Home navigation
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const shouldReset = params.get('reset') === 'true';

    if (shouldReset) {
      setSearchTerm('');
      setQueryTerm('');
      fetchAnime('');
      navigate('/', { replace: true }); // Remove ?reset=true from URL
    }
  }, [location.search, navigate]);

  return (
    <div style={{ padding: '1rem' }}>
      <form onSubmit={handleSearch} style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Search anime..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: '0.5rem',
            width: '250px',
            borderRadius: '6px',
            border: '1px solid #ccc',
            marginRight: '0.5rem',
          }}
        />
        <button type="submit" style={{ padding: '0.5rem 1rem' }}>
          Search
        </button>
      </form>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        {animeList.length > 0 ? (
          animeList.map((anime) => (
            <AnimeCard key={anime.id} anime={anime} />
          ))
        ) : (
          <p>No anime found.</p>
        )}
      </div>
    </div>
  );
};

export default Home;
