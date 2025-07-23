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
  const [animeList, setAnimeList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [queryTerm, setQueryTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch anime from AniList API with pagination and genre filter
  const fetchAnime = async (search = '', page = 1, genre = 'All') => {
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
    setCurrentPage(data.Page.pageInfo.currentPage);
    setTotalPages(data.Page.pageInfo.lastPage);
  };

  // Handle search submit
  const handleSearch = (e) => {
    e.preventDefault();
    setQueryTerm(searchTerm.trim());
    setCurrentPage(1); // Reset to first page on new search
    if (location.pathname !== '/') {
      navigate('/');
    }
  };

  // Handle genre change
  const handleGenreChange = (e) => {
    setSelectedGenre(e.target.value);
    setCurrentPage(1); // Reset to first page on genre change
  };

  // Fetch anime when queryTerm, currentPage, or selectedGenre changes
  useEffect(() => {
    fetchAnime(queryTerm, currentPage, selectedGenre);
  }, [queryTerm, currentPage, selectedGenre]);

  // Reset logic for Home navigation
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const shouldReset = params.get('reset') === 'true';

    if (shouldReset) {
      setSearchTerm('');
      setQueryTerm('');
      setSelectedGenre('All');
      setCurrentPage(1);
      fetchAnime('', 1, 'All');
      navigate('/', { replace: true }); // Remove ?reset=true from URL
    }
  }, [location.search, navigate]);

  // Pagination controls (unchanged)
  const renderPagination = () => {
    if (totalPages <= 1) return null;
    const pages = [];
    const maxPagesToShow = isMobile ? 3 : 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          className={`pagination-btn${i === currentPage ? ' active' : ''}`}
          onClick={() => setCurrentPage(i)}
          disabled={i === currentPage}
        >
          {i}
        </button>
      );
    }
    return (
      <div className="pagination-container">
        <button
          className="pagination-btn"
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        {pages}
        <button
          className="pagination-btn"
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
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
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="home-search-input"
        />
        <div className="genre-select-wrapper">
          <select
            value={selectedGenre}
            onChange={handleGenreChange}
            className="home-genre-select"
          >
            {GENRES.map((genre) => (
              <option key={genre} value={genre}>{genre}</option>
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
