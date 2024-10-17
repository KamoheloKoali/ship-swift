"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import ImageUploadCard from "@/screens/courier/registration/components/ImageUploadCard";
import { CheckCircle, Loader2 } from "lucide-react";
import useDriverRegistration from "@/screens/courier/registration/utils/DriverRegistration";
import { z } from "zod";
import useclientRegistration from "@/screens/client/registration/utils/clientRegistration";

// Zod schema for validation
const clientRegistrationForm = z.object({
  phoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .nonempty("Phone number is required"),
});

export default function ClientRegistrationForm() {
  const {
    files,
    existingImages,
    formData,
    loading,
    isLoading,
    handleFileChange,
    handleInputChange,
    handleUpload,
  } = useclientRegistration();

  // State to manage validation errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleSubmit = async () => {
    try {
      // Clear previous errors
      setErrors({});

      // Validate form data using Zod schema
      clientRegistrationForm.parse(formData);

      await handleUpload(); // Proceed with upload if validation passes
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors: { [key: string]: string } = {};
        // Map Zod errors to the corresponding input field
        error.errors.forEach((err) => {
          if (err.path[0]) {
            formattedErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(formattedErrors); // Set validation errors
      }
    }
  };

  if (isLoading) {
    return (
      <Card className="w-full max-w-4xl mx-auto bg-white rounded-none">
        <CardHeader className="bg-gray-50 border-b border-gray-200">
          <Skeleton className="h-8 w-3/4 mb-2" />
          <Skeleton className="h-8 w-full" />
        </CardHeader>
        <CardContent className="p-6 shadow-md">
          <div className="grid gap-6 ">
            <Skeleton className="h-60 w-full" />
          </div>
          <div className="mt-6 grid gap-4 ">
            <Skeleton className="h-10 w-full" />
          </div>
          <Skeleton className="h-12 w-full mt-6" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto bg-white rounded-none">
      <CardHeader className="bg-gray-50 border-b border-gray-200">
        <CardTitle className="text-3xl font-bold text-gray-900">
          Profile Verification
        </CardTitle>
        <CardDescription className="text-lg text-gray-600">
          Upload the required documents and provide additional information to be
          verified and start working with us.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 shadow-md">
        <div className="">
          {/* <ImageUploadCard
            folder="profile-photo"
            cardTitle="Profile Photo"
            onFileChange={handleFileChange("profile-photo")}
            existingImageUrl={existingImages["profile-photo"]}
          /> */}
          <ImageUploadCard
            folder="id-document"
            cardTitle="Identity Document"
            onFileChange={handleFileChange("id-documents")}
            existingImageUrl={existingImages["id-documents"]}
          />
          {/* <ImageUploadCard
            folder="drivers-license"
            cardTitle="Drivers License"
            onFileChange={handleFileChange("drivers-license")}
            existingImageUrl={existingImages["drivers-license"]}
          />
          <ImageUploadCard
            folder="license-disc"
            cardTitle="License Disc"
            onFileChange={handleFileChange("license-disc")}
            existingImageUrl={existingImages["license-disc"]}
          /> */}
        </div>
        <div className="mt-6 grid gap-4 ">
          <div>
            <Input
              name="phoneNumber"
              placeholder="Phone Number"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              required
            />
            {errors.phoneNumber && (
              <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>
            )}
          </div>

          {/* <div>
            <Input
              name="location"
              placeholder="Residential Address"
              value={formData.location}
              onChange={handleInputChange}
              required
            />
            {errors.location && (
              <p className="text-red-500 text-sm mt-1">{errors.location}</p>
            )}
          </div>
          <div>
            <Input
              name="vehicleMake"
              placeholder="Vehicle Make"
              value={formData.vehicleMake}
              onChange={handleInputChange}
              required
            />
            {errors.vehicleMake && (
              <p className="text-red-500 text-sm mt-1">{errors.vehicleMake}</p>
            )}
          </div>
          <div>
            <Input
              name="vehicleModel"
              placeholder="Vehicle Model"
              value={formData.vehicleModel}
              onChange={handleInputChange}
              required
            />
            {errors.vehicleModel && (
              <p className="text-red-500 text-sm mt-1">{errors.vehicleModel}</p>
            )}
          </div>
          <div>
            <Input
              name="typeOfVehicle"
              placeholder="Vehicle Type"
              value={formData.typeOfVehicle}
              onChange={handleInputChange}
              required
            />
            {errors.typeOfVehicle && (
              <p className="text-red-500 text-sm mt-1">
                {errors.typeOfVehicle}
              </p>
            )}
          </div>
          <div>
            <Input
              name="vehicleColor"
              placeholder="Vehicle Color"
              value={formData.vehicleColor}
              onChange={handleInputChange}
              required
            />
            {errors.vehicleColor && (
              <p className="text-red-500 text-sm mt-1">{errors.vehicleColor}</p>
            )}
          </div> */}
        </div>
        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full mt-6 bg-black text-white hover:bg-gray-800 py-6 text-lg font-semibold transition-all duration-200 ease-in-out transform hover:scale-105"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-8 w-8 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <CheckCircle className="mr-2 h-5 w-5" />
              Submit
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
