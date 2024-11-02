"use client";
import { uploadImage } from "../../registration/utils/Upload";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";

const PhotoCapture: React.FC = () => {
  const router = useRouter();
  const [photo, setPhoto] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const { userId } = useAuth();
  const [isClient, setIsClient] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Start camera stream
  const startCamera = async () => {
    try {
      setError(null);
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera access is not supported in your browser");
      }
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to access camera");
      console.error("Camera access error:", err);
    }
  };

// Stop camera stream
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const capturePhoto = () => {
    try {

      setError(null);
      const video = videoRef.current;
      if (!video) {
        throw new Error("Video stream not available");
      }

      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        throw new Error("Failed to create canvas context");
      }

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/png");
      setPhoto(dataUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to capture photo");
      console.error("Photo capture error:", err);
    }
  };

  const uploadPhoto = async () => {
    if (!photo) {
      setError("No photo to upload");
      return;
    }
    if (!userId) {
      setError("User ID not found");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const blob = dataURItoBlob(photo);
      const file = new File([blob], `courier_${Date.now()}.png`, {
        type: "image/png",
      });
      await uploadImage(file, "driver-photo-rt", userId);

      stopCamera();

      router.push("/onboarding/driver/details");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload photo");
      console.error("Photo upload error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const dataURItoBlob = (dataURI: string) => {
    try {
      const byteString = atob(dataURI.split(",")[1]);
      const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      return new Blob([ab], { type: mimeString });
    } catch (err) {
      throw new Error("Failed to convert photo data");
    }
  };

  if (!isClient) return null;

  return (
    <div className="photo-capture flex flex-col justify-center items-center sm:p-0 xl:p-4 bg-gray-50 rounded-lg shadow-lg relative sm:w-[90%] lg:w-[50%]">
      {error && (
        <div className="w-full p-3 mb-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}
      <div className="relative w-full sm:h-full xl:h-[80%] bg-blue-100 rounded-lg overflow-hidden mb-4">
        <video ref={videoRef} autoPlay className="w-full h-full object-cover" />
        <button
          onClick={startCamera}
          className="absolute top-4 right-4 bg-black text-white px-4 py-2 rounded-lg hover:bg-slate-500 focus:ring focus:ring-white"
          disabled={isLoading}
        >
          Start Camera
        </button>
      </div>

      <button
        onClick={capturePhoto}
        className="bg-slate-500 text-white px-6 py-2 rounded-lg mb-4 w-full max-w-xs hover:bg-black transition duration-700 disabled:opacity-50"
        disabled={isLoading || !videoRef.current?.srcObject}
      >
        Capture Photo
      </button>

      {photo && (
        <div className="photo-preview flex flex-col items-center gap-4 fixed inset-0 bg-gray-800 bg-opacity-70 backdrop-blur-lg justify-center z-50">
          <Image
            src={photo}
            alt="Captured photo"
            width={580}
            height={580}
            className="rounded-lg shadow-md m-2"
          />
          <button
            onClick={uploadPhoto}
            className="bg-black text-white px-6 py-2 rounded-lg hover:bg-slate-500 transition w-full max-w-xs disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? "Uploading..." : "Upload Photo"}
          </button>
        </div>
      )}
    </div>
  );
};

export default PhotoCapture;
