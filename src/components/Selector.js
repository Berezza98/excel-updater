import React from 'react';
import { string, func, array } from 'prop-types';
import '../styles/Selector.css';

const Selector = ({ value, onChange, options, title }) => {
  return (
    <div className="selector">
      <span>{title}</span>
      <select value={value} onChange={onChange}>
        {
          options.map((el, index) => (
            <option key={index} value={el}>{el}</option>
          ))
        }
      </select>
    </div>
  );
};

Selector.propTypes = {
  value: string,
  onChange: func,
  options: array,
  title: string,
};

Selector.defaultProps = {
  value: '',
  onChange: () => {},
  options: [],
  title: ''
};

export default Selector;