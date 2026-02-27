import React, { useState } from 'react';
import Input from '../ui/Input';
import Radio from '../ui/Radio';
import Checkbox from '../ui/Checkbox';
import Button from '../ui/Button';

const Step3 = ({ data, updateData, onContinue, onBack }) => {
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!data.heightFt) newErrors.heightFt = 'Required';
    if (!data.heightIn && data.heightIn !== 0) newErrors.heightIn = 'Required';
    if (!data.weight) newErrors.weight = 'Required';
    if (!data.nicotine) newErrors.nicotine = 'Nicotine status is required';
    if (!data.seriousTreat) newErrors.seriousTreat = 'This selection is required';
    if (!data.transplant) newErrors.transplant = 'This selection is required';
    if (!data.conditions || data.conditions.length === 0) {
      newErrors.conditions = 'Please select at least one condition or "None of the above"';
    }
    if (!data.mentalMeds) newErrors.mentalMeds = 'This selection is required';

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

  const conditionOptions = [
    { value: 'kidney', label: 'Kidney disease (excluding kidney stones)' },
    { value: 'asthma', label: 'Astma' },
    { value: 'parkinson', label: "Parkinson's disease" },
    { value: 'diabetes', label: 'Diabetes' },
    { value: 'ms', label: 'Multiple sclerosis' },
    { value: 'hbp', label: 'High blood pressure' },
    { value: 'nerve', label: 'A degenerative muscle or nerve disease' },
    { value: 'psych', label: 'Psychological disorder (anxiety, depression, bipolar)' },
    { value: 'cirrhosis', label: 'Cirrhosis or hepatitis' },
    { value: 'stroke', label: 'Stroke' },
    { value: 'copd', label: 'Emphysema or COPD' },
    { value: 'cholesterol', label: 'High cholesterol' },
    { value: 'alzheimer', label: "Alzheimer's/dementia/permanent cognitive impairment" },
    { value: 'sleepApnea', label: 'Sleep apnea' },
    { value: 'cancer', label: 'Cancer' },
    { value: 'heartAttack', label: 'Heart attack' },
    { value: 'other', label: 'Other serious condition' },
    { value: 'none', label: 'None of the above' }
  ];

  return (
    <div className="form-step">
      <h2 className="form-title">Health Profile</h2>
      <p className="form-subtitle">This helps us find the best coverage options for you</p>

      <div className="form-section-label">What's your height and weight? *</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
        <Input 
          label="Feet" 
          type="number" 
          placeholder="5"
          value={data.heightFt || ''} 
          onChange={(e) => handleChange('heightFt', e.target.value)}
          error={errors.heightFt}
        />
        <Input 
          label="Inches" 
          type="number" 
          placeholder="10"
          value={data.heightIn || ''} 
          onChange={(e) => handleChange('heightIn', e.target.value)}
          error={errors.heightIn}
        />
        <Input 
          label="Weight (lbs)" 
          type="number" 
          placeholder="175"
          value={data.weight || ''} 
          onChange={(e) => handleChange('weight', e.target.value)}
          error={errors.weight}
        />
      </div>

      <Radio 
        label="Do you currently use any nicotine products? *" 
        name="nicotine" 
        options={yesNoOptions} 
        value={data.nicotine || ''} 
        onChange={(val) => handleChange('nicotine', val)}
        error={errors.nicotine}
      />

      <Radio 
        label="Have you ever been treated for heart disease, HIV, liver disease, or cancer? *" 
        name="seriousTreat" 
        options={yesNoOptions} 
        value={data.seriousTreat || ''} 
        onChange={(val) => handleChange('seriousTreat', val)}
        error={errors.seriousTreat}
      />

      <Radio 
        label="Have you ever undergone an organ transplant? *" 
        name="transplant" 
        options={yesNoOptions} 
        value={data.transplant || ''} 
        onChange={(val) => handleChange('transplant', val)}
        error={errors.transplant}
      />

      <Checkbox 
        label="In the past 10 years, have you been diagnosed with any of the following? *"
        subtitle="You can choose multiple"
        options={conditionOptions}
        selectedValues={data.conditions || []}
        onChange={(val) => handleChange('conditions', val)}
        columns={2}
        error={errors.conditions}
      />

      <Radio 
        label="Are you taking two or more medications to manage a mental health condition? *" 
        name="mentalMeds" 
        options={yesNoOptions} 
        value={data.mentalMeds || ''} 
        onChange={(val) => handleChange('mentalMeds', val)}
        error={errors.mentalMeds}
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

export default Step3;
