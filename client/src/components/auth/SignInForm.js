// components/auth/SignInForm.js
import React from 'react';

export const SignInForm = ({ username, password, setUsername, setPassword, handleSubmit }) => (
  <form onSubmit={handleSubmit} className="signin-form">
    <div className="form-group">
      <label htmlFor="username">שם משתמש:</label>
      <input
        type="text"
        id="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
    </div>
    <div className="form-group">
      <label htmlFor="password">סיסמה:</label>
      <input
        type="password"
        id="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
    </div>
    <button type="submit">התחבר</button>
  </form>
);
