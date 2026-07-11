import React from 'react';

export const Textarea = ({ className = '', ...props }) => (
  <textarea
    className={`min-h-[100px] w-full resize-y rounded-sm border-[1.5px] border-border px-3 py-3 text-base text-text transition-colors duration-150 focus:outline-none focus:border-primary ${className}`.trim()}
    {...props}
  />
);
