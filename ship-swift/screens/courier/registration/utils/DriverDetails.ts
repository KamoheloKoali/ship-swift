import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import {
  getDriverByID,
  updateDriverVerification,
} from "@/actions/driverActions";
import { useRouter } from "next/navigation";

interface DriverData {
  Id: string;
  email: string;
  phoneNumber: string | null;
  firstName: string;
  lastName: string;
  photoUrl: string;
  idPhotoUrl: string;
  vehicleType: string | null;
  dateCreated: Date;
  dateUpdated: Date;
  discPhotoUrl: string | null;
  VIN: string | null;
  discExpiry: string | null;
  idNumber: string | null;
  licensePhotoUrl: string | null;
  licenseExpiry: string | null;
  licenseNumber: string | null;
  plateNumber: string | null;
  location: string | null;
  isVerified: boolean;
  Contacts: Array<{
    Id: string;
    driverId: string;
    clientId: string;
    isConversating: boolean;
  }>;
  Messages: any[];
  clientRequests: any[];
}

export default function useDriverDetails() {
  const { userId } = useAuth();
  const [driverData, setDriverData] = useState<DriverData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchDriverData = async () => {
      if (userId) {
        try {
          const driver = await getDriverByID(userId);
          setDriverData(driver as DriverData);
        } catch (err) {
          setError("Failed to fetch driver data");
          console.error(err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchDriverData();
  }, [userId]);

  const handleConfirm = async () => {
    if (driverData) {
      try {
        setLoading(true);
        const updatedDriver = await updateDriverVerification(
          driverData.Id,
          true
        );
        setDriverData(updatedDriver as DriverData);
        router.push("/driver/dashboard/find-jobs");
      } catch (err) {
        setError("Failed to verify driver");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEdit = () => {
    router.push("/onboarding/driver-onboarding/registration");
  };

  return {
    driverData,
    loading,
    error,
    handleConfirm,
    handleEdit,
  };
}
