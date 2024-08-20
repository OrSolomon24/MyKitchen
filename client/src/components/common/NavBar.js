import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png';
import { useAuth } from '../../context/AuthContext'; // Import useAuth hook
import '../../style/NavBar.css';

export const NavBar = () => {
  const { isAuthenticated } = useAuth(); // Get authentication status

  return (
    <div className="navbar">
      <Link to="/">
        <img src={logo} alt="Logo" />
      </Link>
      <nav>
        <Link to="/foodCategories">מתכונים</Link>
        <Link to="/addRecipe">הוסף מתכון</Link>
        {!isAuthenticated && <Link to="/signin">התחבר</Link>} {/* Conditionally render the sign-in link */}
      </nav>
    </div>
  );
};
