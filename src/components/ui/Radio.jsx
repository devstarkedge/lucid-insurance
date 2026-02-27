import React from 'react';
import './Radio.css';

const Radio = ({ label, name, options, value, onChange, error, variant = 'horizontal' }) => {
  return (
    <div className={`radio-group ${variant}`}>
      {label && <span className="radio-group-label">{label}</span>}
      <div className="radio-options">
        {options.map((opt) => (
          <label key={opt.value} className={`radio-label ${value === opt.value ? 'selected' : ''} ${opt.description ? 'has-description' : ''}`}>
            <input 
              type="radio" 
              name={name} 
              value={opt.value} 
              checked={value === opt.value}
              onChange={() => onChange(opt.value)}
              className="radio-input"
            />
            <span className="radio-custom" />
            <div className="radio-content">
              <span className="radio-text">{opt.label}</span>
              {opt.description && <span className="radio-description">{opt.description}</span>}
            </div>
          </label>
        ))}
      </div>
      {error && <span className="error-message">{error}</span>}
    </div>
  );
};

export default Radio;
