// src/pages/Home.jsx
import React, { useEffect, useState } from 'react';
import AnimeCard from '../components/AnimeCard';

const Home = () => {
  const [animeList, setAnimeList] = useState([]);

  useEffect(() => {
    const fetchAnime = async () => {
      const query = `
        query {
          Page(perPage: 10) {
            media(type: ANIME, sort: POPULARITY_DESC) {
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

      const response = await fetch("https://graphql.anilist.co", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      const { data } = await response.json();
      setAnimeList(data.Page.media);
    };

    fetchAnime();
  }, []);

  return (
    <div style={{ padding: '1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      {animeList.map(anime => (
        <AnimeCard key={anime.id} anime={anime} />
      ))}
    </div>
  );
};

export default Home;
