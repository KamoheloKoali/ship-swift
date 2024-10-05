"use client"
import React, { useState } from 'react';
import { createJob } from '@/actions/courierJobsActions';
import { useUser } from "@clerk/nextjs";

const JobForm: React.FC = () => {
  const { user, isLoaded } = useUser(); // Use the useUser hook to get the user object
  const [error, setError] = useState<string | null | undefined>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    const formData = new FormData(event.currentTarget);

    // Ensure the user object is loaded and available
    if (isLoaded && user) {
      formData.append("clientId", "user_2mvL0iKwI7Eu3cEJOuz7jNsRiLO"); // Append clientId from useUser to FormData
    } else {
      setError("User is not authenticated.");
      return;
    }

    const response = await createJob(formData);

    if (response.success) {
      setSuccess("Job created successfully!");
      setError(null);
      // Optionally, you can reset the form or navigate to another page
    } else {
      setError(response.error);
      setSuccess(null);
      console.log(Object.fromEntries(formData));
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h1>Create a Job</h1>
        <div>
          <label>Title:</label>
          <input type="text" name="title" required />
        </div>
        <div>
          <label>Description:</label>
          <textarea name="description" required />
        </div>
        <div>
          <label>Budget:</label>
          <input type="text" name="budget" required />
        </div>
        <div>
          <label>Drop Off:</label>
          <input type="text" name="DropOff" required />
        </div>
        <div>
          <label>Pick Up:</label>
          <input type="text" name="PickUp" required />
        </div>
        <button type="submit">Create Job</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}
      </form>
    </div>
  );
};

export default JobForm;
