import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Watchlist from './pages/Watchlist';
import AnimeDetails from './pages/AnimeDetails';
import Navbar from './components/Navbar'; // your navbar component

function App() {
  return (
    <Router>
      <div style={{ backgroundColor: '#1c1c2b', minHeight: '100vh' }}>
        <Navbar /> {/* Always visible */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/details/:id" element={<AnimeDetails />} />
          <Route path="/watchlist" element={<Watchlist />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
