import React from 'react';

const SIZES = {
  sm: 'w-4 h-4 border-2',
  md: 'w-8 h-8 border-4',
  lg: 'w-12 h-12 border-4',
};

export const Spinner = ({ size = 'md', colorClassName = 'border-border border-t-accent', className = '' }) => (
  <div
    role="status"
    aria-label="טוען..."
    className={`inline-block rounded-full animate-spin ${SIZES[size]} ${colorClassName} ${className}`.trim()}
  />
);
