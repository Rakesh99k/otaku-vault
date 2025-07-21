import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const AnimeDetail = () => {
  const { id } = useParams();
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
    <div style={{ padding: '2rem' }}>
      <h2>{anime.title.romaji || anime.title.english}</h2>
      <img src={anime.coverImage.large} alt={anime.title.romaji} style={{ width: '200px' }} />
      <p dangerouslySetInnerHTML={{ __html: anime.description }}></p>
      <p><strong>Genres:</strong> {anime.genres.join(', ')}</p>
      <p><strong>Episodes:</strong> {anime.episodes}</p>
      <p><strong>Average Score:</strong> {anime.averageScore}</p>
    </div>
  );
};

export default AnimeDetail;
