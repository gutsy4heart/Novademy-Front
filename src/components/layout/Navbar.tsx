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
          <button className="navbar-button login">Giriş</button>
          <button className="navbar-button register">Qeydiyyat</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 