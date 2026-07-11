import React, { useEffect, useRef } from 'react';

export const Modal = ({ children, onClose }) => {
  const cardRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    cardRef.current?.focus();
  }, []);

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/45 p-4 backdrop-blur-[2px] animate-[modal-fade-in_0.25s_ease]"
      onClick={onClose}
    >
      <div
        ref={cardRef}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        className="w-full max-w-[420px] rounded-lg bg-surface p-6 shadow-lg outline-none animate-[modal-pop-in_0.25s_ease]"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};
