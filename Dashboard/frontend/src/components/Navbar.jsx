import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.scss';

const Navbar = () => {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">Emotion Tracker</Link>
      </div>
      <div className="navbar-menu">
        <Link to="/" className="navbar-item">Home</Link>
        {isLoggedIn && (
          <Link to="/sessions" className="navbar-item">Sessions</Link>
        )}
        {isLoggedIn ? (
          <button onClick={handleLogout} className="navbar-item logout-button">
            Logout
          </button>
        ) : (
          <Link to="/login" className="navbar-item">Login</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 