import React from 'react';

export const Input = ({ className = '', ...props }) => (
  <input
    className={`w-full rounded-sm border-[1.5px] border-border px-3 py-3 text-base text-text transition-colors duration-150 focus:outline-none focus:border-primary ${className}`.trim()}
    {...props}
  />
);
