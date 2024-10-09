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

  const runFacemesh = async () => {
    try {
      // Ensure TensorFlow.js backend is ready
      await tf.setBackend("webgl");
      await tf.ready();

      // Load the face mesh model
      const model = await facemesh.createDetector(
        facemesh.SupportedModels.MediaPipeFaceMesh,
        {
          runtime: "tfjs", // Use 'tfjs' if you want TensorFlow.js runtime
          refineLandmarks: true,
          // solutionPath: "https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh", // Make sure solutionPath is correct
        }
      );

      setIsModelLoaded(true);
      setInterval(() => {
        detect(model);
      }, 100);
    } catch (error) {
      console.error("Failed to load the face mesh model:", error);
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
      const faces = await model.estimateFaces(videoTensor);

      // Get canvas context
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        // Clear previous drawings
        ctx.clearRect(0, 0, videoWidth, videoHeight);

        console.log(faces);
        drawMesh(faces, ctx);
      }

      videoTensor.dispose(); // Clean up tensor
    }
  };

  useEffect(() => {
    runFacemesh();
  }, []);

  return (
    <div>
      <Webcam ref={webcamRef} style={{ width: 640, height: 480 }} />
      <canvas ref={canvasRef} style={{ position: "absolute" }} />
    </div>
  );
};

export default FaceMeshVerification;
