import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaHome, FaUtensils, FaPlusCircle, FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const tabClass = ({ isActive }) =>
  `flex flex-1 flex-col items-center justify-center gap-1 py-2 text-xs font-medium transition-colors min-h-11 ${
    isActive ? 'text-primary' : 'text-text-muted'
  }`;

export const BottomTabBar = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav
      aria-label="ניווט ראשי"
      className="fixed inset-x-0 bottom-0 z-40 flex border-t border-border bg-surface shadow-lg md:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <NavLink to="/" end className={tabClass}>
        <FaHome className="text-lg" />
        בית
      </NavLink>
      <NavLink to="/foodCategories" className={tabClass}>
        <FaUtensils className="text-lg" />
        מתכונים
      </NavLink>
      <NavLink to="/addRecipe" className={tabClass}>
        <FaPlusCircle className="text-lg" />
        הוסף
      </NavLink>
      {isAuthenticated ? (
        <button
          type="button"
          onClick={handleLogout}
          className="flex min-h-11 flex-1 flex-col items-center justify-center gap-1 py-2 text-xs font-medium text-text-muted transition-colors hover:text-danger"
        >
          <FaSignOutAlt className="text-lg" />
          התנתק
        </button>
      ) : (
        <NavLink to="/signin" className={tabClass}>
          <FaSignInAlt className="text-lg" />
          התחבר
        </NavLink>
      )}
    </nav>
  );
};
