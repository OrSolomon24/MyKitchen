import React, { useEffect, useRef } from 'react';

export const Textarea = ({ className = '', value, ...props }) => {
  const textareaRef = useRef(null);

  // Auto-grow to fit content so every row stays reachable -- a fixed-height
  // box forces users to scroll inside a small nested box on top of the
  // page scroll, which mobile browsers handle poorly (taps/swipes get
  // eaten by the outer page instead of moving the caret down a row).
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, [value]);

  return (
    <textarea
      ref={textareaRef}
      value={value}
      className={`min-h-[100px] w-full resize-none overflow-hidden rounded-sm border-[1.5px] border-border px-3 py-3 text-base text-text transition-colors duration-150 focus:outline-none focus:border-primary ${className}`.trim()}
      {...props}
    />
  );
};
