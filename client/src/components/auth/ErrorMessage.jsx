// components/auth/ErrorMessage.js
import React from 'react';

export const ErrorMessage = ({ errorMessage }) =>
  errorMessage && (
    <p className="mb-4 w-full rounded-sm bg-danger-tint p-3 text-center text-danger">
      {errorMessage}
    </p>
  );
