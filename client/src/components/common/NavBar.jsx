import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';
import { useAuth } from '../../context/AuthContext';
import '../../style/NavBar.css';

export const NavBar = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="navbar">
      <Link to="/" className="navbar-brand">
        <img src={logo} alt="My Kitchen" />
      </Link>
      <nav>
        <Link to="/foodCategories">מתכונים</Link>
        <Link to="/addRecipe">הוסף מתכון</Link>
        {!isAuthenticated && <Link to="/signin">התחבר</Link>}
        {isAuthenticated && (
          <button type="button" className="navbar-logout" onClick={handleLogout}>
            התנתק
          </button>
        )}
      </nav>
    </header>
  );
};
