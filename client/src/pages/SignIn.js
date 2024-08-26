// pages/SignIn.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { signInUser } from '../utils/authUtils';
import { SignInForm } from '../components/auth/SignInForm';
import { ErrorMessage } from '../components/auth/ErrorMessage';
import '../style/SignIn.css';

export const SignIn = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // State for error message
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(''); // Clear any previous error message

    try {
      await signInUser(username, password);
      login(); // Set authentication status
      navigate('/'); // Redirect to the home page
    } catch (error) {
      setErrorMessage(error.message); // Display error message
    }
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
