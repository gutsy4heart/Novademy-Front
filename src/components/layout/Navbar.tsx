import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          novademy
        </Link>
        <div className="navbar-buttons">
          <Link to="/login" className="navbar-button login">Giriş</Link>
          <Link to="/register" className="navbar-button register">Qeydiyyat</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 