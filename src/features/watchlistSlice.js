import { createSlice } from '@reduxjs/toolkit';

// Load watchlist from localStorage
const storedWatchlist = localStorage.getItem('animeWatchlist');
const initialState = {
  watchlist: storedWatchlist ? JSON.parse(storedWatchlist) : []
};

const watchlistSlice = createSlice({
  name: 'watchlist',
  initialState,
  reducers: {
    addToWatchlist: (state, action) => {
  const exists = state.watchlist.some(anime => anime.mal_id === action.payload.mal_id);
  if (!exists) {
    state.watchlist.push(action.payload);
    localStorage.setItem('animeWatchlist', JSON.stringify(state.watchlist));
  }
},
    removeFromWatchlist: (state, action) => {
      state.watchlist = state.watchlist.filter(
        (anime) => anime.mal_id !== action.payload
      );
      // Save updated list to localStorage
      localStorage.setItem('animeWatchlist', JSON.stringify(state.watchlist));
    }
  }
});

export const { addToWatchlist, removeFromWatchlist } = watchlistSlice.actions;
export default watchlistSlice.reducer;
