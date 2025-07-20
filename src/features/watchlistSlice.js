import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  animeList: [],
};

export const watchlistSlice = createSlice({
  name: 'watchlist',
  initialState,
  reducers: {
    addToWatchlist: (state, action) => {
      const anime = action.payload;
      const exists = state.animeList.find(item => item.id === anime.id);
      if (!exists) {
        state.animeList.push(anime);
      }
    },
    removeFromWatchlist: (state, action) => {
      const idToRemove = action.payload;
      state.animeList = state.animeList.filter(item => item.id !== idToRemove);
    },
  },
});

export const { addToWatchlist, removeFromWatchlist } = watchlistSlice.actions;
export default watchlistSlice.reducer;
