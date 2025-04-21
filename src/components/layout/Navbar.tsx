import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Navbar.css';

const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated, getFullName } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = () => {
    logout();
    // Обновление страницы произойдет автоматически в методе logout
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          novademy
        </Link>

        <div className="navbar-buttons">
          {isAuthenticated && user ? (
            <div className="profile-dropdown">
              <button className="profile-button" onClick={toggleDropdown}>
                {user ? getFullName(user) : 'İstifadəçi'}
                <span className="dropdown-arrow">▼</span>
              </button>
              {dropdownOpen && (
                <div className="dropdown-menu">
                  <Link to="/profile" className="dropdown-item">
                    Profil
                  </Link>
                  <button onClick={handleLogout} className="dropdown-item">
                    Çıxış
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="navbar-button login">Giriş</Link>
              <Link to="/register" className="navbar-button register">Qeydiyyat</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 