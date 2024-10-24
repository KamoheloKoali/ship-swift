"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useMap } from "react-leaflet"; // Import the useMap hook directly
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { toast } from "sonner";
import { useAuth } from "@clerk/nextjs";

// Dynamically import components (only those depending on DOM)
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Circle = dynamic(
  () => import("react-leaflet").then((mod) => mod.Circle),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);

// Fix for marker icon default issue in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Function to set the map view to the user's location
const SetViewToLocation = ({ position }: { position: [number, number] }) => {
  const map = useMap(); // Correctly use useMap inside the component
  useEffect(() => {
    if (position) {
      map.setView(position, 15); // Adjust the zoom level to fit the user's location
    }
  }, [position, map]);
  return null;
};

export default function LocationPage({
  params,
}: {
  params: { deliveryId: string };
}) {
  const [position, setPosition] = useState<[number, number] | null>(null); // Correct type for position (latitude, longitude)
  const [accuracy, setAccuracy] = useState<number | null>(null); // Accuracy is a number in meters
  const [isClient, setIsClient] = useState(false);
  const user = useAuth();

  useEffect(() => {
    const checkIsAuthorized = async () => {
      // remember to check if driverid or clientid is equal to current userid
    };
    setIsClient(typeof window !== "undefined");
  }, []);

  useEffect(() => {
    if (isClient && navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude, accuracy } = position.coords;

          // Only update if accuracy is within an acceptable range (e.g., less than 100 meters)
          if (accuracy < 500) {
            setPosition([latitude, longitude]);
            setAccuracy(accuracy); // Get the accuracy in meters
          } else {
            console.warn("Poor accuracy:", accuracy);
            toast.warning("Location accuracy is low: " + accuracy + " meters");
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          toast.error(
            "Error getting location: " + error.message + " please refresh page"
          );
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );

      return () => {
        navigator.geolocation.clearWatch(watchId);
      };
    }
  }, [isClient]);

  if (!isClient || !position) {
    return (
      <div className="h-screen w-full flex justify-center items-center">
        Getting your location...
      </div>
    );
  }

  if (accuracy && accuracy > 500) {
    return (
      <div className="h-screen w-full flex justify-center items-center">
        Low Accuracy: {accuracy} meters
      </div>
    );
  }

  return (
    <div className="h-screen w-screen">
      {position && (
        <MapContainer
          center={position}
          zoom={15}
          scrollWheelZoom={true}
          className="h-screen w-screen"
        >
          {/* TileLayer from OpenStreetMap */}
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {/* Marker for user's location */}
          <Marker position={position} />

          {/* Circle depicting accuracy */}
          {accuracy && (
            <Circle center={position} radius={accuracy} color="blue" />
          )}

          {/* Update the map's view to the user's location */}
          <SetViewToLocation position={position} />
        </MapContainer>
      )}
    </div>
  );
}
