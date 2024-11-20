import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import ImageUploadCard from "@/screens/courier/registration/components/ImageUploadCard";
import React, { useState } from "react";
import useclientRegistration from "../registration/utils/clientRegistration";
import { uploadPickUpAndDropOffImage } from "../registration/utils/upload";

type Props = {
  formData: any;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  errors: any;
};

const Case4 = ({ formData, handleInputChange, errors }: Props) => {
  const [files, setFiles] = useState<{ [key: string]: File | null }>({
    PickUp: null,
    DropOff: null,
  });

  const [existingImages, setExistingImages] = useState<{
    [key: string]: string | null;
  }>({
    PickUp: null,
    DropOff: null,
  });

  const handleFileChange = (folder: string) => (file: File | null) => {
    setFiles((prev) => ({ ...prev, [folder]: file }));
    if (file) {
      setExistingImages((prev) => ({ ...prev, [folder]: null }));
    }
  };

  // const handleUpload = async () => {
  //   const allFilesSelectedOrExisting = Object.entries(files).every(
  //     ([key, file]) => file !== null || existingImages[key] !== null
  //   );
  //   if (!allFilesSelectedOrExisting) {
  //     return alert("Please select all required files or use existing images");
  //   }

  //   for (const [folder, file] of Object.entries(files)) {
  //     if (file) {
  //       const { url, error } = await uploadPickUpAndDropOffImage(file, folder, job. || "");

  //       if (error) {
  //         return alert(`Error uploading ${folder}: ${error}`);
  //       }

  //       const fieldName = folder === "id-documents" && "idPhotoUrl";

  //       if (fieldName) {
  //         updateData[fieldName] = url;
  //       }
  //     } else if (existingImages[folder]) {
  //       const fieldName = folder === "id-documents" ? "idPhotoUrl" : null;

  //       if (fieldName) {
  //         updateData[fieldName] = existingImages[folder];
  //       }
  //     }
  //   }
  // };
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-4xl font-semibold tracking-tight">
          Specify pickup and dropoff locations
        </h1>
        <p className="text-lg text-muted-foreground">
          Provide accurate addresses for pickup and delivery.
        </p>
      </div>
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Pickup Location</h2>
        <Input
          name="pickUp"
          value={formData.pickUp}
          onChange={handleInputChange}
          placeholder="Enter pickup address... e.g., letamong, Maqhaka, Berea, Lesotho"
        />
        {errors.pickUp && (
          <p className="text-sm text-red-500">{errors.pickUp}</p>
        )}
        <Input
          name="districtPickup"
          value={formData.districtPickup}
          onChange={handleInputChange}
          placeholder="Enter pickup district/province... e.g., Berea"
        />
        {errors.districtPickup && (
          <p className="text-sm text-red-500">{errors.districtPickup}</p>
        )}
      </div>
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Dropoff Location</h2>
        <Input
          name="dropOff"
          value={formData.dropOff}
          onChange={handleInputChange}
          placeholder="Enter dropoff address... e.g., Moshoeshoe 2 masoleng, Maseru, Lesotho"
        />
        {errors.dropOff && (
          <p className="text-sm text-red-500">{errors.dropOff}</p>
        )}
        <Input
          name="districtDropoff"
          value={formData.districtDropoff}
          onChange={handleInputChange}
          placeholder="Enter dropoff district/province... e.g., Maseru"
        />
        {errors.districtDropoff && (
          <p className="text-sm text-red-500">{errors.districtDropoff}</p>
        )}
      </div>
      <div className="space-y-4 flex gap-1 justify-center">
        <Dialog>
          <DialogTrigger asChild>
            <p className="underline text-sm text-blue-400 cursor-pointer">
              Upload Images of the Pick Up and Drop Off Location
            </p>
          </DialogTrigger>
          <DialogContent className="w-full md:w-[80%]">
            <DialogHeader>
              <DialogTitle>
                Upload Images of the Pick Up and Drop Off Location
              </DialogTitle>
              <DialogDescription>
                Upload images of the pickup and dropoff locations. Please ensure
                the images are clear and show the pickup and dropoff locations.
              </DialogDescription>
            </DialogHeader>
            <ImageUploadCard
              folder="Pick Up"
              cardTitle="Image of the Pick Up Location"
              onFileChange={handleFileChange("PickUp")}
              // existingImageUrl={existingImages["id-documents"]}
            />
            <ImageUploadCard
              folder="Drop Off"
              cardTitle="Image of the Drop Off Location"
              onFileChange={handleFileChange("Dropoff")}
              // existingImageUrl={existingImages["id-documents"]}
            />
          </DialogContent>
          (optional)
        </Dialog>
      </div>
    </div>
  );
};

export default Case4;
