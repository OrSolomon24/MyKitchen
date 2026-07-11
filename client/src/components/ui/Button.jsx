import React from 'react';
import './Button.css';

export const Button = ({ variant = 'primary', className = '', children, ...props }) => (
  <button className={`btn btn-${variant} ${className}`.trim()} {...props}>
    {children}
  </button>
);
