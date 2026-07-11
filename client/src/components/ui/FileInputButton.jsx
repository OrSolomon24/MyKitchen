import React, { useId } from 'react';

export const FileInputButton = ({ children, className = '', onChange, id, ...inputProps }) => {
  const generatedId = useId();
  const inputId = id || generatedId;

  return (
    <div className="inline-block">
      <label
        htmlFor={inputId}
        className={`inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-full border-[1.5px] border-border bg-surface px-5 py-3 font-semibold text-primary transition-colors duration-150 hover:border-primary hover:bg-primary-tint focus-within:outline-none focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 ${className}`.trim()}
      >
        {children}
      </label>
      <input id={inputId} type="file" className="sr-only" onChange={onChange} {...inputProps} />
    </div>
  );
};
