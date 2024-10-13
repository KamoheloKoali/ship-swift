import React from 'react';

interface ConfirmDetailsProps {
  formData: { email: string; password: string; firstName: string; lastName: string };
}

const ConfirmDetails: React.FC<ConfirmDetailsProps> = ({ formData }) => {
  return (
    <div>
      <h2>Confirm Details</h2>
      <p>Email: {formData.email}</p>
      <p>First Name: {formData.firstName}</p>
      <p>Last Name: {formData.lastName}</p>
    </div>
  );
};

export default ConfirmDetails;
