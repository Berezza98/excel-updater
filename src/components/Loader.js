import React from 'react';
import { ProgressCircle } from 'react-desktop/macOs';
import '../styles/Loader.css';
import { string } from 'prop-types';

const Loader = ({ loadingPersentage }) => (
  <div className="loader">
    <ProgressCircle size={40} />
    { loadingPersentage }
  </div>
);

Loader.propTypes = {
  loadingPersentage: string,
};

export default Loader;