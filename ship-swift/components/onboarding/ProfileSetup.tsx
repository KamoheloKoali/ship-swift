import React from 'react';

interface ProfileSetupProps {
  formData: { firstName: string; lastName: string };
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

const ProfileSetup: React.FC<ProfileSetupProps> = ({ formData, setFormData }) => {
  return (
    <div>
      <h2>Profile Setup</h2>
      <input
        type="text"
        placeholder="First Name"
        value={formData.firstName}
        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
      />
      <input
        type="text"
        placeholder="Last Name"
        value={formData.lastName}
        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
      />
    </div>
  );
};

export default ProfileSetup;
