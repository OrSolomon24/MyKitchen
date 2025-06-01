// src/components/Loader.js
import React from 'react';
import '../style/Loader.css';
import loadGif from '../assets/load.gif';

const Loader = () => {
  return (
    <div className="loader-container">
      <img src={loadGif} alt="Loading..." className="loader-gif" />
    </div>
  );
};

export default Loader;
