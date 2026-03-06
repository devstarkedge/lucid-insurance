import React, { useState } from 'react';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Radio from '../ui/Radio';
import Button from '../ui/Button';

const Step1 = ({ data, updateData, onContinue, onReset }) => {
  const [errors, setErrors] = useState({});

  const states = [
    { value: '', label: 'Select a state' },
    { value: 'California', label: 'California' },
    { value: 'New York', label: 'New York' },
    { value: 'Texas', label: 'Texas' },
    { value: 'Florida', label: 'Florida' }
  ];

  const sexOptions = [
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' }
  ];

  const residencyOptions = [
    { value: 'Yes', label: 'Yes' },
    { value: 'No', label: 'No' }
  ];

  const validate = () => {
    const newErrors = {};
    if (!data.fullName) newErrors.fullName = 'Full Name is required';
    if (!data.address) newErrors.address = 'Street Address is required';
    if (!data.state) newErrors.state = 'State is required';
    if (!data.sex) newErrors.sex = 'Sex is required';
    if (!data.birthDate) newErrors.birthDate = 'Birth Date is required';
    if (!data.residency) newErrors.residency = 'Residency status is required';

    // Email validation
    if (!data.email) {
      newErrors.email = 'Email Address is required';
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone validation (simple)
    if (!data.phone) {
      newErrors.phone = 'Phone Number is required';
    } else if (!/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(data.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (validate()) {
      onContinue();
    }
  };

  const handleChange = (field, value) => {
    updateData({ [field]: value });
    // Clear error for this field when user types
    if (errors[field]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  return (
    <div className="form-step">
      <h2 className="form-title">Personal Information</h2>
      <p className="form-subtitle">Basic details to help us identify you</p>

      <Input
        label="Full Name *"
        placeholder="John Smith"
        value={data.fullName || ''}
        onChange={(e) => handleChange('fullName', e.target.value)}
        error={errors.fullName}
      />

      <Input
        label="Street Address *"
        placeholder="123 Main Street, Apt 4B"
        value={data.address || ''}
        onChange={(e) => handleChange('address', e.target.value)}
        error={errors.address}
      />

      <Select
        label="State *"
        options={states}
        value={data.state || ''}
        onChange={(e) => handleChange('state', e.target.value)}
        error={errors.state}
      />

      <Radio
        label="Sex *"
        name="sex"
        options={sexOptions}
        value={data.sex || ''}
        onChange={(val) => handleChange('sex', val)}
        error={errors.sex}
      />

      {data.fullName && (
        <div style={{
          background: 'rgba(59, 130, 246, 0.05)',
          padding: '1rem',
          borderRadius: '0.75rem',
          marginBottom: '1.5rem',
          border: '1px dashed var(--primary)',
          fontSize: '0.9rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span>Welcome back! We've prefilled your previous progress.</span>
          <button
            type="button"
            onClick={onReset}
            style={{
              color: 'var(--primary)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontWeight: '600',
              textDecoration: 'underline'
            }}
          >
            Start Fresh
          </button>
        </div>
      )}

      <Input
        label="Birth Date *"
        type="date"
        value={data.birthDate || ''}
        onChange={(e) => handleChange('birthDate', e.target.value)}
        error={errors.birthDate}
      />

      <Radio
        label="US Citizen or Permanent Resident? *"
        name="residency"
        options={residencyOptions}
        value={data.residency || ''}
        onChange={(val) => handleChange('residency', val)}
        error={errors.residency}
      />

      <div style={{ position: 'relative' }}>
        <Input
          label="Email Address *"
          placeholder="demo@example.com"
          value={data.email || ''}
          onChange={(e) => handleChange('email', e.target.value)}
          error={errors.email}
        />
        <span style={{ position: 'absolute', right: 0, top: 0, fontSize: '0.8rem', color: 'var(--primary)' }}>Change Email</span>
      </div>

      <Input
        label="Phone Number *"
        placeholder="(555) 123-4567"
        value={data.phone || ''}
        onChange={(e) => handleChange('phone', e.target.value)}
        error={errors.phone}
      />

      <div className="form-actions">
        <Button onClick={handleContinue} className="btn-continue">
          Continue
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4.16666 10H15.8333" stroke="white" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M10 4.16666L15.8333 10L10 15.8333" stroke="white" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Button>
      </div>
    </div>
  );
};

export default Step1;
