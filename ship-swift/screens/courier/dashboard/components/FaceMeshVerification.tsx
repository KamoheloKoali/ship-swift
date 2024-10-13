"use client";

import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import { Button } from "@/components/ui/button";
import DriverRegistrationForm from "../../registration/components/DriverRegistrationForm";

const FaceRecognitionWithForm: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [uploadedFaceDescriptors, setUploadedFaceDescriptors] = useState<any[]>(
    []
  );
  const [snapshotFaceDescriptor, setSnapshotFaceDescriptor] = useState<any>(null);
  const [matchResult, setMatchResult] = useState<string | null>(null);
  const [isMatched, setIsMatched] = useState<boolean | null>(null);

  // Load face-api models
  useEffect(() => {
    const loadModels = async () => {
      await faceapi.nets.ssdMobilenetv1.loadFromUri("/models");
      await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
      await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
    };

    loadModels();
  }, []);

  // Start video feed
  useEffect(() => {
    const startVideo = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    };
    startVideo();
  }, []);

  // Take a snapshot from the video and detect the face descriptor
  const handleSnapshot = async () => {
    if (videoRef.current) {
      const detections = await faceapi
        .detectSingleFace(videoRef.current)
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (detections) {
        setSnapshotFaceDescriptor(detections.descriptor);
      }
    }
  };

  // Compare snapshot with the uploaded form images
  const compareFaces = () => {
    if (!snapshotFaceDescriptor || uploadedFaceDescriptors.length === 0) return;

    let foundMatch = false;

    uploadedFaceDescriptors.forEach((uploadedDescriptor) => {
      const distance = faceapi.euclideanDistance(
        snapshotFaceDescriptor,
        uploadedDescriptor
      );
      if (distance < 0.6) {
        foundMatch = true;
      }
    });

    setMatchResult(foundMatch ? "Match found!" : "No match found.");
    setIsMatched(foundMatch);
  };

  // Handle form submission or file upload to extract faces from uploaded images
  const handleUploadedImageFaces = async (imageUrl: string) => {
    const img = new Image();
    img.src = imageUrl;
    img.onload = async () => {
      const detection = await faceapi
        .detectSingleFace(img)
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (detection) {
        setUploadedFaceDescriptors((prev) => [...prev, detection.descriptor]);
      }
    };
  };

  // Call this function when form images are uploaded and provide the URL of the images
  const onFormUploadComplete = (imageUrls: string[]) => {
    imageUrls.forEach((url) => handleUploadedImageFaces(url));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-100">
      <h2 className="mb-4 text-3xl font-bold text-center text-gray-800">
        Driver Registration with Face Recognition
      </h2>

      {/* Render the driver registration form and pass the upload handler */}
      <DriverRegistrationForm onUploadComplete={onFormUploadComplete} />

      {/* Video Stream for taking snapshots */}
      <div className="relative w-full max-w-2xl mt-6">
        <video
          ref={videoRef}
          autoPlay
          muted
          className="w-full h-auto rounded-lg shadow-lg"
        />
        <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />
      </div>

      <Button onClick={handleSnapshot} className="mt-4 bg-blue-600">
        Take Snapshot
      </Button>

      <Button onClick={compareFaces} className="mt-4 bg-green-600">
        Compare Faces
      </Button>

      {/* Display match result */}
      {matchResult && (
        <div
          className={`mt-6 p-4 rounded-lg shadow-lg bg-white w-full max-w-md text-center ${
            isMatched ? "text-green-500" : "text-red-500"
          }`}
        >
          <span className="text-xl font-semibold">{matchResult}</span>
        </div>
      )}
    </div>
  );
};

export default FaceRecognitionWithForm;
