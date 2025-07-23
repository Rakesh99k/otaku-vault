import React from 'react';
import { useSelector } from 'react-redux';
import AnimeCard from '../components/AnimeCard';
import './Watchlist.css';

const Watchlist = () => {
  const watchlist = useSelector((state) => state.watchlist.list);

  return (
    <div className="watchlist-container" style={{minHeight: 'calc(100vh - 60px)'}}>
      <h2 className="watchlist-title">My Watchlist</h2>
      <div className="watchlist-content" style={{flex: '1'}}>
        {watchlist.length > 0 ? (
          <div className="watchlist-cards">
            {watchlist.map((anime) => (
              <AnimeCard key={anime.id} anime={anime} />
            ))}
          </div>
        ) : (
          <div className="watchlist-empty">
            <p className="watchlist-empty-text">
              Your watchlist is empty !!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Watchlist;