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

  const isInWatchlist = watchlist.some((item) => item.id === Number(id));

  useEffect(() => {
    const fetchAnimeDetails = async () => {
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
          }
        }
      `;

      const variables = { id: parseInt(id) };

      const response = await fetch('https://graphql.anilist.co', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, variables }),
      });

      const { data } = await response.json();
      setAnime(data.Media);
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

  if (!anime) return <p>Loading...</p>;

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
        {anime.title.romaji || anime.title.english}
      </h2>
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
    </div>
  );
};

export default AnimeDetails;
