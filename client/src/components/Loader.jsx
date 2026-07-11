// src/components/Loader.js
import React from 'react';
import { Spinner } from './ui/Spinner';

const Loader = () => {
  return (
    <div className="fixed inset-0 z-50 flex h-screen w-full items-center justify-center bg-bg">
      <Spinner size="lg" />
    </div>
  );
};

export default Loader;
