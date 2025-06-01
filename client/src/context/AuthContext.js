import React, { createContext, useContext, useEffect, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('auth') === 'true';
  });

  useEffect(() => {
    // Optional: auto-expiry logic (in case you want to enforce 2 weeks TTL manually)
    const expiry = localStorage.getItem('auth_expiry');
    if (expiry && Date.now() > Number(expiry)) {
      localStorage.removeItem('auth');
      localStorage.removeItem('auth_expiry');
      setIsAuthenticated(false);
    }
  }, []);

  const login = () => {
    setIsAuthenticated(true);
    localStorage.setItem('auth', 'true');
    localStorage.setItem('auth_expiry', Date.now() + 1000 * 60 * 60 * 24 * 14); // 2 weeks
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('auth');
    localStorage.removeItem('auth_expiry');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
