"use client";
import React from "react";
import ImageUploadCard from "./ImageUploadCard";

const DriverRegistrationForm = () => {
  return (
    <div>
      <h1>Upload Documents</h1>
      <ImageUploadCard folder="profile-photo" cardTitle="Profile Photo"/>{" "}
      {/* Uploads to driver-docs/profile-photo */}
      <ImageUploadCard folder="id-document" cardTitle="Identity Documnent"/>{" "}
      {/* Uploads to driver-docs/documents */}
      <ImageUploadCard folder="drivers-license" cardTitle="Drivers License"/>{" "}
      {/* Uploads to driver-docs/others */}
      <ImageUploadCard folder="license-disc" cardTitle="License Disc"/>{" "}
      {/* Uploads to driver-docs/others */}
    </div>
  );
};

export default DriverRegistrationForm;
