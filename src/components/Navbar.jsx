import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav style={styles.nav}>
      <h1 style={styles.logo}>OtakuVault</h1>
      <div>
        <Link to="/" style={styles.link}>Home</Link>
        <Link to="/watchlist" style={styles.link}>Watchlist</Link>
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    backgroundColor: '#1e1e2f',
    padding: '1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: '#fff'
  },
  logo: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    margin: 0
  },
  link: {
    color: '#fff',
    marginLeft: '1rem',
    textDecoration: 'none',
    fontSize: '1rem'
  }
};

export default Navbar;
