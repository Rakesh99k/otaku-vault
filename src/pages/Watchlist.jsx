// src/pages/Watchlist.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import AnimeCard from '../components/AnimeCard';

const Watchlist = () => {
  const watchlist = useSelector((state) => state.watchlist.list);

  return (
    <div className="watchlist-page">
      <h2>My Watchlist</h2>
      {watchlist.length === 0 ? (
        <p>Your watchlist is empty 😢</p>
      ) : (
        <div className="anime-list">
          {watchlist.map((anime) => (
            <AnimeCard key={anime.id} anime={anime} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Watchlist;
