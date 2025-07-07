import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Watchlist from './pages/Watchlist';        // ✅ already existing
import AnimeDetails from './pages/AnimeDetails';  // ✅ new details page

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/watchlist" element={<Watchlist />} />    
        <Route path="/anime/:id" element={<AnimeDetails />} />
      </Routes>
    </Router>
  );
};

export default App;
