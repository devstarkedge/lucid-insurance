import React, { useState } from 'react';
import Stepper from '../ui/Stepper';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import Step4 from './Step4';
import Button from '../ui/Button';
import './InsuranceForm.css';

const InsuranceForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const steps = [
    "Personal Information",
    "Lifestyle & Financial",
    "Health Profile",
    "Coverage Needs"
  ];

  const updateFormData = (newData) => {
    setFormData((prev) => ({ ...prev, ...newData }));
  };

  const handleContinue = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    // setIsSubmitting(true);
    setIsSubmitted(true);
    setError(null);

    // const portalId = '245066659';
    // const formGuid = 'a9745802-fde6-4539-8463-74c389d33454';
    // const endpoint = `https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${formGuid}`;

  
    // const hubspotFields = [
    //   { name: 'email', value: formData.email },
    //   { name: 'full_name', value: formData.fullName },
    //   { name: 'phone', value: formData.phone },
    //   { name: 'address', value: formData.address },
    //   { name: 'state', value: formData.state },
    //   { name: 'sex', value: formData.sex },
    //   { name: 'date_of_birth', value: formData.birthDate },
    //   { name: 'us_citizen_or_permanent_resident', value: formData.residency },
    //   { name: 'occupation', value: formData.occupation },
    //   { name: 'what_is_your_annual_household_income', value: formData.income },
    //   { name: 'are_you_currently_dealing_with_substance_abuse_or_alcoholism', value: formData.substance },
    //   { name: 'do_you_consume_alcohol', value: formData.alcohol },
    //   { name: 'have_you_filed_for_bankruptcy_in_the_past_2_years', value: formData.bankruptcy },
    //   { name: 'have_you_ever_been_convicted_or_charged_with_a_felony', value: formData.felony },
    //   { name: 'have_you_in_the_past_2_years_or_do_you_plan_in_the_next_year_to_participate_in_any_of_the_following', value: (formData.activities || []).join(', ') },
    //   { name: 'whats_your_height_and_weight', value: `${formData.heightFt}'${formData.heightIn}" - ${formData.weight} lbs` },
    //   { name: 'do_you_currently_use_any_nicotine_products', value: formData.nicotine },
    //   { name: 'have_you_ever_been_treated_for_heart_disease_hiv_liver_disease_or_cancer', value: formData.seriousTreat },
    //   { name: 'have_you_ever_undergone_an_organ_transplant', value: formData.transplant },
    //   { name: 'in_the_past_10_years_have_you_been_diagnosed_with_any_of_the_following', value: (formData.conditions || []).join(', ') },
    //   { name: 'are_you_taking_two_or_more_medications_to_manage_a_mental_health_condition', value: formData.mentalMeds },
    //   { name: 'what_type_of_life_insurance_are_you_looking_for', value: formData.insuranceType },
    //   { name: 'term_length_for_term_quotes', value: formData.termLength },
    //   { name: 'coverage_amount', value: formData.coverageAmount },
    //   { name: 'primary_beneficiari', value: formData.beneficiaries }
    // ];

    // const body = {
    //   fields: hubspotFields,
    //   context: {
    //     pageUri: window.location.href,
    //     pageName: document.title
    //   }
    // };

    // console.log('HubSpot Submission Payload:', body);

    // try {
    //   const response = await fetch(endpoint, {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify(body)
    //   });

    //   if (response.ok) {
    //     setIsSubmitted(true);
    //   } else {
    //     const errorData = await response.json();
    //     setError(errorData.message || 'Something went wrong. Please try again.');
    //   }
    // } catch (err) {
    //   setError('Connection error. Please check your internet and try again.');
    // } finally {
    //   setIsSubmitting(false);
    // }
  };

  const renderStep = () => {
    if (isSubmitted) {
      return (
        <div className="placeholder-step">
          <div className="success-icon">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="32" cy="32" r="32" fill="#DEF7EC"/>
              <path d="M18 32L28 42L46 24" stroke="#057A55" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h2 className="form-title">Application Submitted!</h2>
          <p className="form-subtitle">Thank you for your application, {formData.fullName}. Our AI Policy Engine is now analyzing your profile and we'll be in touch shortly.</p>
          <Button onClick={() => window.location.reload()} variant="secondary" style={{ marginTop: '2rem' }}>Close</Button>
        </div>
      );
    }

    if (isSubmitting) {
      return (
        <div className="placeholder-step">
          <div className="loading-spinner"></div>
          <h2 className="form-title">Submitting Application...</h2>
          <p className="form-subtitle">Please wait while we secure your data and analyze your profile.</p>
        </div>
      );
    }

    switch (currentStep) {
      case 1:
        return <Step1 data={formData} updateData={updateFormData} onContinue={handleContinue} />;
      case 2:
        return <Step2 data={formData} updateData={updateFormData} onContinue={handleContinue} onBack={handleBack} />;
      case 3:
        return <Step3 data={formData} updateData={updateFormData} onContinue={handleContinue} onBack={handleBack} />;
      case 4:
        return (
          <div className="step-container">
            {error && <div className="submit-error-banner">{error}</div>}
            <Step4 data={formData} updateData={updateFormData} onFinish={handleSubmit} onBack={handleBack} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="insurance-form-container">
      <div className="form-header">
        <h1>Life Insurance Application</h1>
        <p>Help us understand your needs for personalized recommendations</p>
      </div>
      
      <Stepper currentStep={currentStep} steps={steps} />
      
      <div className="card">
        {renderStep()}
      </div>
    </div>
  );
};

export default InsuranceForm;
