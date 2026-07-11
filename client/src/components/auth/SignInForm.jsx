// components/auth/SignInForm.js
import React from 'react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

export const SignInForm = ({ username, password, setUsername, setPassword, handleSubmit }) => (
  <form onSubmit={handleSubmit} className="flex w-full flex-col">
    <div className="mb-5">
      <label htmlFor="username" className="mb-2 block font-semibold text-text">
        שם משתמש:
      </label>
      <Input
        type="text"
        id="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
    </div>
    <div className="mb-5">
      <label htmlFor="password" className="mb-2 block font-semibold text-text">
        סיסמה:
      </label>
      <Input
        type="password"
        id="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
    </div>
    <Button type="submit" variant="primary" className="mt-2 w-full">
      התחבר
    </Button>
  </form>
);
