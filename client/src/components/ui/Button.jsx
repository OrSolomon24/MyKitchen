import React from 'react';

const BASE =
  'inline-flex items-center justify-center gap-2 rounded-full font-semibold ' +
  'transition-colors transition-transform duration-150 active:translate-y-px ' +
  'disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0 ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ' +
  'min-h-11';

const VARIANTS = {
  primary: 'bg-primary text-text-on-dark shadow-sm px-5 py-3 hover:not-disabled:bg-primary-dark hover:not-disabled:shadow-md',
  secondary:
    'bg-surface text-primary border-[1.5px] border-border px-5 py-3 hover:not-disabled:border-primary hover:not-disabled:bg-primary-tint',
  danger: 'bg-danger text-text-on-dark px-5 py-3 hover:not-disabled:bg-danger-dark',
  ghost: 'bg-transparent text-text-muted px-4 py-3 hover:not-disabled:text-text hover:not-disabled:bg-surface-muted',
};

export const Button = ({ variant = 'primary', className = '', children, ...props }) => (
  <button className={`${BASE} ${VARIANTS[variant]} ${className}`.trim()} {...props}>
    {children}
  </button>
);
