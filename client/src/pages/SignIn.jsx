// pages/SignIn.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, usernameToEmail } from '../api/supabaseClient';
import { SignInForm } from '../components/auth/SignInForm';
import { ErrorMessage } from '../components/auth/ErrorMessage';
import '../style/SignIn.css';

export const SignIn = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // State for error message
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(''); // Clear any previous error message

    const { error } = await supabase.auth.signInWithPassword({
      email: usernameToEmail(username),
      password,
    });
    if (error) {
      setErrorMessage('שם משתמש או סיסמה שגויים.');
      return;
    }

    navigate('/'); // Redirect to the home page
  };

  return (
    <div className="signin-container">
      <ErrorMessage errorMessage={errorMessage} /> {/* Display error message */}
      <SignInForm
        username={username}
        password={password}
        setUsername={setUsername}
        setPassword={setPassword}
        handleSubmit={handleSubmit}
      />
    </div>
  );
};
