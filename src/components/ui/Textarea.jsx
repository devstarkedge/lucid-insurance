import React from 'react';
import './Textarea.css';

const Textarea = ({ label, id, subtitle, error, ...props }) => {
  return (
    <div className="textarea-group">
      {label && <label htmlFor={id} className="textarea-label">{label}</label>}
      <textarea id={id} className={`textarea-field ${error ? 'textarea-error' : ''}`} {...props} />
      {subtitle && <span className="textarea-subtitle">{subtitle}</span>}
      {error && <span className="error-message">{error}</span>}
    </div>
  );
};

export default Textarea;
