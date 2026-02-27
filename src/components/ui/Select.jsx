import React from 'react';
import './Select.css';

const Select = ({ label, id, options, error, ...props }) => {
  return (
    <div className="select-group">
      {label && <label htmlFor={id} className="select-label">{label}</label>}
      <div className="select-wrapper">
        <select id={id} className={`select-field ${error ? 'select-error' : ''}`} {...props}>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      {error && <span className="error-message">{error}</span>}
    </div>
  );
};

export default Select;
