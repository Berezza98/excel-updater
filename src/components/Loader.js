import React from 'react';
import { ProgressCircle } from 'react-desktop/macOs';
import '../styles/Loader.css';

const Loader = () => (
  <div className="loader">
    <ProgressCircle size={40} />
  </div>
);

export default Loader;