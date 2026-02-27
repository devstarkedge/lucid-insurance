import React, { useState } from 'react';
import Input from '../ui/Input';
import Radio from '../ui/Radio';
import Checkbox from '../ui/Checkbox';
import Button from '../ui/Button';

const Step2 = ({ data, updateData, onContinue, onBack }) => {
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!data.occupation) newErrors.occupation = 'Occupation is required';
    if (!data.income) newErrors.income = 'Annual income is required';
    if (!data.substance) newErrors.substance = 'This selection is required';
    if (!data.alcohol) newErrors.alcohol = 'This selection is required';
    if (!data.bankruptcy) newErrors.bankruptcy = 'This selection is required';
    if (!data.felony) newErrors.felony = 'This selection is required';
    if (!data.activities || data.activities.length === 0) {
      newErrors.activities = 'Please select at least one activity or "None of the Above"';
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
    if (errors[field]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const yesNoOptions = [
    { value: 'yes', label: 'Yes' },
    { value: 'no', label: 'No' }
  ];

  const activityOptions = [
    { value: 'aviation', label: 'Recreational Aviation' },
    { value: 'airSports', label: 'Air Sports' },
    { value: 'motorSports', label: 'Motor Sports' },
    { value: 'climbing', label: 'Mountain, Rock, Snow or Ice Climbing' },
    { value: 'scuba', label: 'Scuba Diving' },
    { value: 'cliffDiving', label: 'Cliff Diving' },
    { value: 'otherSports', label: 'Other Sport Activities' },
    { value: 'none', label: 'None of the Above' }
  ];

  return (
    <div className="form-step">
      <h2 className="form-title">Lifestyle & Financial Information</h2>
      <p className="form-subtitle">Final details to ensure accurate pricing</p>

      <Input 
        label="Occupation *" 
        placeholder="Software Engineer" 
        value={data.occupation || ''} 
        onChange={(e) => handleChange('occupation', e.target.value)}
        error={errors.occupation}
      />

      <Input 
        label="What is your annual household income? *" 
        placeholder="100000-150000" 
        value={data.income || ''} 
        onChange={(e) => handleChange('income', e.target.value)}
        error={errors.income}
      />

      <Radio 
        label="Are you currently dealing with substance abuse or alcoholism? *" 
        name="substance" 
        options={yesNoOptions} 
        value={data.substance || ''} 
        onChange={(val) => handleChange('substance', val)}
        error={errors.substance}
      />

      <Radio 
        label="Do you consume alcohol? *" 
        name="alcohol" 
        options={yesNoOptions} 
        value={data.alcohol || ''} 
        onChange={(val) => handleChange('alcohol', val)}
        error={errors.alcohol}
      />

      <Radio 
        label="Have you filed for bankruptcy in the past 2 years? *" 
        name="bankruptcy" 
        options={yesNoOptions} 
        value={data.bankruptcy || ''} 
        onChange={(val) => handleChange('bankruptcy', val)}
        error={errors.bankruptcy}
      />

      <Radio 
        label="Have you ever been convicted or charged with a felony? *" 
        name="felony" 
        options={yesNoOptions} 
        value={data.felony || ''} 
        onChange={(val) => handleChange('felony', val)}
        error={errors.felony}
      />

      <Checkbox 
        label="Have you in the past 2 years, or do you plan in the next year, to participate in any of the following?"
        options={activityOptions}
        selectedValues={data.activities || []}
        onChange={(val) => handleChange('activities', val)}
        error={errors.activities}
      />

      <div className="form-actions">
        <Button onClick={onBack} variant="secondary">Back</Button>
        <Button onClick={handleContinue} className="btn-continue">
          Continue
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4.16666 10H15.8333" stroke="white" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M10 4.16666L15.8333 10L10 15.8333" stroke="white" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Button>
      </div>
    </div>
  );
};

export default Step2;
