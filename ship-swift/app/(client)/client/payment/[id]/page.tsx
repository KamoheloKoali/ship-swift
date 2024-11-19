'use client';

import { loadStripe } from '@stripe/stripe-js';
import { getJobById } from '@/actions/courierJobsActions';
import { useState, useEffect } from 'react';

type Job = {
  Id: string;
  Title: string;
  Budget: string;
  // ... other fields as needed
};

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || '');

const PaymentPage = ({ params }: { params: { id: string } }) => {
  const [job, setJob] = useState<Job | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJob = async () => {
      const result = await getJobById(params.id);
      if (result.success && result.data) {
        setJob(result.data);
      } else {
        setError(result.error || 'Failed to load job');
      }
    };
    fetchJob();
  }, [params.id]);

  const handlePayment = async () => {
    if (!job) return;
    
    const stripe = await stripePromise;
    const res = await fetch('/api/create-checkout-session', {
      method: 'POST',
      body: JSON.stringify({ jobId: params.id, amount: job.Budget }),
    });
    const { sessionId } = await res.json();

    await stripe?.redirectToCheckout({ sessionId });
  };

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (!job) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Payment for Job: {job.Title}</h1>
      <p>Amount: ${job.Budget}</p>
      <button 
        onClick={handlePayment}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Pay Now
      </button>
    </div>
  );
};

export default PaymentPage;