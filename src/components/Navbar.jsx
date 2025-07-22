import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <h1 className="navbar-logo">OtakuVault</h1>
      <div className="navbar-links">
        <Link to="/?reset=true">Home</Link>
        <Link to="/watchlist">Watchlist</Link>
      </div>
    </nav>
  );
};

export default Navbar;
