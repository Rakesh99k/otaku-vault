import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AnimeCard from '../components/AnimeCard';
import './Home.css';

const PER_PAGE = 25;
const GENRES = [
  'All',
  'Action',
  'Adventure',
  'Comedy',
  'Drama',
  'Fantasy',
  'Horror',
  'Mystery',
  'Romance',
  'Sci-Fi',
  'Slice of Life',
  'Sports',
  'Supernatural',
  'Thriller',
];

const Home = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [animeList, setAnimeList] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Get params from URL
  const params = new URLSearchParams(location.search);
  const search = params.get('search') || '';
  const genre = params.get('genre') || 'All';
  const page = parseInt(params.get('page') || '1', 10);

  // Fetch anime when params change
  useEffect(() => {
    const fetchAnime = async () => {
      const query = `
        query ($search: String, $page: Int, $perPage: Int, $genre: String) {
          Page(page: $page, perPage: $perPage) {
            pageInfo {
              total
              currentPage
              lastPage
              hasNextPage
            }
            media(search: $search, genre: $genre, type: ANIME, sort: POPULARITY_DESC) {
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
        page,
        perPage: PER_PAGE,
        genre: genre !== 'All' ? genre : undefined,
      };
      const response = await fetch('https://graphql.anilist.co', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, variables }),
      });
      const { data } = await response.json();
      setAnimeList(data.Page.media);
      setTotalPages(data.Page.pageInfo.lastPage);
    };
    fetchAnime();
  }, [search, genre, page]);

  // Handle search submit
  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(location.search);
    if (search) params.set('search', search);
    else params.delete('search');
    params.set('page', 1);
    navigate({ pathname: '/', search: params.toString() });
  };

  // Handle genre change
  const handleGenreChange = (e) => {
    const params = new URLSearchParams(location.search);
    const value = e.target.value;
    if (value && value !== 'All') params.set('genre', value);
    else params.delete('genre');
    params.set('page', 1);
    navigate({ pathname: '/', search: params.toString() });
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(location.search);
    params.set('page', newPage);
    navigate({ pathname: '/', search: params.toString() });
  };

  // Pagination controls
  const renderPagination = () => {
    if (totalPages <= 1) return null;
    const pages = [];
    const maxPagesToShow = isMobile ? 3 : 5;
    let startPage = Math.max(1, page - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          className={`pagination-btn${i === page ? ' active' : ''}`}
          onClick={() => handlePageChange(i)}
          disabled={i === page}
        >
          {i}
        </button>
      );
    }
    return (
      <div className="pagination-container">
        <button
          className="pagination-btn"
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
        >
          Previous
        </button>
        {pages}
        <button
          className="pagination-btn"
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
    );
  };

  return (
    <div className="home-container">
      <form onSubmit={handleSearch} className="home-search-form">
        <input
          type="text"
          placeholder="Search anime..."
          value={search}
          onChange={e => {
            const params = new URLSearchParams(location.search);
            if (e.target.value) params.set('search', e.target.value);
            else params.delete('search');
            params.set('page', 1);
            navigate({ pathname: '/', search: params.toString() });
          }}
          className="home-search-input"
        />
        <div className="genre-select-wrapper">
          <select
            value={genre}
            onChange={handleGenreChange}
            className="home-genre-select"
          >
            {GENRES.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
          <span className="genre-select-arrow">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg>
          </span>
        </div>
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
      {renderPagination()}
    </div>
  );
};

export default Home;
