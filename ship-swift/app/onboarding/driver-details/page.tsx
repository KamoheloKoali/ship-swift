"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import DriverDetailsForm from "@/screens/courier/registration/Components/DriverDetailsForm";
import { createDriver } from "@/actions/driverActions";
import { z } from "zod";

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

// Infer the type from the Zod schema
type DriverData = z.infer<typeof driverSchema>;

const Page: React.FC = () => {
  // useForm hook with Zod resolver
  const { handleSubmit } = useForm<DriverData>({
    resolver: zodResolver(driverSchema),
  });

  // Update this function to expect DriverData
  const handleCreateDriver = async (driverData: DriverData) => {
    // Normalize data to ensure all fields are populated
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
    } else {
      console.error("Error creating driver:", response.error);
    }
  };

  return (
    <div>
      {/* Pass the handleSubmit wrapped around handleCreateDriver */}
      <DriverDetailsForm onSubmit={handleCreateDriver} />
    </div>
  );
};

export default Page;
