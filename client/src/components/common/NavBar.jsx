import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';
import { useAuth } from '../../context/AuthContext';

export const NavBar = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between bg-surface px-4 py-3 shadow-sm md:px-6">
      <Link to="/" className="block">
        <img src={logo} alt="My Kitchen" className="h-9 md:h-11" />
      </Link>
      <nav className="hidden items-center gap-5 md:flex">
        <Link to="/foodCategories" className="font-semibold text-primary transition-colors hover:text-accent">
          מתכונים
        </Link>
        <Link to="/addRecipe" className="font-semibold text-primary transition-colors hover:text-accent">
          הוסף מתכון
        </Link>
        {!isAuthenticated && (
          <Link to="/signin" className="font-semibold text-primary transition-colors hover:text-accent">
            התחבר
          </Link>
        )}
        {isAuthenticated && (
          <button
            type="button"
            className="font-semibold text-text-muted transition-colors hover:text-danger"
            onClick={handleLogout}
          >
            התנתק
          </button>
        )}
      </nav>
    </header>
  );
};
