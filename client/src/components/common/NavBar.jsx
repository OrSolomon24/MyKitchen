import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Logo } from './Logo';
import { useAuth } from '../../context/AuthContext';

const navLinkClass = ({ isActive }) =>
  `relative py-1.5 font-medium transition-colors hover:text-ink ${
    isActive
      ? 'text-ink after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:rounded-full after:bg-accent'
      : 'text-text-muted'
  }`;

export const NavBar = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-bg/90 backdrop-blur-sm print:hidden">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between px-4 py-2.5 md:px-6">
        <Link to="/" aria-label="המטבח שלי — דף הבית" className="block">
          <Logo />
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          <NavLink to="/foodCategories" className={navLinkClass}>
            מתכונים
          </NavLink>
          <NavLink to="/addRecipe" className={navLinkClass}>
            הוספת מתכון
          </NavLink>
          {!isAuthenticated && (
            <NavLink
              to="/signin"
              className="rounded-full bg-primary px-5 py-2 font-medium text-text-on-dark transition-colors hover:bg-primary-dark"
            >
              התחברות
            </NavLink>
          )}
          {isAuthenticated && (
            <button
              type="button"
              className="font-medium text-text-muted transition-colors hover:text-danger"
              onClick={handleLogout}
            >
              התנתקות
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};
