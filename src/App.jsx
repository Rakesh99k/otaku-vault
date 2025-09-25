import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Watchlist from './pages/Watchlist';
import AnimeDetails from './pages/AnimeDetails';
import Navbar from './components/Navbar'; // your navbar component
import Intro from './pages/Intro';
import './pages/Intro.css';

function Layout({ children }) {
  const location = useLocation();
  const hideNavbar = location.pathname === '/';
  return (
    <div style={{ backgroundColor: '#1c1c2b', minHeight: '100vh' }}>
      {!hideNavbar && <Navbar />}
      {children}
    </div>
  );
}

function App() {
  const introSeen = typeof window !== 'undefined' && sessionStorage.getItem('introSeen') === '1';
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={introSeen ? <Navigate to="/home" replace /> : <Intro />} />
          <Route path="/home" element={<Home />} />
          <Route path="/details/:id" element={<AnimeDetails />} />
          <Route path="/watchlist" element={<Watchlist />} />
          <Route path="*" element={<Navigate to={introSeen ? '/home' : '/'} replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
