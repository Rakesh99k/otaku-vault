import { configureStore } from '@reduxjs/toolkit';
import watchlistReducer from '../features/watchlistSlice';

export const store = configureStore({
  reducer: {
    watchlist: watchlistReducer,
  },
});
