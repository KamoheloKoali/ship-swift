"use client";
// components/FaceRecognition.tsx
import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";

const FaceRecognition: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [uploadedFaceDescriptor, setUploadedFaceDescriptor] =
    useState<any>(null);
  const [matchResult, setMatchResult] = useState<string | null>(null);
  const [isMatched, setIsMatched] = useState<boolean | null>(null);
  const [capturedImageUrl, setCapturedImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const loadModels = async () => {
      try {
        console.log("Loading models...");
        await faceapi.nets.ssdMobilenetv1.loadFromUri("/models");
        await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
        await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
        console.log("Models loaded successfully.");
      } catch (error) {
        console.error("Error loading models:", error);
      }
    };

    const startVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          console.log("Video stream started.");
        } else {
          console.error("Video element reference is null.");
        }
      } catch (error) {
        console.error("Error starting video stream:", error);
      }
    };

    loadModels().then(startVideo);
  }, []);

  useEffect(() => {
    if (uploadedImage) {
      const img = document.createElement("img");
      img.src = uploadedImageUrl!;
      img.onload = async () => {
        try {
          console.log("Detecting face in uploaded image...");
          const detection = await faceapi
            .detectSingleFace(img)
            .withFaceLandmarks()
            .withFaceDescriptor();

          if (detection) {
            console.log("Face detected:", detection);
            setUploadedFaceDescriptor(detection.descriptor);
          } else {
            console.error("No face detected in the uploaded image.");
          }
        } catch (error) {
          console.error("Error detecting face in uploaded image:", error);
        }
      };
    }
  }, [uploadedImage, uploadedImageUrl]);

  const captureImageFromVideo = async () => {
    if (videoRef.current && canvasRef.current) {
      const displaySize = {
        width: videoRef.current.videoWidth,
        height: videoRef.current.videoHeight,
      };
      faceapi.matchDimensions(canvasRef.current, displaySize);

      const context = canvasRef.current.getContext("2d");
      if (context) {
        // Capture a single frame from the video
        context.drawImage(
          videoRef.current,
          0,
          0,
          displaySize.width,
          displaySize.height
        );

        // Convert the canvas to an image URL (data URL)
        const dataUrl = canvasRef.current.toDataURL("image/png");
        setCapturedImageUrl(dataUrl); // Save the captured image URL

        const img = new Image();
        img.src = dataUrl;
        img.onload = async () => {
          try {
            console.log("Detecting face in captured image...");
            const detection = await faceapi
              .detectSingleFace(img)
              .withFaceLandmarks()
              .withFaceDescriptor();

            if (detection) {
              console.log("Face detected in captured image:", detection);
              compareCapturedFace(detection.descriptor); // Compare the captured face with uploaded face
            } else {
              console.error("No face detected in the captured image.");
            }
          } catch (error) {
            console.error("Error detecting face in captured image:", error);
          }
        };
      }
    }
  };

  // Function to compare the captured face with the uploaded image
  const compareCapturedFace = (capturedFaceDescriptor: Float32Array) => {
    if (!uploadedFaceDescriptor) return;

    console.log("Comparing captured face with uploaded image...");
    const distance = faceapi.euclideanDistance(
      uploadedFaceDescriptor,
      capturedFaceDescriptor
    );
    console.log(`Distance to uploaded face: ${distance}`);
    if (distance < 0.6) {
      console.log("Match found!");
      setMatchResult("Match found!");
      setIsMatched(true);
    } else {
      console.log("No match found.");
      setMatchResult("No match found.");
      setIsMatched(false);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (file) {
        console.log("Image uploaded:", file.name);
        setUploadedImage(file);
        setUploadedImageUrl(URL.createObjectURL(file));
        setMatchResult(null); // Reset match result on new upload
      } else {
        console.error("No file selected.");
      }
    } catch (error) {
      console.error("Error handling image upload:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-100">
      <h2 className="mb-4 text-3xl font-bold text-center text-gray-800">
        Upload an Image to Compare
      </h2>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="mb-4 text-sm text-gray-500 
          file:mr-4 file:py-2 file:px-4 
          file:rounded-full file:border-0 
          file:text-sm file:font-semibold 
          file:bg-blue-600 file:text-white 
          hover:file:bg-blue-700 cursor-pointer"
      />
      {uploadedImageUrl && (
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-gray-700">
            Uploaded Image:
          </h3>
          <img
            src={uploadedImageUrl}
            alt="Uploaded"
            className="mt-2 max-w-xs rounded-lg shadow-lg"
          />
        </div>
      )}
      <div className="relative w-full max-w-2xl">
        <video
          ref={videoRef}
          autoPlay
          muted
          className="w-full h-auto rounded-lg shadow-lg"
        />
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full rounded-lg"
        />
      </div>

      <button
        onClick={captureImageFromVideo}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
      >
        Capture Face from Video
      </button>

      {capturedImageUrl && (
        <div className="mt-4">
          <h3 className="text-xl font-semibold text-gray-700">
            Captured Image:
          </h3>
          <img
            src={capturedImageUrl}
            alt="Captured"
            className="mt-2 max-w-xs rounded-lg shadow-lg"
          />
        </div>
      )}

      <div className="mt-6 p-4 rounded-lg shadow-lg bg-white w-full max-w-md text-center">
        {matchResult && (
          <div
            className={`flex items-center justify-center ${
              isMatched ? "text-green-500" : "text-red-500"
            }`}
          >
            {isMatched ? (
              <div className="h-6 w-6 mr-2">We have a match</div>
            ) : (
              <div className="h-6 w-6 mr-2">No match at all</div>
            )}
            <span className="text-xl font-semibold">{matchResult}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default FaceRecognition;
