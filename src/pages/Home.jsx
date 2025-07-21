import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AnimeCard from '../components/AnimeCard';

const Home = () => {
  const [animeList, setAnimeList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [queryTerm, setQueryTerm] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Reset search when "?reset=true" is in the URL
    if (location.search.includes('reset=true')) {
      setSearchTerm('');
      setQueryTerm(''); // This triggers the fetch for default list
      window.history.replaceState({}, '', location.pathname);
    }
  }, [location.search]);

  useEffect(() => {
    const fetchAnime = async () => {
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
        search: queryTerm || undefined,
      };

      const response = await fetch("https://graphql.anilist.co", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, variables }),
      });

      const { data } = await response.json();
      setAnimeList(data.Page.media);
    };

    fetchAnime();
  }, [queryTerm]); // 👈 Only depend on queryTerm

  const handleSearch = (e) => {
    e.preventDefault();
    setQueryTerm(searchTerm.trim());
    if (location.pathname !== '/') {
      navigate('/');
    }
  };

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
