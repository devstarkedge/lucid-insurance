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

  const isValidEmail = (email) => {
    return /^\S+@\S+\.\S+$/.test(email);
  };

  const saveToLocalStorage = (data, step) => {
    if (data.email && isValidEmail(data.email)) {
      const dataToSave = {
        formData: data,
        currentStep: step,
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem(`lucide_insurance_data_${data.email}`, JSON.stringify(dataToSave));
      localStorage.setItem('lucide_insurance_last_email', data.email);
    }
  };

  React.useEffect(() => {
    // Cleanup: Remove any partial email data keys to keep localStorage clean
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('lucide_insurance_data_')) {
          const emailPart = key.replace('lucide_insurance_data_', '');
          if (!isValidEmail(emailPart)) {
            localStorage.removeItem(key);
            i--;
          }
        }
      }
    } catch (e) {
      console.warn('LocalStorage cleanup failed', e);
    }

    const lastEmail = localStorage.getItem('lucide_insurance_last_email');
    if (lastEmail) {
      const savedData = localStorage.getItem(`lucide_insurance_data_${lastEmail}`);
      if (savedData) {
        try {
          const parsed = JSON.parse(savedData);
          setFormData(parsed.formData || {});
          setCurrentStep(parsed.currentStep || 1);
        } catch (e) {
          console.error('Error parsing saved form data', e);
        }
      }
    }
  }, []);

  const steps = [
    "Personal Information",
    "Lifestyle & Financial",
    "Health Profile",
    "Coverage Needs"
  ];

  const updateFormData = (newData) => {
    setFormData((prev) => {
      const updated = { ...prev, ...newData };

      if (newData.email && newData.email !== prev.email) {
        if (isValidEmail(newData.email)) {
          const existingData = localStorage.getItem(`lucide_insurance_data_${newData.email}`);

          if (existingData) {
            try {
              const parsed = JSON.parse(existingData);
              return { ...parsed.formData, email: newData.email };
            } catch (e) {
              console.error('Error recovering existing data for email', e);
            }
          }
        }
      }

      return updated;
    });

  };

  const clearSession = () => {
    if (formData.email) {
      localStorage.removeItem(`lucide_insurance_data_${formData.email}`);
      localStorage.removeItem('lucide_insurance_last_email');
    }
    setFormData({});
    setCurrentStep(1);
  };

  const submitToHubspot = async (data, step) => {
    const portalId = '245066659';
    const formGuid = '4eb77d07-f352-4595-8bc6-dbd7465de4d3';
    const accessToken = import.meta.env.VITE_HUBSPOT_ACCESS_TOKEN;

    // Map each step to the correct internal HubSpot progress status
    const progressMapping = {
      1: 'personal_info',
      2: 'lifestyle _financial',
      3: 'health_profile',
      4: 'coverage_needs'
    };

    if (step === 1) {
      // Step 1: Use Forms API (Form Submission)
      const endpoint = `https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${formGuid}`;
      const fields = [
        { name: 'email', value: data.email },
        { name: 'full_name', value: data.fullName },
        { name: 'phone', value: data.phone },
        { name: 'address', value: data.address },
        { name: 'state', value: data.state },
        { name: 'sex', value: data.sex },
        { name: 'date_of_birth', value: data.birthDate },
        { name: 'us_citizen_or_permanent_resident', value: data.residency },
        { name: 'application_progress', value: progressMapping[1] },
        { name: 'lifecycle_stage', value: 'marketingqualifiedlead' }
      ].filter(f => f.value != null).map(f => ({ ...f, value: String(f.value) }));

      const body = {
        fields,
        context: {
          pageUri: window.location.href,
          pageName: document.title
        }
      };

      console.log('HubSpot Form Submission (Step 1):', body);
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Form submission failed');
      }
    } else {
      // Steps 2-4: Use CRM API (Direct CRM Contact Update) 
      const email = encodeURIComponent(data.email);
      const endpointCRM = `/hubapi/crm/v3/objects/contacts/${email}?idProperty=email`;

      const propertiesMapping = {
        2: {
          occupation: data.occupation,
          what_is_your_annual_household_income: data.income,
          are_you_currently_dealing_with_substance_abuse_or_alcoholism: data.substance,
          do_you_consume_alcohol: data.alcohol,
          have_you_filed_for_bankruptcy_in_the_past_2_years: data.bankruptcy,
          have_you_ever_been_convicted_or_charged_with_a_felony: data.felony,
          have_you_in_the_past_2_years_or_do_you_plan_in_the_next_year_to_participate_in_any_of_the_following: (data.activities || []).join(', '),
          application_progress: progressMapping[2]
        },
        3: {
          whats_your_height_and_weight: data.weight || '',
          do_you_currently_use_any_nicotine_products: data.nicotine,
          have_you_ever_been_treated_for_heart_disease_hiv_liver_disease_or_cancer: data.seriousTreat,
          have_you_ever_undergone_an_organ_transplant: data.transplant,
          in_the_past_10_years_have_you_been_diagnosed_with_any_of_the_following: (data.conditions || []).join(', '),
          are_you_taking_two_or_more_medications_to_manage_a_mental_health_condition: data.mentalMeds,
          application_progress: progressMapping[3]
        },
        4: {
          what_type_of_life_insurance_are_you_looking_for: data.insuranceType,
          term_length_for_term_quotes: data.termLength,
          coverage_amount: data.coverageAmount,
          primary_beneficiari: data.beneficiaries,
          application_progress: progressMapping[4]
        }
      };

      const properties = propertiesMapping[step] || {};
      const sanitizedProperties = {};

      // Value normalization mapping for CRM API
      const valueMap = {
        // Yes/No
        'yes': 'Yes',
        'no': 'No',
        'none': 'None of the Above',

        // Activities (Step 2)
        'aviation': 'Recreational Aviation',
        'airSports': 'Air Sports',
        'motorSports': 'Motor Sports',
        'climbing': 'Mountain, Rock, Snow or Ice Climbing',
        'scuba': 'Scuba Diving',
        'cliffDiving': 'Cliff Diving',
        'otherSports': 'Other Sport Activities',

        // Health Conditions (Step 3)
        'kidney': 'Kidney disease (excluding kidney stones)',
        'asthma': 'Astma',
        'parkinson': "Parkinson's disease",
        'diabetes': 'Diabetes',
        'ms': 'Multiple sclerosis',
        'hbp': 'High blood pressure',
        'nerve': 'A degenerative muscle or nerve disease',
        'psych': 'Psychological disorder (anxiety, depression, bipolar)',
        'cirrhosis': 'Cirrhosis or hepatitis',
        'stroke': 'Stroke',
        'copd': 'Emphysema or COPD',
        'cholesterol': 'High cholesterol',
        'alzheimer': "Alzheimer's/dementia/permanent cognitive impairment",
        'sleepApnea': 'Sleep apnea',
        'cancer': 'Cancer',
        'heartAttack': 'Heart attack',
        'other': 'Other serious condition',

        // Income (Step 2)
        'under25': 'Under $25,000',
        '25to50': '$25,000 - $49,999',
        '50to100': '$50,000 - $99,999',
        '100to150': '$100,000 - $149,999',
        '150to200': '$150,000 - $199,999',
        'above200': '$200,000+',

        // Insurance Type (Step 4)
        'term': 'Term',
        'whole': 'Whole Life',
        'universal': 'Universal Life',
        'final': 'Final Expense'
      };

      const normalizeValue = (val) => {
        if (val == null) return '';
        const strVal = String(val);

        if (strVal.includes(', ')) {
          return strVal.split(', ')
            .map(item => valueMap[item.toLowerCase()] || item)
            .join('; ');
        }

        return valueMap[strVal.toLowerCase()] || strVal;
      };

      Object.keys(properties).forEach(key => {
        if (properties[key] != null) {
          sanitizedProperties[key] = normalizeValue(properties[key]);
        }
      });

      const bodyCRM = { properties: sanitizedProperties };
      console.log(`HubSpot CRM Update (Step ${step}):`, bodyCRM);

      const responseCRM = await fetch(endpointCRM, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(bodyCRM)
      });
      if (!responseCRM.ok) {
        const err = await responseCRM.json();
        console.error('HubSpot CRM API Error Response:', err);
        throw new Error(err.message || 'CRM update failed');
      }

      // SPECIAL CASE: For the final step (4), also submit the FULL form to the second Form ID
      if (step === 4) {
        const finalFormGuid = 'a9745802-fde6-4539-8463-74c389d33454';
        const finalEndpoint = `https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${finalFormGuid}`;

        // Map all data points from all steps
        const allFields = [
          // Step 1
          { name: 'email', value: data.email },
          { name: 'full_name', value: data.fullName },
          { name: 'phone', value: data.phone },
          { name: 'address', value: data.address },
          { name: 'state', value: data.state },
          { name: 'sex', value: data.sex },
          { name: 'date_of_birth', value: data.birthDate },
          { name: 'us_citizen_or_permanent_resident', value: data.residency },
          { name: 'lifecycle_stage', value: 'marketingqualifiedlead' },
          // Step 2
          { name: 'occupation', value: data.occupation },
          { name: 'what_is_your_annual_household_income', value: data.income },
          { name: 'are_you_currently_dealing_with_substance_abuse_or_alcoholism', value: data.substance },
          { name: 'do_you_consume_alcohol', value: data.alcohol },
          { name: 'have_you_filed_for_bankruptcy_in_the_past_2_years', value: data.bankruptcy },
          { name: 'have_you_ever_been_convicted_or_charged_with_a_felony', value: data.felony },
          { name: 'have_you_in_the_past_2_years_or_do_you_plan_in_the_next_year_to_participate_in_any_of_the_following', value: (data.activities || []).join(', ') },
          // Step 3
          { name: 'whats_your_height_and_weight', value: data.weight },
          { name: 'do_you_currently_use_any_nicotine_products', value: data.nicotine },
          { name: 'have_you_ever_been_treated_for_heart_disease_hiv_liver_disease_or_cancer', value: data.seriousTreat },
          { name: 'have_you_ever_undergone_an_organ_transplant', value: data.transplant },
          { name: 'in_the_past_10_years_have_you_been_diagnosed_with_any_of_the_following', value: (data.conditions || []).join(', ') },
          { name: 'are_you_taking_two_or_more_medications_to_manage_a_mental_health_condition', value: data.mentalMeds },
          // Step 4
          { name: 'what_type_of_life_insurance_are_you_looking_for', value: data.insuranceType },
          { name: 'term_length_for_term_quotes', value: data.termLength },
          { name: 'coverage_amount', value: data.coverageAmount },
          { name: 'primary_beneficiari', value: data.beneficiaries },
          { name: 'application_progress', value: progressMapping[4] }
        ];

        const finalFields = allFields
          .filter(f => f.value != null)
          .map(f => ({ ...f, value: normalizeValue(f.value) }));

        const finalBody = {
          fields: finalFields,
          context: {
            pageUri: window.location.href,
            pageName: document.title
          }
        };

        console.log('HubSpot Final Full Form Submission (Step 4):', finalBody);
        const finalResponse = await fetch(finalEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(finalBody)
        });

        if (!finalResponse.ok) {
          const finalErr = await finalResponse.json();
          console.error('Final Form Error:', finalErr);

          throw new Error(finalErr.message || 'Final form submission failed');
        }
      }
    }
    return true;
  };

  const handleContinue = async () => {
    if (currentStep < 4) {
      saveToLocalStorage(formData, currentStep + 1);

      try {
        await submitToHubspot(formData, currentStep);
      } catch (err) {
        console.warn('Silent HubSpot failure during multi-step submission:', err);
      }
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      await submitToHubspot(formData, 4);
      setIsSubmitted(true);
      if (formData.email) {
        localStorage.removeItem(`lucide_insurance_data_${formData.email}`);
        localStorage.removeItem('lucide_insurance_last_email');
      }
    } catch (err) {
      setError(err.message || 'Connection error. Please check your internet and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    if (isSubmitted) {
      return (
        <div className="placeholder-step">
          <div className="success-icon">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="32" cy="32" r="32" fill="#DEF7EC" />
              <path d="M18 32L28 42L46 24" stroke="#057A55" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
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
        return <Step1 data={formData} updateData={updateFormData} onContinue={handleContinue} onReset={clearSession} />;
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

      <form onSubmit={handleSubmit}>
        <Stepper currentStep={currentStep} steps={steps} />

        <div className="card">
          {renderStep()}
        </div>
      </form>
    </div>
  );
};

export default InsuranceForm;
