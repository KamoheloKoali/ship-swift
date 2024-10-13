import React from 'react';

interface AccountInfoProps {
  formData: { email: string; password: string };
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

const AccountInfo: React.FC<AccountInfoProps> = ({ formData, setFormData }) => {
  return (
    <div>
      <h2>Account Info</h2>
      <input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
      />
      <input
        type="password"
        placeholder="Password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
      />
    </div>
  );
};

export default AccountInfo;
