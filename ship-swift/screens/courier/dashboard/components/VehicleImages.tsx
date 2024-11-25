"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useAuth } from "@clerk/nextjs";
import { uploadImage } from "../../registration/utils/Upload";
import { useRouter } from "next/navigation"
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { updateVehicleImages } from "@/actions/driverActions";

const VehicleImages = ({}) => {
  const [photos, setPhotos] = useState<Record<string, string>>({});
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [currentViewIndex, setCurrentViewIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { userId } = useAuth();
  const router = useRouter();

  const views = ["Front View", "Side View", "Rear View"];

  const startCamera = async () => {
    try {
      setError(null);
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera access is not supported in your browser");
      }

      const constraints = {
        video: {
          facingMode: { exact: "environment" },
        },
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraReady(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to access camera");
      console.error("Camera access error:", err);
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
      setIsCameraReady(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current?.srcObject) {
      try {
        const video = videoRef.current;
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");

        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL("image/png");

          setPhotos((prevPhotos) => ({
            ...prevPhotos,
            [`${currentViewIndex + 1}`]: dataUrl,
          }));

          if (currentViewIndex < views.length - 1) {
            setCurrentViewIndex((prev) => prev + 1);
          } else {
            stopCamera();
            setIsCameraOpen(false);
          }
        } else {
          throw new Error("Failed to create canvas context");
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to capture photo"
        );
        console.error("Photo capture error:", err);
      }
    }
  };

  const uploadAllPhotos = async () => {
    if (!userId) {
      setError("User ID is missing. Please log in again.");
      return;
    }

    if (Object.keys(photos).length !== views.length) {
      setError("Please capture all views before uploading");
      return;
    }

    setIsLoading(true);
    try {
      const uploadPromises = Object.entries(photos).map(
        async ([view, photo]) => {
          const blob = dataURItoBlob(photo);
          const file = new File([blob], `${userId}-${view}.png`, {
            type: "image/png",
          });
          const { url, error } = await uploadImage(file, "car-photos", userId);

          if (error || !url) {
            throw new Error(
              error || `Failed to upload ${views[+view - 1]} photo`
            );
          }

          return url;
        }
      );

      const urls = await Promise.all(uploadPromises);
      const combinedUrls = urls.join(", ");
      const result = await updateVehicleImages(userId, combinedUrls);

      if (result.success) {
        toast({ title: "Success", description: "Vehicle images updated" });
        setPhotos({});
        router.push("/onboarding/driver-onboarding/face-recog");
      } else {
        throw new Error(result.error || "Failed to update vehicle images");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload photos");
      console.error("Photo upload error:", err);
    } finally {
      setIsLoading(false);
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

  useEffect(() => {
    if (isCameraOpen) {
      startCamera();
    }
  }, [isCameraOpen]);

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <Button
        onClick={() => {
          setPhotos({});
          setCurrentViewIndex(0);
          setIsCameraOpen(true);
        }}
        className="bg-black text-white px-6 py-3 rounded-lg hover:bg-slate-500 focus:ring focus:ring-white"
        disabled={isLoading}
      >
        Capture Vehicle Images
      </Button>

      <Button
        onClick={uploadAllPhotos}
        className="mt-4 bg-black text-white px-6 py-3 rounded-lg hover:bg-slate-500 focus:ring focus:ring-white"
        disabled={isLoading || Object.keys(photos).length !== views.length}
      >
        {isLoading ? "Uploading..." : "Upload Images"}
      </Button>

      <Dialog
        open={isCameraOpen}
        onOpenChange={(open) => !open && stopCamera()}
      >
        <DialogContent className="max-w-full max-h-full w-screen h-screen p-0 bg-black">
          {error && (
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-[90%] p-3 bg-red-100 text-red-700 rounded-lg z-50">
              {error}
            </div>
          )}

          <div className="relative w-full h-full">
            <video
              ref={videoRef}
              autoPlay
              className="absolute inset-0 w-full h-full object-cover"
            />

            {isCameraReady && (
              <button
                onClick={capturePhoto}
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-white rounded-full shadow-md border-4 border-gray-300 hover:scale-105 transition-transform disabled:opacity-50"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VehicleImages;
