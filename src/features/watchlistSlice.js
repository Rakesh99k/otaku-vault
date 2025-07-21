import { createSlice } from '@reduxjs/toolkit';

// Load watchlist safely from localStorage
let savedWatchlist = [];
try {
  const stored = localStorage.getItem('watchlist');
  savedWatchlist = stored ? JSON.parse(stored) : [];
} catch (error) {
  console.error("Error parsing watchlist from localStorage:", error);
  savedWatchlist = [];
}

const watchlistSlice = createSlice({
  name: 'watchlist',
  initialState: {
    list: savedWatchlist,
  },
  reducers: {
    addToWatchlist: (state, action) => {
      const anime = action.payload;
      const alreadyExists = state.list.some(item => item.id === anime.id);

      if (!alreadyExists && anime.id) {
        state.list.push(anime);
        localStorage.setItem('watchlist', JSON.stringify(state.list));
      }
    },
    removeFromWatchlist: (state, action) => {
      state.list = state.list.filter(item => item.id !== action.payload);
      localStorage.setItem('watchlist', JSON.stringify(state.list));
    },
  },
});

export const { addToWatchlist, removeFromWatchlist } = watchlistSlice.actions;
export default watchlistSlice.reducer;
