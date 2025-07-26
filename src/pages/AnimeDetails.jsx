import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './AnimeDetails.css';

const AnimeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [anime, setAnime] = useState(null);

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

  if (!anime) return <p>Loading...</p>;

  return (
    <div className="anime-details-container">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
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
