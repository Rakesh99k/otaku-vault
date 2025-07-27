import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToWatchlist, removeFromWatchlist } from '../features/watchlistSlice';
import './AnimeDetails.css';

const AnimeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const watchlist = useSelector((state) => state.watchlist.list);
  const [anime, setAnime] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const isInWatchlist = watchlist.some((item) => item.id === Number(id));

  useEffect(() => {
    const fetchAnimeDetails = async () => {
      setIsLoading(true);
      const query = `
        query ($id: Int) {
          Media(id: $id, type: ANIME) {
            id
            title {
              romaji
              english
            }
            description
            coverImage {
              large
            }
            genres
            averageScore
            episodes
            format
            status
            startDate { year month day }
            endDate { year month day }
            season
            seasonYear
            characters(sort: ROLE, perPage: 10) {
              edges {
                role
                node {
                  id
                  name {
                    full
                    native
                  }
                  image {
                    large
                  }
                  description
                }
              }
            }
          }
        }
      `;

      const variables = { id: parseInt(id) };

      try {
        const response = await fetch('https://graphql.anilist.co', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query, variables }),
        });

        const { data } = await response.json();
        setAnime(data.Media);
      } catch (error) {
        console.error('Error fetching anime details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnimeDetails();
  }, [id]);

  const handleWatchlistToggle = () => {
    if (!anime) return;
    if (isInWatchlist) {
      dispatch(removeFromWatchlist(anime.id));
    } else {
      dispatch(addToWatchlist(anime));
    }
  };

  if (isLoading) {
    return (
      <div className="anime-details-container">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <div className="details-skeleton details-skeleton-title"></div>
        <div className="details-skeleton details-skeleton-img"></div>
        <div className="details-skeleton details-skeleton-text medium"></div>
        <div className="details-skeleton details-skeleton-text short"></div>
        <div className="details-skeleton details-skeleton-text short"></div>
        <div className="details-skeleton details-skeleton-text short"></div>
      </div>
    );
  }

  if (!anime) return <p>Anime not found.</p>;

  return (
    <div className="anime-details-container">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>
      <button
        className={`details-watchlist-btn${isInWatchlist ? ' in-watchlist' : ''}`}
        onClick={handleWatchlistToggle}
      >
        {isInWatchlist ? 'Remove' : <><span role="img" aria-label="heart">❤️</span> Watchlist</>}
      </button>
      <h2 className="anime-details-title">
        {anime.title.english || anime.title.romaji}
      </h2>
      {anime.title.english && anime.title.romaji && anime.title.english !== anime.title.romaji && (
        <h3 className="anime-details-romaji">{anime.title.romaji}</h3>
      )}
      <img
        src={anime.coverImage.large}
        alt={anime.title.romaji}
        className="anime-details-img"
      />
      <p
        className="anime-details-description"
        dangerouslySetInnerHTML={{ __html: anime.description }}
      ></p>
      <p className="anime-details-meta">
        <strong>Genres:</strong> {anime.genres.join(', ')}
      </p>
      <p className="anime-details-meta">
        <strong>Episodes:</strong> {anime.episodes}
      </p>
      <p className="anime-details-meta">
        <strong>Average Score:</strong> {anime.averageScore}
      </p>
      <p className="anime-details-meta">
        <strong>Format:</strong> {anime.format}
      </p>
      <p className="anime-details-meta">
        <strong>Status:</strong> {anime.status}
      </p>
      <p className="anime-details-meta">
        <strong>Start Date:</strong> {anime.startDate?.year || ''}{anime.startDate?.month ? `-${anime.startDate.month}` : ''}{anime.startDate?.day ? `-${anime.startDate.day}` : ''}
      </p>
      <p className="anime-details-meta">
        <strong>End Date:</strong> {anime.endDate?.year || ''}{anime.endDate?.month ? `-${anime.endDate.month}` : ''}{anime.endDate?.day ? `-${anime.endDate.day}` : ''}
      </p>
      <p className="anime-details-meta">
        <strong>Season:</strong> {anime.season} {anime.seasonYear}
      </p>
      
      {/* Characters Section */}
      {anime.characters?.edges && anime.characters.edges.length > 0 && (
        <div className="characters-section">
          <h3 className="characters-title">Characters</h3>
          <div className="characters-grid">
            {anime.characters.edges.map(({ role, node: character }) => (
              <div key={character.id} className="character-card">
                <img
                  src={character.image?.large}
                  alt={character.name?.full}
                  className="character-image"
                />
                <div className="character-info">
                  <h4 className="character-name">{character.name?.full}</h4>
                  <p className="character-role">{role}</p>
                  {character.name?.native && (
                    <p className="character-native">{character.name.native}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnimeDetails;
