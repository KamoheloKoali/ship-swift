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
import { Skeleton } from "@/components/ui/skeleton";
import ImageUploadCard from "@/screens/courier/registration/components/ImageUploadCard";
import { CheckCircle, Loader2 } from "lucide-react";
import { z } from "zod";
import useclientRegistration from "@/screens/client/registration/utils/clientRegistration";
import { PhoneInput, ValidationResult } from "@/screens/global/phone-input";

// Zod schema for validation
const clientRegistrationSchema = z.object({
  idDocuments: z.instanceof(File, { message: "Identity document is required" }),
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
  const [phoneValidation, setPhoneValidation] =
    useState<ValidationResult | null>(null);

  // State to manage validation errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleSubmit = async () => {
    try {
      // Validate file upload
      clientRegistrationSchema.parse({ idDocuments: files["id-documents"] });

      // Validate phone number
      if (!phoneValidation?.success) {
        setErrors({
          phoneNumber: phoneValidation?.error || "Invalid phone number",
        });
        return;
      }

      await handleUpload();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors: { [key: string]: string } = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            formattedErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(formattedErrors);
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
          <ImageUploadCard
            folder="id-document"
            cardTitle="Identity Document"
            onFileChange={handleFileChange("id-documents")}
            existingImageUrl={existingImages["id-documents"]}
          />
        </div>
        <div className="mt-6 grid gap-4 ">
          <div>
            <PhoneInput
              value={formData.phoneNumber}
              onValueChange={({ phoneNumber, validation }) => {
                setPhoneValidation(validation);
                handleInputChange({
                  target: {
                    name: "phoneNumber",
                    value: phoneNumber as string,
                  },
                } as React.ChangeEvent<HTMLInputElement>);
              }}
            />
            {phoneValidation && !phoneValidation.success && (
              <p className="text-red-500 text-sm mt-1">
                {phoneValidation.error}
              </p>
            )}
          </div>
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
