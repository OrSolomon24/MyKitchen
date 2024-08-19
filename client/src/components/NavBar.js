// NavBar.js
import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import '../style/NavBar.css';

export const NavBar = () => {
  return (
    <div className="navbar">
      <Link to="/">
        <img src={logo} alt="Logo" />
      </Link>
      <nav>
        <Link to="/foodCategories">מתכונים</Link>
        <Link to="/addRecipe">הוסף מתכון</Link>
        <Link to="/signin">התחבר</Link>

      </nav>
    </div>
  );
}
