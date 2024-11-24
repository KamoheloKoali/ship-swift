"use client";
import { useState, useRef } from "react";
import Image from "next/image";
import { useAuth } from "@clerk/nextjs";
import { uploadImage } from "../../registration/utils/Upload";
import { updateVehicleImages } from "@/actions/driverActions";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const VehicleImages: React.FC = () => {
  const { userId } = useAuth();
  const [images, setImages] = useState<{
    front: string | null;
    side: string | null;
    rear: string | null;
  }>({ front: null, side: null, rear: null });
  const [photo, setPhoto] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<
    "front" | "side" | "rear" | null
  >(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const startCamera = async (view: "front" | "side" | "rear") => {
    try {
      setError(null);
      setCurrentView(view);

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera access is not supported in your browser");
      }

      const constraints = {
        video: {
          facingMode: { exact: "environment" },
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          setIsCameraReady(true);
        };
      }
    } catch (err) {
      // If environment camera fails, try without exact requirement
      try {
        const fallbackConstraints = {
          video: {
            facingMode: "environment",
            width: { ideal: 1920 },
            height: { ideal: 1080 },
          },
        };
        const stream = await navigator.mediaDevices.getUserMedia(
          fallbackConstraints
        );
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            setIsCameraReady(true);
          };
        }
      } catch (fallbackErr) {
        setError(
          "Failed to access camera. Please ensure camera permissions are granted."
        );
      }
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
      setIsCameraReady(false);
      setCurrentView(null);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.8); // Using JPEG with 0.8 quality for better compression
        setPhoto(dataUrl);
        stopCamera();
      }
    }
  };

  const uploadPhoto = async () => {
    if (!photo || !currentView) {
      setError("No photo captured or view not selected.");
      return;
    }

    if (!userId) {
      setError("User not authenticated.");
      return;
    }

    setError(null);

    try {
      const blob = dataURItoBlob(photo);
      const file = new File([blob], `${userId}-${currentView}.jpg`, {
        type: "image/jpeg",
      });

      const { url, error } = await uploadImage(file, "car-photos", userId);

      if (error || !url) {
        throw new Error(error || "Failed to upload photo.");
      }

      setImages((prev) => ({
        ...prev,
        [currentView]: url,
      }));

      setPhoto(null);
      setCurrentView(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred.");
    }
  };

  const handleSubmit = async () => {
    if (!userId) {
      setError("User not authenticated.");
      return;
    }

    if (!images.front || !images.side || !images.rear) {
      setError("Please capture all vehicle images before submitting.");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const vehicleImagesUrls = `${images.front},${images.side},${images.rear}`;
      const result = await updateVehicleImages(userId, vehicleImagesUrls);

      if (!result.success) {
        throw new Error(result.error || "Failed to update database.");
      }

      router.push("/onboarding/driver-onboarding/face-recog");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const dataURItoBlob = (dataURI: string) => {
    const byteString = atob(dataURI.split(",")[1]);
    const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  };

  return (
    <Card className="w-full max-w-4xl mx-auto bg-white rounded-none">
      <CardHeader className="bg-gray-50 border-b border-gray-200">
        <CardTitle className="text-3xl text-center font-bold text-gray-900">
          Capture Vehicle Images
        </CardTitle>
        <CardDescription className="text-lg text-center text-gray-600">
          Please capture clear images of your vehicle from all required angles.
        </CardDescription>
      </CardHeader>

      <CardContent className="p-6 shadow-md">
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded">
            {error}
          </div>
        )}

        {isCameraReady && (
          <div className="camera flex flex-col items-center gap-4 mb-6">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full max-w-md border rounded-md shadow-sm"
            />
            <div className="flex gap-4">
              <Button
                onClick={capturePhoto}
                className="bg-black text-white hover:bg-gray-800 px-6 py-2 rounded-md"
              >
                Capture Photo
              </Button>
              <Button
                onClick={stopCamera}
                variant="outline"
                className="px-6 py-2 rounded-md"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {photo && (
          <div className="photo-preview flex flex-col items-center gap-4 mb-6">
            <Image
              src={photo}
              alt="Captured photo"
              width={400}
              height={300}
              className="rounded-md border shadow-sm"
            />
            <div className="flex gap-4">
              <Button
                onClick={uploadPhoto}
                className="bg-black text-white hover:bg-gray-800 px-6 py-2 rounded-md"
              >
                Upload Photo
              </Button>
              <Button
                onClick={() => setPhoto(null)}
                variant="outline"
                className="px-6 py-2 rounded-md"
              >
                Retake
              </Button>
            </div>
          </div>
        )}

        <div className="preview grid grid-cols-1 sm:grid-cols-3 gap-6">
          {Object.entries(images).map(([view, url]) => (
            <div key={view} className="flex flex-col items-center gap-4">
              <Card className="w-full bg-white shadow-md overflow-hidden">
                <CardContent className="p-4">
                  {url ? (
                    <div className="relative">
                      <Image
                        src={url}
                        alt={`${view} view`}
                        width={300}
                        height={200}
                        className="rounded-md"
                      />
                      <Button
                        onClick={() =>
                          startCamera(view as "front" | "side" | "rear")
                        }
                        className="absolute bottom-2 right-2 bg-black/80 text-white hover:bg-black"
                        size="sm"
                      >
                        Retake
                      </Button>
                    </div>
                  ) : (
                    <div className="w-full h-48 border rounded-md flex items-center justify-center text-gray-500 bg-gray-50">
                      No Image
                    </div>
                  )}
                </CardContent>
              </Card>
              <Button
                onClick={() => startCamera(view as "front" | "side" | "rear")}
                disabled={isCameraReady || photo !== null}
                className="w-full bg-black text-white hover:bg-gray-800 disabled:bg-gray-300"
              >
                Capture {view.charAt(0).toUpperCase() + view.slice(1)} View
              </Button>
            </div>
          ))}
        </div>

        <Button
          onClick={handleSubmit}
          disabled={
            !images.front || !images.side || !images.rear || isSubmitting
          }
          className="w-full mt-6 py-4 text-lg font-semibold rounded-md bg-black text-white hover:bg-gray-800 disabled:bg-gray-300 disabled:text-gray-500"
        >
          {isSubmitting ? "Submitting..." : "Submit All Images"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default VehicleImages;
