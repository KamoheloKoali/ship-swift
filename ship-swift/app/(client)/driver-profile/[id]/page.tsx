'use client'
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import type { DriverProfileProps, DriverProfileState } from '@/types/driver';
import { DriverProfileContent } from '../components/DriverProfileContent';

const DriverProfile: React.FC<DriverProfileProps> = () => {
  const params = useParams();
  const driverId = params?.id;
  
  const [state, setState] = useState<DriverProfileState>({
    driver: null,
    loading: true
  });

  useEffect(() => {
    if (!driverId) return;
  
    const fetchDriver = async () => {
      try {
        const response = await fetch(`/api/drivers/${driverId}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }
  
        const data = await response.json();
        setState({ driver: data, loading: false });
      } catch (error) {
        console.error('Fetch error:', error);
        setState(prev => ({ 
          ...prev,
          loading: false,
          error: {
            status: 500,
            message: error instanceof Error ? error.message : 'An error occurred'
          }
        }));
      }
    };
  
    fetchDriver();
  }, [driverId]);

  return <DriverProfileContent {...state} />;
};

export default DriverProfile;