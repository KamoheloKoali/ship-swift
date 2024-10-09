"use client";
import React from "react";
import DriverDetailsForm from "@/screens/courier/registration/components/DriverDetailsForm";
import { createDriver } from "@/actions/driverActions";
import { z } from "zod";
import { toast } from "react-hot-toast";

// Define the Zod schema for driver data validation
const driverSchema = z.object({
  clerkId: z.string().min(1, "Clerk ID is required"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  photoUrl: z.string().url("Invalid URL"),
  idPhotoUrl: z.string().url("Invalid URL"),
  idNumber: z.string().optional(),
  licenseNumber: z.string().optional(),
  licenseExpiry: z.string().optional(),
  vehicleType: z.string().optional(),
  plateNumber: z.string().optional(),
  VIN: z.string().optional(),
  diskExpiry: z.string().optional(),
});

type DriverData = z.infer<typeof driverSchema>;

const Page: React.FC = () => {
  const handleCreateDriver = async (driverData: DriverData) => {
    try {
      const normalizedDriverData = {
        ...driverData,
        idNumber: driverData.idNumber ?? "",
        licenseNumber: driverData.licenseNumber ?? "",
        licenseExpiry: driverData.licenseExpiry ?? "",
        vehicleType: driverData.vehicleType ?? "",
        plateNumber: driverData.plateNumber ?? "",
        VIN: driverData.VIN ?? "",
        diskExpiry: driverData.diskExpiry ?? "",
      };

      const response = await createDriver(normalizedDriverData);
      if (response.success) {
        console.log("Driver created successfully:", response.data);
        toast.success("Driver created successfully!");
      } else {
        console.error("Error creating driver:", response.error);
        toast.error(`Error creating driver: ${response.error}`);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div>
      <DriverDetailsForm onSubmit={handleCreateDriver} />
    </div>
  );
};

export default Page;
