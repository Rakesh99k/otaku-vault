import { createSlice } from '@reduxjs/toolkit';

// Initial state for the watchlist
const initialState = {
  watchlist: [],
};

export const watchlistSlice = createSlice({
  name: 'watchlist',
  initialState,
  reducers: {
    addToWatchlist: (state, action) => {
      state.watchlist.push(action.payload);
    },
    removeFromWatchlist: (state, action) => {
      state.watchlist = state.watchlist.filter(
        (anime) => anime.mal_id !== action.payload
      );
    },
  },
});

// Export actions
export const { addToWatchlist, removeFromWatchlist } = watchlistSlice.actions;

// Export reducer
export default watchlistSlice.reducer;
