import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import logo from '../assets/logo_otaku-vault.png';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo-wrapper">
        <img src={logo} alt="OtakuVault Logo" className="navbar-logo-img" />
        <h1 className="navbar-logo">OtakuVault</h1>
      </div>
      <div className="navbar-links">
        <Link to="/?reset=true">Home</Link>
        <Link to="/watchlist">Watchlist</Link>
      </div>
    </nav>
  );
};

export default Navbar;
