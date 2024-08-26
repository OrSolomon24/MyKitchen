// components/auth/ErrorMessage.js
import React from 'react';

export const ErrorMessage = ({ errorMessage }) => (
  errorMessage && <p className="error-message">{errorMessage}</p>
);
