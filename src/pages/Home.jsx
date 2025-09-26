import React, { useEffect, useState, useCallback, useRef } from 'react';
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
  const [isLoading, setIsLoading] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const searchTimeoutRef = useRef(null);

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

  // Initialize search input from URL
  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  // Debounced search function
  const debouncedSearch = useCallback((value) => {
    console.log('Debounced search called with:', value);
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
      searchTimeoutRef.current = setTimeout(() => {
        console.log('Executing search for:', value);
        const params = new URLSearchParams(location.search);
        if (value) params.set('search', value);
        else params.delete('search');
        params.set('page', 1);
        navigate({ pathname: '/home', search: params.toString() });
      }, 500);
  }, [location.search, navigate]);

  // Fetch anime when params change
  useEffect(() => {
    const fetchAnime = async () => {
      console.log('Fetching anime with params:', { search, genre, page });
      setIsLoading(true);
      const query = `
        query ($search: String, $page: Int, $perPage: Int, $genre: [String]) {
          Page(page: $page, perPage: $perPage) {
            pageInfo {
              total
              currentPage
              lastPage
              hasNextPage
            }
            media(
              search: $search
              genre_in: $genre
              type: ANIME
              sort: POPULARITY_DESC
            ) {
              id
              title {
                romaji
                english
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
        genre: genre !== 'All' ? [genre] : undefined, // <-- FIX: array for genre_in
      };

      try {
        const response = await fetch('https://graphql.anilist.co', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query, variables }),
        });
        const { data } = await response.json();
        setAnimeList(data.Page.media);
        setTotalPages(data.Page.pageInfo.lastPage);
      } catch (error) {
        console.error('Error fetching anime:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAnime();
  }, [search, genre, page]);

  // Handle search submit
  const handleSearch = (e) => {
    e.preventDefault();
    // Clear any pending debounced search
    const params = new URLSearchParams(location.search);
    if (searchInput) params.set('search', searchInput);
    else params.delete('search');
    params.set('page', 1);
    navigate({ pathname: '/home', search: params.toString() });
  };

  // Handle genre change
  const handleGenreChange = (e) => {
    const params = new URLSearchParams(location.search);
    const value = e.target.value;
    if (value && value !== 'All') params.set('genre', value);
    else params.delete('genre');
    params.set('page', 1);
    navigate({ pathname: '/home', search: params.toString() });
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(location.search);
    params.set('page', newPage);
    navigate({ pathname: '/home', search: params.toString() });
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

  // Render skeleton cards while loading
  const renderSkeletonCards = () => {
    return Array.from({ length: PER_PAGE }, (_, index) => (
      <AnimeCard key={`skeleton-${index}`} loading={true} />
    ));
  };

  return (
    <div className="home-container">
      <form onSubmit={handleSearch} className="home-search-form">
        <div className={`search-progress${isLoading ? ' loading' : ''}`}></div>
        <input
          type="text"
          placeholder="Search anime..."
          value={searchInput}
          onChange={e => {
            const value = e.target.value;
            setSearchInput(value);
            debouncedSearch(value);
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
        {isLoading ? (
          renderSkeletonCards()
        ) : animeList.length > 0 ? (
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
