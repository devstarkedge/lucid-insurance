import React, { useState } from 'react';
import Select from '../ui/Select';
import Radio from '../ui/Radio';
import Textarea from '../ui/Textarea';
import Checkbox from '../ui/Checkbox';
import Button from '../ui/Button';

const Step4 = ({ data, updateData, onFinish, onBack }) => {
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!data.insuranceType) newErrors.insuranceType = 'Insurance type is required';
    if (!data.termLength) newErrors.termLength = 'Term length is required';
    if (!data.coverageAmount) newErrors.coverageAmount = 'Coverage amount is required';
    if (!data.beneficiaries) newErrors.beneficiaries = 'Primary beneficiaries are required';
    if (!data.consent1) newErrors.consent1 = 'You must consent to proceed';
    if (!data.consent2) newErrors.consent2 = 'You must agree to terms to proceed';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFinish = () => {
    if (validate()) {
      onFinish();
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

  const insuranceTypes = [
    { 
      value: 'term', 
      label: 'Term Life Insurance', 
      description: 'Coverage for a specific period (10-30 years). Lower premiums, straightforward protection.' 
    },
    { 
      value: 'universal', 
      label: 'Universal Life Insurance', 
      description: 'Permanent coverage with flexible premiums and cash value accumulation potential.' 
    },
    { 
      value: 'Show me both options', 
      label: 'Show me both options', 
      description: 'Compare Term and Universal Life quotes to find the best fit for your needs.' 
    }
  ];

  const termOptions = [
    { value: '10 Years', label: '10 Years' },
    { value: '20 Years', label: '20 Years' },
    { value: '30 Years', label: '30 Years' }
  ];

  const amountOptions = [
    { value: '$100K', label: '$100K' },
    { value: '$250K', label: '$250K' },
    { value: '$500K', label: '$500K' },
    { value: '$1M', label: '$1M' }
  ];

  return (
    <div className="form-step">
      <h2 className="form-title">Time to set your coverage details</h2>
      <p className="form-subtitle">Define the protection you need for your family</p>

      <Radio 
        label="What type of life insurance are you looking for? *" 
        name="insuranceType" 
        options={insuranceTypes} 
        value={data.insuranceType || ''} 
        onChange={(val) => handleChange('insuranceType', val)}
        variant="vertical"
        error={errors.insuranceType}
      />

      <Select 
        label="Term length (for Term quotes)" 
        options={termOptions} 
        value={data.termLength || ''} 
        onChange={(e) => handleChange('termLength', e.target.value)}
        error={errors.termLength}
      />

      <Select 
        label="Coverage amount *" 
        options={amountOptions} 
        value={data.coverageAmount || ''} 
        onChange={(e) => handleChange('coverageAmount', e.target.value)}
        error={errors.coverageAmount}
      />

      <Textarea 
        label="Primary Beneficiaries *" 
        subtitle="Who will receive the benefits"
        placeholder="Jane Smith (Spouse) - 100%"
        value={data.beneficiaries || ''}
        onChange={(e) => handleChange('beneficiaries', e.target.value)}
        error={errors.beneficiaries}
      />

      <Checkbox 
        options={[
          { 
            value: 'consent1', 
            label: <span>By checking this box, I consent to Lucid (and our trusted partners) contacting me about insurance products and services via <strong>phone</strong> (including autodialed & prerecorded calls), <strong>text message</strong>, and <strong>email</strong> using the information I provided. I understand that consent is not required to purchase any goods or services. Msg & data rates may apply. Reply STOP to opt-out of texts. View our <a href="#">Privacy Policy</a> & <a href="#">Terms</a>.</span>
          }
        ]}
        selectedValues={data.consent1 ? ['consent1'] : []}
        onChange={(val) => handleChange('consent1', val.includes('consent1'))}
        error={errors.consent1}
      />

      <Checkbox 
        options={[
          { 
            value: 'consent2', 
            label: <span>I agree to the <a href="#">Terms and Conditions</a> and <a href="#">Privacy Policy</a>. I authorize LUCID to submit my application and personal information to insurance carriers for policy underwriting purposes.</span>
          }
        ]}
        selectedValues={data.consent2 ? ['consent2'] : []}
        onChange={(val) => handleChange('consent2', val.includes('consent2'))}
        error={errors.consent2}
      />

      <div className="info-banner">
        <strong>Ready to submit?</strong> Our AI Policy Engine will analyze your profile and provide personalized recommendations in seconds.
      </div>

      <div className="form-actions">
        <Button onClick={onBack} variant="secondary" className="btn-back">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transform: 'rotate(180deg)', marginRight: '0.5rem' }}>
            <path d="M4.16666 10H15.8333" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M10 4.16666L15.8333 10L10 15.8333" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back
        </Button>
        <Button onClick={handleFinish} className="btn-continue">
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

export default Step4;
