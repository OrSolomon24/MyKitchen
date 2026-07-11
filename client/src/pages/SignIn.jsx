// pages/SignIn.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, usernameToEmail } from '../api/supabaseClient';
import { SignInForm } from '../components/auth/SignInForm';
import { ErrorMessage } from '../components/auth/ErrorMessage';

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
    <div className="mx-auto my-8 flex max-w-[440px] flex-col items-center rounded-lg bg-surface p-6 shadow-md md:my-16 md:p-12">
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
