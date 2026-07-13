import React from 'react';

export const Input = ({ className = '', ...props }) => (
  <input
    className={`w-full rounded-sm border-[1.5px] border-border bg-surface px-3 py-3 text-base text-text transition-colors duration-150 placeholder:text-text-muted/70 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 ${className}`.trim()}
    {...props}
  />
);
