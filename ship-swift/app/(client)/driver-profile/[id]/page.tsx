'use client'
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';  // Use useParams from next/navigation
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Loader2
} from 'lucide-react';
import type { 
  DriverProfileProps,
  DriverProfileState,
} from '@/types/driver';
import { TABS } from '@/types/driver';
import { VehicleTab } from '../components/VehicleTab';
import { DocumentsTab } from '../components/DocumentsTab';
import { ActivityTab } from '../components/ActivityTab';
import DriverInfo from '../components/DriverInfo';

const DriverProfile: React.FC<DriverProfileProps> = () => {
  const params = useParams();
  const driverId = params?.id;

  console.log('Full params:', params);
  console.log('URL driverId:', driverId);
  console.log('Expected ID:', 'user_2msxfh6QIiMFhIAbgEog7Qiecc7');
  
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

  if (state.loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="text-center text-red-500">
        Error: {state.error.message}
      </div>
    );
  }

  if (!state.driver) {
    return <div>Driver not found</div>;
  }

  const { driver } = state;


  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Driver Profile</h1>
          <Badge variant={driver.isVerified ? "default" : "secondary"}>
            {driver.isVerified ? "Verified" : "Unverified"}
          </Badge>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Profile Summary Card */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent>
           <DriverInfo driver={driver} />
          </CardContent>
        </Card>

        {/* Details Tabs Card */}
        <Card className="md:col-span-2">
          <CardContent className="pt-6">
            <Tabs defaultValue="vehicle">
              <TabsList className="grid grid-cols-3 gap-4">
                {TABS.map(tab => (
                  <TabsTrigger key={tab.id} value={tab.id}>
                    {/* <tab.icon className="h-4 w-4 mr-2" /> */}
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value="vehicle" className="mt-4">
                <VehicleTab driver={driver} />
              </TabsContent>

              <TabsContent value="documents" className="mt-4">
                <DocumentsTab driver={driver} />
              </TabsContent>

              <TabsContent value="activity" className="mt-4">
                <ActivityTab driver={driver} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DriverProfile;