import React from 'react';
import './Checkbox.css';

const Checkbox = ({ label, subtitle, options, selectedValues = [], onChange, error, columns = 1 }) => {
  const handleToggle = (optionValue) => {
    let newValues;
    if (optionValue === 'none') {
      newValues = ['none'];
    } else {
      newValues = selectedValues.filter(v => v !== 'none');
      if (newValues.includes(optionValue)) {
        newValues = newValues.filter(v => v !== optionValue);
      } else {
        newValues = [...newValues, optionValue];
      }
    }
    onChange(newValues);
  };

  return (
    <div className="checkbox-group">
      <div className="checkbox-header">
        {label && <span className="checkbox-group-label">{label}</span>}
        {subtitle && <span className="checkbox-subtitle">{subtitle}</span>}
      </div>
      <div className={`checkbox-list ${columns > 1 ? 'grid' : ''}`}>
        {options.map((opt) => (
          <label key={opt.value} className={`checkbox-item ${selectedValues.includes(opt.value) ? 'selected' : ''}`}>
            <input 
              type="checkbox" 
              checked={selectedValues.includes(opt.value)}
              onChange={() => handleToggle(opt.value)}
              className="checkbox-input"
            />
            <span className="checkbox-custom" />
            <span className="checkbox-text">{opt.label}</span>
          </label>
        ))}
      </div>
      {error && <span className="error-message">{error}</span>}
    </div>
  );
};

export default Checkbox;
