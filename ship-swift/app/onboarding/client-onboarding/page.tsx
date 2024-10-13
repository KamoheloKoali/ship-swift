"use client"
import React, { useState } from 'react';
import AccountInfo from '@/components/onboarding/AccountInfo';
import ProfileSetup from '@/components/onboarding/ProfileSetup';
import ConfirmDetails from '@/components/onboarding/ConfirmDetails';
import ProgressBar from '@/components/ProgressBar';
import RegHeader from '@/components/RegHeader';
const Onboarding = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  });

  const steps = 3;

  const nextStep = () => {
    if (step < steps) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div style={{ maxWidth: '500px', margin: 'auto' }}>
      <RegHeader className="space-evenly"/>
      <ProgressBar step={step} steps={steps} />

      {step === 1 && <AccountInfo formData={formData} setFormData={setFormData} />}
      {step === 2 && <ProfileSetup formData={formData} setFormData={setFormData} />}
      {step === 3 && <ConfirmDetails formData={formData} />}

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
        <button onClick={prevStep} disabled={step === 1}>
          Back
        </button>
        <button onClick={nextStep} disabled={step === steps}>
          {step === steps ? 'Finish' : 'Next'}
        </button>
      </div>
    </div>
  );
};

export default Onboarding;
