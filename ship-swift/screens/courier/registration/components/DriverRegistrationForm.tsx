"use client";
import React from "react";
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
import ImageUploadCard from "./ImageUploadCard";
import { CheckCircle } from "lucide-react";
import useDriverRegistration from "@/screens/courier/registration/utils/DriverRegistration";

export default function DriverRegistrationForm() {
  const {
    files,
    existingImages,
    formData,
    loading,
    isLoading,
    handleFileChange,
    handleInputChange,
    handleUpload,
  } = useDriverRegistration();

  if (isLoading) {
    return (
      <Card className="w-full max-w-4xl mx-auto bg-white rounded-none">
        <CardHeader className="bg-gray-50 border-b border-gray-200">
          <Skeleton className="h-8 w-3/4 mb-2" />
          <Skeleton className="h-8 w-full" />
        </CardHeader>
        <CardContent className="p-6 shadow-md">
          <div className="grid gap-6 md:grid-cols-2">
            {[...Array(4)].map((_, index) => (
              <Skeleton key={index} className="h-60 w-full" />
            ))}
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {[...Array(5)].map((_, index) => (
              <Skeleton key={index} className="h-10 w-full" />
            ))}
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
        <div className="grid gap-6 md:grid-cols-2">
          <ImageUploadCard
            folder="profile-photo"
            cardTitle="Profile Photo"
            onFileChange={handleFileChange("profile-photo")}
            existingImageUrl={existingImages["profile-photo"]}
          />
          <ImageUploadCard
            folder="id-document"
            cardTitle="Identity Document"
            onFileChange={handleFileChange("id-document")}
            existingImageUrl={existingImages["id-document"]}
          />
          <ImageUploadCard
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
          />
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Input
            name="phoneNumber"
            placeholder="Phone Number"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            required
          />
          <Input
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleInputChange}
            required
          />
          <Input
            name="vehicleMake"
            placeholder="Vehicle Make"
            value={formData.vehicleMake}
            onChange={handleInputChange}
            required
          />
          <Input
            name="vehicleModel"
            placeholder="Vehicle Model"
            value={formData.vehicleModel}
            onChange={handleInputChange}
            required
          />
          <Input
            name="vehicleColor"
            placeholder="Vehicle Color"
            value={formData.vehicleColor}
            onChange={handleInputChange}
            required
          />
        </div>
        <Button
          onClick={handleUpload}
          disabled={loading}
          className="w-full mt-6 bg-black text-white hover:bg-gray-800 py-6 text-lg font-semibold transition-all duration-200 ease-in-out transform hover:scale-105"
        >
          {loading ? (
            "Uploading..."
          ) : (
            <>
              <CheckCircle className="mr-2 h-5 w-5" />
              Upload All Documents and Submit
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
