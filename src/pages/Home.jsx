import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AnimeCard from '../components/AnimeCard';
import './Home.css';

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
    <div className="home-container">
      <form onSubmit={handleSearch} className="home-search-form">
        <input
          type="text"
          placeholder="Search anime..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="home-search-input"
        />
        <button type="submit" className="home-search-button">
          Search
        </button>
      </form>

      <div className="home-anime-list">
        {animeList.length > 0 ? (
          animeList.map((anime) => (
            <AnimeCard key={anime.id} anime={anime} />
          ))
        ) : (
          <p style={{ color: 'white' }}>No anime found.</p>
        )}
      </div>
    </div>
  );
};

export default Home;
