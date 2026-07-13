import React from 'react';

/*
 * Brand mark — a steaming pot in a round "rubber stamp" badge.
 * Single SVG source of truth; public/favicon.svg mirrors this drawing.
 */
export const LogoMark = ({ className = '', onDark = false }) => {
  const ink = onDark ? '#fbf7ed' : '#2a3220';
  const honey = onDark ? '#d9a94f' : '#a66f1f';
  const paper = onDark ? 'transparent' : '#faf5eb';

  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true" focusable="false">
      <circle cx="32" cy="32" r="30.5" fill={paper} />
      <circle cx="32" cy="32" r="29.25" fill="none" stroke={ink} strokeWidth="2.5" />
      <g stroke={honey} strokeWidth="2.6" strokeLinecap="round" fill="none">
        <path d="M23.5 13.5c-1.8 2.4 1.8 3.6 0 6" />
        <path d="M32 11c-1.8 2.4 1.8 3.6 0 6" />
        <path d="M40.5 13.5c-1.8 2.4 1.8 3.6 0 6" />
      </g>
      <rect x="29.2" y="25.6" width="5.6" height="3.6" rx="1.8" fill={ink} />
      <path d="M17.5 30.8h29" stroke={ink} strokeWidth="3" strokeLinecap="round" />
      <path d="M20 33.6h24v6.9a9.5 9.5 0 0 1-9.5 9.5h-5a9.5 9.5 0 0 1-9.5-9.5z" fill={ink} />
      <path d="M12.5 35.8h5M46.5 35.8h5" stroke={ink} strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
};

export const Logo = ({ onDark = false, markClassName = 'h-10 w-10' }) => (
  <span className="flex items-center gap-2.5">
    <LogoMark className={markClassName} onDark={onDark} />
    <span className="flex flex-col leading-none">
      <span
        className={`font-display text-lg font-black leading-none ${
          onDark ? 'text-text-on-dark' : 'text-ink'
        }`}
      >
        המטבח שלי
      </span>
      <span
        className={`mt-1 text-[0.6rem] font-semibold uppercase leading-none tracking-[0.3em] ${
          onDark ? 'text-accent-tint/80' : 'text-accent'
        }`}
      >
        My Kitchen
      </span>
    </span>
  </span>
);
