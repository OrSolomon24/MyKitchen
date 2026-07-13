import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from './Logo';

export const Footer = () => (
  <footer className="hidden print:hidden md:block">
    {/* Scalloped trim hanging over the page background, like a fabric edge */}
    <div className="divider-scallop divider-scallop--ink rotate-180" />
    <div className="bg-ink text-text-on-dark">
      <div className="mx-auto grid max-w-[1200px] gap-8 px-6 py-10 md:grid-cols-3">
        <div>
          <Link to="/" aria-label="המטבח שלי — דף הבית" className="inline-block">
            <Logo onDark />
          </Link>
          <p className="mt-3 max-w-[36ch] text-sm leading-relaxed text-text-on-dark/70">
            יומן מתכונים ביתי — נכתב, נטעם ונשמר באהבה.
          </p>
        </div>
        <nav className="flex flex-col gap-2 text-sm" aria-label="ניווט תחתון">
          <span className="mb-1 font-display text-md font-bold">ניווט</span>
          <Link to="/" className="text-text-on-dark/70 transition-colors hover:text-text-on-dark">
            בית
          </Link>
          <Link
            to="/foodCategories"
            className="text-text-on-dark/70 transition-colors hover:text-text-on-dark"
          >
            כל המתכונים
          </Link>
          <Link
            to="/addRecipe"
            className="text-text-on-dark/70 transition-colors hover:text-text-on-dark"
          >
            הוספת מתכון
          </Link>
        </nav>
        <div className="flex flex-col gap-2 text-sm md:items-end">
          <span className="font-display text-md font-bold">מהמטבח שלנו לשלכם</span>
          <p className="m-0 text-text-on-dark/70">בתיאבון!</p>
        </div>
      </div>
      <div className="border-t border-text-on-dark/10 py-4 text-center text-xs text-text-on-dark/50">
        © {new Date().getFullYear()} Or Solomon · My Kitchen
      </div>
    </div>
  </footer>
);
