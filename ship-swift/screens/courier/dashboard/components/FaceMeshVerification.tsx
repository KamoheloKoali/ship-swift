"use client";
import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import * as tf from "@tensorflow/tfjs";
import * as facemesh from "@tensorflow-models/face-landmarks-detection";
import { drawMesh } from "@/app/utils/face-mesh-utilities";

const FaceMeshVerification = () => {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [faces, setFaces] = useState<any[]>([]); // State to store detected faces

  const runFacemesh = async () => {
    try {
      // Request access to the user's camera
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true, // Request video input from the camera
      });
  
      // If successful, set the webcam stream
      if (webcamRef.current) {
        webcamRef.current.srcObject = stream;
      }
  
      // Ensure TensorFlow.js backend is ready
      await tf.setBackend("webgl");
      await tf.ready();
  
      // Load the face mesh model
      const model = await facemesh.createDetector(
        facemesh.SupportedModels.MediaPipeFaceMesh,
        {
          runtime: "tfjs", // Use 'tfjs' if you want TensorFlow.js runtime
          refineLandmarks: true,
        }
      );
  
      setIsModelLoaded(true);
      setInterval(() => {
        detect(model);
      }, 100);
    } catch (error) {
      console.error("Failed to access the camera or load the face mesh model:", error);
      alert("Please allow camera access to use this feature.");
    }
  };

  const detect = async (model: any) => {
    if (
      webcamRef.current &&
      webcamRef.current.video?.readyState === 4 // Check if the webcam video is ready
    ) {
      const video = webcamRef.current.video;

      // Get the video width and height
      const videoWidth = video.videoWidth;
      const videoHeight = video.videoHeight;

      // Set video and canvas dimensions
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      // Convert video frame to tensor
      const videoTensor = tf.browser.fromPixels(video);

      // Run face mesh detection
      const detectedFaces = await model.estimateFaces(videoTensor);

      // Store detected faces in state
      setFaces(detectedFaces);

      // Get canvas context
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        // Clear previous drawings
        ctx.clearRect(0, 0, videoWidth, videoHeight);

        // Draw the mesh on detected faces
        drawMesh(detectedFaces, ctx);
      }

      videoTensor.dispose(); // Clean up tensor
    }
  };

  useEffect(() => {
    runFacemesh();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen p-5">
      <div className="relative w-full max-w-xl">
        <Webcam videoConstraints={{ facingMode: "user" }} ref={webcamRef} className="w-full rounded-lg shadow-lg" />
        <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full rounded-lg" />
      </div>

      {/* Conditionally set the background color based on face detection */}
      <div
        className={`mt-5 w-full max-w-xl p-4 text-center font-bold text-lg rounded-lg shadow-md transition-colors duration-500 ${
          faces.length > 0 ? "bg-green-500 text-white" : "bg-red-500 text-white"
        }`}
      >
        {faces.length > 0 ? "Face Detected!" : "No Face Detected"}
      </div>
    </div>
  );
};

export default FaceMeshVerification;
