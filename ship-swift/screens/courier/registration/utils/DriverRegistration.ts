import { useState, useEffect } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { uploadImage } from "@/screens/courier/registration/utils/Upload";
import { upsertDriver, getDriverByID } from "@/actions/driverActions";

export default function useDriverRegistration() {
  const [files, setFiles] = useState<{ [key: string]: File | null }>({
    "profile-photo": null,
    "id-document": null,
    "drivers-license": null,
    "license-disc": null,
  });
  const [existingImages, setExistingImages] = useState<{
    [key: string]: string | null;
  }>({
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
  const [isLoading, setIsLoading] = useState(true);
  const { userId } = useAuth();
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    const fetchDriverData = async () => {
      if (userId) {
        try {
          const driver = await getDriverByID(userId);
          if (driver) {
            setFormData({
              phoneNumber: driver.phoneNumber || "",
              location: driver.location || "",
              vehicleMake: driver.vehicleType
                ? driver.vehicleType.split(" ")[0]
                : "",
              vehicleModel: driver.vehicleType
                ? driver.vehicleType.split(" ")[1]
                : "",
              vehicleColor: driver.vehicleType
                ? driver.vehicleType.split(" ")[2]
                : "",
            });
            setExistingImages({
              "profile-photo": driver.photoUrl || null,
              "id-document": driver.idPhotoUrl || null,
              "drivers-license": driver.licensePhotoUrl || null,
              "license-disc": driver.discPhotoUrl || null,
            });
          }
        } catch (error) {
          console.error("Error fetching driver data:", error);
        }
      }
      setIsLoading(false);
    };

    fetchDriverData();
  }, [userId]);

  const handleFileChange = (folder: string) => (file: File | null) => {
    setFiles((prev) => ({ ...prev, [folder]: file }));
    if (file) {
      setExistingImages((prev) => ({ ...prev, [folder]: null }));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpload = async () => {
    const allFilesSelectedOrExisting = Object.entries(files).every(
      ([key, file]) => file !== null || existingImages[key] !== null
    );
    if (!allFilesSelectedOrExisting) {
      return alert("Please select all required files or use existing images");
    }

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
      } else if (existingImages[folder]) {
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
          updateData[fieldName] = existingImages[folder];
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

  return {
    files,
    existingImages,
    formData,
    loading,
    isLoading,
    handleFileChange,
    handleInputChange,
    handleUpload,
  };
}
