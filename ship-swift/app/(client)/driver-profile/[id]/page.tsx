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
  Car,
  Mail,
  Phone,
  MapPin,
  Calendar,
  FileText,
  Shield,
  User,
  Loader2
} from 'lucide-react';
import type { 
  Driver,
  DriverProfileProps,
  DriverProfileState,
  ApiError
} from '@/types/driver';
import { TABS } from '@/types/driver';

const DriverProfile: React.FC<DriverProfileProps> = () => {
  const { driverId } = useParams();  // Get driverId from useParams
  console.log(driverId);
  
  const [state, setState] = useState<DriverProfileState>({
    driver: null,
    loading: true
  });

  useEffect(() => {
    if (!driverId) return;  // Ensure driverId is defined before fetching

    const fetchDriver = async () => {
      try {
        const response = await fetch(`/api/drivers/${driverId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch driver data');
        }
        const data: Driver = await response.json();
        setState({ driver: data, loading: false });
      } catch (error) {
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
  }, [driverId]);  // Add driverId as dependency

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
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 rounded-full overflow-hidden mb-4">
                <img
                  src={driver.photoUrl}
                  alt={`${driver.firstName} ${driver.lastName}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <h2 className="text-xl font-semibold">
                {driver.firstName} {driver.lastName}
              </h2>
              <div className="flex items-center gap-2 mt-2">
                <Mail className="h-4 w-4" />
                <a href={`mailto:${driver.email}`} className="text-sm">
                  {driver.email}
                </a>
              </div>
              {driver.phoneNumber && (
                <div className="flex items-center gap-2 mt-2">
                  <Phone className="h-4 w-4" />
                  <a href={`tel:${driver.phoneNumber}`} className="text-sm">
                    {driver.phoneNumber}
                  </a>
                </div>
              )}
              {driver.location && (
                <div className="flex items-center gap-2 mt-2">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">{driver.location}</span>
                </div>
              )}
            </div>
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
                <dl className="grid gap-4">
                  <div className="flex justify-between">
                    <dt className="font-medium">Vehicle Type</dt>
                    <dd>{driver.vehicleType || 'Not specified'}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="font-medium">VIN</dt>
                    <dd>{driver.VIN || 'Not specified'}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="font-medium">Plate Number</dt>
                    <dd>{driver.plateNumber || 'Not specified'}</dd>
                  </div>
                </dl>
              </TabsContent>

              <TabsContent value="documents" className="mt-4">
                <dl className="grid gap-4">
                  <div className="flex justify-between">
                    <dt className="font-medium">License Number</dt>
                    <dd>{driver.licenseNumber || 'Not specified'}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="font-medium">License Expiry</dt>
                    <dd>{driver.licenseExpiry || 'Not specified'}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="font-medium">ID Number</dt>
                    <dd>{driver.idNumber || 'Not specified'}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="font-medium">DISC Expiry</dt>
                    <dd>{driver.discExpiry || 'Not specified'}</dd>
                  </div>
                </dl>
              </TabsContent>

              <TabsContent value="activity" className="mt-4">
                <dl className="grid gap-4">
                  <div className="flex justify-between">
                    <dt className="font-medium">Date Joined</dt>
                    <dd>{new Date(driver.dateCreated).toLocaleDateString()}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="font-medium">Last Updated</dt>
                    <dd>{new Date(driver.dateUpdated).toLocaleDateString()}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="font-medium">Active Jobs</dt>
                    <dd>{driver.activeJobs?.length || 0}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="font-medium">Scheduled Trips</dt>
                    <dd>{driver.scheduledTrips?.length || 0}</dd>
                  </div>
                </dl>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DriverProfile;