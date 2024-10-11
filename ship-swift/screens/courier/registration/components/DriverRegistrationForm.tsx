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
import { Input } from "@/components/ui/input"; // Assuming you have this component
import ImageUploadCard from "./ImageUploadCard";
import { uploadImage } from "@/screens/courier/registration/utils/Upload";
import { upsertDriver } from "@/actions/driverActions";
import { useAuth, useUser } from "@clerk/nextjs";
import { CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DriverRegistrationForm() {
  const [files, setFiles] = useState<{ [key: string]: File | null }>({
    "profile-photo": null,
    "id-document": null,
    "drivers-license": null,
    "license-disc": null,
  });
  const [formData, setFormData] = useState({
    phoneNumber: "",
    location: "",
    vehicleMake: "",
    vehicleModel: "",
    vehicleColor: "",
  });
  const [loading, setLoading] = useState(false);
  const { userId } = useAuth();
  const { user } = useUser();
  const router = useRouter();

  const handleFileChange = (folder: string) => (file: File | null) => {
    setFiles((prev) => ({ ...prev, [folder]: file }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpload = async () => {
    const allFilesSelected = Object.values(files).every(
      (file) => file !== null
    );
    if (!allFilesSelected) {
      return alert("Please select all required files");
    }

    // Check if all form fields are filled
    if (Object.values(formData).some((value) => value === "")) {
      return alert("Please fill in all fields");
    }

    setLoading(true);

    const updateData: any = {
      clerkId: userId || "",
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.emailAddresses[0]?.emailAddress || "",
      phoneNumber: formData.phoneNumber,
      location: formData.location,
      vehicleType:
        `${formData.vehicleMake} ${formData.vehicleModel} ${formData.vehicleColor}`.trim(),
    };

    for (const [folder, file] of Object.entries(files)) {
      if (file) {
        const { url, error } = await uploadImage(file, folder, userId || "");

        if (error) {
          setLoading(false);
          return alert(`Error uploading ${folder}: ${error}`);
        }

        const fieldName =
          folder === "profile-photo"
            ? "photoUrl"
            : folder === "id-document"
            ? "idPhotoUrl"
            : folder === "drivers-license"
            ? "licensePhotoUrl"
            : folder === "license-disc"
            ? "discPhotoUrl"
            : null;

        if (fieldName) {
          updateData[fieldName] = url;
        }
      }
    }

    const result = await upsertDriver(updateData);

    if (result.success) {
      router.push("/onboarding/driver-onboarding/details");
    } else {
      alert(`Error saving to database: ${result.error}`);
    }

    setLoading(false);
  };

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
          />
          <ImageUploadCard
            folder="id-document"
            cardTitle="Identity Document"
            onFileChange={handleFileChange("id-document")}
          />
          <ImageUploadCard
            folder="drivers-license"
            cardTitle="Drivers License"
            onFileChange={handleFileChange("drivers-license")}
          />
          <ImageUploadCard
            folder="license-disc"
            cardTitle="License Disc"
            onFileChange={handleFileChange("license-disc")}
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
